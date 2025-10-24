# 瓦片地图制作教程笔记

## 核心概念

### 什么是瓦片地图（Tilemap）？
瓦片地图是一种将游戏世界分解为模块化构建块的技术。通过将世界分解成类似乐高的小块，可以获得内存、性能和创意上的优势。

### 三个核心组件

1. **Tilemap（瓦片地图）**
   - 瓦片集和瓦片图层的容器
   - 通过`this.make.tilemap()`或`this.add.tilemap()`创建

2. **Tileset（瓦片集）**
   - 存储地图中每个瓦片的信息
   - 一张包含所有可用瓦片的图片

3. **TilemapLayer（瓦片图层）**
   - 实际渲染瓦片的显示对象
   - 一个地图可以有多个图层（地面层、建筑层、装饰层等）

## Tiled地图编辑器使用

### 安装和基础
- 官网：https://www.mapeditor.org/
- 免费开源的瓦片地图编辑器
- 可导出为CSV、JSON等格式

### 在Tiled中创建地图的关键步骤

1. **嵌入瓦片集**
   - 加载瓦片集时勾选"Embed in map"选项
   - 或者在创建后点击底部的"embed tileset"按钮

2. **设置瓦片图层格式**
   - 确保不使用压缩的"Tile Layer Format"
   - 在"Map → Map Properties"中调整

3. **导出地图**
   - 保存为JSON文件格式

### 设置碰撞属性

在Tiled中标记哪些瓦片可以碰撞：

1. 打开Tileset Editor（点击右下角的"Edit Tileset"按钮）
2. 选择所有瓦片（拖拽或CTRL+A）
3. 在属性窗口（左侧）添加布尔属性"collides"
4. 选择需要碰撞的瓦片，勾选"collides"为true
5. 重新导出地图

## Phaser 3集成

### 加载瓦片地图

```typescript
// 在preload中加载
this.load.image('tiles', 'path/to/tileset.png');
this.load.tilemapTiledJSON('map', 'path/to/map.json');

// 在create中创建
const map = this.make.tilemap({ key: 'map' });
const tileset = map.addTilesetImage('tileset-name-in-tiled', 'tiles');
const layer = map.createLayer('layer-name-in-tiled', tileset, 0, 0);
```

### 多图层系统

常见的图层结构：
- **Below Player** - 地面、路径（在玩家下方）
- **World** - 建筑、障碍物（与玩家碰撞）
- **Above Player** - 屋顶、标志顶部（在玩家上方）

```typescript
const belowLayer = map.createLayer('Below Player', tileset, 0, 0);
const worldLayer = map.createLayer('World', tileset, 0, 0);
const aboveLayer = map.createLayer('Above Player', tileset, 0, 0);

// 设置深度
aboveLayer.setDepth(10);
```

### 物理碰撞设置

```typescript
// 方法1：通过瓦片索引
worldLayer.setCollisionBetween(1, 500);

// 方法2：通过属性（推荐）
worldLayer.setCollisionByProperty({ collides: true });

// 调试碰撞
worldLayer.renderDebug(this.add.graphics(), {
  tileColor: null,
  collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
  faceColor: new Phaser.Display.Color(40, 39, 37, 255)
});
```

### 启用物理引擎

```typescript
// 在game config中
const config = {
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

// 创建物理精灵
this.player = this.physics.add.sprite(x, y, 'player');

// 添加碰撞
this.physics.add.collider(this.player, worldLayer);
```

### 对象层（Object Layer）

可以在Tiled中使用对象层来标记：
- 玩家出生点
- NPC位置
- 场景切换点
- 道具位置

```typescript
// 获取对象层
const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point');
this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
```

## 开罗游戏风格的地图设计

### 瓦片尺寸
- 标准：32x32像素或64x64像素
- 等距：使用2:1比例（如64x32）

### 图层策略
1. **地面层** - 草地、道路、地板
2. **装饰层** - 花、石头、小物件
3. **建筑层** - 墙壁、房屋
4. **屋顶层** - 屋顶、树冠
5. **碰撞层** - 不可见的碰撞区域

### 瓦片复用技巧
- 使用自动瓦片（Auto-tiling）功能
- 创建可组合的模块化瓦片
- 使用瓦片变体（Tile Variations）增加多样性

## 东京大地图制作计划

### 地图结构
```
tokyo_map/
├── tilesets/
│   ├── ground.png (地面瓦片：道路、人行道、草地)
│   ├── buildings.png (建筑瓦片：墙壁、窗户、门)
│   ├── decorations.png (装饰瓦片：树木、路灯、标志)
│   └── interiors.png (室内瓦片：地板、家具)
├── maps/
│   ├── shibuya.json (涩谷区域)
│   ├── akihabara.json (秋叶原区域)
│   └── tokyo_full.json (完整东京地图)
└── objects/
    ├── npcs.json (NPC位置)
    └── events.json (事件触发点)
```

### 制作步骤

1. **创建瓦片集**
   - 地面瓦片（16x16或32x32）
   - 建筑瓦片（模块化墙壁、窗户、门）
   - 装饰瓦片（树木、路灯、标志、车辆）

2. **在Tiled中构建地图**
   - 创建多个图层
   - 放置瓦片
   - 标记碰撞属性
   - 添加对象层（NPC、传送点）

3. **在Phaser中加载**
   - 加载瓦片集和地图JSON
   - 创建图层
   - 设置碰撞
   - 添加相机跟随

4. **优化**
   - 使用瓦片挤出（tile-extruder）防止瓦片出血
   - 分块加载大地图
   - 使用对象池管理NPC

## 工具推荐

- **Tiled** - 地图编辑器
- **Aseprite** - 像素艺术编辑器
- **TexturePacker** - 精灵表生成器
- **tile-extruder** - 防止瓦片出血

## 参考资源

- Phaser 3 Tilemap教程：https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
- Tiled官方文档：http://docs.mapeditor.org/
- Phaser示例：https://labs.phaser.io/
- 开罗游戏风格参考：Basketball Club Story

