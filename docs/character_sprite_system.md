# 角色精灵动画系统 - 技术文档

## 核心设计原则

### 1. 开罗游戏风格特征
- **Q版可爱风格**：大头身比例（1:1.5）
- **简洁造型**：清晰的轮廓和色块
- **明亮色彩**：高饱和度配色
- **像素完美**：无抗锯齿处理

### 2. 动画规格
- **方向数量**：4方向（上、下、左、右）
- **动画帧数**：每方向4帧走路循环
- **角色尺寸**：32x32像素（单帧）
- **精灵表尺寸**：128x128像素（4x4网格）
- **帧率**：8 FPS（每帧125ms）

### 3. 角色类型

#### 主角（玩家）
- **外观**：篮球运动服+运动鞋
- **配色**：橙色球衣#FF6B35 + 蓝色短裤#4169E1
- **特征**：背包、篮球、头带

#### NPC类型
1. **教练**：西装+哨子+战术板
2. **商店老板**：围裙+商品
3. **路人**：休闲服装
4. **对手球员**：不同颜色球衣

#### 球员（5个位置）
1. **控球后卫（PG）**：蓝色球衣
2. **得分后卫（SG）**：红色球衣
3. **小前锋（SF）**：绿色球衣
4. **大前锋（PF）**：黄色球衣
5. **中锋（C）**：紫色球衣

## 精灵表布局

```
精灵表布局（4x4网格，128x128像素）：

行1：向下走（4帧）
[帧1] [帧2] [帧3] [帧4]

行2：向左走（4帧）
[帧1] [帧2] [帧3] [帧4]

行3：向右走（4帧）
[帧1] [帧2] [帧3] [帧4]

行4：向上走（4帧）
[帧1] [帧2] [帧3] [帧4]
```

## 走路动画循环

### 4帧走路循环（标准）
1. **帧1**：站立姿势（双脚并拢）
2. **帧2**：左脚向前（接触地面）
3. **帧3**：站立姿势（双脚并拢）
4. **帧4**：右脚向前（接触地面）

### 动画原理
- **接触**：脚接触地面
- **下压**：身体重心下移
- **经过**：身体经过支撑腿
- **抬起**：脚离开地面

## 配色方案

### 主角配色
```
球衣：#FF6B35（橙色）
短裤：#4169E1（蓝色）
皮肤：#FDBCB4（浅肤色）
头发：#8B4513（棕色）
鞋子：#FFFFFF（白色）+ #FF0000（红色）
```

### NPC配色
```
教练：
- 西装：#2C3E50（深蓝）
- 衬衫：#FFFFFF（白色）
- 领带：#E74C3C（红色）

商店老板：
- 围裙：#27AE60（绿色）
- 衣服：#F39C12（橙色）

路人：
- 多样化配色（随机）
```

### 球员配色
```
控球后卫（PG）：#4169E1（蓝色）
得分后卫（SG）：#FF4757（红色）
小前锋（SF）：#2ECC71（绿色）
大前锋（PF）：#F1C40F（黄色）
中锋（C）：#9B59B6（紫色）
```

## Phaser集成

### 加载精灵表
```typescript
this.load.spritesheet('player', '/sprites/player.png', {
  frameWidth: 32,
  frameHeight: 32
});
```

### 创建动画
```typescript
// 向下走
this.anims.create({
  key: 'walk-down',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
  frameRate: 8,
  repeat: -1
});

// 向左走
this.anims.create({
  key: 'walk-left',
  frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
  frameRate: 8,
  repeat: -1
});

// 向右走
this.anims.create({
  key: 'walk-right',
  frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
  frameRate: 8,
  repeat: -1
});

// 向上走
this.anims.create({
  key: 'walk-up',
  frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
  frameRate: 8,
  repeat: -1
});
```

### WASD键控制
```typescript
const cursors = this.input.keyboard.addKeys({
  up: Phaser.Input.Keyboard.KeyCodes.W,
  down: Phaser.Input.Keyboard.KeyCodes.S,
  left: Phaser.Input.Keyboard.KeyCodes.A,
  right: Phaser.Input.Keyboard.KeyCodes.D
});

// 更新函数
update() {
  if (cursors.up.isDown) {
    player.setVelocityY(-160);
    player.anims.play('walk-up', true);
  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
    player.anims.play('walk-down', true);
  }
  
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('walk-left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('walk-right', true);
  }
  
  // 停止时显示第一帧
  if (!cursors.up.isDown && !cursors.down.isDown && 
      !cursors.left.isDown && !cursors.right.isDown) {
    player.setVelocity(0);
    player.anims.stop();
  }
}
```

## 角色列表

### 需要生成的角色精灵
1. **主角**（玩家控制）
2. **教练**（NPC）
3. **商店老板**（NPC）
4. **路人男**（NPC）
5. **路人女**（NPC）
6. **控球后卫**（对手）
7. **得分后卫**（对手）
8. **小前锋**（对手）
9. **大前锋**（对手）
10. **中锋**（对手）

## 文件组织

```
client/public/sprites/
├── player.png (主角精灵表)
├── coach.png (教练精灵表)
├── shop_owner.png (商店老板精灵表)
├── npc_male.png (路人男精灵表)
├── npc_female.png (路人女精灵表)
├── pg_player.png (控球后卫精灵表)
├── sg_player.png (得分后卫精灵表)
├── sf_player.png (小前锋精灵表)
├── pf_player.png (大前锋精灵表)
└── c_player.png (中锋精灵表)
```

## 下一步行动

1. ✅ 完成技术文档
2. 🔄 生成10个角色精灵表
3. ⏳ 创建Phaser动画配置文件
4. ⏳ 集成WASD键控制系统
5. ⏳ 实现角色碰撞检测
6. ⏳ 添加角色阴影效果

## 参考资源

- [Pixelblog - Human Walk Cycle](https://www.slynyrd.com/blog)
- 开罗游戏官方角色设计
- Phaser 3 Sprite Animation文档

