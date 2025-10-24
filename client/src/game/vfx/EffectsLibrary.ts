// client/src/game/vfx/EffectsLibrary.ts

/**
 * 特效类型枚举，用于区分不同渲染和播放逻辑的特效
 */
export enum EffectType {
    ParticleSystem = "ParticleSystem", // 粒子系统
    Aura = "Aura",                     // 光环/气场
    Trail = "Trail",                   // 拖尾
    Burst = "Burst",                   // 爆发/瞬时效果
    Overlay = "Overlay",               // 屏幕或目标叠加效果
    Sound = "Sound",                   // 纯声音效果（尽管是VFX库，但有时需要同步声音ID）
}

/**
 * 特效配置接口
 */
export interface EffectConfig {
    duration?: number; // 持续时间 (秒)
    color?: string;    // 主色调 (HEX)
    size?: number;     // 尺寸/半径
    intensity?: number; // 强度/密度
    texture?: string;  // 粒子或光环使用的纹理ID
    // 更多特定于EffectType的属性...
}

/**
 * 单个特效定义接口
 */
export interface GameEffect {
    id: string;
    name: string;
    type: EffectType;
    description: string;
    config: EffectConfig;
}

/**
 * 篮球主题特效库 - 40种高质量特效
 */
export const EffectsLibrary: Record<string, GameEffect> = {
    // 1. 投篮成功/得分特效 (Shot Success/Scoring)
    "SCORE_SWISH": {
        id: "SCORE_SWISH",
        name: "空心入网",
        type: EffectType.Burst,
        description: "篮球空心入网时，篮筐周围瞬间爆发的金色星光和清脆的玻璃声。",
        config: { duration: 0.8, color: "#FFD700", size: 1.5, intensity: 100, texture: "star_burst" }
    },
    "SCORE_BUZZER_BEATER": {
        id: "SCORE_BUZZER_BEATER",
        name: "绝杀时刻",
        type: EffectType.Overlay,
        description: "比赛结束哨响前得分，屏幕边缘出现时间扭曲的蓝色脉冲和慢动作残影。",
        config: { duration: 2.0, color: "#00BFFF", intensity: 0.5 }
    },
    "SCORE_HEAT_CHECK": {
        id: "SCORE_HEAT_CHECK",
        name: "手感火热",
        type: EffectType.Aura,
        description: "连续得分后，球员身体周围环绕着上升的红色火焰光环。",
        config: { duration: 5.0, color: "#FF4500", size: 0.8, intensity: 0.7, texture: "fire_wave" }
    },
    "SCORE_AND_ONE": {
        id: "SCORE_AND_ONE",
        name: "加罚机会",
        type: EffectType.Burst,
        description: "打板得分并造成犯规，篮球落点处炸开一道闪耀的白色电流。",
        config: { duration: 1.0, color: "#FFFFFF", size: 1.2, intensity: 80, texture: "lightning_arc" }
    },
    "SCORE_TRIPLE_DOUBLE": {
        id: "SCORE_TRIPLE_DOUBLE",
        name: "三双成就",
        type: EffectType.Overlay,
        description: "达成三双数据时，短暂的屏幕高光和紫色的数据流叠加。",
        config: { duration: 1.5, color: "#8A2BE2", intensity: 0.4 }
    },

    // 2. 运球/突破特效 (Dribbling/Driving)
    "DRIBBLE_CROSSOVER": {
        id: "DRIBBLE_CROSSOVER",
        name: "华丽变向",
        type: EffectType.Trail,
        description: "快速变向时，篮球和球员手臂留下短暂的蓝色残影和风刃效果。",
        config: { duration: 0.5, color: "#00FFFF", intensity: 0.9, texture: "wind_slash" }
    },
    "DRIBBLE_ANKLE_BREAKER": {
        id: "DRIBBLE_ANKLE_BREAKER",
        name: "脚踝终结者",
        type: EffectType.Burst,
        description: "晃倒防守者时，防守者脚下出现短暂的红色裂纹和震荡波。",
        config: { duration: 1.2, color: "#FF0000", size: 2.0, intensity: 0.6, texture: "ground_crack" }
    },
    "DRIBBLE_SPEED_BOOST": {
        id: "DRIBBLE_SPEED_BOOST",
        name: "极速推进",
        type: EffectType.Aura,
        description: "加速突破时，球员身后拖着一道绿色的气流尾迹。",
        config: { duration: 3.0, color: "#00FF00", size: 0.5, intensity: 0.8, texture: "speed_lines" }
    },
    "DRIBBLE_BEHIND_BACK": {
        id: "DRIBBLE_BEHIND_BACK",
        name: "背后运球",
        type: EffectType.Sound,
        description: "一次完美的背后运球，伴随着清脆的'啪'一声和短暂的焦点模糊。",
        config: { duration: 0.3, size: 0.1 }
    },
    "DRIBBLE_SPIN_MOVE": {
        id: "DRIBBLE_SPIN_MOVE",
        name: "陀螺转身",
        type: EffectType.Trail,
        description: "转身时，球员身体周围出现一道快速旋转的白色光环。",
        config: { duration: 0.6, color: "#FFFFFF", intensity: 0.7, texture: "spin_blur" }
    },

    // 3. 防守/抢断/盖帽特效 (Defense/Steal/Block)
    "DEFENSE_BLOCK_REJECTION": {
        id: "DEFENSE_BLOCK_REJECTION",
        name: "排球大帽",
        type: EffectType.Burst,
        description: "成功盖帽，篮球被击飞处爆发出银色的冲击波和破碎的冰晶。",
        config: { duration: 1.0, color: "#C0C0C0", size: 1.8, intensity: 90, texture: "ice_shard" }
    },
    "DEFENSE_STEAL_SUCCESS": {
        id: "DEFENSE_STEAL_SUCCESS",
        name: "抢断成功",
        type: EffectType.Burst,
        description: "成功抢断瞬间，对手头上飘出一个红色的'失误'图标和短暂的黑色烟雾。",
        config: { duration: 0.7, color: "#FF0000", size: 1.0, intensity: 0.5, texture: "error_icon" }
    },
    "DEFENSE_INTIMIDATION": {
        id: "DEFENSE_INTIMIDATION",
        name: "威慑气场",
        type: EffectType.Aura,
        description: "防守强硬时，球员周围散发着深紫色的压迫感光环。",
        config: { duration: 4.0, color: "#4B0082", size: 1.0, intensity: 0.6, texture: "dark_pulse" }
    },
    "DEFENSE_CHARGE_TAKEN": {
        id: "DEFENSE_CHARGE_TAKEN",
        name: "制造进攻犯规",
        type: EffectType.Burst,
        description: "成功制造进攻犯规，球员倒地处出现一道金色的盾牌标记。",
        config: { duration: 1.5, color: "#FFC72C", size: 1.5, intensity: 0.8, texture: "shield_icon" }
    },
    "DEFENSE_CLUTCH_STOP": {
        id: "DEFENSE_CLUTCH_STOP",
        name: "关键防守",
        type: EffectType.Overlay,
        description: "比赛关键时刻的成功防守，屏幕短暂变为黑白并聚焦到防守者。",
        config: { duration: 1.0, intensity: 1.0 }
    },

    // 4. 传球/助攻特效 (Passing/Assist)
    "PASS_ASSIST_PERFECT": {
        id: "PASS_ASSIST_PERFECT",
        name: "完美助攻",
        type: EffectType.Trail,
        description: "传球路径上出现一道闪烁的金色轨迹，并伴随一个'A+'标记。",
        config: { duration: 1.0, color: "#FFD700", intensity: 1.0, texture: "golden_line" }
    },
    "PASS_ALLEY_OOP": {
        id: "PASS_ALLEY_OOP",
        name: "空接传球",
        type: EffectType.Trail,
        description: "高抛传球时，篮球周围环绕着上升的白色螺旋气流。",
        config: { duration: 1.5, color: "#FFFFFF", intensity: 0.8, texture: "spiral_wind" }
    },
    "PASS_NO_LOOK": {
        id: "PASS_NO_LOOK",
        name: "不看人传球",
        type: EffectType.Burst,
        description: "传球瞬间，球员眼睛处闪烁一道快速的红色光芒。",
        config: { duration: 0.4, color: "#FF0000", size: 0.5, intensity: 0.9 }
    },
    "PASS_FANCY_DISH": {
        id: "PASS_FANCY_DISH",
        name: "花式妙传",
        type: EffectType.ParticleSystem,
        description: "背后或胯下传球，篮球周围散落着五彩的几何粒子。",
        config: { duration: 0.6, color: "#FF69B4", intensity: 70, texture: "geometric_shapes" }
    },
    "PASS_TURNOVER": {
        id: "PASS_TURNOVER",
        name: "传球失误",
        type: EffectType.Burst,
        description: "传球被抢断，篮球周围爆发出短暂的红色'X'形闪光。",
        config: { duration: 0.5, color: "#FF0000", size: 0.8, intensity: 0.8 }
    },

    // 5. 扣篮特效 (Dunking)
    "DUNK_POWER_SLAM": {
        id: "DUNK_POWER_SLAM",
        name: "暴力重扣",
        type: EffectType.Burst,
        description: "扣篮落地时，地面出现一道强烈的黄色震荡波和烟尘。",
        config: { duration: 1.2, color: "#FFC72C", size: 3.0, intensity: 1.0, texture: "ground_shockwave" }
    },
    "DUNK_WINDMILL": {
        id: "DUNK_WINDMILL",
        name: "风车灌篮",
        type: EffectType.Trail,
        description: "扣篮过程中，手臂划出一道紫色的螺旋形光影。",
        config: { duration: 1.0, color: "#8A2BE2", intensity: 0.9, texture: "spiral_trail" }
    },
    "DUNK_POSTERIZE": {
        id: "DUNK_POSTERIZE",
        name: "隔人暴扣",
        type: EffectType.Overlay,
        description: "隔人扣篮成功，屏幕短暂出现漫画风格的线条和红色冲击字样。",
        config: { duration: 1.5, color: "#FF4500", intensity: 0.7 }
    },
    "DUNK_FLIGHT_MODE": {
        id: "DUNK_FLIGHT_MODE",
        name: "滞空模式",
        type: EffectType.Aura,
        description: "球员在空中停留时，身体周围散发着微弱的白色重力场光环。",
        config: { duration: 1.5, color: "#F0F8FF", size: 0.7, intensity: 0.5, texture: "gravity_field" }
    },
    "DUNK_BACKBOARD_SHATTER": {
        id: "DUNK_BACKBOARD_SHATTER",
        name: "震碎篮板",
        type: EffectType.Burst,
        description: "极小概率触发，篮板出现裂纹并伴随玻璃破碎的粒子效果。",
        config: { duration: 2.5, color: "#A9A9A9", size: 5.0, intensity: 1.0, texture: "glass_shards" }
    },

    // 6. 状态/增益/减益特效 (Status/Buff/Debuff)
    "STATUS_MOMENTUM": {
        id: "STATUS_MOMENTUM",
        name: "势不可挡",
        type: EffectType.Aura,
        description: "获得动量增益，球员脚下出现快速流动的蓝色能量圈。",
        config: { duration: 10.0, color: "#1E90FF", size: 0.6, intensity: 0.8, texture: "energy_ring" }
    },
    "STATUS_TIRED": {
        id: "STATUS_TIRED",
        name: "体力不支",
        type: EffectType.Overlay,
        description: "体力耗尽，球员周围出现缓慢下沉的灰色汗滴粒子。",
        config: { duration: 999, color: "#808080", intensity: 0.3, texture: "sweat_drop" }
    },
    "STATUS_CLUTCH": {
        id: "STATUS_CLUTCH",
        name: "大心脏",
        type: EffectType.Aura,
        description: "关键时刻，球员胸口发出稳定的橙色心跳脉冲。",
        config: { duration: 60.0, color: "#FFA500", size: 0.4, intensity: 0.9, texture: "heart_pulse" }
    },
    "STATUS_INJURY": {
        id: "STATUS_INJURY",
        name: "受伤痛苦",
        type: EffectType.Overlay,
        description: "球员受伤时，受伤部位闪烁红色的疼痛标记。",
        config: { duration: 999, color: "#FF0000", intensity: 0.6 }
    },
    "STATUS_FOCUS": {
        id: "STATUS_FOCUS",
        name: "专注模式",
        type: EffectType.Overlay,
        description: "进入高度专注状态，视野边缘轻微模糊，中央目标高亮。",
        config: { duration: 5.0, color: "#FFFFFF", intensity: 0.2 }
    },

    // 7. 特殊技能/终结技特效 (Special Skills/Finishers)
    "SKILL_FADEAWAY": {
        id: "SKILL_FADEAWAY",
        name: "后仰跳投",
        type: EffectType.Trail,
        description: "后仰时，球员身体在空中留下一道优雅的抛物线光影。",
        config: { duration: 1.0, color: "#FF69B4", intensity: 0.7, texture: "arc_trail" }
    },
    "SKILL_SKY_HOOK": {
        id: "SKILL_SKY_HOOK",
        name: "天勾",
        type: EffectType.Aura,
        description: "使用天勾时，篮球周围短暂出现一道象征高度的蓝色光柱。",
        config: { duration: 1.2, color: "#4169E1", size: 0.5, intensity: 0.9, texture: "light_pillar" }
    },
    "SKILL_DREAM_SHAKE": {
        id: "SKILL_DREAM_SHAKE",
        name: "梦幻舞步",
        type: EffectType.ParticleSystem,
        description: "使用梦幻舞步时，球员脚下散发出金色的沙尘粒子。",
        config: { duration: 1.5, color: "#DAA520", intensity: 60, texture: "gold_dust" }
    },
    "SKILL_GHOST_MOVE": {
        id: "SKILL_GHOST_MOVE",
        name: "幽灵闪现",
        type: EffectType.Burst,
        description: "快速移动躲避防守时，短暂出现半透明的残影。",
        config: { duration: 0.5, color: "#ADD8E6", size: 0.8, intensity: 0.5 }
    },
    "SKILL_ULTIMATE_FINISHER": {
        id: "SKILL_ULTIMATE_FINISHER",
        name: "终极绝杀",
        type: EffectType.Overlay,
        description: "释放终极技能，全屏短暂闪烁，并伴随一道黑洞般的能量漩涡。",
        config: { duration: 3.0, color: "#000000", intensity: 1.0 }
    },

    // 8. 场地/环境特效 (Court/Environment)
    "COURT_FAN_ROAR": {
        id: "COURT_FAN_ROAR",
        name: "观众欢呼",
        type: EffectType.Sound,
        description: "主场得分时，观众席上方出现一道向上冲的绿色声波。",
        config: { duration: 1.5, color: "#3CB371", size: 5.0 }
    },
    "COURT_TIMEOUT_CALL": {
        id: "COURT_TIMEOUT_CALL",
        name: "暂停标记",
        type: EffectType.Burst,
        description: "教练叫暂停时，场地中央出现一个巨大的'T'形蓝色标记。",
        config: { duration: 2.0, color: "#4682B4", size: 4.0, intensity: 0.7, texture: "T_marker" }
    },
    "COURT_SHOT_CLOCK_VIOLATION": {
        id: "COURT_SHOT_CLOCK_VIOLATION",
        name: "24秒违例",
        type: EffectType.Burst,
        description: "24秒违例时，投篮计时器周围闪烁红色警示光。",
        config: { duration: 1.0, color: "#FF0000", size: 0.5, intensity: 1.0 }
    },
    "COURT_RAIN_EFFECT": {
        id: "COURT_RAIN_EFFECT",
        name: "雨天球场",
        type: EffectType.Overlay,
        description: "室外场地在雨天时的屏幕水滴和模糊效果。",
        config: { duration: 999, intensity: 0.2 }
    },
    "COURT_SPOTLIGHT": {
        id: "COURT_SPOTLIGHT",
        name: "聚光灯",
        type: EffectType.Aura,
        description: "比赛MVP或焦点球员脚下出现一束追随的白色聚光灯。",
        config: { duration: 999, color: "#FFFFFF", size: 2.0, intensity: 0.5 }
    },

    // 9. 犯规/判罚特效 (Foul/Penalty)
    "FOUL_PERSONAL": {
        id: "FOUL_PERSONAL",
        name: "普通犯规",
        type: EffectType.Burst,
        description: "普通犯规发生时，犯规者头顶短暂出现一个黄色的'F'标记。",
        config: { duration: 0.8, color: "#FFFF00", size: 0.8, intensity: 0.8, texture: "F_icon" }
    },
    "FOUL_TECHNICAL": {
        id: "FOUL_TECHNICAL",
        name: "技术犯规",
        type: EffectType.Burst,
        description: "技术犯规，一个紫色的闪电符号在球员头顶炸开。",
        config: { duration: 1.5, color: "#800080", size: 1.0, intensity: 0.9, texture: "lightning_symbol" }
    },
    "FOUL_FLAGRANT": {
        id: "FOUL_FLAGRANT",
        name: "恶意犯规",
        type: EffectType.Overlay,
        description: "恶意犯规，屏幕短暂血红，伴随低沉的震动效果。",
        config: { duration: 1.0, color: "#8B0000", intensity: 0.6 }
    },
    "FOUL_THREE_SHOTS": {
        id: "FOUL_THREE_SHOTS",
        name: "三次罚球",
        type: EffectType.Burst,
        description: "获得三次罚球机会，罚球线上方出现三个闪烁的数字'3'。",
        config: { duration: 2.0, color: "#00FF7F", size: 1.5, intensity: 0.8 }
    },
    "FOUL_GOALTENDING": {
        id: "FOUL_GOALTENDING",
        name: "干扰球",
        type: EffectType.Burst,
        description: "干扰球判罚，篮筐周围出现一道红色的禁止圈。",
        config: { duration: 1.0, color: "#FF0000", size: 1.5, intensity: 0.7, texture: "no_entry_sign" }
    },

    // 10. 杂项/趣味特效 (Miscellaneous/Fun)
    "MISC_MASCOT_DANCE": {
        id: "MISC_MASCOT_DANCE",
        name: "吉祥物热舞",
        type: EffectType.ParticleSystem,
        description: "暂停期间，吉祥物周围散发出彩色的纸屑和气球粒子。",
        config: { duration: 5.0, color: "#FFC0CB", intensity: 50, texture: "confetti" }
    },
    "MISC_COACH_ANGER": {
        id: "MISC_COACH_ANGER",
        name: "教练暴怒",
        type: EffectType.Burst,
        description: "教练不满判罚，头顶冒出黑色的蒸汽和红色的感叹号。",
        config: { duration: 1.5, color: "#000000", size: 0.8, intensity: 0.6, texture: "steam_exclamation" }
    },
    "MISC_BALL_FLAME": {
        id: "MISC_BALL_FLAME",
        name: "火焰篮球",
        type: EffectType.Aura,
        description: "篮球在空中飞行时，被一层燃烧的橙色火焰包裹。",
        config: { duration: 1.5, color: "#FF8C00", size: 0.3, intensity: 1.0, texture: "fire_ball" }
    },
    "MISC_SLOW_MOTION": {
        id: "MISC_SLOW_MOTION",
        name: "子弹时间",
        type: EffectType.Overlay,
        description: "关键投篮进入慢动作，屏幕边缘出现蓝色渐变和时间流逝的线条。",
        config: { duration: 3.0, color: "#4682B4", intensity: 0.3 }
    },
    "MISC_MVP_POSE": {
        id: "MISC_MVP_POSE",
        name: "MVP定格",
        type: EffectType.Burst,
        description: "获得MVP，球员身上被一道从天而降的金色光束笼罩，并伴随镜头闪光。",
        config: { duration: 2.0, color: "#FFD700", size: 2.5, intensity: 1.0, texture: "god_ray" }
    },
};

// 导出类型和库，方便其他模块使用
export default EffectsLibrary;
