// client/src/game/animations/BasketballActions.ts

/**
 * 篮球动作的定义接口
 * @interface BasketballAction
 * @property {string} id - 动作的唯一标识符（使用小驼峰命名法）
 * @property {string} name - 动作的名称（用于UI显示）
 * @property {string} category - 动作的类别（如：Dribbling, Shooting, Passing, Defense, Movement）
 * @property {string} description - 动作的简短描述
 * @property {number} duration - 动作的默认持续时间（单位：毫秒）
 */
export interface BasketballAction {
    id: string;
    name: string;
    category: 'Dribbling' | 'Shooting' | 'Passing' | 'Defense' | 'Movement' | 'PostPlay';
    description: string;
    duration: number;
}

/**
 * 篮球动作库 - 包含50种高质量、符合篮球主题的动作。
 * @type {BasketballAction[]}
 */
export const BasketballActions: BasketballAction[] = [
    // --- Dribbling/Ball Handling (17) ---
    { id: 'crossover', name: '交叉步运球', category: 'Dribbling', description: '快速将球从一只手换到另一只手。', duration: 500 },
    { id: 'behindTheBack', name: '背后运球', category: 'Dribbling', description: '将球从背后绕过腰部换手。', duration: 600 },
    { id: 'inAndOut', name: '内外运球', category: 'Dribbling', description: '假装交叉步，但将球拉回同侧，用于突破。', duration: 700 },
    { id: 'hesitationDribble', name: '犹豫步运球', category: 'Dribbling', description: '突然放慢速度，假装停顿或传球，然后加速。', duration: 800 },
    { id: 'spinMove', name: '转身运球', category: 'Dribbling', description: '以持球手为轴心，背对防守者完成180度转身。', duration: 900 },
    { id: 'shammgod', name: '山姆高德', category: 'Dribbling', description: '用一只手将球向前推，然后迅速用同一只手将球拉回。', duration: 1000 },
    { id: 'doubleCrossover', name: '双重交叉步', category: 'Dribbling', description: '连续两次快速交叉步运球。', duration: 750 },
    { id: 'throughTheLegs', name: '胯下运球', category: 'Dribbling', description: '将球从胯下换手。', duration: 650 },
    { id: 'retreatDribble', name: '后撤运球', category: 'Dribbling', description: '向后运球拉开与防守者的距离。', duration: 700 },
    { id: 'killerCrossover', name: '脚踝终结者', category: 'Dribbling', description: '幅度大且速度极快的交叉步，旨在晃倒防守者。', duration: 550 },
    { id: 'lowDribble', name: '低位运球', category: 'Dribbling', description: '保持低重心，将球运在膝盖以下，保护球。', duration: 400 },
    { id: 'speedDribble', name: '加速运球', category: 'Dribbling', description: '全速推进，将球运在身体前方。', duration: 300 },
    { id: 'changeOfPace', name: '节奏变化', category: 'Dribbling', description: '突然从慢速切换到快速运球。', duration: 850 },
    { id: 'sideStepDribble', name: '侧向运球', category: 'Dribbling', description: '运球时横向移动，为投篮或传球创造空间。', duration: 700 },
    { id: 'pullBackDribble', name: '后拉运球', category: 'Dribbling', description: '运球时突然向后拉球，通常用于制造投篮空间。', duration: 750 },
    { id: 'halfSpin', name: '半转身', category: 'Dribbling', description: '运球时进行180度转身，但保持面对篮筐。', duration: 600 },
    { id: 'poundDribble', name: '重击运球', category: 'Dribbling', description: '用力向下拍球，以获得更好的控制和节奏。', duration: 450 },

    // --- Shooting (13) ---
    { id: 'jumpShot', name: '跳投', category: 'Shooting', description: '跳起并在最高点出手投篮。', duration: 1200 },
    { id: 'layup', name: '上篮', category: 'Shooting', description: '靠近篮筐时，利用篮板或直接将球放入。', duration: 1000 },
    { id: 'dunk', name: '扣篮', category: 'Shooting', description: '高高跳起，将球砸入篮筐。', duration: 1100 },
    { id: 'fadeaway', name: '后仰跳投', category: 'Shooting', description: '向后倾斜身体，远离防守者完成跳投。', duration: 1300 },
    { id: 'freeThrow', name: '罚球', category: 'Shooting', description: '在罚球线上无干扰地投篮。', duration: 1500 },
    { id: 'floater', name: '抛投', category: 'Shooting', description: '在防守者头顶高弧度抛球。', duration: 1150 },
    { id: 'stepBackJumper', name: '后撤步跳投', category: 'Shooting', description: '运球后向后迈步，创造空间并完成跳投。', duration: 1400 },
    { id: 'hookShot', name: '勾手投篮', category: 'Shooting', description: '单手以弧线将球投向篮筐，身体侧对防守者。', duration: 1250 },
    { id: 'threePointer', name: '三分球', category: 'Shooting', description: '在三分线外投篮。', duration: 1350 },
    { id: 'putbackDunk', name: '补扣', category: 'Shooting', description: '抢到进攻篮板后立即完成扣篮。', duration: 950 },
    { id: 'bankShot', name: '打板投篮', category: 'Shooting', description: '瞄准篮板特定区域，利用反弹入筐。', duration: 1200 },
    { id: 'reverseLayup', name: '反手上篮', category: 'Shooting', description: '在篮筐另一侧完成上篮。', duration: 1050 },
    { id: 'turnaroundJumper', name: '转身跳投', category: 'Shooting', description: '背对篮筐接球，然后快速转身完成跳投。', duration: 1300 },

    // --- Passing (7) ---
    { id: 'chestPass', name: '胸前传球', category: 'Passing', description: '从胸部直接将球传出，速度快且精准。', duration: 500 },
    { id: 'bouncePass', name: '击地传球', category: 'Passing', description: '将球击地一次，弹到队友手中。', duration: 600 },
    { id: 'overheadPass', name: '头顶传球', category: 'Passing', description: '双手高举过头，将球传出，常用于长传。', duration: 700 },
    { id: 'noLookPass', name: '不看人传球', category: 'Passing', description: '眼睛看向别处，但将球传给队友。', duration: 800 },
    { id: 'baseballPass', name: '棒球式传球', category: 'Passing', description: '单手像投棒球一样长距离传球。', duration: 1000 },
    { id: 'wrapAroundPass', name: '绕身传球', category: 'Passing', description: '将球从防守者身体一侧绕过传给队友。', duration: 750 },
    { id: 'shovelPass', name: '铲传', category: 'Passing', description: '低手将球轻轻向上抛给切入的队友。', duration: 650 },

    // --- Defense/Rebounding (8) ---
    { id: 'blockShot', name: '盖帽', category: 'Defense', description: '跳起在空中拦截投篮。', duration: 900 },
    { id: 'stealBall', name: '抢断', category: 'Defense', description: '从运球者或传球路线上抢走球。', duration: 700 },
    { id: 'defensiveStance', name: '防守姿势', category: 'Defense', description: '保持低重心，侧身移动，紧盯进攻者。', duration: 400 },
    { id: 'boxOut', name: '卡位', category: 'Defense', description: '用身体挡住对手，为抢篮板创造空间。', duration: 600 },
    { id: 'rebound', name: '抢篮板', category: 'Defense', description: '跳起抓住投篮未进的球。', duration: 850 },
    { id: 'chargeTake', name: '制造进攻犯规', category: 'Defense', description: '在合理冲撞区外站定，被进攻者撞倒。', duration: 1000 },
    { id: 'helpDefense', name: '协防', category: 'Defense', description: '离开自己的防守人，帮助队友防守。', duration: 550 },
    { id: 'closeOut', name: '扑防', category: 'Defense', description: '快速冲向空位投篮者，进行干扰。', duration: 700 },

    // --- Movement/Off-Ball (5) ---
    { id: 'vCut', name: 'V字切入', category: 'Movement', description: '跑向篮筐，突然向外跑，再快速切入。', duration: 1000 },
    { id: 'backdoorCut', name: '后门切入', category: 'Movement', description: '假装向外跑，然后迅速切入篮筐。', duration: 800 },
    { id: 'screenSet', name: '设置掩护', category: 'Movement', description: '站定不动，用身体阻碍防守者追赶队友。', duration: 1200 },
    { id: 'rollToBasket', name: '掩护后顺下', category: 'Movement', description: '设置掩护后，迅速转身跑向篮筐。', duration: 750 },
    { id: 'popOut', name: '掩护后外弹', category: 'Movement', description: '设置掩护后，迅速跑向三分线外接球。', duration: 850 },

    // --- Post Play (5) ---
    { id: 'dropStep', name: '下沉步', category: 'PostPlay', description: '背身持球时，向底线或中路迈出一步，完成进攻。', duration: 900 },
    { id: 'upAndUnder', name: '假动作后反手上篮', category: 'PostPlay', description: '假装投篮，晃起防守者，然后迈步上篮。', duration: 1100 },
    { id: 'postSpin', name: '低位转身', category: 'PostPlay', description: '背身持球时，快速转身摆脱防守者。', duration: 800 },
    { id: 'babyHook', name: '小勾手', category: 'PostPlay', description: '在低位靠近篮筐处使用的小幅度勾手。', duration: 1000 },
    { id: 'faceUp', name: '面筐进攻', category: 'PostPlay', description: '从背身持球转为面向篮筐，准备突破或投篮。', duration: 700 },
];

// 导出动作库
export default BasketballActions;