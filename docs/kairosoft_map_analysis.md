# Kairosoft Basketball Club Story 地图系统分析

## 视觉特征分析

### 1. 等距投影系统
- **投影比例**: 2:1 isometric (宽:高 = 2:1)
- **瓦片尺寸**: 约32x16像素基础瓦片
- **视角角度**: 26.565度 (标准等距角)
- **排列方式**: 菱形网格，交错排列

### 2. 色彩方案

#### 草地系统
- **主色**: `#2E8B57` (深海绿)
- **阴影色**: `#228B22` (森林绿)
- **花朵点缀**: `#F5DEB3` (米黄色小点)
- **纹理**: 随机分布的浅色点状装饰

#### 篮球场地
- **主场地色**: `#FF8C00` (深橙色)
- **三分线**: `#FFFFFF` (白色，2px宽)
- **罚球区**: `#4169E1` (皇家蓝)
- **中圈**: `#FF4500` (橙红色)
- **边界线**: `#FFFFFF` (白色)

#### 道路系统
- **主路色**: `#696969` (暗灰色)
- **分隔线**: `#FFFFFF` (白色虚线)
- **人行道**: `#D3D3D3` (浅灰色)
- **阴影**: `#2F4F4F` (深石板灰)

#### 建筑物
- **屋顶色**: `#DC143C` (深红), `#FF8C00` (橙色), `#4169E1` (蓝色)
- **墙体色**: `#F5F5DC` (米色), `#FAFAD2` (浅金黄)
- **窗户**: `#87CEEB` (天空蓝)
- **阴影**: 屋顶色的60%亮度版本

#### 树木
- **树冠**: `#228B22` (森林绿)
- **树冠高光**: `#32CD32` (酸橙绿)
- **树干**: `#8B4513` (马鞍棕)
- **阴影**: `#006400` (深绿)

#### 水体
- **主色**: `#87CEEB` (天空蓝)
- **深水**: `#4682B4` (钢蓝)
- **高光**: `#B0E0E6` (粉蓝)

### 3. 瓦片类型清单

#### 地面瓦片 (Ground Tiles)
1. `grass_base.png` - 基础草地 (32x16)
2. `grass_flower.png` - 带花朵草地 (32x16)
3. `road_straight.png` - 直路 (32x16)
4. `road_corner.png` - 转角路 (32x16)
5. `sidewalk.png` - 人行道 (32x16)
6. `court_orange.png` - 橙色场地 (32x16)
7. `court_blue.png` - 蓝色区域 (32x16)
8. `water.png` - 水面 (32x16)

#### 装饰瓦片 (Decoration Tiles)
9. `tree_small.png` - 小树 (32x48)
10. `tree_large.png` - 大树 (48x64)
11. `basketball_hoop.png` - 篮球架 (32x64)
12. `bench.png` - 长椅 (32x24)
13. `lamp_post.png` - 路灯 (16x48)
14. `fence.png` - 栅栏 (32x16)

#### 建筑瓦片 (Building Tiles)
15. `building_red_roof.png` - 红屋顶建筑 (64x80)
16. `building_orange_roof.png` - 橙屋顶建筑 (64x80)
17. `building_blue_roof.png` - 蓝屋顶建筑 (64x80)
18. `shop_front.png` - 商店前台 (48x64)
19. `gym_entrance.png` - 体育馆入口 (96x96)

#### 特殊瓦片 (Special Tiles)
20. `court_center_circle.png` - 中圈 (64x32)
21. `court_three_point_line.png` - 三分线 (128x64)
22. `scoreboard.png` - 记分牌 (64x48)
23. `bleachers.png` - 看台 (96x64)
24. `parking_lot.png` - 停车场 (64x32)

### 4. 技术规格

#### Phaser 3 配置
```typescript
const mapConfig = {
  tileWidth: 32,
  tileHeight: 16,
  orientation: 'isometric',
  renderOrder: 'right-down',
  staggerAxis: 'x',
  staggerIndex: 'odd'
};
```

#### 层级顺序 (Z-Index)
1. 底层: 草地、道路、水面 (z=0)
2. 地面装饰: 花朵、地面标记 (z=1)
3. 低矮物体: 栅栏、长椅 (z=2)
4. 中等物体: 树木、路灯 (z=3)
5. 建筑物: 房屋、体育馆 (z=4)
6. 角色层: 球员、NPC (z=5)
7. UI层: 对话框、菜单 (z=10)

#### 阴影系统
- **方向**: 右下方45度
- **偏移**: X+4px, Y+4px
- **颜色**: `rgba(0, 0, 0, 0.3)`
- **模糊**: 0px (像素完美)

### 5. 地图布局参考

#### 标准篮球场区域 (28x15米 → 约56x30瓦片)
```
[草地边界]
[观众看台] [观众看台]
[篮球场主区域 - 橙色]
  - 三分线 (白色弧线)
  - 罚球区 (蓝色矩形)
  - 中圈 (橙红色圆)
  - 篮球架 (两端)
[教练席] [替补席]
[草地边界]
```

#### 周边设施布局
- **左侧**: 训练设施、更衣室、商店
- **右侧**: 休息区、餐厅、医疗室
- **上方**: 停车场、主入口
- **下方**: 树木、花园、水池

### 6. 动画效果

#### 静态装饰动画
- 树木: 轻微摇摆 (2秒循环)
- 水面: 波纹闪烁 (3秒循环)
- 路灯: 光晕闪烁 (1秒循环)

#### 交互动画
- 球员移动: 8方向行走动画
- 投篮: 跳跃+投球动作
- 得分: 欢呼+闪光特效

### 7. 性能优化

#### 瓦片图集 (Tileset Atlas)
- 所有瓦片合并到单个PNG (1024x1024)
- 使用JSON描述瓦片位置
- 启用纹理压缩

#### 渲染优化
- 视口裁剪 (只渲染可见区域)
- 对象池 (复用精灵对象)
- 分层渲染 (减少draw calls)

## 实现计划

### Phase 1: 瓦片集生成
1. 使用AI生成24个基础瓦片
2. 确保像素完美、色彩饱和
3. 创建瓦片图集JSON

### Phase 2: Phaser场景搭建
1. 配置等距地图引擎
2. 加载瓦片图集
3. 创建多层地图

### Phase 3: 地图数据设计
1. 设计篮球场主区域
2. 布置周边设施
3. 添加装饰元素

### Phase 4: 交互系统
1. 角色移动控制 (WASD)
2. 建筑物点击交互
3. 地图扩展系统

## 参考资料

- 原始参考图: `/home/ubuntu/basketball_manager/docs/kairosoft_basketball_reference.png`
- Phaser等距地图文档: https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.html
- 等距投影数学: https://en.wikipedia.org/wiki/Isometric_projection

