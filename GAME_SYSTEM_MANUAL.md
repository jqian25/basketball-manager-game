# 篮球热潮物语 - 游戏系统完整手册

## 📋 文档说明

本手册专门介绍**新开发的游戏系统**，包括：
- 星球大战3D开场动画
- 拉拉队表演系统
- Kairosoft风格超大地图
- 宝箱收集系统
- 愤怒的小鸟式投篮游戏
- 快速比赛系统

---

## 🎮 游戏系统总览

### 系统架构图
```
游戏入口
    ├── 星球大战开场 (/opening)
    ├── 超大地图系统 (/basketball-court)
    │   ├── 宝箱收集系统
    │   ├── 关卡传送门系统
    │   └── 玩家移动系统
    ├── 投篮游戏系统
    │   ├── 带拉拉队开场 (/shooting-game-opening)
    │   └── 直接进入 (/shooting-game)
    └── 快速比赛系统 (/match/quick)
        └── 拉拉队开场表演
```

---

## 🌟 系统1：星球大战3D开场动画

### 访问路径
```
URL: /opening
组件: client/src/components/StarWarsOpening.tsx
```

### 功能特性

#### 1. 真正的3D透视滚动
```css
perspective: 300px;           /* 3D透视距离 */
perspective-origin: 50% 50%;  /* 透视原点 */
transform: rotateX(25deg);    /* X轴旋转25度 */
```

#### 2. 三层星空视差
- **第一层星空**: 200s动画周期，大星星
- **第二层星空**: 150s动画周期，中星星
- **第三层星空**: 100s动画周期，小星星

#### 3. 标题动画
- **淡入**: 0-15% (0-1.2秒)
- **显示**: 15-85% (1.2-6.8秒)
- **淡出**: 85-100% (6.8-8秒)
- **缩放**: 0.3 → 1 → 1.5

#### 4. 文字滚动
- **延迟**: 8秒后开始
- **时长**: 60秒
- **方向**: 从下往上
- **效果**: 逐渐消失在远方

### 技术实现

#### CSS关键代码
```css
/* 3D滚动容器 */
.crawl-container {
  perspective: 300px;
  perspective-origin: 50% 50%;
}

/* 文字3D旋转 */
.crawl-text {
  transform: rotateX(25deg);
  transform-origin: 50% 100%;
}

/* 滚动动画 */
@keyframes crawlAnimation {
  0% { top: 100%; opacity: 1; }
  100% { top: -150%; opacity: 0; }
}
```

### 使用场景
1. 游戏启动欢迎动画
2. 新章节开始过场
3. 重要剧情前奏

---

## 💃 系统2：拉拉队表演系统

### 访问路径
```
独立页面: /cheerleader
组件: client/src/components/CheerleaderOpening.tsx
集成位置: 
  - QuickMatch.tsx (快速比赛)
  - ShootingGameWithOpening.tsx (投篮游戏)
```

### 视频资源

#### 视频列表（7个）
```javascript
const CHEERLEADER_VIDEOS = [
  '/videos/cheerleader_blonde.mp4',    // 金发拉拉队
  '/videos/cheerleader_asian.mp4',     // 亚洲拉拉队
  '/videos/cheerleader_latina.mp4',    // 拉丁拉拉队
  '/videos/cheerleader_bunny.mp4',     // 兔女郎拉拉队
  '/videos/cheerleader_redhead.mp4',   // 红发拉拉队
  '/cheerleader-opening.mp4',          // 开场拉拉队
  '/cheerleader-halftime.mp4'          // 中场拉拉队
];
```

### 功能特性

#### 1. 随机播放
```typescript
const randomIndex = Math.floor(Math.random() * CHEERLEADER_VIDEOS.length);
setSelectedVideo(CHEERLEADER_VIDEOS[randomIndex]);
```

#### 2. 跳过机制
- **显示时机**: 视频播放3秒后
- **按钮位置**: 右下角
- **样式**: 红色背景，白色文字，悬停放大

#### 3. 自动跳转
```typescript
const handleVideoEnd = () => {
  setShowOpening(false);
  startGame(); // 进入游戏
};
```

### 集成方式

#### 快速比赛集成
```typescript
// QuickMatch.tsx
const [showCheerleader, setShowCheerleader] = useState(false);

const handleCheerleaderEnd = () => {
  setShowCheerleader(false);
  setGameStarted(true);
  setCommentary("比赛开始！双方球员进入场地！");
};
```

#### 投篮游戏集成
```typescript
// ShootingGameWithOpening.tsx
const [showOpening, setShowOpening] = useState(true);

const handleVideoEnd = () => {
  setShowOpening(false);
  startGame(); // 启动Phaser游戏
};
```

---

## 🗺️ 系统3：Kairosoft风格超大地图

### 访问路径
```
URL: /basketball-court
场景: client/src/game/scenes/BasketballCourtScene.ts
页面: client/src/pages/BasketballCourt.tsx
```

### 地图规格

#### 基础参数
```typescript
MAP_WIDTH = 150;      // 150瓦片宽
MAP_HEIGHT = 100;     // 100瓦片高
TILE_WIDTH = 64;      // 瓦片宽64像素
TILE_HEIGHT = 32;     // 瓦片高32像素
总瓦片数 = 15,000个
```

#### 等距视角计算
```typescript
// 瓦片坐标 → 世界坐标
const x = (tileX - tileY) * (TILE_WIDTH / 2);
const y = (tileX + tileY) * (TILE_HEIGHT / 2);

// 世界坐标 → 瓦片坐标
const tileX = Math.floor((worldX / (TILE_WIDTH / 2) + worldY / (TILE_HEIGHT / 2)) / 2);
const tileY = Math.floor((worldY / (TILE_HEIGHT / 2) - worldX / (TILE_WIDTH / 2)) / 2);
```

### 地图内容详解

#### 1. 篮球场（3个）

**主场馆 (25, 20)**
```typescript
尺寸: 28x15瓦片
包含:
  - 橙色地板 (court_orange)
  - 蓝色罚球区 (court_blue)
  - 2个篮球架 (basketball_hoop)
  - 1个记分牌 (scoreboard)
  - 2个看台 (bleachers)
  - 8个替补席长椅 (bench)
  - 栅栏围栏 (fence)
```

**训练场A (75, 20)** 和 **训练场B (25, 60)**
- 结构与主场馆相同
- 位置不同，分布在地图各处

#### 2. 道路网络

**横向主干道**
```typescript
y = 40: 从x=0到x=149
y = 80: 从x=0到x=149
瓦片: road_straight
```

**纵向主干道**
```typescript
x = 50: 从y=0到y=99
x = 100: 从y=0到y=99
瓦片: road_straight
```

#### 3. 建筑群（8个）

**体育馆群（左上角）**
```typescript
(10, 10)  - gym_entrance (体育馆入口, 3x缩放)
(18, 10)  - building_red_roof (红屋顶, 2.5x缩放)
(10, 18)  - building_orange_roof (橙屋顶, 2.5x缩放)
```

**商业区（右上角）**
```typescript
(130, 10) - building_orange_roof
(138, 10) - building_red_roof
(130, 18) - gym_entrance
```

**宿舍区（左下角）**
```typescript
(10, 85)  - building_red_roof
(18, 85)  - building_orange_roof
(10, 93)  - building_red_roof
```

**训练设施区（右下角）**
```typescript
(130, 85) - gym_entrance
(138, 85) - building_orange_roof
```

#### 4. 装饰元素

**树木（200棵）**
```typescript
随机分布在草地区域
瓦片: tree_small
缩放: 1.5x
避开: 篮球场、道路、建筑
```

**长椅（50个）**
```typescript
随机分布在草地区域
瓦片: bench
缩放: 1x
用途: 休息装饰
```

#### 5. 水景区（2个）

**右下角大水池**
```typescript
位置: (140, 90) 到 (149, 99)
尺寸: 10x10瓦片
瓦片: water
```

**左上角小水池**
```typescript
位置: (35, 5) 到 (41, 11)
尺寸: 7x7瓦片
瓦片: water
```

### 操作控制

#### 键盘控制
```typescript
W键 - 向上移动
A键 - 向左移动
S键 - 向下移动
D键 - 向右移动
E键 - 交互（打开宝箱/进入传送门）
```

#### 鼠标控制
```typescript
滚轮向上 - 放大地图 (最大2x)
滚轮向下 - 缩小地图 (最小0.5x)
```

#### 相机系统
```typescript
跟随模式: 相机跟随玩家
平滑系数: 0.1 (lerp)
边界限制: 地图边界内
```

### 小地图系统

#### 位置和尺寸
```typescript
位置: 右下角
尺寸: 200x150像素
背景: 半透明黑色
边框: 2px白色
```

#### 显示内容
```typescript
- 完整地图缩略图
- 玩家位置（红点）
- 实时更新
```

---

## 🎁 系统4：宝箱收集系统

### 系统文件
```
系统: client/src/game/systems/ChestSystem.ts
集成: BasketballCourtScene.ts
```

### 宝箱类型

#### 金色宝箱
```typescript
数量: 10个
奖励: 50-200篮球币（随机）
刷新时间: 30秒
特效: 金色粒子光芒
位置: 随机生成在草地区域
```

#### 银色宝箱
```typescript
数量: 5个
奖励: 随机道具
刷新时间: 60秒
特效: 银色粒子光芒
位置: 随机生成在草地区域
```

### 道具系统

#### 道具类型（4种）
```typescript
1. energy_basketball - 能量篮球
   效果: 临时提升投篮能力
   持续: 30秒

2. fire_basketball - 火焰篮球
   效果: 发射火焰攻击
   持续: 20秒

3. shield_basketball - 护盾篮球
   效果: 篮球护盾保护
   持续: 40秒

4. speed_shoes - 加速鞋
   效果: 移动速度提升50%
   持续: 25秒
```

### 交互机制

#### 检测范围
```typescript
DETECTION_RANGE = 100像素
```

#### 靠近效果
```typescript
距离 < 100像素:
  - 宝箱放大: 1.5x → 2x (200ms动画)
  - 显示提示: "按E打开宝箱"
  - 提示位置: 宝箱上方50像素
  
距离 >= 100像素:
  - 宝箱恢复: 2x → 1.5x (200ms动画)
  - 隐藏提示
```

#### 打开宝箱
```typescript
按E键:
  1. 播放打开动画
  2. 生成粒子特效（金色/银色）
  3. 显示奖励文字 ("+50币" 或 "获得道具")
  4. 文字上升并淡出 (1秒动画)
  5. 宝箱消失
  6. 开始刷新计时
```

### 刷新机制

#### 刷新逻辑
```typescript
金色宝箱:
  - 打开后30秒刷新
  - 刷新位置: 随机草地区域
  - 最多同时存在10个

银色宝箱:
  - 打开后60秒刷新
  - 刷新位置: 随机草地区域
  - 最多同时存在5个
```

#### 位置生成算法
```typescript
generateRandomPosition(): { x: number, y: number } {
  let attempts = 0;
  while (attempts < 100) {
    const tileX = Math.floor(Math.random() * MAP_WIDTH);
    const tileY = Math.floor(Math.random() * MAP_HEIGHT);
    
    if (isGrassArea(tileX, tileY)) {
      return tileToWorld(tileX, tileY);
    }
    attempts++;
  }
  return defaultPosition;
}
```

---

## 🚪 系统5：关卡传送门系统

### 系统文件
```
系统: client/src/game/systems/LevelPortalSystem.ts
集成: BasketballCourtScene.ts
```

### 传送门数据结构

```typescript
interface PortalData {
  id: string;              // 唯一标识
  x: number;               // 瓦片X坐标
  y: number;               // 瓦片Y坐标
  level: LevelData;        // 关联的关卡数据
  unlocked: boolean;       // 是否解锁
}
```

### 关卡数据结构

```typescript
interface LevelData {
  world: number;           // 世界编号 (1)
  level: number;           // 关卡编号 (1-10)
  name: string;            // 关卡名称
  basketballs: BasketballType[];  // 可用篮球类型
  obstacles: ObstacleData[];      // 障碍物配置
  hoop: { x: number, y: number }; // 篮筐位置
  stars: [number, number, number]; // 三星要求
}
```

### 初始关卡

#### 关卡1-1：新手训练
```typescript
{
  world: 1,
  level: 1,
  name: "新手训练",
  basketballs: [
    { type: "normal", count: 3 },
    { type: "speed", count: 2 }
  ],
  obstacles: [
    { type: "wood_box", x: 600, y: 400 },
    { type: "wood_box", x: 650, y: 400 }
  ],
  hoop: { x: 1000, y: 300 },
  stars: [2, 4, 5]  // ⭐⭐⭐用2球, ⭐⭐用4球, ⭐用5球
}
```

### 传送门特性

#### 视觉效果
```typescript
1. 旋转动画:
   - 360度旋转
   - 10秒循环
   - 无限重复

2. 脉冲动画:
   - 缩放: 1.5x ↔ 1.6x
   - 1.5秒周期
   - Sine缓动
   - 无限重复

3. 靠近放大:
   - 距离 < 100像素
   - 缩放: 1.5x → 2x
   - 200ms动画
   - Back.easeOut缓动
```

#### 交互提示
```typescript
靠近传送门:
  - 显示: "按E进入关卡"
  - 位置: 传送门上方150像素
  - 样式: 白色文字，黑色背景
  - 深度: 10000 (最上层)
```

### 关卡信息对话框

#### 对话框内容
```typescript
显示信息:
  - 关卡编号: "关卡 1-1"
  - 关卡名称: "新手训练"
  - 可用篮球: "可用篮球: 5个"
  - 星级要求: "⭐⭐⭐ 2球  ⭐⭐ 4球  ⭐ 5球"
  
按钮:
  - 开始挑战 (绿色, 左侧)
  - 取消 (红色, 右侧)
```

#### 对话框样式
```typescript
背景: 黑色半透明 (0.9)
尺寸: 600x400像素
位置: 屏幕中央
深度: 10000-10001
滚动: 不跟随相机 (setScrollFactor(0))
```

### 游戏流程

```
1. 玩家移动到传送门附近
   ↓
2. 显示"按E进入关卡"提示
   ↓
3. 按E键打开关卡信息对话框
   ↓
4. 查看关卡信息
   ↓
5. 点击"开始挑战"
   ↓
6. 跳转到 /shooting-game-opening
   ↓
7. 播放拉拉队开场视频
   ↓
8. 进入投篮游戏场景
```

---

## 🏀 系统6：愤怒的小鸟式投篮游戏

### 访问路径
```
带开场: /shooting-game-opening
直接进入: /shooting-game
场景: client/src/game/scenes/ShootingGameScene.ts
页面: client/src/pages/ShootingGame.tsx
```

### 游戏规格

#### 画布尺寸
```typescript
宽度: 1200像素
高度: 800像素
背景色: #87CEEB (天蓝色)
```

#### 物理引擎
```typescript
引擎: Matter.js
重力: { y: 2 }
调试模式: false (生产环境)
```

### 篮球类型系统

#### 1. 普通篮球 🟠
```typescript
类型: "normal"
颜色: 橙色
特殊能力: 无
弹道: 标准抛物线
使用: 基础投篮
```

#### 2. 加速篮球 🟡
```typescript
类型: "speed"
颜色: 黄色
特殊能力: 点击加速
效果: 速度提升2倍
持续: 瞬间加速
使用: 远距离投篮
```

#### 3. 爆炸篮球 ⚫
```typescript
类型: "bomb"
颜色: 黑色
特殊能力: 撞击爆炸
效果: 范围伤害，摧毁障碍物
爆炸半径: 100像素
使用: 清除障碍物
```

#### 4. 分裂篮球 🔵
```typescript
类型: "split"
颜色: 蓝色
特殊能力: 点击分裂
效果: 分裂成3个小球
分裂角度: -30°, 0°, +30°
使用: 覆盖更大范围
```

#### 5. 回旋篮球 🟢
```typescript
类型: "boomerang"
颜色: 绿色
特殊能力: 回旋飞行
效果: 曲线轨迹，绕过障碍物
轨迹: 正弦波曲线
使用: 绕过障碍物
```

### 弹弓发射系统

#### 拖拽机制
```typescript
1. 鼠标按下 (pointerdown):
   - 记录起始位置
   - 开始拖拽

2. 鼠标移动 (pointermove):
   - 计算拉力向量
   - 限制最大拉力
   - 显示轨迹预览

3. 鼠标松开 (pointerup):
   - 计算发射速度
   - 创建物理篮球
   - 应用力到篮球
   - 隐藏轨迹预览
```

#### 力度计算
```typescript
// 拉力向量
const dragX = startX - currentX;
const dragY = startY - currentY;

// 限制最大拉力
const maxDrag = 200;
const distance = Math.sqrt(dragX * dragX + dragY * dragY);
if (distance > maxDrag) {
  dragX = (dragX / distance) * maxDrag;
  dragY = (dragY / distance) * maxDrag;
}

// 发射速度
const velocityX = dragX * 0.1;
const velocityY = dragY * 0.1;
```

#### 轨迹预览
```typescript
// 绘制虚线轨迹
const points = 20;
for (let i = 0; i < points; i++) {
  const t = i / points;
  const x = startX + velocityX * t * 60;
  const y = startY + velocityY * t * 60 + 0.5 * gravity * (t * 60) ** 2;
  
  // 绘制点
  graphics.fillCircle(x, y, 3);
}
```

### 障碍物系统

#### 障碍物类型

**木箱**
```typescript
类型: "wood_box"
材质: 木头
耐久度: 100
可破坏: 是
尺寸: 50x50像素
颜色: 棕色
```

**石块**
```typescript
类型: "stone_block"
材质: 石头
耐久度: 无限
可破坏: 否
尺寸: 60x60像素
颜色: 灰色
```

**玻璃板**
```typescript
类型: "glass_panel"
材质: 玻璃
耐久度: 30
可破坏: 是（易碎）
尺寸: 40x80像素
颜色: 半透明蓝色
```

#### 碰撞检测
```typescript
// 监听碰撞事件
this.matter.world.on('collisionstart', (event) => {
  event.pairs.forEach((pair) => {
    const { bodyA, bodyB } = pair;
    
    // 篮球撞击障碍物
    if (isBasketball(bodyA) && isObstacle(bodyB)) {
      handleCollision(bodyA, bodyB);
    }
  });
});

// 处理碰撞
function handleCollision(basketball, obstacle) {
  // 减少障碍物耐久度
  obstacle.durability -= basketball.damage;
  
  // 耐久度为0时摧毁
  if (obstacle.durability <= 0) {
    destroyObstacle(obstacle);
  }
  
  // 爆炸篮球特殊处理
  if (basketball.type === 'bomb') {
    explode(basketball.x, basketball.y);
  }
}
```

### 篮筐系统

#### 篮筐配置
```typescript
位置: { x: 1000, y: 300 }
尺寸: 80x20像素 (篮筐口)
传感器: 是 (isSensor: true)
检测: 篮球进入触发
```

#### 得分检测
```typescript
// 监听篮球进入篮筐
this.matter.world.on('collisionstart', (event) => {
  event.pairs.forEach((pair) => {
    const { bodyA, bodyB } = pair;
    
    if (isBasketball(bodyA) && isHoop(bodyB)) {
      // 得分！
      onScore();
    }
  });
});

function onScore() {
  // 播放得分动画
  showScoreAnimation();
  
  // 计算星级
  const stars = calculateStars();
  
  // 显示完成界面
  showLevelComplete(stars);
}
```

### 评分系统

#### 星级计算
```typescript
function calculateStars(usedBalls: number, level: LevelData): number {
  const [threeStars, twoStars, oneStar] = level.stars;
  
  if (usedBalls <= threeStars) return 3;  // ⭐⭐⭐
  if (usedBalls <= twoStars) return 2;    // ⭐⭐
  if (usedBalls <= oneStar) return 1;     // ⭐
  return 0;  // 失败
}
```

#### 奖励计算
```typescript
function calculateReward(stars: number): number {
  switch (stars) {
    case 3: return 300;  // 三星: 300篮球币
    case 2: return 200;  // 二星: 200篮球币
    case 1: return 100;  // 一星: 100篮球币
    default: return 0;   // 失败: 0篮球币
  }
}
```

### 关卡完成界面

#### 显示内容
```typescript
- 标题: "关卡完成！" 或 "关卡失败"
- 星级: ⭐⭐⭐ (动画显示)
- 使用篮球数: "使用了 3 个篮球"
- 奖励: "+300 篮球币"
- 按钮: "下一关" / "重试" / "返回地图"
```

#### 动画效果
```typescript
1. 背景淡入 (0.3秒)
2. 标题缩放弹出 (0.5秒)
3. 星星逐个显示 (每个0.3秒)
4. 奖励文字上升 (0.5秒)
5. 按钮淡入 (0.3秒)
```

---

## 🎯 系统7：快速比赛系统

### 访问路径
```
URL: /match/quick
组件: client/src/pages/QuickMatch.tsx
```

### 比赛配置

#### 基础设置
```typescript
节数: 4节
每节时长: 180秒 (3分钟)
总时长: 12分钟
速度控制: 1x / 2x / 4x
```

#### 球队设置
```typescript
主队:
  - 名称: "主队"
  - 颜色: 蓝色
  - 初始分数: 0

客队:
  - 名称: "客队"
  - 颜色: 红色
  - 初始分数: 0
```

### 视角模式

#### 电影视角 (Cinematic)
```typescript
模式: "cinematic"
镜头类型:
  - wide: 广角镜头 (全场视角)
  - close: 特写镜头 (球员近景)
  - hoop: 篮筐视角 (投篮视角)
  - crowd: 观众席视角 (得分时)
```

#### 像素视角 (Pixel)
```typescript
模式: "pixel"
风格: Kairosoft像素风格
视角: 俯视45度
渲染: Canvas 2D
```

### 比赛事件系统

#### 事件类型
```typescript
interface GameEvent {
  id: number;
  type: "shot" | "assist" | "rebound" | "steal" | "block" | "quarter_end";
  time: number;        // 剩余时间
  quarter: number;     // 当前节数
  team: "home" | "away";
  player?: { name: string };
  targetPlayer?: { name: string };
  success?: boolean;   // 投篮是否成功
  points?: number;     // 得分 (2/3)
  description: string; // 事件描述
  shotType?: "three" | "mid" | "layup" | "dunk";
}
```

#### 事件生成逻辑
```typescript
function generateGameEvent(): GameEvent {
  const eventType = randomEventType();
  const team = Math.random() < 0.5 ? "home" : "away";
  
  switch (eventType) {
    case "shot":
      return generateShotEvent(team);
    case "assist":
      return generateAssistEvent(team);
    case "rebound":
      return generateReboundEvent(team);
    // ...
  }
}

function generateShotEvent(team: string): GameEvent {
  const shotType = randomShotType();
  const success = Math.random() < 0.45; // 45%命中率
  
  return {
    type: "shot",
    team,
    shotType,
    success,
    points: success ? (shotType === "three" ? 3 : 2) : 0,
    description: generateShotDescription(shotType, success)
  };
}
```

### 解说系统

#### 解说模板
```typescript
const commentaryTemplates = {
  shot_success_three: [
    "漂亮！三分球空心入网！",
    "太准了！三分球命中！",
    "完美的三分球！"
  ],
  shot_success_dunk: [
    "暴扣！势不可挡！",
    "太震撼了！扣篮得分！"
  ],
  shot_miss: [
    "可惜！没进！",
    "哎呀，差一点！"
  ],
  // ...
};
```

#### 解说生成
```typescript
function generateCommentary(event: GameEvent): string {
  let key = "";
  
  if (event.type === "shot") {
    if (event.success) {
      if (event.shotType === "three") {
        key = "shot_success_three";
      } else if (event.shotType === "dunk") {
        key = "shot_success_dunk";
      } else {
        key = "shot_success_normal";
      }
    } else {
      key = "shot_miss";
    }
  }
  
  const templates = commentaryTemplates[key];
  return templates[Math.floor(Math.random() * templates.length)];
}
```

#### 解说显示
```typescript
// 灌篮高手风格字幕
<div className="commentary-box">
  <span className="label">【解说】</span>
  <span className="text">{commentary}</span>
</div>

样式:
  - 位置: 底部中央
  - 背景: 黑色半透明
  - 边框: 2px橙色
  - 字体: 粗体，白色
  - 动画: 淡入淡出
```

### 观众反应系统

#### 反应文字库
```typescript
const crowdReactions = [
  "哇！！！",
  "太厉害了！",
  "好球！",
  "加油！",
  "太帅了！",
  "牛逼！",
  "绝了！"
];
```

#### 触发条件
```typescript
显示观众反应:
  - 三分球命中
  - 扣篮得分
  - 精彩盖帽
  - 关键抢断
  - 比分反超
```

#### 显示效果
```typescript
位置: 右上角
字体: 6xl, 粗体
颜色: 黄色
阴影: 深色投影
动画: 旋转弹出 (-20° → 0°)
持续: 2秒
```

### 得分特效

#### 特效动画
```typescript
触发: 投篮得分时
内容: "+2" 或 "+3"
动画序列:
  1. 缩放弹出: 0 → 2 (0.6秒)
  2. 上升: y+100 → y-100
  3. 淡出: opacity 1 → 0
  4. 最终缩放: 2 → 3
```

#### 样式设计
```typescript
字体: 9xl (144px)
颜色: 金黄色 (#FFD700)
阴影: 黑色模糊阴影
位置: 屏幕中央偏上
深度: 最上层
```

### 拉拉队开场集成

#### 触发时机
```typescript
1. 用户点击"开始比赛"
2. 设置 showCheerleader = true
3. 播放随机拉拉队视频
4. 视频结束后 setGameStarted(true)
5. 比赛正式开始
```

#### 代码实现
```typescript
const [showCheerleader, setShowCheerleader] = useState(false);

const handleStartMatch = () => {
  setShowCheerleader(true);
};

const handleCheerleaderEnd = () => {
  setShowCheerleader(false);
  setGameStarted(true);
  setCommentary("比赛开始！双方球员进入场地！");
};

// 渲染
{showCheerleader && (
  <CheerleaderVideo onEnd={handleCheerleaderEnd} />
)}
```

### 比赛控制

#### 播放/暂停
```typescript
const [isPaused, setIsPaused] = useState(false);

const togglePause = () => {
  setIsPaused(!isPaused);
};

// 游戏循环中检查
if (!isPaused) {
  updateGameTime();
  generateEvents();
}
```

#### 速度控制
```typescript
const [speed, setSpeed] = useState<1 | 2 | 4>(1);

const changeSpeed = (newSpeed: 1 | 2 | 4) => {
  setSpeed(newSpeed);
};

// 事件生成频率
const eventInterval = 3000 / speed; // 基础3秒，根据速度调整
```

#### 快进功能
```typescript
const fastForward = () => {
  setSpeed(4);
  setIsPaused(false);
};
```

---

## 📦 素材资源完整清单

### 瓦片集（Tileset）

#### 地面瓦片（6个）
```
client/public/tiles/
├── grass_base.png          # 草地基础瓦片 (64x32)
├── grass_flower.png        # 草地花朵瓦片 (64x32)
├── court_orange.png        # 篮球场橙色地板 (64x32)
├── court_blue.png          # 篮球场蓝色区域 (64x32)
├── road_straight.png       # 灰色道路 (64x32)
└── water.png               # 水面瓦片 (64x32)
```

#### 装饰物体（4个）
```
client/public/tiles/
├── tree_small.png          # 小树 (64x96)
├── basketball_hoop.png     # 篮球架 (64x128)
├── bench.png               # 长椅 (64x32)
└── fence.png               # 栅栏 (64x32)
```

#### 建筑物（5个）
```
client/public/tiles/
├── building_red_roof.png   # 红屋顶建筑 (128x128)
├── building_orange_roof.png # 橙屋顶建筑 (128x128)
├── gym_entrance.png        # 体育馆入口 (192x192)
├── scoreboard.png          # 电子记分牌 (96x64)
└── bleachers.png           # 蓝色看台 (160x96)
```

### 道具素材（Items）

#### 收集道具（5个）
```
client/public/items/
├── basketball_coin.png     # 篮球币 (32x32)
├── energy_basketball.png   # 能量篮球 (48x48)
├── fire_basketball.png     # 火焰篮球 (48x48)
├── shield_basketball.png   # 护盾篮球 (48x48)
└── speed_shoes.png         # 加速鞋 (48x48)
```

#### 投篮篮球（5个）
```
client/public/items/
├── basketball_normal.png   # 普通篮球 (48x48)
├── basketball_speed.png    # 加速篮球 (48x48)
├── basketball_bomb.png     # 爆炸篮球 (48x48)
├── basketball_split.png    # 分裂篮球 (48x48)
└── basketball_boomerang.png # 回旋篮球 (48x48)
```

#### 系统素材（3个）
```
client/public/items/
├── chest_gold.png          # 金色宝箱 (64x64)
├── chest_silver.png        # 银色宝箱 (64x64)
└── level_portal.png        # 关卡传送门 (96x96)
```

### 视频素材（Videos）

```
client/public/videos/
├── cheerleader_blonde.mp4  # 金发拉拉队 (1920x1080, MP4)
├── cheerleader_asian.mp4   # 亚洲拉拉队 (1920x1080, MP4)
├── cheerleader_latina.mp4  # 拉丁拉拉队 (1920x1080, MP4)
├── cheerleader_bunny.mp4   # 兔女郎拉拉队 (1920x1080, MP4)
├── cheerleader_redhead.mp4 # 红发拉拉队 (1920x1080, MP4)
├── cheerleader-opening.mp4 # 开场拉拉队 (1920x1080, MP4)
└── cheerleader-halftime.mp4 # 中场拉拉队 (1920x1080, MP4)
```

---

## 🔗 完整路由表

| 路由 | 页面 | 功能 | 状态 |
|------|------|------|------|
| `/opening` | 星球大战开场 | 3D滚动字幕动画 | ✅ 完成 |
| `/cheerleader` | 拉拉队表演 | 随机拉拉队视频 | ✅ 完成 |
| `/basketball-court` | 超大地图 | Kairosoft风格等距地图 | ✅ 完成 |
| `/shooting-game` | 投篮游戏 | 愤怒的小鸟式投篮（无开场） | ✅ 完成 |
| `/shooting-game-opening` | 投篮游戏（带开场） | 先播放拉拉队视频 | ✅ 完成 |
| `/match/quick` | 快速比赛 | 3分钟快速对战（带拉拉队开场） | ✅ 完成 |

---

## 🎯 完整游戏流程示例

### 流程1：从地图进入投篮游戏（完整体验）

```
1. 访问 /basketball-court
   ↓
2. 看到150x100超大地图
   - 3个篮球场
   - 8个建筑物
   - 200棵树
   - 2个水池
   ↓
3. 使用WASD键移动玩家
   ↓
4. 探索地图，收集宝箱
   - 靠近金色宝箱，按E键
   - 获得50-200篮球币
   - 靠近银色宝箱，按E键
   - 获得随机道具
   ↓
5. 移动到左上角关卡传送门 (30, 30)
   ↓
6. 靠近传送门，显示"按E进入关卡"
   ↓
7. 按E键，打开关卡信息对话框
   - 关卡编号: 1-1
   - 关卡名称: 新手训练
   - 可用篮球: 5个
   - 星级要求: ⭐⭐⭐ 2球 / ⭐⭐ 4球 / ⭐ 5球
   ↓
8. 点击"开始挑战"按钮
   ↓
9. 自动跳转到 /shooting-game-opening
   ↓
10. 播放随机拉拉队开场视频
    - 全屏视频
    - 3秒后显示跳过按钮
    - 可跳过或等待播放完毕
   ↓
11. 视频结束，进入投篮游戏场景
    - Phaser 3游戏引擎启动
    - Matter.js物理引擎初始化
    - 显示弹弓和篮球
   ↓
12. 拖拽篮球
    - 按住鼠标左键
    - 拖拽调整力度和角度
    - 实时显示轨迹预览（虚线）
   ↓
13. 松开鼠标，发射篮球
    - 篮球按抛物线飞行
    - 物理引擎模拟真实弹道
    - 与障碍物碰撞
   ↓
14. 篮球投进篮筐
    - 播放得分动画
    - 显示"+2"或"+3"特效
   ↓
15. 关卡完成
    - 计算星级（根据使用篮球数）
    - 显示完成界面
    - 奖励篮球币
    - 解锁下一关卡
   ↓
16. 选择下一步
    - 点击"下一关"继续挑战
    - 点击"返回地图"回到超大地图
    - 点击"重试"重新挑战本关
```

### 流程2：快速比赛（含拉拉队开场）

```
1. 访问 /match
   ↓
2. 选择"快速比赛"
   ↓
3. 跳转到 /match/quick
   ↓
4. 自动播放拉拉队开场视频
   - 随机选择7个视频之一
   - 全屏播放
   - 3秒后可跳过
   ↓
5. 视频结束，比赛开始
   - 显示计分板
   - 显示比赛时间（3分钟）
   - 显示主队 vs 客队
   ↓
6. 比赛实时进行
   - 每3秒生成一个比赛事件
   - 投篮、助攻、篮板、抢断、盖帽
   - 实时更新比分
   ↓
7. 解说系统
   - 灌篮高手风格字幕
   - 底部中央显示
   - 黑色半透明背景
   - 橙色边框
   ↓
8. 得分时特效
   - 显示"+2"或"+3"
   - 金黄色大字
   - 缩放弹出动画
   - 观众反应文字
   ↓
9. 镜头切换
   - 广角镜头（全场）
   - 特写镜头（球员）
   - 篮筐视角（投篮）
   - 观众席视角（得分）
   ↓
10. 比赛控制
    - 播放/暂停按钮
    - 速度控制（1x/2x/4x）
    - 快进功能
   ↓
11. 第1节结束（3分钟后）
    - 显示"第1节结束"
    - 短暂暂停
    - 继续第2节
   ↓
12. 重复第2、3、4节
   ↓
13. 比赛结束
    - 显示最终比分
    - 显示比赛统计
    - 保存比赛记录（注册用户）
   ↓
14. 选择下一步
    - 再来一局
    - 返回比赛选择
    - 查看详细统计
```

---

## 🛠️ 技术实现细节

### Phaser 3 游戏引擎配置

#### 基础配置
```typescript
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,        // 自动选择WebGL或Canvas
  width: 1200,              // 游戏宽度
  height: 800,              // 游戏高度
  parent: 'game-container', // 父容器ID
  backgroundColor: '#87CEEB', // 背景色
  physics: {
    default: 'matter',      // 使用Matter.js物理引擎
    matter: {
      gravity: { y: 2 },    // 重力加速度
      debug: false          // 调试模式
    }
  },
  scene: [BasketballCourtScene, ShootingGameScene]
};
```

#### 场景生命周期
```typescript
class GameScene extends Phaser.Scene {
  preload() {
    // 加载资源
    this.load.image('texture', 'path/to/image.png');
    this.load.spritesheet('sprite', 'path/to/sprite.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }
  
  create() {
    // 创建游戏对象
    this.player = this.add.sprite(x, y, 'sprite');
    this.cameras.main.startFollow(this.player);
  }
  
  update(time: number, delta: number) {
    // 每帧更新
    this.handleInput();
    this.updatePhysics(delta);
  }
}
```

### Matter.js 物理引擎

#### 创建物理对象
```typescript
// 创建静态矩形（地面）
const ground = this.matter.add.rectangle(
  x, y,           // 位置
  width, height,  // 尺寸
  {
    isStatic: true,  // 静态对象
    friction: 0.5,   // 摩擦系数
    restitution: 0.2 // 弹性系数
  }
);

// 创建动态圆形（篮球）
const ball = this.matter.add.circle(
  x, y,           // 位置
  radius,         // 半径
  {
    restitution: 0.8,  // 高弹性
    friction: 0.1,     // 低摩擦
    density: 0.001     // 密度
  }
);

// 应用力
this.matter.applyForce(ball, { x: forceX, y: forceY });
```

#### 碰撞监听
```typescript
this.matter.world.on('collisionstart', (event) => {
  event.pairs.forEach((pair) => {
    const { bodyA, bodyB } = pair;
    
    // 检查碰撞对象类型
    if (bodyA.label === 'basketball' && bodyB.label === 'hoop') {
      this.onScore();
    }
  });
});
```

### React与Phaser集成

#### 组件封装
```typescript
export default function GameComponent() {
  const gameRef = useRef<Phaser.Game | null>(null);
  
  useEffect(() => {
    // 创建游戏实例
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }
    
    // 清理
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);
  
  return (
    <div>
      <div id="game-container" />
      <UI />
    </div>
  );
}
```

#### 数据通信
```typescript
// Phaser → React
scene.events.emit('score-changed', newScore);

// React监听
useEffect(() => {
  const scene = gameRef.current?.scene.getScene('GameScene');
  scene?.events.on('score-changed', (score) => {
    setScore(score);
  });
}, []);

// React → Phaser
const pauseGame = () => {
  const scene = gameRef.current?.scene.getScene('GameScene');
  scene?.scene.pause();
};
```

---

## 📊 性能优化建议

### 地图渲染优化

#### 视口裁剪
```typescript
// 只渲染可见区域
const camera = this.cameras.main;
const visibleTiles = this.map.getTilesWithinWorldXY(
  camera.worldView.x,
  camera.worldView.y,
  camera.worldView.width,
  camera.worldView.height
);

// 只更新可见瓦片
visibleTiles.forEach(tile => {
  this.updateTile(tile);
});
```

#### 对象池
```typescript
class ObjectPool {
  private pool: Phaser.GameObjects.Sprite[] = [];
  
  get(): Phaser.GameObjects.Sprite {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.scene.add.sprite(0, 0, 'texture');
  }
  
  release(obj: Phaser.GameObjects.Sprite) {
    obj.setVisible(false);
    this.pool.push(obj);
  }
}
```

### 物理引擎优化

#### 休眠物体
```typescript
// 让静止的物体进入休眠状态
this.matter.world.setSleeping(true);

// 设置休眠阈值
body.sleepThreshold = 60; // 60帧不动进入休眠
```

#### 碰撞过滤
```typescript
// 使用碰撞分组减少检测
const categoryBasketball = 0x0001;
const categoryObstacle = 0x0002;
const categoryHoop = 0x0004;

basketball.setCollisionCategory(categoryBasketball);
basketball.setCollidesWith([categoryObstacle, categoryHoop]);
```

### 资源加载优化

#### 懒加载
```typescript
// 只在需要时加载
scene.load.once('complete', () => {
  scene.scene.start('GameScene');
});

scene.load.image('heavy-texture', 'path/to/large-image.png');
scene.load.start();
```

#### 纹理图集
```typescript
// 将多个小图合并成一个大图
scene.load.atlas(
  'game-atlas',
  'atlas.png',
  'atlas.json'
);

// 使用
scene.add.sprite(x, y, 'game-atlas', 'sprite-name');
```

---

## 🐛 常见问题排查

### 问题1：地图渲染空白

**可能原因：**
1. 瓦片素材未加载
2. 瓦片集名称不匹配
3. Canvas未正确创建

**解决方案：**
```typescript
// 检查资源加载
console.log('Loaded textures:', this.textures.list);

// 检查瓦片集
console.log('Tilesets:', this.map.tilesets);

// 检查Canvas
console.log('Canvas:', document.getElementById('game-container'));
```

### 问题2：物理引擎不工作

**可能原因：**
1. Matter.js未正确配置
2. 物理对象未添加到世界
3. 重力设置错误

**解决方案：**
```typescript
// 检查物理配置
console.log('Physics config:', this.physics.config);

// 检查物理对象
console.log('Bodies:', this.matter.world.getAllBodies());

// 启用调试模式
this.matter.world.drawDebug = true;
```

### 问题3：视频无法播放

**可能原因：**
1. 视频文件路径错误
2. 视频格式不支持
3. 浏览器自动播放策略

**解决方案：**
```typescript
// 检查视频路径
console.log('Video src:', videoElement.src);

// 添加错误处理
videoElement.onerror = (e) => {
  console.error('Video error:', e);
};

// 添加用户交互触发
<video muted autoPlay /> // 静音可以自动播放
```

### 问题4：宝箱不刷新

**可能原因：**
1. 刷新定时器未启动
2. 位置生成失败
3. 宝箱未正确销毁

**解决方案：**
```typescript
// 检查定时器
console.log('Refresh timers:', this.chestSystem.timers);

// 检查位置生成
console.log('Generated position:', position);

// 检查宝箱销毁
chest.destroy();
console.log('Chest destroyed:', !chest.active);
```

---

## 🎓 扩展开发指南

### 添加新关卡

#### 1. 定义关卡数据
```typescript
// client/src/game/scenes/ShootingGameScene.ts
export const LEVEL_1_2: LevelData = {
  world: 1,
  level: 2,
  name: "进阶挑战",
  basketballs: [
    { type: "normal", count: 2 },
    { type: "speed", count: 2 },
    { type: "bomb", count: 1 }
  ],
  obstacles: [
    { type: "wood_box", x: 500, y: 400 },
    { type: "wood_box", x: 550, y: 400 },
    { type: "stone_block", x: 700, y: 350 }
  ],
  hoop: { x: 1000, y: 300 },
  stars: [3, 5, 7]
};
```

#### 2. 添加传送门
```typescript
// client/src/game/systems/LevelPortalSystem.ts
initialize() {
  this.createPortal('1-1', 30, 30, LEVEL_1_1, true);
  this.createPortal('1-2', 35, 30, LEVEL_1_2, false); // 初始锁定
}
```

#### 3. 解锁机制
```typescript
// 完成1-1后解锁1-2
onLevelComplete(levelId: string) {
  if (levelId === '1-1') {
    this.portalSystem.unlockLevel('1-2');
  }
}
```

### 添加新篮球类型

#### 1. 定义篮球类型
```typescript
// client/src/game/scenes/ShootingGameScene.ts
type BasketballType = 
  | "normal" 
  | "speed" 
  | "bomb" 
  | "split" 
  | "boomerang"
  | "freeze";  // 新类型：冰冻篮球
```

#### 2. 创建篮球素材
```
client/public/items/basketball_freeze.png (48x48)
```

#### 3. 实现特殊能力
```typescript
createBasketball(type: BasketballType) {
  const ball = this.matter.add.circle(x, y, radius);
  
  if (type === "freeze") {
    // 冰冻能力：撞击后冻结障碍物3秒
    ball.setData('ability', () => {
      this.freezeObstacles(ball.x, ball.y, 150);
    });
  }
  
  return ball;
}

freezeObstacles(x: number, y: number, radius: number) {
  const obstacles = this.getObstaclesInRadius(x, y, radius);
  obstacles.forEach(obstacle => {
    obstacle.setStatic(true);
    obstacle.setTint(0x00FFFF); // 蓝色冰冻效果
    
    this.time.delayedCall(3000, () => {
      obstacle.setStatic(false);
      obstacle.clearTint();
    });
  });
}
```

### 添加新宝箱类型

#### 1. 定义宝箱类型
```typescript
// client/src/game/systems/ChestSystem.ts
type ChestType = "gold" | "silver" | "diamond"; // 新增钻石宝箱
```

#### 2. 创建宝箱素材
```
client/public/items/chest_diamond.png (64x64)
```

#### 3. 实现奖励逻辑
```typescript
createChest(type: ChestType) {
  const chest = this.scene.add.sprite(x, y, `chest_${type}`);
  
  if (type === "diamond") {
    chest.setData('reward', {
      type: 'rare_item',
      value: 'legendary_basketball' // 传说级篮球
    });
    chest.setData('refreshTime', 300000); // 5分钟刷新
  }
  
  return chest;
}
```

---

## 📞 技术支持

**问题反馈：** https://help.manus.im

**项目仓库：** https://github.com/jqian25/basketball-manager-game

**在线演示：** https://3005-i2qr7t8t8mnzx98nd8797-d808f38f.manus-asia.computer

---

## 📄 版本信息

**文档版本：** v1.0.0

**最后更新：** 2024-10-24

**适用游戏版本：** v1.0.0

**作者：** Manus AI Development Team

---

## 🙏 致谢

感谢以下开源项目：
- **Phaser 3** - 强大的HTML5游戏引擎
- **Matter.js** - 2D物理引擎
- **React** - 用户界面库
- **TypeScript** - JavaScript超集
- **Vite** - 快速构建工具

---

**祝您游戏开发愉快！🏀**

