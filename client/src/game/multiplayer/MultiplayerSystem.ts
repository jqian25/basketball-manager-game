// client/src/game/multiplayer/MultiplayerSystem.ts

/**
 * 定义所有可能的消息类型。
 * 客户端和服务器之间通过这些类型进行通信。
 * 
 * 生产级建议: 
 * 在实际项目中，可以使用数字枚举或更紧凑的字符串来减少传输数据量。
 */
export enum MessageType {
    CONNECT = 'CONNECT',            // 客户端连接请求
    DISCONNECT = 'DISCONNECT',      // 客户端断开连接通知
    STATE_UPDATE = 'STATE_UPDATE',  // 服务器发送的完整游戏状态更新（权威状态）
    PLAYER_INPUT = 'PLAYER_INPUT',  // 客户端发送的玩家输入（如移动、攻击）
    PLAYER_JOINED = 'PLAYER_JOINED',// 新玩家加入通知
    PLAYER_LEFT = 'PLAYER_LEFT',    // 玩家离开通知
    ERROR = 'ERROR',                // 通用错误消息
}

/**
 * 定义基本的消息结构接口。
 * 所有通过WebSocket发送的消息都应遵循此结构。
 */
export interface IMessage {
    type: MessageType;
    payload: any; // 消息的具体内容，类型取决于 MessageType
}

/**
 * 玩家状态接口。
 * 定义了在游戏中同步的玩家数据结构。
 */
export interface IPlayerState {
    id: string;     // 玩家唯一ID
    x: number;      // 玩家X坐标
    y: number;      // 玩家Y坐标
    health: number; // 玩家生命值
    // 生产级建议: 
    // 1. 坐标值可以使用整数或定点数来减少浮点数同步问题。
    // 2. 包含一个 sequenceNumber/tick 来标识这是哪个游戏帧的状态。
}

/**
 * 完整的游戏状态接口。
 * 服务器定期发送给客户端以同步游戏世界。
 */
export interface IGameState {
    players: IPlayerState[];
    // 其他游戏实体，如：
    // projectiles: IProjectileState[];
    // items: IItemState[];
    timestamp: number; // 服务器时间戳，用于客户端网络延迟补偿和状态预测
}

// 定义事件回调函数的类型别名
export type MessageHandler = (payload: any) => void;
export type ConnectionHandler = () => void;

/**
 * MultiplayerSystem 类
 * 负责管理与游戏服务器的WebSocket连接、消息的发送和接收、
 * 以及将接收到的消息分发给相应的处理函数。
 * 这是一个客户端网络层的核心组件，旨在提供一个高内聚、低耦合的网络抽象层。
 * 
 * 生产级质量:
 * - 使用 WebSocket 进行全双工通信。
 * - 提供清晰的连接状态管理和错误处理。
 * - 基于事件/回调机制解耦网络层和游戏逻辑层。
 */
export class MultiplayerSystem {
    private socket: WebSocket | null = null;
    private readonly url: string;
    // 使用 Map 存储消息类型到处理函数列表的映射，支持多重订阅
    private messageHandlers: Map<MessageType, MessageHandler[]> = new Map();

    // 连接状态回调
    private onOpenCallback: ConnectionHandler | null = null;
    private onCloseCallback: ConnectionHandler | null = null;
    private onErrorCallback: ((event: Event) => void) | null = null;

    /**
     * 构造函数
     * @param url WebSocket服务器的地址，例如: "ws://localhost:8080/game"
     */
    constructor(url: string) {
        this.url = url;
        console.log(`MultiplayerSystem initialized with URL: ${this.url}`);
    }

    /**
     * 尝试建立与游戏服务器的WebSocket连接。
     */
    public connect(): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.warn("Connection already established.");
            return;
        }
        if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
            console.warn("Connection is already in progress.");
            return;
        }

        try {
            this.socket = new WebSocket(this.url);

            // 绑定事件处理函数
            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onclose = this.handleClose.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onerror = this.handleError.bind(this);

            console.log("Attempting to connect to server...");
        } catch (error) {
            console.error("Failed to create WebSocket instance:", error);
            // 如果WebSocket构造失败，立即触发错误回调
            if (this.onErrorCallback) {
                this.onErrorCallback(error as Event);
            }
        }
    }

    /**
     * 断开与服务器的连接。
     * 可以选择性地发送一个 DISCONNECT 消息给服务器。
     */
    public disconnect(): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log("Sending disconnect signal and closing connection...");
            // 优雅地通知服务器断开连接
            this.send(MessageType.DISCONNECT); 
            this.socket.close(1000, "Client initiated disconnect");
        } else if (this.socket) {
            // 如果连接未打开，直接关闭
             this.socket.close();
        } else {
            console.warn("No active connection to disconnect.");
        }
        this.socket = null;
    }

    /**
     * 检查当前连接状态。
     * @returns boolean - 是否已连接 (WebSocket.OPEN)
     */
    public isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    /**
     * 注册特定消息类型的处理函数。
     * @param type 消息类型 (MessageType)
     * @param handler 消息处理函数 (MessageHandler)
     */
    public on(type: MessageType, handler: MessageHandler): void {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type)!.push(handler);
        // console.log(`Registered handler for message type: ${type}`);
    }

    /**
     * 移除特定消息类型的处理函数。
     * @param type 消息类型 (MessageType)
     * @param handler 要移除的处理函数
     */
    public off(type: MessageType, handler: MessageHandler): void {
        const handlers = this.messageHandlers.get(type);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
                // console.log(`Removed handler for message type: ${type}`);
            }
            // 如果列表为空，可以移除整个 Map entry
            if (handlers.length === 0) {
                this.messageHandlers.delete(type);
            }
        }
    }

    /**
     * 注册连接成功时的回调函数。
     * @param handler 回调函数
     */
    public onOpen(handler: ConnectionHandler): void {
        this.onOpenCallback = handler;
    }

    /**
     * 注册连接关闭时的回调函数。
     * @param handler 回调函数
     */
    public onClose(handler: ConnectionHandler): void {
        this.onCloseCallback = handler;
    }
    
    /**
     * 注册连接错误时的回调函数。
     * @param handler 回调函数
     */
    public onError(handler: (event: Event) => void): void {
        this.onErrorCallback = handler;
    }

    /**
     * 发送消息到服务器。
     * @param type 消息类型
     * @param payload 消息载荷
     */
    public send(type: MessageType, payload: any = {}): void {
        if (!this.isConnected()) {
            // 在生产环境中，可以考虑将消息放入队列，等待连接恢复后再发送
            console.error(`Cannot send message: Not connected. Type: ${type}`);
            return;
        }

        const message: IMessage = { type, payload };
        try {
            // 生产级建议: 
            // 1. 对于高频消息（如 PLAYER_INPUT），可以使用更高效的序列化方式（如 Protocol Buffers 或 MessagePack）
            //    并以 ArrayBuffer 形式发送，以减少 JSON 序列化和解析的开销。
            const jsonMessage = JSON.stringify(message);
            this.socket!.send(jsonMessage);
            // 避免频繁日志输出，影响性能
            // console.log(`Sent message: ${type}`); 
        } catch (error) {
            console.error(`Failed to send message ${type}:`, error);
        }
    }

    /**
     * 处理WebSocket连接打开事件。
     * @private
     */
    private handleOpen(): void {
        console.log("WebSocket connection established.");
        // 连接成功后，发送一个 CONNECT 消息给服务器，包含客户端信息
        this.send(MessageType.CONNECT, { 
            clientVersion: "1.0.0",
            // 可以在这里包含认证令牌等信息
            // authToken: "..."
        });
        if (this.onOpenCallback) {
            this.onOpenCallback();
        }
    }

    /**
     * 处理WebSocket连接关闭事件。
     * @private
     */
    private handleClose(event: CloseEvent): void {
        console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
        this.socket = null; // 清除引用
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    /**
     * 处理WebSocket错误事件。
     * @param event 错误事件对象
     * @private
     */
    private handleError(event: Event): void {
        console.error("WebSocket error occurred:", event);
        if (this.onErrorCallback) {
            this.onErrorCallback(event);
        }
        // 错误发生后，通常会紧跟着一个 close 事件，所以不需要在这里手动调用 onCloseCallback
    }

    /**
     * 处理从服务器接收到的WebSocket消息。
     * @param event 消息事件对象
     * @private
     */
    private handleMessage(event: MessageEvent): void {
        try {
            // 生产级建议: 
            // 检查 event.data 的类型，如果是 ArrayBuffer，则需要使用相应的反序列化方法。
            const message: IMessage = JSON.parse(event.data);
            
            if (!message || !message.type) {
                console.warn("Received malformed message (missing type):", event.data);
                return;
            }

            // 查找并执行所有注册的处理函数
            const handlers = this.messageHandlers.get(message.type);
            if (handlers) {
                // 遍历处理函数并执行
                handlers.forEach(handler => {
                    try {
                        handler(message.payload);
                    } catch (handlerError) {
                        // 捕获单个处理函数中的错误，避免中断其他处理函数
                        console.error(`Error executing handler for ${message.type}:`, handlerError);
                    }
                });
            } else {
                console.warn(`No handler registered for message type: ${message.type}`);
            }

        } catch (error) {
            console.error("Failed to parse incoming message JSON:", event.data, error);
            // 可以发送一个本地错误事件通知游戏逻辑层
            if (this.messageHandlers.has(MessageType.ERROR)) {
                 this.messageHandlers.get(MessageType.ERROR)!.forEach(handler => {
                    handler({ code: 500, message: "Client JSON parsing error" });
                });
            }
        }
    }

    // --- 游戏逻辑特定的发送方法示例 (方便游戏场景调用) ---

    /**
     * 发送玩家输入到服务器。
     * 这是一个高频发送的方法，用于实时同步玩家操作。
     * @param inputData 玩家输入数据，例如：{ sequence: 123, keys: { up: true, left: false } }
     */
    public sendPlayerInput(inputData: any): void {
        this.send(MessageType.PLAYER_INPUT, inputData);
    }

    // --- 游戏逻辑特定的接收处理注册示例 (方便游戏场景调用) ---

    /**
     * 示例：注册游戏状态更新处理函数。
     * @param handler 接收 IGameState 的处理函数
     */
    public onStateUpdate(handler: (gameState: IGameState) => void): void {
        // 使用类型断言确保传入的 handler 符合 MessageHandler 的签名
        this.on(MessageType.STATE_UPDATE, handler as MessageHandler);
    }

    /**
     * 示例：注册新玩家加入处理函数。
     * @param handler 接收 IPlayerState 的处理函数
     */
    public onPlayerJoined(handler: (playerState: IPlayerState) => void): void {
        this.on(MessageType.PLAYER_JOINED, handler as MessageHandler);
    }
}

/*
// -----------------------------------------------------------------------------
// 使用示例 (在Phaser 3 Scene中)
// -----------------------------------------------------------------------------

import * as Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    private multiplayerSystem: MultiplayerSystem;
    private players: Map<string, Phaser.GameObjects.Sprite> = new Map();

    constructor() {
        super('GameScene');
        // 生产级建议: 服务器地址应从配置中读取
        this.multiplayerSystem = new MultiplayerSystem('ws://localhost:8080');
    }

    preload() {
        // 加载玩家资源
        this.load.image('player_asset', 'assets/player.png');
    }

    create() {
        // 1. 设置连接回调
        this.multiplayerSystem.onOpen(() => {
            console.log("Successfully connected to the game server.");
            // 可以在这里发送初始房间加入请求等
        });

        this.multiplayerSystem.onClose(() => {
            console.log("Disconnected from the game server. Attempting to reconnect...");
            // 可以在这里实现自动重连逻辑
        });

        this.multiplayerSystem.onError((event) => {
            console.error("Connection error detected.", event);
        });

        // 2. 注册消息处理函数
        // 使用专用的 onStateUpdate/onPlayerJoined 方法，更具类型安全性
        this.multiplayerSystem.onStateUpdate(this.handleStateUpdate.bind(this));
        this.multiplayerSystem.onPlayerJoined(this.handlePlayerJoined.bind(this));
        // 使用通用的 on 方法注册其他消息类型
        this.multiplayerSystem.on(MessageType.PLAYER_LEFT, this.handlePlayerLeft.bind(this));
        this.multiplayerSystem.on(MessageType.ERROR, this.handleServerError.bind(this));

        // 3. 建立连接
        this.multiplayerSystem.connect();
    }

    update(time: number, delta: number) {
        // 4. 处理玩家输入并发送
        const inputData = this.collectPlayerInput();
        if (inputData) {
            // 客户端预测：立即应用输入到本地玩家，减少延迟感
            // this.applyLocalInput(inputData);
            // 发送输入到服务器
            this.multiplayerSystem.sendPlayerInput(inputData);
        }
    }

    private collectPlayerInput(): any {
        // 收集键盘、鼠标等输入，并封装成一个输入对象
        // 示例: 
        // const cursors = this.input.keyboard.createCursorKeys();
        // return { tick: this.game.loop.frame, up: cursors.up.isDown, left: cursors.left.isDown };
        return { keys: { up: false, down: false, left: false, right: false } }; 
    }

    private handleStateUpdate(gameState: IGameState): void {
        // 接收服务器的权威状态，进行协调和纠正
        for (const playerState of gameState.players) {
            let playerSprite = this.players.get(playerState.id);
            
            if (!playerSprite) {
                // 如果是新玩家，在这里创建
                playerSprite = this.add.sprite(playerState.x, playerState.y, 'player_asset');
                this.players.set(playerState.id, playerSprite);
                console.log(`Created new sprite for player ${playerState.id}`);
            }

            // 状态同步逻辑：
            // 生产级建议: 
            // 1. 使用插值 (Interpolation) 或外推 (Extrapolation) 来平滑移动，而不是直接设置坐标。
            // 2. 如果是本地玩家，需要进行客户端预测与服务器权威状态的协调 (Reconciliation)。
            playerSprite.x = playerState.x;
            playerSprite.y = playerState.y;
        }
    }

    private handlePlayerJoined(playerState: IPlayerState): void {
        console.log(`Player joined: ${playerState.id}`);
        // 在场景中创建新玩家的Sprite (如果 handleStateUpdate 没有处理)
        if (!this.players.has(playerState.id)) {
            const newPlayer = this.add.sprite(playerState.x, playerState.y, 'player_asset');
            this.players.set(playerState.id, newPlayer);
        }
    }

    private handlePlayerLeft(payload: { id: string }): void {
        console.log(`Player left: ${payload.id}`);
        const playerSprite = this.players.get(payload.id);
        if (playerSprite) {
            playerSprite.destroy(); // 销毁 Phaser Sprite 对象
            this.players.delete(payload.id);
        }
    }

    private handleServerError(payload: { code: number, message: string }): void {
        console.error(`Server Error [${payload.code}]: ${payload.message}`);
        // 根据错误类型决定是否断开连接或显示错误信息
        // this.multiplayerSystem.disconnect();
    }
}
*/