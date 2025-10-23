# 篮球经理 - 模块化架构文档

## 项目概述
- **风格**：Fate/stay night 高品质动漫风 + 灌篮高手配色
- **规则**：完整NBA规则（48分钟，4节制）
- **模式**：游客模式（3分钟快速赛）+ 注册模式（完整体验）

## 模块划分

### 1. 核心模块 (Core)
```
server/_core/          # 框架核心（不要修改）
server/gameEngine.ts   # 比赛引擎
server/db.ts           # 数据库操作
server/routers.ts      # API路由
```

### 2. 数据模块 (Data)
```
drizzle/schema.ts      # 数据库表结构
  - users              # 用户表
  - players            # 球员表（六维属性）
  - teams              # 球队表
  - matches            # 比赛记录表
  - facilities         # 设施表
  - sponsors           # 赞助商表
  - leagues            # 联赛表
  - leagueStandings    # 排名表
```

### 3. 前端页面模块 (Pages)
```
client/src/pages/
  Home.tsx             # 首页（开场动画+登录）
  Game.tsx             # 游戏主菜单
  Match.tsx            # 比赛模式选择
  MatchPlay.tsx        # 比赛进行页面（待开发）
  PlayerManage.tsx     # 球员管理（待开发）
  TeamManage.tsx       # 球队管理（待开发）
  League.tsx           # 联赛系统（待开发）
  Facility.tsx         # 设施建设（待开发）
  Sponsor.tsx          # 赞助商系统（待开发）
  Stats.tsx            # 数据统计（待开发）
```

### 4. 组件模块 (Components)
```
client/src/components/
  OpeningAnimation.tsx      # 开场动画
  Basketball.tsx            # SVG篮球组件
  PlayerCard.tsx            # 球员卡片（待开发）
  MatchAnimation.tsx        # 比赛动画系统（待开发）
  ShotAnimation.tsx         # 投篮分镜动画（待开发）
  CheerleaderVideo.tsx      # 啦啦队视频播放器（待开发）
  CourtCanvas.tsx           # 球场Canvas渲染（待开发）
```

### 5. 动画资源模块 (Assets)
```
client/public/
  bg-romantic-court.png     # 朦胧美背景
  opening-scene.mp4         # 开场视频
  player-*.png              # 球员动作帧（待生成）
  cheerleader-*.mp4         # 啦啦队视频（待生成）
  court-*.svg               # 球场元素SVG（待生成）
```

### 6. 样式模块 (Styles)
```
client/src/styles/
  starwars.css              # 星球大战文字滚动
  opening-effects.css       # 开场特效
  match-animation.css       # 比赛动画（待开发）
```

### 7. 工具模块 (Utils)
```
client/src/utils/
  playerGenerator.ts        # 球员生成器（待开发）
  experienceCalculator.ts   # 经验值计算（待开发）
  matchSimulator.ts         # 比赛模拟器（待开发）
```

## 开发优先级

### Phase 1: 视觉资源（当前）
- [x] 朦胧美背景
- [ ] 开场视频（男女主互动）
- [ ] 球员动作动画（5位置 × 8动作）
- [ ] 啦啦队视频（4种风格）
- [ ] 球场SVG元素

### Phase 2: 比赛系统
- [x] 比赛引擎后端
- [ ] 比赛前端界面
- [ ] 投篮分镜动画
- [ ] 实时数据更新
- [ ] 音效系统

### Phase 3: 球员系统
- [ ] 球员创建/编辑
- [ ] 17种成长类型
- [ ] 经验值系统
- [ ] 球员卡片展示

### Phase 4: 管理系统
- [ ] 球队管理
- [ ] 设施建设
- [ ] 赞助商系统
- [ ] 联赛系统

### Phase 5: 数据统计
- [ ] 球员数据统计
- [ ] 球队数据统计
- [ ] 历史记录
- [ ] 排行榜

## 技术栈
- **前端**：React 19 + TypeScript + Tailwind 4
- **动画**：Framer Motion + GSAP + Three.js
- **后端**：Express + tRPC
- **数据库**：MySQL (Drizzle ORM)
- **AI生成**：图像（DALL-E）+ 视频（Veo3）

## 维护指南
1. 每个模块独立开发，避免相互依赖
2. 新功能添加到对应模块，不要修改核心模块
3. 使用TypeScript类型确保类型安全
4. 组件复用优先，避免代码重复
5. 定期保存checkpoint，便于回滚

