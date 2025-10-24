// client/src/game/i18n/LocalizationSystem.ts

/**
 * 支持的语言枚举
 */
export enum Language {
    ZH_CN = 'zh_CN', // 简体中文
    EN_US = 'en_US', // 美式英语
    JA_JP = 'ja_JP', // 日语
}

/**
 * 本地化键的类型定义
 * 包含所有需要本地化的文本键
 */
export type LocalizationKey =
    | 'GAME_TITLE'
    | 'START_GAME'
    | 'SETTINGS'
    | 'QUIT_GAME'
    | 'PLAYER_NAME'
    | 'TEAM_NAME'
    | 'SCOREBOARD'
    | 'QUARTER_LABEL'
    | 'TIMEOUT_CALL'
    | 'THREE_POINTER'
    | 'SLAM_DUNK'
    | 'FREE_THROW'
    | 'ASSIST'
    | 'REBOUND'
    | 'STEAL'
    | 'BLOCK'
    | 'FOUL'
    | 'GAME_OVER'
    | 'MVP_AWARD'
    | 'CHAMPION_MESSAGE';

/**
 * 存储所有本地化文本的结构
 * 键是 LocalizationKey，值是对应语言的文本
 */
export type LocalizationData = {
    [key in LocalizationKey]: string;
};

/**
 * 语言包类型
 * 键是 Language 枚举，值是对应语言的 LocalizationData
 */
export type LanguagePack = {
    [key in Language]: LocalizationData;
};

// ---------------------------------------------------
// 完整数据库 - 符合篮球主题的高质量内容数据库
// ---------------------------------------------------

export const BASKETBALL_LANGUAGE_PACK: LanguagePack = {
    [Language.ZH_CN]: {
        GAME_TITLE: '篮球巨星之路',
        START_GAME: '开始比赛',
        SETTINGS: '游戏设置',
        QUIT_GAME: '退出游戏',
        PLAYER_NAME: '球员姓名',
        TEAM_NAME: '球队名称',
        SCOREBOARD: '比分牌',
        QUARTER_LABEL: '第 {quarter} 节', // 包含占位符
        TIMEOUT_CALL: '请求暂停',
        THREE_POINTER: '三分命中!',
        SLAM_DUNK: '暴力扣篮!',
        FREE_THROW: '罚球',
        ASSIST: '助攻',
        REBOUND: '篮板',
        STEAL: '抢断',
        BLOCK: '盖帽',
        FOUL: '犯规',
        GAME_OVER: '比赛结束',
        MVP_AWARD: '最有价值球员 (MVP)',
        CHAMPION_MESSAGE: '恭喜！您赢得了总冠军奖杯！',
    },
    [Language.EN_US]: {
        GAME_TITLE: 'Basketball Superstar Journey',
        START_GAME: 'Start Game',
        SETTINGS: 'Settings',
        QUIT_GAME: 'Quit Game',
        PLAYER_NAME: 'Player Name',
        TEAM_NAME: 'Team Name',
        SCOREBOARD: 'Scoreboard',
        QUARTER_LABEL: 'Quarter {quarter}', // 包含占位符
        TIMEOUT_CALL: 'Call Timeout',
        THREE_POINTER: 'Three-Pointer!',
        SLAM_DUNK: 'Slam Dunk!',
        FREE_THROW: 'Free Throw',
        ASSIST: 'Assist',
        REBOUND: 'Rebound',
        STEAL: 'Steal',
        BLOCK: 'Block',
        FOUL: 'Foul',
        GAME_OVER: 'Game Over',
        MVP_AWARD: 'Most Valuable Player (MVP)',
        CHAMPION_MESSAGE: 'Congratulations! You won the Championship Trophy!',
    },
    [Language.JA_JP]: {
        GAME_TITLE: 'バスケットボール・スーパースターの旅',
        START_GAME: '試合開始',
        SETTINGS: '設定',
        QUIT_GAME: 'ゲーム終了',
        PLAYER_NAME: '選手名',
        TEAM_NAME: 'チーム名',
        SCOREBOARD: 'スコアボード',
        QUARTER_LABEL: '第 {quarter} クォーター', // 包含占位符
        TIMEOUT_CALL: 'タイムアウトを要求',
        THREE_POINTER: 'スリーポイント成功!',
        SLAM_DUNK: '豪快なダンク!',
        FREE_THROW: 'フリースロー',
        ASSIST: 'アシスト',
        REBOUND: 'リバウンド',
        STEAL: 'スティール',
        BLOCK: 'ブロック',
        FOUL: 'ファウル',
        GAME_OVER: '試合終了',
        MVP_AWARD: '最優秀選手 (MVP)',
        CHAMPION_MESSAGE: 'おめでとうございます！チャンピオンシップトロフィーを獲得しました！',
    },
};

/**
 * 本地化系统
 */
export class LocalizationSystem {
    private currentLanguage: Language = Language.ZH_CN;
    private languagePack: LanguagePack;

    /**
     * 构造函数
     * @param initialLanguage 初始语言
     * @param languagePack 语言包数据
     */
    constructor(initialLanguage: Language, languagePack: LanguagePack) {
        this.currentLanguage = initialLanguage;
        this.languagePack = languagePack;
    }

    /**
     * 设置当前语言
     * @param language 要设置的语言
     */
    public setLanguage(language: Language): void {
        if (this.languagePack[language]) {
            this.currentLanguage = language;
        } else {
            console.warn(`Language pack not found for: ${language}`);
        }
    }

    /**
     * 获取当前语言
     */
    public getCurrentLanguage(): Language {
        return this.currentLanguage;
    }

    /**
     * 获取指定键的本地化文本
     * @param key 本地化键
     * @returns 对应语言的文本，如果找不到则返回键本身
     */
    public get(key: LocalizationKey): string {
        const data = this.languagePack[this.currentLanguage];
        if (data && data[key]) {
            return data[key];
        }
        console.warn(`Localization key not found for ${this.currentLanguage}: ${key}`);
        return key; // 找不到时返回键本身作为回退
    }

    /**
     * 获取指定键的本地化文本，并支持简单的字符串替换（占位符）
     * 占位符格式为 {key}
     * @param key 本地化键
     * @param replacements 占位符替换对象，例如 { quarter: 4 }
     * @returns 替换后的文本
     */
    public getWithParams(key: LocalizationKey, replacements: Record<string, string | number>): string {
        let text = this.get(key);
        for (const [placeholder, value] of Object.entries(replacements)) {
            // 使用正则表达式进行全局替换，例如将 {placeholder} 替换为值
            const regex = new RegExp(`{${placeholder}}`, 'g');
            text = text.replace(regex, String(value));
        }
        return text;
    }
}

// 示例用法（可根据需要保留或移除）
/*
const localizationSystem = new LocalizationSystem(Language.ZH_CN, BASKETBALL_LANGUAGE_PACK);
console.log(localizationSystem.get('GAME_TITLE')); // 篮球巨星之路
console.log(localizationSystem.getWithParams('QUARTER_LABEL', { quarter: 4 })); // 第 4 节

localizationSystem.setLanguage(Language.EN_US);
console.log(localizationSystem.get('SLAM_DUNK')); // Slam Dunk!
console.log(localizationSystem.getWithParams('QUARTER_LABEL', { quarter: 1 })); // Quarter 1
*/
