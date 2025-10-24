// client/src/game/social/SocialSystem.ts

/**
 * 玩家状态枚举
 */
export enum PlayerStatus {
    Offline = 'Offline',
    Online = 'Online',
    InGame = 'InGame',
    Away = 'Away',
}

/**
 * 聊天频道枚举
 */
export enum ChatChannel {
    Global = 'Global',
    Private = 'Private',
    Team = 'Team',
    System = 'System',
}

/**
 * 玩家基础信息接口
 */
export interface PlayerInfo {
    id: string; // 玩家唯一ID
    name: string; // 玩家昵称
    status: PlayerStatus; // 玩家当前状态
}

/**
 * 好友请求接口
 */
export interface FriendRequest {
    requestId: string; // 请求唯一ID
    sender: PlayerInfo; // 发送者信息
    timestamp: number; // 请求时间戳
}

/**
 * 聊天消息接口
 */
export interface ChatMessage {
    id: string; // 消息唯一ID
    channel: ChatChannel; // 频道类型
    sender: PlayerInfo; // 发送者信息
    content: string; // 消息内容
    timestamp: number; // 消息时间戳
    targetId?: string; // 如果是私聊，目标玩家ID；如果是队伍，队伍ID
}

/**
 * 队伍成员接口
 */
export interface TeamMember extends PlayerInfo {
    isLeader: boolean; // 是否为队长
}

/**
 * 队伍接口
 */
export interface Team {
    teamId: string; // 队伍唯一ID
    leaderId: string; // 队长ID
    members: TeamMember[]; // 队伍成员列表
    maxMembers: number; // 最大成员数
}

/**
 * 社交系统核心类
 * 负责好友管理、聊天通信和组队功能。
 * 在实际应用中，此类会与后端API进行通信。
 * 
 * 注意：本类中的所有异步方法（如 sendFriendRequest, createTeam 等）都
 * 模拟了与后端通信的过程，实际项目中需要替换为真实的 HTTP 请求或 WebSocket 通信。
 * 事件发射器（eventEmitter）用于模拟通知游戏UI或其他系统社交状态的变更，
 * 在 Phaser 3 中，推荐使用 Phaser.Events.EventEmitter 实例。
 */
export class SocialSystem {
    // 假设我们有一个事件发射器来通知UI更新，这里使用一个简单的对象模拟
    // 在Phaser 3中，通常会使用 Phaser.Events.EventEmitter
    private eventEmitter: { on: (event: string, callback: Function) => void, emit: (event: string, ...args: any[]) => void };
    
    // 社交数据状态
    private friends: PlayerInfo[] = [];
    private friendRequests: FriendRequest[] = [];
    private chatHistory: ChatMessage[] = [];
    private currentTeam: Team | null = null;

    /**
     * 构造函数
     * @param eventEmitter 游戏事件发射器实例 (应为 Phaser.Events.EventEmitter 或类似接口)
     */
    constructor(eventEmitter: any) {
        this.eventEmitter = eventEmitter;
        console.log('SocialSystem initialized.');
        // 注册模拟的后端事件监听器
        this.setupBackendListeners();
    }

    // --- 内部辅助方法 ---

    /**
     * 模拟设置后端事件监听器。
     * 实际应用中，这些监听器会通过 WebSocket 或类似机制接收后端推送的实时数据。
     */
    private setupBackendListeners(): void {
        // 示例：监听后端推送的好友请求、聊天消息和队伍更新事件
        // this.eventEmitter.on('server:friendRequestReceived', this.handleFriendRequestReceived.bind(this));
        // this.eventEmitter.on('server:chatMessageReceived', this.handleChatMessageReceived.bind(this));
        // this.eventEmitter.on('server:teamUpdate', this.handleTeamUpdate.bind(this));
    }

    /**
     * 触发UI更新事件。
     * @param eventName 事件名称，例如 'social:friendAdded', 'social:chatMessageReceived'
     * @param data 事件数据
     */
    private emitUpdate(eventName: string, data: any): void {
        this.eventEmitter.emit(eventName, data);
    }

    // --- 好友管理功能 ---

    /**
     * 获取当前好友列表。
     * @returns 好友列表
     */
    public getFriends(): PlayerInfo[] {
        return this.friends;
    }

    /**
     * 获取待处理的好友请求列表。
     * @returns 好友请求列表
     */
    public getFriendRequests(): FriendRequest[] {
        return this.friendRequests;
    }

    /**
     * 发送好友请求。
     * @param targetPlayerId 目标玩家ID
     * @returns 成功或失败的Promise
     */
    public async sendFriendRequest(targetPlayerId: string): Promise<boolean> {
        console.log(`Sending friend request to ${targetPlayerId}...`);
        // 实际应用中：调用后端API发送请求
        // const response = await fetch('/api/social/sendFriendRequest', { method: 'POST', body: JSON.stringify({ targetPlayerId }) });
        
        // 模拟成功逻辑
        if (targetPlayerId) {
            this.emitUpdate('social:friendRequestSent', { targetId: targetPlayerId, success: true });
            return true;
        }
        return false;
    }

    /**
     * 处理收到的好友请求（接受或拒绝）。
     * @param requestId 请求ID
     * @param accept 是否接受
     * @returns 成功或失败的Promise
     */
    public async handleFriendRequest(requestId: string, accept: boolean): Promise<boolean> {
        const requestIndex = this.friendRequests.findIndex(req => req.requestId === requestId);
        if (requestIndex === -1) {
            console.warn(`Friend request ${requestId} not found.`);
            return false;
        }

        const request = this.friendRequests[requestIndex];
        console.log(`${accept ? 'Accepting' : 'Rejecting'} friend request from ${request.sender.name}...`);
        
        // 实际应用中：调用后端API处理请求
        // const response = await fetch('/api/social/handleFriendRequest', { method: 'POST', body: JSON.stringify({ requestId, accept }) });

        this.friendRequests.splice(requestIndex, 1); // 从列表中移除请求

        if (accept) {
            // 模拟将新好友添加到列表
            this.friends.push(request.sender);
            this.emitUpdate('social:friendAdded', request.sender);
        } else {
            this.emitUpdate('social:friendRequestRejected', request.sender.id);
        }

        this.emitUpdate('social:friendRequestsUpdated', this.friendRequests);
        return true;
    }

    /**
     * 移除好友。
     * @param playerId 要移除的好友ID
     * @returns 成功或失败的Promise
     */
    public async removeFriend(playerId: string): Promise<boolean> {
        console.log(`Removing friend ${playerId}...`);
        // 实际应用中：调用后端API移除好友
        
        const index = this.friends.findIndex(f => f.id === playerId);
        if (index !== -1) {
            const removedFriend = this.friends.splice(index, 1)[0];
            this.emitUpdate('social:friendRemoved', removedFriend);
            return true;
        }
        return false;
    }

    // --- 聊天功能 ---

    /**
     * 获取聊天历史记录。
     * @returns 聊天消息列表
     */
    public getChatHistory(): ChatMessage[] {
        return this.chatHistory;
    }

    /**
     * 发送聊天消息。
     * @param channel 频道类型
     * @param content 消息内容
     * @param targetId 目标ID（私聊为玩家ID，队伍为队伍ID，其他频道可忽略）
     * @returns 成功或失败的Promise
     */
    public async sendChatMessage(channel: ChatChannel, content: string, targetId?: string): Promise<boolean> {
        if (!content.trim()) return false;

        // 模拟当前玩家信息（实际应从游戏状态中获取）
        const myPlayerInfo: PlayerInfo = { id: 'player_self', name: 'You', status: PlayerStatus.Online };

        // 构造消息对象
        const message: ChatMessage = {
            id: Date.now().toString(),
            channel: channel,
            sender: myPlayerInfo,
            content: content,
            timestamp: Date.now(),
            targetId: targetId,
        };

        console.log(`Sending message in ${channel}: "${content}"`);
        // 实际应用中：调用后端API发送消息
        
        // 模拟将消息添加到本地历史记录
        this.chatHistory.push(message);
        // 触发消息接收事件，通知UI更新
        this.emitUpdate('social:chatMessageReceived', message);

        // 保持历史记录长度，防止内存溢出
        if (this.chatHistory.length > 100) {
            this.chatHistory.shift();
        }

        return true;
    }

    // --- 组队功能 ---

    /**
     * 获取当前队伍信息。
     * @returns 当前队伍对象或null
     */
    public getCurrentTeam(): Team | null {
        return this.currentTeam;
    }

    /**
     * 创建新队伍。
     * @param maxMembers 最大成员数，默认为4
     * @returns 成功或失败的Promise
     */
    public async createTeam(maxMembers: number = 4): Promise<boolean> {
        if (this.currentTeam) {
            console.warn('Already in a team. Must leave first.');
            return false;
        }

        // 模拟当前玩家信息
        const myPlayerInfo: PlayerInfo = { id: 'player_self', name: 'You', status: PlayerStatus.Online };
        
        // 实际应用中：调用后端API创建队伍
        // 模拟后端返回新的队伍信息
        const newTeam: Team = {
            teamId: 'team_' + Date.now().toString(),
            leaderId: myPlayerInfo.id,
            members: [{ ...myPlayerInfo, isLeader: true }],
            maxMembers: maxMembers,
        };

        this.currentTeam = newTeam;
        this.emitUpdate('social:teamCreated', newTeam);
        console.log(`Team created with ID: ${newTeam.teamId}`);
        return true;
    }

    /**
     * 邀请玩家加入队伍（仅限队长）。
     * @param targetPlayerId 目标玩家ID
     * @returns 成功或失败的Promise
     */
    public async inviteToTeam(targetPlayerId: string): Promise<boolean> {
        if (!this.currentTeam) {
            console.warn('Must be in a team to invite others.');
            return false;
        }
        // 假设 'player_self' 是当前玩家的ID
        if (this.currentTeam.leaderId !== 'player_self') { 
            console.warn('Only the team leader can invite members.');
            return false;
        }
        
        console.log(`Inviting ${targetPlayerId} to team ${this.currentTeam.teamId}...`);
        // 实际应用中：调用后端API发送邀请
        this.emitUpdate('social:teamInviteSent', { targetId: targetPlayerId, teamId: this.currentTeam.teamId });
        return true;
    }

    /**
     * 处理队伍邀请（接受或拒绝）。
     * @param teamId 队伍ID
     * @param leaderId 邀请者ID
     * @param accept 是否接受
     * @returns 成功或失败的Promise
     */
    public async handleTeamInvite(teamId: string, leaderId: string, accept: boolean): Promise<boolean> {
        if (this.currentTeam) {
            console.warn('Already in a team. Cannot join another.');
            return false;
        }

        console.log(`${accept ? 'Accepting' : 'Rejecting'} team invite from ${leaderId} for team ${teamId}...`);
        // 实际应用中：调用后端API处理邀请
        
        if (accept) {
            // 模拟后端返回加入后的队伍信息
            const joinedTeam: Team = {
                teamId: teamId,
                leaderId: leaderId,
                members: [
                    // 模拟其他成员和当前玩家
                    { id: leaderId, name: 'Leader', status: PlayerStatus.Online, isLeader: true },
                    { id: 'player_self', name: 'You', status: PlayerStatus.Online, isLeader: false },
                ],
                maxMembers: 4,
            };
            this.currentTeam = joinedTeam;
            this.emitUpdate('social:teamJoined', joinedTeam);
        } else {
            this.emitUpdate('social:teamInviteRejected', teamId);
        }

        return true;
    }

    /**
     * 离开当前队伍。
     * @returns 成功或失败的Promise
     */
    public async leaveTeam(): Promise<boolean> {
        if (!this.currentTeam) {
            console.warn('Not currently in a team.');
            return false;
        }

        const teamId = this.currentTeam.teamId;
        console.log(`Leaving team ${teamId}...`);
        // 实际应用中：调用后端API离开队伍
        
        this.currentTeam = null;
        this.emitUpdate('social:teamLeft', teamId);
        return true;
    }

    /**
     * 踢出队伍成员（仅限队长）。
     * @param memberId 要踢出的成员ID
     * @returns 成功或失败的Promise
     */
    public async kickMember(memberId: string): Promise<boolean> {
        // 检查是否在队伍中且是队长
        if (!this.currentTeam || this.currentTeam.leaderId !== 'player_self') {
            console.warn('You are not the team leader or not in a team.');
            return false;
        }
        // 不能踢自己
        if (memberId === 'player_self') {
            console.warn('Cannot kick yourself. Use leaveTeam instead.');
            return false;
        }

        // 实际应用中：调用后端API踢出成员
        
        const index = this.currentTeam.members.findIndex(m => m.id === memberId);
        if (index !== -1) {
            const kickedMember = this.currentTeam.members.splice(index, 1)[0];
            this.emitUpdate('social:memberKicked', { teamId: this.currentTeam.teamId, member: kickedMember });
            // 触发队伍信息更新
            this.emitUpdate('social:teamUpdated', this.currentTeam);
            return true;
        }
        return false;
    }

    // --- 模拟后端推送事件处理函数 ---
    
    /**
     * 模拟处理接收到的好友请求。
     * @param request 好友请求对象
     */
    public handleFriendRequestReceived(request: FriendRequest): void {
        this.friendRequests.push(request);
        this.emitUpdate('social:friendRequestsUpdated', this.friendRequests);
        console.log(`New friend request from ${request.sender.name}`);
    }

    /**
     * 模拟处理接收到的聊天消息。
     * @param message 聊天消息对象
     */
    public handleChatMessageReceived(message: ChatMessage): void {
        this.chatHistory.push(message);
        this.emitUpdate('social:chatMessageReceived', message);
        console.log(`New chat message in ${message.channel} from ${message.sender.name}`);
        
        if (this.chatHistory.length > 100) {
            this.chatHistory.shift();
        }
    }

    /**
     * 模拟处理队伍状态更新。
     * @param team 队伍对象
     */
    public handleTeamUpdate(team: Team | null): void {
        this.currentTeam = team;
        if (team) {
            this.emitUpdate('social:teamUpdated', team);
            console.log(`Team updated. Current members: ${team.members.length}`);
        } else {
            this.emitUpdate('social:teamDisbanded', null);
            console.log('Team disbanded.');
        }
    }
}
