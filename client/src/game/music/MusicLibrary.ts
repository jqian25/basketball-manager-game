// client/src/game/music/MusicLibrary.ts

/**
 * BGM曲目元数据接口定义
 */
export interface BGMTrack {
    /** 唯一标识符，通常与文件名对应 */
    id: string;
    /** 曲目名称 */
    title: string;
    /** 艺术家/作曲家 */
    artist: string;
    /** 风格/情绪 */
    genre: 'HipHop' | 'Electronic' | 'Rock' | 'Orchestral' | 'Jazz' | 'Funk';
    /** 情绪标签：'PumpUp' | 'Focus' | 'Tense' | 'Celebration' | 'Chill' | 'Training' | 'Defeat'; */
    mood: string;
    /** 播放时长（秒） */
    duration: number;
    /** 适用的游戏场景：'Menu' | 'InGame' | 'Timeout' | 'Victory' | 'Defeat' | 'Training' */
    scene: string;
}

/**
 * 篮球主题BGM音乐库
 * 包含20首曲目的元数据
 */
export const MusicLibrary: BGMTrack[] = [
    // 1. 比赛进行中 - 紧张/高能
    {
        id: 'game_time_anthem',
        title: 'Game Time Anthem',
        artist: 'The Court Kings',
        genre: 'HipHop',
        mood: 'PumpUp',
        duration: 185,
        scene: 'InGame',
    },
    // 2. 比赛进行中 - 电子/快速
    {
        id: 'fast_break_fever',
        title: 'Fast Break Fever',
        artist: 'DJ Crossover',
        genre: 'Electronic',
        mood: 'PumpUp',
        duration: 160,
        scene: 'InGame',
    },
    // 3. 暂停/休息 - 轻松/过渡
    {
        id: 'timeout_groove',
        title: 'Timeout Groove',
        artist: 'The Jazz Hands',
        genre: 'Funk',
        mood: 'Chill',
        duration: 95,
        scene: 'Timeout',
    },
    // 4. 胜利 - 庆祝/史诗
    {
        id: 'championship_ring',
        title: 'Championship Ring',
        artist: 'Victory Ensemble',
        genre: 'Orchestral',
        mood: 'Celebration',
        duration: 140,
        scene: 'Victory',
    },
    // 5. 菜单/主界面 - 氛围/冷静
    {
        id: 'locker_room_vibes',
        title: 'Locker Room Vibes',
        artist: 'Smooth Operator',
        genre: 'Jazz',
        mood: 'Focus',
        duration: 210,
        scene: 'Menu',
    },
    // 6. 训练模式 - 稳定/节奏感
    {
        id: 'dribble_and_drill',
        title: 'Dribble and Drill',
        artist: 'The Practice Squad',
        genre: 'HipHop',
        mood: 'Training',
        duration: 175,
        scene: 'Training',
    },
    // 7. 比赛进行中 - 摇滚/激情
    {
        id: 'slam_dunk_rock',
        title: 'Slam Dunk Rock',
        artist: 'Hardwood Heroes',
        genre: 'Rock',
        mood: 'PumpUp',
        duration: 150,
        scene: 'InGame',
    },
    // 8. 比赛进行中 - 紧张/最后几秒
    {
        id: 'buzzer_beater_tension',
        title: 'Buzzer Beater Tension',
        artist: 'The Clockwork',
        genre: 'Electronic',
        mood: 'Tense',
        duration: 65,
        scene: 'InGame',
    },
    // 9. 失败 - 沉重/反思
    {
        id: 'walk_of_shame',
        title: 'Walk of Shame',
        artist: 'The Low Notes',
        genre: 'Jazz',
        mood: 'Defeat',
        duration: 120,
        scene: 'Defeat',
    },
    // 10. 菜单/生涯模式 - 励志/史诗
    {
        id: 'road_to_glory',
        title: 'Road to Glory',
        artist: 'Epic Sports Scores',
        genre: 'Orchestral',
        mood: 'Focus',
        duration: 240,
        scene: 'Menu',
    },
    // 11. 比赛进行中 - 经典街球
    {
        id: 'streetball_classic',
        title: 'Streetball Classic',
        artist: 'The Concrete Crew',
        genre: 'HipHop',
        mood: 'Chill',
        duration: 190,
        scene: 'InGame',
    },
    // 12. 暂停/商业广告风格
    {
        id: 'ad_break_jingle',
        title: 'Ad Break Jingle',
        artist: 'Studio 55',
        genre: 'Funk',
        mood: 'Celebration',
        duration: 45,
        scene: 'Timeout',
    },
    // 13. 比赛进行中 - 电子/未来感
    {
        id: 'cyber_court',
        title: 'Cyber Court',
        artist: 'Neon Net',
        genre: 'Electronic',
        mood: 'Tense',
        duration: 170,
        scene: 'InGame',
    },
    // 14. 训练模式 - 轻快/重复
    {
        id: 'repetition_is_key',
        title: 'Repetition is Key',
        artist: 'The Drill Masters',
        genre: 'Electronic',
        mood: 'Training',
        duration: 130,
        scene: 'Training',
    },
    // 15. 胜利 - 轻松/欢快
    {
        id: 'post_game_high',
        title: 'Post Game High',
        artist: 'The Feel Goods',
        genre: 'Funk',
        mood: 'Celebration',
        duration: 105,
        scene: 'Victory',
    },
    // 16. 比赛进行中 - 紧张/中场
    {
        id: 'mid_court_clash',
        title: 'Mid-Court Clash',
        artist: 'The Rockers',
        genre: 'Rock',
        mood: 'Tense',
        duration: 165,
        scene: 'InGame',
    },
    // 17. 菜单/设置界面 - 极简/环境
    {
        id: 'menu_lofi',
        title: 'Menu Lo-Fi',
        artist: 'The Ambient Baller',
        genre: 'Jazz',
        mood: 'Chill',
        duration: 200,
        scene: 'Menu',
    },
    // 18. 比赛进行中 - 史诗/追分
    {
        id: 'comeback_kid',
        title: 'Comeback Kid',
        artist: 'The Score Keepers',
        genre: 'Orchestral',
        mood: 'PumpUp',
        duration: 195,
        scene: 'InGame',
    },
    // 19. 暂停/球迷互动
    {
        id: 'crowd_cheer_mix',
        title: 'Crowd Cheer Mix',
        artist: 'Stadium Sounds',
        genre: 'HipHop',
        mood: 'PumpUp',
        duration: 80,
        scene: 'Timeout',
    },
    // 20. 菜单/球员编辑 - 专注/冷静
    {
        id: 'player_creation_flow',
        title: 'Player Creation Flow',
        artist: 'The Architect',
        genre: 'Electronic',
        mood: 'Focus',
        duration: 220,
        scene: 'Menu',
    },
];

export default MusicLibrary;