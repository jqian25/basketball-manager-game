# 像素艺术生成系统 - 技术文档

## 核心原则

### 1. 等距投影基础（Isometric Projection）
- **2:1比例规则**：每向水平移动2个像素，垂直移动1个像素
- **角度**：使用26.5°角（而非真实的30°），以避免锯齿
- **无消失点**：所有平行线保持平行，不会汇聚

### 2. 开罗游戏（Kairosoft）风格特征
- **明亮色彩**：使用高饱和度、高对比度的配色方案
- **简洁造型**：建筑物采用简化的几何形状
- **模块化设计**：每个元素都可以独立复用
- **可爱风格**：圆润的边角，友好的视觉语言

### 3. 50个东京都市场景列表

#### 商业区（10个场景）
1. 涩谷十字路口 (Shibuya Crossing)
2. 秋叶原电器街 (Akihabara)
3. 新宿歌舞伎町 (Shinjuku Kabukicho)
4. 银座购物街 (Ginza)
5. 原宿竹下通 (Harajuku Takeshita)
6. 六本木之丘 (Roppongi Hills)
7. 表参道 (Omotesando)
8. 池袋阳光城 (Ikebukuro Sunshine)
9. 东京站丸之内 (Tokyo Station Marunouchi)
10. 台场海滨公园 (Odaiba Seaside)

#### 文化区（10个场景）
11. 浅草寺雷门 (Asakusa Sensoji)
12. 明治神宫 (Meiji Shrine)
13. 上野公园 (Ueno Park)
14. 皇居外苑 (Imperial Palace)
15. 增上寺 (Zojoji Temple)
16. 代代木公园 (Yoyogi Park)
17. 东京塔周边 (Tokyo Tower)
18. 晴空塔 (Tokyo Skytree)
19. 浅草花屋敷 (Asakusa Hanayashiki)
20. 神田神保町书店街 (Kanda Jimbocho)

#### 居住区（10个场景）
21. 下北泽 (Shimokitazawa)
22. 中目黑 (Nakameguro)
23. 吉祥寺 (Kichijoji)
24. 自由之丘 (Jiyugaoka)
25. 惠比寿 (Ebisu)
26. 三轩茶屋 (Sangenjaya)
27. 高円寺 (Koenji)
28. 阿佐谷 (Asagaya)
29. 荻窪 (Ogikubo)
30. 中野百老汇 (Nakano Broadway)

#### 体育设施（10个场景）
31. 国立竞技场 (National Stadium)
32. 东京巨蛋 (Tokyo Dome)
33. 有明体育馆 (Ariake Arena)
34. 代代木体育馆 (Yoyogi Gymnasium)
35. 驹泽奥林匹克公园 (Komazawa Olympic Park)
36. 江户川区体育馆 (Edogawa Gymnasium)
37. 大田区体育馆 (Ota Gymnasium)
38. 世田谷区体育馆 (Setagaya Gymnasium)
39. 练马区体育馆 (Nerima Gymnasium)
40. 足立区体育馆 (Adachi Gymnasium)

#### 特色场景（10个场景）
41. 筑地市场 (Tsukiji Market)
42. 东京迪士尼乐园入口 (Tokyo Disneyland)
43. 富士电视台 (Fuji TV Building)
44. 彩虹大桥 (Rainbow Bridge)
45. 隅田川河畔 (Sumida River)
46. 东京湾夜景 (Tokyo Bay Night)
47. 新宿御苑 (Shinjuku Gyoen)
48. 东京大学本乡校区 (Tokyo University)
49. 东京国际展示场 (Tokyo Big Sight)
50. 羽田机场国际航站楼 (Haneda Airport)

## 技术实现方案

### 方案A：AI图像生成（推荐）
使用Manus内置的图像生成API，生成符合开罗风格的等距像素艺术

**优势：**
- 快速生成大量场景
- 统一的视觉风格
- 可以精确控制提示词

**提示词模板：**
```
Isometric pixel art of [LOCATION], Kairosoft game style, 2:1 ratio, 
vibrant colors, cute and simple design, modular buildings, 
bright saturated palette, clean lines, no shadows, 
top-down 45-degree view, retro game aesthetic, 
pixel perfect, 64x64 tile size
```

### 方案B：程序化生成
使用Python脚本生成基础的等距建筑精灵

**优势：**
- 完全可控
- 可以动态修改
- 适合生成重复性元素

**实现步骤：**
1. 创建基础立方体生成器
2. 添加纹理和颜色
3. 组合成复杂建筑
4. 导出为PNG

### 方案C：混合方案（最佳）
结合AI生成和程序化生成的优势

**流程：**
1. 使用AI生成主要建筑物的高清参考图
2. 使用程序化生成器创建像素艺术版本
3. 手动调整细节和颜色
4. 批量导出所有资源

## 色彩方案

### 开罗游戏标准配色
- **建筑主体**：#FFD700 (金色), #FF6B6B (红色), #4ECDC4 (青色)
- **屋顶**：#FF4757 (深红), #2F3542 (深灰)
- **道路**：#95A5A6 (灰色), #34495E (深灰)
- **植被**：#2ECC71 (绿色), #27AE60 (深绿)
- **天空**：#87CEEB (天空蓝), #3498DB (蓝色)

### 灌篮高手配色融合
- **主色调**：#FF6B35 (橙色) - 篮球色
- **辅助色**：#87CEEB (天空蓝) - 晴空
- **强调色**：#FFFFFF (白色) - 云朵

## 文件组织结构

```
client/public/maps/tokyo/
├── commercial/
│   ├── shibuya_crossing.png
│   ├── akihabara.png
│   └── ...
├── cultural/
│   ├── asakusa_temple.png
│   ├── meiji_shrine.png
│   └── ...
├── residential/
│   ├── shimokitazawa.png
│   ├── nakameguro.png
│   └── ...
├── sports/
│   ├── national_stadium.png
│   ├── tokyo_dome.png
│   └── ...
└── special/
    ├── tsukiji_market.png
    ├── rainbow_bridge.png
    └── ...
```

## 下一步行动

1. ✅ 完成技术文档
2. 🔄 使用AI生成50个场景的像素艺术
3. ⏳ 创建场景数据库配置文件
4. ⏳ 集成到Phaser游戏引擎
5. ⏳ 实现场景切换和交互系统

## 参考资源

- [Pixelblog - Isometric Pixel Art](https://www.slynyrd.com/blog/2022/11/28/pixelblog-41-isometric-pixel-art)
- [Lospec - Isometric Tile Tutorial](https://lospec.com/pixel-art-tutorials/isometric-tile-21-ratio-by-st0ven)
- 开罗游戏官方作品（Basketball Club Story）

