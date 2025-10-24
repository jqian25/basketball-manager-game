/**
 * @file SoundLibrary.ts
 * @description 篮球游戏音效库定义。包含约60种高质量、篮球主题的音效。
 *
 * SoundLibrary 结构:
 * 1. 比赛事件 (Game Events): 哨声、蜂鸣器、计时器等。
 * 2. 球员动作 (Player Actions): 运球、投篮、跑动、跳跃等。
 * 3. 观众反应 (Crowd Reactions): 欢呼、鼓掌、嘘声等。
 * 4. 特殊效果 (Special Effects): 慢动作、回放、特效等。
 * 5. 界面/UI (UI/Interface): 按钮点击、菜单切换等。
 */

// 定义音效的类型，假设每个音效都有一个唯一的ID（key）和文件路径（path）
export type SoundEffect = {
    id: string;
    path: string;
    description: string; // 描述音效用途
};

// 使用 Record<string, SoundEffect[]> 来组织音效库，方便按类别查找
export type SoundLibrary = {
    [category: string]: SoundEffect[];
};

/**
 * 篮球游戏音效库
 * 包含约60种音效 (实际数量: 60 种)，分为五大类。
 * 实际项目中，`path` 应指向音效文件的实际位置，例如 "/sfx/game/buzzer.mp3"。
 * 此处使用占位符路径。
 */
export const SoundLibraryData: SoundLibrary = {
    // 1. 比赛事件 (Game Events) - 10 种
    'game_events': [
        { id: 'buzzer_end_game', path: '/sfx/game/buzzer_end_game.mp3', description: '比赛结束蜂鸣器' },
        { id: 'buzzer_shot_clock', path: '/sfx/game/buzzer_shot_clock.mp3', description: '24秒进攻时间到蜂鸣器' },
        { id: 'whistle_foul', path: '/sfx/game/whistle_foul.mp3', description: '犯规哨声' },
        { id: 'whistle_timeout', path: '/sfx/game/whistle_timeout.mp3', description: '暂停哨声' },
        { id: 'whistle_jump_ball', path: '/sfx/game/whistle_jump_ball.mp3', description: '跳球哨声' },
        { id: 'timer_countdown_5s', path: '/sfx/game/timer_countdown_5s.mp3', description: '比赛最后5秒倒计时' },
        { id: 'scoreboard_update', path: '/sfx/game/scoreboard_update.mp3', description: '比分板更新提示音' },
        { id: 'referee_call_travel', path: '/sfx/game/referee_call_travel.mp3', description: '裁判喊走步' },
        { id: 'referee_call_double_dribble', path: '/sfx/game/referee_call_double_dribble.mp3', description: '裁判喊二次运球' },
        { id: 'quarter_start_horn', path: '/sfx/game/quarter_start_horn.mp3', description: '每节开始的短促号角' },
    ],

    // 2. 球员动作 (Player Actions) - 30 种
    'player_actions': [
        // 运球 (Dribbling) - 6 种
        { id: 'dribble_hard_wood', path: '/sfx/actions/dribble_hard_wood.mp3', description: '硬木地板快速运球' },
        { id: 'dribble_slow_gym', path: '/sfx/actions/dribble_slow_gym.mp3', description: '体育馆慢速运球' },
        { id: 'crossover_move', path: '/sfx/actions/crossover_move.mp3', description: '交叉步运球动作声' },
        { id: 'behind_back_dribble', path: '/sfx/actions/behind_back_dribble.mp3', description: '背后运球声' },
        { id: 'dribble_stop', path: '/sfx/actions/dribble_stop.mp3', description: '运球停止声' },
        { id: 'ball_catch', path: '/sfx/actions/ball_catch.mp3', description: '接球声' },

        // 投篮/进球 (Shooting/Scoring) - 10 种
        { id: 'swish_net', path: '/sfx/actions/swish_net.mp3', description: '空心入网声 (Swish)' },
        { id: 'rim_in', path: '/sfx/actions/rim_in.mp3', description: '球擦篮筐入网声' },
        { id: 'rim_out_miss', path: '/sfx/actions/rim_out_miss.mp3', description: '球砸篮筐弹出声 (Miss)' },
        { id: 'backboard_hit', path: '/sfx/actions/backboard_hit.mp3', description: '球砸篮板声' },
        { id: 'layup_release', path: '/sfx/actions/layup_release.mp3', description: '上篮出手声' },
        { id: 'dunk_slam', path: '/sfx/actions/dunk_slam.mp3', description: '大力扣篮声' },
        { id: 'dunk_rim_shake', path: '/sfx/actions/dunk_rim_shake.mp3', description: '扣篮后篮筐晃动声' },
        { id: 'free_throw_release', path: '/sfx/actions/free_throw_release.mp3', description: '罚球出手声' },
        { id: 'three_point_release', path: '/sfx/actions/three_point_release.mp3', description: '三分球出手声' },
        { id: 'ball_bounce_to_stop', path: '/sfx/actions/ball_bounce_to_stop.mp3', description: '球弹跳至停止' },

        // 跑动/身体接触 (Movement/Contact) - 14 种
        { id: 'sneaker_squeak_quick', path: '/sfx/actions/sneaker_squeak_quick.mp3', description: '球鞋快速急停摩擦声 (短)' },
        { id: 'sneaker_squeak_long', path: '/sfx/actions/sneaker_squeak_long.mp3', description: '球鞋长时间摩擦声 (长)' },
        { id: 'run_footsteps_fast', path: '/sfx/actions/run_footsteps_fast.mp3', description: '快速跑动脚步声' },
        { id: 'run_footsteps_slow', path: '/sfx/actions/run_footsteps_slow.mp3', description: '慢速跑动脚步声' },
        { id: 'jump_takeoff', path: '/sfx/actions/jump_takeoff.mp3', description: '跳跃起跳声' },
        { id: 'land_soft', path: '/sfx/actions/land_soft.mp3', description: '轻柔落地声' },
        { id: 'land_hard', path: '/sfx/actions/land_hard.mp3', description: '重重落地声' },
        { id: 'body_impact_light', path: '/sfx/actions/body_impact_light.mp3', description: '轻微身体接触/碰撞' },
        { id: 'body_impact_hard', path: '/sfx/actions/body_impact_hard.mp3', description: '激烈身体碰撞/犯规' },
        { id: 'ball_pass_whoosh', path: '/sfx/actions/ball_pass_whoosh.mp3', description: '传球时的风声/呼啸声' },
        { id: 'ball_hit_floor_hard', path: '/sfx/actions/ball_hit_floor_hard.mp3', description: '球重重砸地声' },
        { id: 'jersey_rustle', path: '/sfx/actions/jersey_rustle.mp3', description: '球衣摩擦声' },
        { id: 'grunt_effort', path: '/sfx/actions/grunt_effort.mp3', description: '发力时的低吼声' },
        { id: 'grunt_pain', path: '/sfx/actions/grunt_pain.mp3', description: '受伤或痛苦的低吼声' },
    ],

    // 3. 观众反应 (Crowd Reactions) - 15 种
    'crowd_reactions': [
        { id: 'cheer_short_score', path: '/sfx/crowd/cheer_short_score.mp3', description: '短促的进球欢呼' },
        { id: 'cheer_long_win', path: '/sfx/crowd/cheer_long_win.mp3', description: '长时间的胜利欢呼' },
        { id: 'applause_light', path: '/sfx/crowd/applause_light.mp3', description: '稀疏的掌声' },
        { id: 'applause_heavy', path: '/sfx/crowd/applause_heavy.mp3', description: '热烈的掌声' },
        { id: 'boo_short_foul', path: '/sfx/crowd/boo_short_foul.mp3', description: '短促的嘘声 (对犯规)' },
        { id: 'gasp_miss', path: '/sfx/crowd/gasp_miss.mp3', description: '投篮不中时的叹息声' },
        { id: 'ooh_close_call', path: '/sfx/crowd/ooh_close_call.mp3', description: '惊险时刻的“Ooh”声' },
        { id: 'chant_defense', path: '/sfx/crowd/chant_defense.mp3', description: '“防守”口号 (Defense Chant)' },
        { id: 'crowd_murmur_low', path: '/sfx/crowd/crowd_murmur_low.mp3', description: '背景低语/嗡嗡声' },
        { id: 'crowd_murmur_high', path: '/sfx/crowd/crowd_murmur_high.mp3', description: '背景兴奋的嗡嗡声' },
        { id: 'air_horn_fan', path: '/sfx/crowd/air_horn_fan.mp3', description: '球迷气喇叭声' },
        { id: 'drum_beat_fan', path: '/sfx/crowd/drum_beat_fan.mp3', description: '球迷鼓点声' },
        { id: 'commentator_excited', path: '/sfx/crowd/commentator_excited.mp3', description: '解说员激动喊叫 (Placeholder)' },
        { id: 'commentator_calm', path: '/sfx/crowd/commentator_calm.mp3', description: '解说员平静叙述 (Placeholder)' },
        { id: 'jumbotron_effect', path: '/sfx/crowd/jumbotron_effect.mp3', description: '大屏幕特效音' },
    ],

    // 4. 特殊效果 (Special Effects) - 5 种
    'special_effects': [
        { id: 'slow_motion_whoosh', path: '/sfx/special/slow_motion_whoosh.mp3', description: '慢动作过渡音效' },
        { id: 'replay_start_jingle', path: '/sfx/special/replay_start_jingle.mp3', description: '回放开始提示音' },
        { id: 'highlight_stinger', path: '/sfx/special/highlight_stinger.mp3', description: '精彩瞬间短促音效' },
        { id: 'powerup_collect', path: '/sfx/special/powerup_collect.mp3', description: '收集道具/能量提升' },
        { id: 'level_up_fanfare', path: '/sfx/special/level_up_fanfare.mp3', description: '升级/成就达成号角' },
    ],

    // 5. 界面/UI (UI/Interface) - 10 种
    'ui_interface': [
        { id: 'ui_button_click', path: '/sfx/ui/ui_button_click.mp3', description: '通用按钮点击声 (确认)' },
        { id: 'ui_menu_open', path: '/sfx/ui/ui_menu_open.mp3', description: '菜单打开/弹出' },
        { id: 'ui_menu_close', path: '/sfx/ui/ui_menu_close.mp3', description: '菜单关闭/收回' },
        { id: 'ui_tab_switch', path: '/sfx/ui/ui_tab_switch.mp3', description: '标签页切换' },
        { id: 'ui_error_alert', path: '/sfx/ui/ui_error_alert.mp3', description: '错误/警告提示音' },
        { id: 'ui_success_chime', path: '/sfx/ui/ui_success_chime.mp3', description: '成功/完成提示音' },
        { id: 'ui_slider_move', path: '/sfx/ui/ui_slider_move.mp3', description: '滑块/进度条移动' },
        { id: 'ui_notification_in', path: '/sfx/ui/ui_notification_in.mp3', description: '新通知弹出' },
        { id: 'ui_select_player', path: '/sfx/ui/ui_select_player.mp3', description: '选择球员/卡牌' },
        { id: 'ui_purchase_confirm', path: '/sfx/ui/ui_purchase_confirm.mp3', description: '购买确认音效' },
    ],
};

// 辅助函数：计算音效总数
function countTotalSounds(library: SoundLibrary): number {
    let count = 0;
    for (const category in library) {
        count += library[category].length;
    }
    return count;
}

// 导出音效库的总数，方便外部检查
export const TotalSoundCount: number = countTotalSounds(SoundLibraryData);

// 示例：如何使用音效库
// console.log(`音效库总数: ${TotalSoundCount}`);
// console.log(`比赛结束音效路径: ${SoundLibraryData.game_events.find(s => s.id === 'buzzer_end_game')?.path}`);
