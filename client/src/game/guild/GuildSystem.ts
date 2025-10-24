// client/src/game/guild/GuildSystem.ts

// 模拟Phaser 3环境中的EventEmitter，在实际Phaser项目中应替换为Phaser.Events.EventEmitter
class EventEmitter {
    private events: { [key: string]: Function[] } = {};

    on(eventName: string, listener: Function) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    emit(eventName: string, ...args: any[]) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => listener(...args));
        }
    }
}

// 宝可梦Game Boy风格的常量和配置
export const MAX_GUILD_MEMBERS = 10; // 联盟最大成员数，Game Boy时代资源有限，设定较小
export const MAX_GUILD_NAME_LENGTH = 8; // 联盟名称最大长度，符合早期游戏的限制
export const INITIAL_GUILD_FUNDS = 500; // 初始资金
export const GUILD_RANK_NAMES: string[] = [
    "新成员", // Newbie
    "成员",   // Member
    "精英",   // Elite
    "副会长", // Vice-Leader
    "会长"    // Leader
];

// 联盟成员的状态接口
export interface IGuildMember {
    id: number; // 玩家ID
    name: string; // 玩家名称
    level: number; // 玩家等级（或最高宝可梦等级）
    rank: number; // 联盟内等级 (索引到 GUILD_RANK_NAMES)
    lastOnline: number; // 最后上线时间戳
    contribution: number; // 贡献值
}

// 联盟（公会）的核心数据接口
export interface IGuild {
    id: number; // 联盟ID
    name: string; // 联盟名称
    tag: string; // 联盟简称（例如：[PKM]）
    leaderId: number; // 会长玩家ID
    funds: number; // 联盟资金
    level: number; // 联盟等级
    experience: number; // 联盟经验值
    members: IGuildMember[]; // 成员列表
    announcement: string; // 公告
    // 宝可梦风格，可能有一些特殊的“基地”或“徽章”信息
    baseLocation?: string; // 基地位置（例如：常磐市）
    badgeCount: number; // 获得的特殊徽章数量
}

// 联盟系统配置接口（用于升级等）
export interface IGuildLevelConfig {
    level: number;
    expToNext: number; // 升级所需经验
    maxMembers: number; // 该等级最大成员数
    unlockFeature: string; // 解锁的特性描述
}

export const GUILD_LEVEL_CONFIGS: IGuildLevelConfig[] = [
    { level: 1, expToNext: 100, maxMembers: 10, unlockFeature: "基础公会功能" },
    { level: 2, expToNext: 300, maxMembers: 15, unlockFeature: "公会聊天" },
    { level: 3, expToNext: 800, maxMembers: 20, unlockFeature: "公会任务" },
    { level: 4, expToNext: 1500, maxMembers: 25, unlockFeature: "公会基地" },
    { level: 5, expToNext: 3000, maxMembers: 30, unlockFeature: "公会战" }
];

// 模拟的玩家数据
export const MOCK_PLAYER_DATA: IGuildMember = {
    id: 999, name: "主角", level: 50, rank: 0, lastOnline: Date.now(), contribution: 0
};

// 联盟系统事件
export enum GuildEvents {
    GUILD_CREATED = 'guildCreated',
    GUILD_UPDATED = 'guildUpdated',
    MEMBER_JOINED = 'memberJoined',
    MEMBER_LEFT = 'memberLeft',
    RANK_CHANGED = 'rankChanged',
}

/**
 * 联盟系统核心类
 * 继承自EventEmitter，用于在Phaser 3中进行事件通信
 */
export class GuildSystem extends EventEmitter {
    private currentGuild: IGuild | null = null;
    private nextGuildId: number = 1000;

    constructor() {
        super();
        console.log("GuildSystem initialized. Ready for adventure!");
    }

    /**
     * 获取当前联盟数据
     */
    public getGuild(): IGuild | null {
        return this.currentGuild;
    }

    /**
     * 玩家是否已加入联盟
     */
    public isInGuild(playerId: number): boolean {
        return this.currentGuild !== null && this.currentGuild.members.some(m => m.id === playerId);
    }

    /**
     * 创建一个新联盟
     * @param name 联盟名称
     * @param tag 联盟标签
     * @param leader 联盟创建者（会长）
     * @returns 成功或失败消息
     */
    public createGuild(name: string, tag: string, leader: IGuildMember): string {
        if (this.isInGuild(leader.id)) {
            return "您已在其他联盟中。";
        }

        if (name.length > MAX_GUILD_NAME_LENGTH) {
            return `联盟名称不能超过${MAX_GUILD_NAME_LENGTH}个字符。`;
        }

        const newLeader: IGuildMember = {
            ...leader,
            rank: GUILD_RANK_NAMES.length - 1, // 会长等级
            contribution: 0
        };

        this.currentGuild = {
            id: this.nextGuildId++,
            name: name,
            tag: tag.toUpperCase().substring(0, 4), // 标签最多4个字符
            leaderId: leader.id,
            funds: INITIAL_GUILD_FUNDS,
            level: 1,
            experience: 0,
            members: [newLeader],
            announcement: `欢迎来到 ${name}! 让我们一起成为宝可梦大师!`,
            badgeCount: 0
        };

        this.emit(GuildEvents.GUILD_CREATED, this.currentGuild);
        return `成功创建联盟: [${this.currentGuild.tag}] ${this.currentGuild.name}`;
    }

    /**
     * 玩家加入联盟 (模拟，实际可能需要邀请或申请)
     * @param member 要加入的成员
     * @returns 成功或失败消息
     */
    public joinGuild(member: IGuildMember): string {
        if (!this.currentGuild) {
            return "当前没有可加入的联盟。";
        }

        const config = GUILD_LEVEL_CONFIGS.find(c => c.level === this.currentGuild!.level);
        const maxMembers = config ? config.maxMembers : MAX_GUILD_MEMBERS;

        if (this.currentGuild.members.length >= maxMembers) {
            return `联盟成员已满 (${maxMembers}人)。`;
        }

        if (this.isInGuild(member.id)) {
            return "您已是本联盟成员。";
        }

        const newMember: IGuildMember = {
            ...member,
            rank: 0, // 初始为新成员
            contribution: 0
        };

        this.currentGuild.members.push(newMember);
        this.emit(GuildEvents.MEMBER_JOINED, newMember, this.currentGuild);
        this.emit(GuildEvents.GUILD_UPDATED, this.currentGuild);
        return `${member.name} 成功加入联盟 ${this.currentGuild.name}。`;
    }

    /**
     * 玩家离开联盟
     * @param playerId 玩家ID
     * @returns 成功或失败消息
     */
    public leaveGuild(playerId: number): string {
        if (!this.currentGuild) {
            return "您不在任何联盟中。";
        }

        const memberIndex = this.currentGuild.members.findIndex(m => m.id === playerId);

        if (memberIndex === -1) {
            return "您不是本联盟成员。";
        }

        const member = this.currentGuild.members[memberIndex];

        if (member.id === this.currentGuild.leaderId) {
            if (this.currentGuild.members.length > 1) {
                return "会长不能直接离开，请先转让会长职位。";
            }
            // 如果是唯一成员的会长，则解散联盟
            this.currentGuild = null;
            this.emit(GuildEvents.MEMBER_LEFT, member);
            this.emit(GuildEvents.GUILD_UPDATED, null);
            return `联盟 ${member.name} 已解散。`;
        }

        this.currentGuild.members.splice(memberIndex, 1);
        this.emit(GuildEvents.MEMBER_LEFT, member, this.currentGuild);
        this.emit(GuildEvents.GUILD_UPDATED, this.currentGuild);
        return `${member.name} 已离开联盟 ${this.currentGuild.name}。`;
    }

    /**
     * 会长/副会长提升/降级成员等级
     * @param operatorId 操作者ID
     * @param targetId 目标成员ID
     * @param newRankIndex 新的等级索引
     * @returns 成功或失败消息
     */
    public changeMemberRank(operatorId: number, targetId: number, newRankIndex: number): string {
        if (!this.currentGuild) return "没有联盟。";

        const operator = this.currentGuild.members.find(m => m.id === operatorId);
        const target = this.currentGuild.members.find(m => m.id === targetId);

        if (!operator || !target) return "操作者或目标成员不在联盟中。";

        // 只有会长(最高等级)或副会长(次高等级)能操作
        const isLeader = operator.rank === GUILD_RANK_NAMES.length - 1;
        const isViceLeader = operator.rank === GUILD_RANK_NAMES.length - 2;

        if (!isLeader && !isViceLeader) {
            return "您没有权限进行此操作。";
        }

        if (target.id === operatorId) {
            return "您不能改变自己的等级。";
        }

        if (newRankIndex < 0 || newRankIndex >= GUILD_RANK_NAMES.length - 1) {
            return "等级索引无效或不能直接任命为会长。";
        }

        // 副会长不能操作等级高于或等于自己的成员
        if (isViceLeader && target.rank >= operator.rank) {
            return "副会长不能操作等级高于或等于自己的成员。";
        }

        // 会长不能被降级（除非转让）
        if (target.id === this.currentGuild.leaderId) {
            return "请使用转让会长功能。";
        }

        target.rank = newRankIndex;
        this.emit(GuildEvents.RANK_CHANGED, target, GUILD_RANK_NAMES[newRankIndex]);
        this.emit(GuildEvents.GUILD_UPDATED, this.currentGuild);
        return `${target.name} 的等级已更改为 ${GUILD_RANK_NAMES[newRankIndex]}。`;
    }

    /**
     * 联盟经验增加，并检查是否升级
     * @param exp 增加的经验值
     */
    public addExperience(exp: number): void {
        if (!this.currentGuild) return;

        this.currentGuild.experience += exp;
        let didLevelUp = false;

        while (true) {
            const currentConfig = GUILD_LEVEL_CONFIGS.find(c => c.level === this.currentGuild!.level);
            if (!currentConfig || this.currentGuild.level >= GUILD_LEVEL_CONFIGS.length) {
                break; // 达到最高等级
            }

            if (this.currentGuild.experience >= currentConfig.expToNext) {
                this.currentGuild.experience -= currentConfig.expToNext;
                this.currentGuild.level++;
                didLevelUp = true;
                console.log(`联盟 ${this.currentGuild.name} 升级到 Lv.${this.currentGuild.level}!`);
            } else {
                break;
            }
        }

        if (didLevelUp) {
            this.emit(GuildEvents.GUILD_UPDATED, this.currentGuild);
        }
    }

    // --- 模拟使用示例 (在实际游戏中应在其他地方调用) ---
    public static runExample(): void {
        const system = new GuildSystem();
        const player1 = MOCK_PLAYER_DATA;
        const player2: IGuildMember = { id: 102, name: "小霞", level: 85, rank: 0, lastOnline: Date.now(), contribution: 0 };
        const player3: IGuildMember = { id: 103, name: "小刚", level: 78, rank: 0, lastOnline: Date.now(), contribution: 0 };

        // 监听事件
        system.on(GuildEvents.GUILD_CREATED, (guild: IGuild) => console.log(`[事件] 联盟创建: ${guild.name}`));
        system.on(GuildEvents.MEMBER_JOINED, (member: IGuildMember) => console.log(`[事件] 成员加入: ${member.name}`));
        system.on(GuildEvents.RANK_CHANGED, (member: IGuildMember, rankName: string) => console.log(`[事件] 等级变更: ${member.name} -> ${rankName}`));
        system.on(GuildEvents.GUILD_UPDATED, (guild: IGuild | null) => console.log(`[事件] 联盟状态更新: ${guild ? guild.name + " (Lv." + guild.level + ")" : "无"}`));

        console.log("\n--- 步骤 1: 创建联盟 ---");
        console.log(system.createGuild("火箭队", "RKT", player1));
        const guild = system.getGuild()!;
        console.log(`当前成员数: ${guild.members.length}`);

        console.log("\n--- 步骤 2: 成员加入 ---");
        console.log(system.joinGuild(player2));
        console.log(system.joinGuild(player3));
        console.log(`当前成员数: ${guild.members.length}`);

        console.log("\n--- 步骤 3: 会长提升成员等级 (小霞) ---");
        // player1 (主角) 是会长 (rank 4)
        // 提升小霞 (id 102) 到 副会长 (rank 3)
        console.log(system.changeMemberRank(player1.id, player2.id, 3));

        console.log("\n--- 步骤 4: 增加经验值并升级 ---");
        system.addExperience(150); // 升级到 Lv.2
        console.log(`联盟等级: ${system.getGuild()?.level}, 经验: ${system.getGuild()?.experience}`);

        system.addExperience(500); // 升级到 Lv.3
        console.log(`联盟等级: ${system.getGuild()?.level}, 经验: ${system.getGuild()?.experience}`);

        console.log("\n--- 步骤 5: 成员离开 ---");
        console.log(system.leaveGuild(player3.id));
        console.log(`当前成员数: ${guild.members.length}`);
    }
}

// 在实际项目中，这部分代码应移除，或仅用于测试
// GuildSystem.runExample();
