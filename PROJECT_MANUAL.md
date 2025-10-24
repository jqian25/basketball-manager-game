# 篮球经理游戏 - 完整项目手册

## 📖 目录

1. [游戏使用说明](#游戏使用说明)
2. [项目结构](#项目结构)
3. [代码架构](#代码架构)
4. [核心模块详解](#核心模块详解)
5. [数据库设计](#数据库设计)
6. [安装与部署](#安装与部署)
7. [功能扩展指南](#功能扩展指南)
8. [常见问题](#常见问题)

---

## 游戏使用说明

### 🎮 游戏模式

#### 1. 游客模式（快速体验）
- **访问路径**: `/` → 选择"快速体验"
- **特点**:
  - 无需注册，即刻开始
  - 3分钟快速比赛
  - 简化规则
  - 无数据保存
  - 无球员成长

#### 2. 注册用户模式（完整体验）
- **访问路径**: `/` → 选择"注册/登录完整版"
- **特点**:
  - NBA完整规则（48分钟）
  - 球员经验成长系统
  - 个人球队管理后台
  - 详细数据统计分析
  - 性感啦啦队表演
  - 赞助商合作系统
  - 联赛排名与奖励
  - **开放世界RPG探索** ⭐

### 🗺️ 开放世界RPG系统

#### 访问方式
1. 注册并登录
2. 进入游戏菜单 (`/game`)
3. 点击"开放世界"卡片

#### 操作指南
- **移动**: WASD 或 方向键
- **奔跑**: 按住 Shift
- **交互**: Space 或 Enter（靠近NPC时）
- **退出对话**: ESC

#### 场景介绍

**湘北高中场景** (`/openworld`)
- **地图大小**: 60x45 格子
- **主要区域**:
  - 教学楼（左上）
  - 体育馆（右上）
  - 篮球场（中下）
  - 道路系统
  - 休息区

**NPC角色**:
1. **安西教练** (38, 23) - 体育馆附近
   - 性格：睿智慈祥
   - 特点：善于用简单话语点醒球员
   
2. **樱木花道** (35, 30) - 篮球场上
   - 性格：热血冲动
   - 特点：自称天才，充满热情
   
3. **流川枫** (40, 30) - 篮球场上
   - 性格：冷酷寡言
   - 特点：篮球天才，话很少
   
4. **彩子** (36, 27) - 篮球场附近
   - 性格：温柔负责
   - 特点：球队经理，关心球员
   
5. **清洁工大叔** (25, 22) - 道路上
   - 性格：亲切健谈
   - 特点：见证学校历史

#### AI对话系统
- 每个NPC都有独特的AI人格
- 支持自然语言对话
- 对话会根据上下文生成
- 关键词触发特定回复（篮球、训练、比赛等）

---

## 项目结构

```
basketball_manager/
├── client/                          # 前端代码
│   ├── src/
│   │   ├── components/             # React组件
│   │   │   ├── kairo/             # Kairosoft游戏组件
│   │   │   │   ├── ClubOverview.tsx
│   │   │   │   ├── PlayerManagement.tsx
│   │   │   │   ├── FacilityManagement.tsx
│   │   │   │   └── ...
│   │   │   ├── openWorld/         # 开放世界组件
│   │   │   │   └── OpenWorldGame.tsx
│   │   │   └── ui/                # UI组件库
│   │   ├── pages/                 # 页面组件
│   │   │   ├── Home.tsx           # 主页
│   │   │   ├── Game.tsx           # 游戏菜单
│   │   │   ├── OpenWorld.tsx      # 开放世界
│   │   │   ├── Match.tsx          # 比赛
│   │   │   └── PlayerManage.tsx   # 球员管理
│   │   ├── systems/               # 游戏系统
│   │   │   ├── kairo/
│   │   │   │   └── ThemedAreaSystem.ts  # 主题区域系统
│   │   │   └── openWorld/
│   │   │       ├── PlayerController.ts   # 玩家控制器
│   │   │       └── NPCDialogueSystem.ts  # NPC对话系统
│   │   ├── data/                  # 游戏数据
│   │   │   ├── kairo/
│   │   │   │   └── facilitiesDatabase.ts # 设施数据库
│   │   │   └── maps/              # 地图数据
│   │   │       ├── worldMap.ts    # 世界地图
│   │   │       ├── tokyoCityMap.ts # 东京城市地图
│   │   │       └── shohokuSchoolMap.ts # 湘北高中地图
│   │   ├── types/                 # TypeScript类型定义
│   │   │   ├── kairo.ts
│   │   │   └── openWorld.ts
│   │   └── App.tsx                # 应用入口
│   └── public/                    # 静态资源
│       └── kairo/                 # Kairosoft像素艺术资源
│           ├── facilities/        # 60个设施建筑
│           ├── nature/            # 50个自然元素
│           ├── decorations/       # 80个装饰物品
│           ├── courts/            # 20个球场资源
│           ├── characters/        # 角色精灵图
│           └── icons/             # UI图标
│
├── server/                         # 后端代码
│   ├── _core/
│   │   ├── index.ts               # 服务器入口
│   │   ├── oauth.ts               # OAuth认证
│   │   └── context.ts             # tRPC上下文
│   ├── routes/
│   │   └── ai.ts                  # AI对话API
│   ├── routers/                   # tRPC路由
│   └── db/
│       └── schema-npc-marketplace.ts # NPC市场Schema
│
├── drizzle/                        # 数据库
│   ├── schema.ts                  # 数据库Schema
│   └── migrations/                # 迁移文件
│
├── docs/                          # 文档
│   └── themed-areas-reference.md  # 主题区域参考
│
├── package.json                   # 项目配置
├── drizzle.config.ts             # Drizzle配置
├── tsconfig.json                 # TypeScript配置
└── vite.config.ts                # Vite配置
```

---

## 代码架构

### 前端架构

#### 1. 组件层次
```
App
├── Router
│   ├── Home (主页)
│   ├── Game (游戏菜单)
│   ├── OpenWorld (开放世界)
│   ├── Match (比赛)
│   └── PlayerManage (球员管理)
```

#### 2. 状态管理
- **useAuth**: 用户认证状态
- **useState/useRef**: 本地组件状态
- **游戏循环**: requestAnimationFrame

#### 3. 渲染系统
- **Canvas 2D**: 地图和角色渲染
- **React组件**: UI界面
- **实时更新**: 60fps游戏循环

### 后端架构

#### 1. API层
- **tRPC**: 类型安全的API
- **Express**: HTTP服务器
- **REST API**: AI对话接口

#### 2. 数据层
- **Drizzle ORM**: 数据库操作
- **MySQL**: 数据存储

#### 3. 认证层
- **OAuth 2.0**: Manus平台认证
- **JWT**: 会话管理

---

## 核心模块详解

### 模块1: 主页系统 (Home.tsx)

**功能**:
- 开场动画展示
- 游客/注册模式选择
- 自动登录检测

**关键代码**:
```typescript
const handleGuestLogin = () => {
  setLocation("/game"); // 游客直接进入游戏
};

const handleUserLogin = () => {
  window.location.href = getLoginUrl(); // OAuth登录
};
```

### 模块2: 开放世界系统 (OpenWorldGame.tsx)

**核心组件**:
1. **玩家控制器** (PlayerController.ts)
   - 处理键盘输入
   - 计算移动和碰撞
   - 更新玩家状态

2. **NPC对话系统** (NPCDialogueSystem.ts)
   - 管理对话会话
   - 调用AI生成回复
   - 保存对话历史

3. **地图渲染器**
   - Canvas绘制瓦片
   - 相机跟随玩家
   - 渲染NPC和对象

**关键代码**:
```typescript
// 游戏循环
const gameLoop = () => {
  const deltaTime = (now - lastTime) / 1000;
  playerController.update(deltaTime);
  render();
  requestAnimationFrame(gameLoop);
};

// 碰撞检测
private canMoveTo(x: number, y: number): boolean {
  // 检查地图边界
  // 检查瓦片可行走性
  // 检查与对象的碰撞
  return true/false;
}
```

### 模块3: Kairosoft游戏系统

**核心组件**:
1. **设施数据库** (facilitiesDatabase.ts)
   - 60个设施定义
   - 属性、成本、效果
   - 分类和筛选

2. **主题区域系统** (ThemedAreaSystem.ts)
   - 63个协同区域定义
   - 相邻检测算法
   - 效果计算引擎

**关键代码**:
```typescript
// 检测主题区域
static detectThemedAreas(placements: FacilityPlacement[]): DetectedThemedArea[] {
  const detectedAreas: DetectedThemedArea[] = [];
  
  for (const areaDefinition of THEMED_AREAS) {
    const matches = this.findAreaMatches(areaDefinition, placements);
    detectedAreas.push(...matches);
  }
  
  return detectedAreas;
}

// 计算总效果
static calculateTotalEffects(detectedAreas: DetectedThemedArea[]) {
  // 累加所有区域的效果加成
  return { price, popular, exp, upkeep, ... };
}
```

---

## 数据库设计

### 核心表

#### 1. users (用户表)
```sql
- id: 主键
- openId: OAuth唯一标识
- name: 用户名
- role: 角色 (user/admin)
- createdAt: 创建时间
```

#### 2. players (球员表)
```sql
- id: 主键
- userId: 所属用户
- name: 球员名
- position: 位置 (PG/SG/SF/PF/C)
- scoring, passing, defense: 六维属性
- experience, level: 经验和等级
```

#### 3. npcMarketplace (NPC市场表)
```sql
- id: 主键
- npcId: NPC唯一标识
- name: NPC名称
- category: 分类
- basePrice: 基础价格
- premiumPrice: 高级版价格
- defaultPersonality: 默认性格
```

#### 4. userNpcs (用户拥有的NPC表)
```sql
- id: 主键
- userId: 用户ID
- npcMarketplaceId: 关联NPC商品
- customName: 自定义名称
- isPremium: 是否高级版
- aiConfig: AI配置 (JSON)
- placement: 放置位置 (JSON)
```

#### 5. mapCustomObjects (地图自定义对象表)
```sql
- id: 主键
- userId: 用户ID
- mapId: 地图ID
- objectType: 对象类型
- objectData: 对象数据 (JSON)
```

### 关系图
```
users (1) ----< (N) players
users (1) ----< (N) userNpcs
users (1) ----< (N) mapCustomObjects
npcMarketplace (1) ----< (N) userNpcs
```

---

## 安装与部署

### 开发环境要求
- Node.js >= 18
- pnpm >= 8
- MySQL >= 8.0

### 安装步骤

#### 1. 解压项目
```bash
tar -xzf basketball_manager_complete.tar.gz
cd basketball_manager
```

#### 2. 安装依赖
```bash
pnpm install
```

#### 3. 配置环境变量
创建 `.env` 文件：
```env
# 数据库配置
DATABASE_URL=mysql://user:password@localhost:3306/basketball_manager

# OAuth配置
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URI=http://localhost:3000/api/oauth/callback

# JWT密钥
JWT_SECRET=your_jwt_secret

# 服务器端口
PORT=3000
```

#### 4. 初始化数据库
```bash
# 生成并应用迁移
pnpm db:push
```

#### 5. 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:3000

### 生产部署

#### 1. 构建项目
```bash
pnpm build
```

#### 2. 启动生产服务器
```bash
NODE_ENV=production node server/_core/index.js
```

#### 3. 使用PM2管理进程
```bash
pm2 start server/_core/index.js --name basketball-manager
pm2 save
pm2 startup
```

---

## 功能扩展指南

### 🗺️ 添加新地图

#### 1. 创建地图数据文件
```typescript
// client/src/data/maps/newMap.ts
import type { SceneMap } from "../../types/openWorld";

export const NEW_MAP: SceneMap = {
  metadata: {
    id: "scene-new-map",
    name: "新地图",
    level: "scene",
    width: 50,
    height: 40,
    tileSize: 32
  },
  tiles: createTileGrid(50, 40),
  objects: [],
  npcs: [],
  portals: [],
  basketballCourts: [],
  spawnPoint: { x: 25, y: 20 },
  sceneName: "新地图",
  sceneType: "school"
};
```

#### 2. 添加传送门
在现有地图中添加传送门：
```typescript
portals: [
  {
    id: "portal-to-new-map",
    type: "portal",
    x: 30,
    y: 40,
    targetMapId: "scene-new-map",
    targetX: 25,
    targetY: 20,
    requiresInteraction: true,
    transitionEffect: "fade"
  }
]
```

### 👤 添加新NPC

#### 1. 在地图数据中添加NPC
```typescript
npcs: [
  {
    id: "npc-new-character",
    type: "npc",
    name: "新角色",
    x: 30,
    y: 30,
    spriteSheet: "/characters/new-character.png",
    interactable: true,
    movementPattern: "static",
    aiPersonality: "友好热情，喜欢聊篮球"
  }
]
```

#### 2. 添加到NPC市场（可选）
```sql
INSERT INTO npcMarketplace (
  npcId, name, category, basePrice, 
  premiumPrice, defaultPersonality, spriteSheet
) VALUES (
  'npc-new-character', '新角色', 'student', 
  9.99, 19.99, '友好热情', '/characters/new-character.png'
);
```

### 🏢 添加新设施

#### 1. 在设施数据库中添加
```typescript
// client/src/data/kairo/facilitiesDatabase.ts
{
  id: "new-facility",
  name: "新设施",
  category: "training",
  description: "一个全新的训练设施",
  cost: 50000,
  maintenanceCost: 500,
  unlockLevel: 5,
  effects: {
    training: 15,
    morale: 5
  },
  imagePath: "/kairo/facilities/new-facility.png"
}
```

#### 2. 添加到主题区域（可选）
```typescript
// client/src/systems/kairo/ThemedAreaSystem.ts
{
  id: "new-area",
  name: "新区域",
  facilities: ["new-facility", "other-facility"],
  effect: { type: "exp", value: 15 },
  description: "新设施和其他设施的组合"
}
```

### 🎨 添加新像素艺术资源

#### 1. 准备图片
- 格式：PNG（透明背景）
- 尺寸：32x32 或 64x64 像素
- 风格：Kairosoft等轴测风格

#### 2. 放置到对应目录
```
client/public/kairo/
├── facilities/     # 设施建筑
├── nature/         # 自然元素
├── decorations/    # 装饰物品
├── characters/     # 角色精灵图
└── icons/          # UI图标
```

#### 3. 在代码中引用
```typescript
imagePath: "/kairo/facilities/your-image.png"
```

### 🤖 自定义AI对话

#### 1. 修改AI人格
```typescript
aiPersonality: "你的自定义人格描述：性格特点、说话风格、专长领域等"
```

#### 2. 添加关键词回复
在 `server/routes/ai.ts` 中添加：
```typescript
if (lowerMessage.includes("你的关键词")) {
  const responses = [
    "回复1",
    "回复2",
    "回复3"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
```

#### 3. 接入真实大模型
替换 `generateRuleBasedResponse` 函数：
```typescript
// 调用OpenAI API
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: messages
  })
});
```

### 📊 添加新页面

#### 1. 创建页面组件
```typescript
// client/src/pages/NewPage.tsx
export default function NewPage() {
  return (
    <div>
      <h1>新页面</h1>
    </div>
  );
}
```

#### 2. 添加路由
```typescript
// client/src/App.tsx
import NewPage from "./pages/NewPage";

<Route path={"/newpage"} component={NewPage} />
```

#### 3. 添加菜单入口
```typescript
// client/src/pages/Game.tsx
{
  icon: YourIcon,
  title: "新功能",
  description: "新功能描述",
  color: "from-color-500 to-color-600",
  path: "/newpage",
  available: true
}
```

---

## 常见问题

### Q1: 数据库连接失败
**A**: 检查 `.env` 文件中的 `DATABASE_URL` 是否正确，确保MySQL服务已启动。

### Q2: NPC对话没有反应
**A**: 检查：
1. AI API路由是否正确注册
2. 浏览器控制台是否有错误
3. NPC的 `interactable` 属性是否为 `true`

### Q3: 地图渲染空白
**A**: 检查：
1. Canvas元素是否正确创建
2. 地图数据是否正确加载
3. 浏览器控制台是否有错误

### Q4: 球员属性不生效
**A**: 确保：
1. 数据库Schema已更新 (`pnpm db:push`)
2. 属性值在有效范围内（1-20）
3. 前后端类型定义一致

### Q5: 如何重置数据库
**A**: 
```bash
# 删除所有表
pnpm db:drop

# 重新生成Schema
pnpm db:push
```

### Q6: 如何调试游戏循环
**A**: 在 `OpenWorldGame.tsx` 中添加：
```typescript
console.log("Player position:", player.x, player.y);
console.log("FPS:", 1 / deltaTime);
```

### Q7: 如何优化性能
**A**: 
1. 减少Canvas重绘范围
2. 使用对象池管理NPC
3. 实现视野裁剪（只渲染可见区域）
4. 使用Web Worker处理AI计算

---

## 📞 技术支持

如有问题，请查看：
- 项目文档: `/docs`
- 代码注释: 每个文件都有详细注释
- TypeScript类型: `/client/src/types`

---

## 🎉 结语

这个项目采用**模块化设计**，所有功能都是**独立可扩展**的。你可以：
- 添加新地图和场景
- 创建更多NPC角色
- 设计新的游戏机制
- 集成更多AI功能
- 开发后台管理系统

祝你开发愉快！🏀

