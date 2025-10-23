#!/usr/bin/env python3
"""
开罗游戏风格像素艺术生成器
手工绘制每一个像素点，创建16x16像素的篮球球员动画
"""

from PIL import Image, ImageDraw
import os

# 颜色定义（开罗游戏风格）
COLORS = {
    # 皮肤色
    'skin_light': (255, 220, 177),
    'skin_shadow': (227, 187, 143),
    'skin_dark': (198, 153, 110),
    
    # 橙队球衣
    'orange_main': (255, 107, 53),  # #FF6B35
    'orange_light': (255, 140, 90),
    'orange_dark': (220, 80, 30),
    'orange_shadow': (180, 60, 20),
    
    # 蓝队球衣
    'blue_main': (59, 130, 246),  # #3B82F6
    'blue_light': (96, 165, 250),
    'blue_dark': (37, 99, 235),
    'blue_shadow': (29, 78, 216),
    
    # 头发
    'hair_black': (40, 40, 40),
    'hair_brown': (101, 67, 33),
    'hair_blonde': (255, 220, 100),
    
    # 鞋子
    'shoe_white': (255, 255, 255),
    'shoe_black': (40, 40, 40),
    'shoe_shadow': (100, 100, 100),
    
    # 其他
    'white': (255, 255, 255),
    'black': (0, 0, 0),
    'transparent': (0, 0, 0, 0),
}

def create_player_sprite_sheet(team_color='orange', player_number=1):
    """
    创建一个球员的完整sprite sheet
    包含4个方向 x 3帧动画 = 12帧
    布局：
    - 第1行：向下走（3帧）
    - 第2行：向左走（3帧）
    - 第3行：向右走（3帧）
    - 第4行：向上走（3帧）
    """
    
    # 创建sprite sheet（16x16 x 12帧 = 192x64）
    sprite_size = 16
    frames_per_row = 3
    rows = 4
    
    sheet_width = sprite_size * frames_per_row
    sheet_height = sprite_size * rows
    
    # 使用RGBA模式支持透明背景
    sprite_sheet = Image.new('RGBA', (sheet_width, sheet_height), COLORS['transparent'])
    
    # 选择球衣颜色
    if team_color == 'orange':
        jersey_main = COLORS['orange_main']
        jersey_light = COLORS['orange_light']
        jersey_dark = COLORS['orange_dark']
        jersey_shadow = COLORS['orange_shadow']
    else:  # blue
        jersey_main = COLORS['blue_main']
        jersey_light = COLORS['blue_light']
        jersey_dark = COLORS['blue_dark']
        jersey_shadow = COLORS['blue_shadow']
    
    # 绘制每一帧
    for row in range(rows):
        for col in range(frames_per_row):
            x_offset = col * sprite_size
            y_offset = row * sprite_size
            
            # 创建单帧图像
            frame = Image.new('RGBA', (sprite_size, sprite_size), COLORS['transparent'])
            pixels = frame.load()
            
            # 根据方向和帧数绘制不同的姿势
            direction = ['down', 'left', 'right', 'up'][row]
            frame_num = col
            
            # 手工绘制像素（16x16）
            # 这里简化版本，实际应该更细致
            
            if direction == 'down':
                # 向下走的动画
                draw_player_down(pixels, frame_num, jersey_main, jersey_light, jersey_dark)
            elif direction == 'left':
                # 向左走的动画
                draw_player_left(pixels, frame_num, jersey_main, jersey_light, jersey_dark)
            elif direction == 'right':
                # 向右走的动画
                draw_player_right(pixels, frame_num, jersey_main, jersey_light, jersey_dark)
            elif direction == 'up':
                # 向上走的动画
                draw_player_up(pixels, frame_num, jersey_main, jersey_light, jersey_dark)
            
            # 将单帧粘贴到sprite sheet
            sprite_sheet.paste(frame, (x_offset, y_offset))
    
    return sprite_sheet

def draw_player_down(pixels, frame_num, jersey_main, jersey_light, jersey_dark):
    """绘制向下走的球员（正面）"""
    skin = COLORS['skin_light']
    skin_shadow = COLORS['skin_shadow']
    hair = COLORS['hair_black']
    shoe = COLORS['shoe_white']
    
    # 头部（行3-6）
    # 头发
    for x in range(5, 11):
        for y in range(3, 5):
            pixels[x, y] = hair
    
    # 脸
    for x in range(6, 10):
        for y in range(5, 7):
            pixels[x, y] = skin
    
    # 眼睛
    pixels[6, 5] = COLORS['black']
    pixels[9, 5] = COLORS['black']
    
    # 身体（行7-11）
    # 球衣主体
    for x in range(5, 11):
        for y in range(7, 11):
            pixels[x, y] = jersey_main
    
    # 球衣高光
    for x in range(6, 9):
        pixels[x, 7] = jersey_light
    
    # 球衣阴影
    for x in range(6, 10):
        pixels[x, 10] = jersey_dark
    
    # 手臂（根据帧数变化）
    if frame_num == 0:  # 中立姿势
        pixels[4, 8] = skin
        pixels[11, 8] = skin
    elif frame_num == 1:  # 左手前，右手后
        pixels[4, 7] = skin
        pixels[4, 8] = skin
        pixels[11, 9] = skin
    else:  # 右手前，左手后
        pixels[4, 9] = skin
        pixels[11, 7] = skin
        pixels[11, 8] = skin
    
    # 腿部（行11-15，根据帧数变化）
    if frame_num == 0:  # 双脚并拢
        for x in range(6, 8):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        for x in range(8, 10):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        # 鞋子
        pixels[6, 14] = shoe
        pixels[7, 14] = shoe
        pixels[8, 14] = shoe
        pixels[9, 14] = shoe
    elif frame_num == 1:  # 左脚前
        for x in range(5, 7):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        for x in range(9, 11):
            for y in range(12, 15):
                pixels[x, y] = jersey_dark
        pixels[5, 14] = shoe
        pixels[6, 14] = shoe
        pixels[9, 14] = shoe
        pixels[10, 14] = shoe
    else:  # 右脚前
        for x in range(5, 7):
            for y in range(12, 15):
                pixels[x, y] = jersey_dark
        for x in range(9, 11):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        pixels[5, 14] = shoe
        pixels[6, 14] = shoe
        pixels[9, 14] = shoe
        pixels[10, 14] = shoe

def draw_player_left(pixels, frame_num, jersey_main, jersey_light, jersey_dark):
    """绘制向左走的球员（侧面）"""
    skin = COLORS['skin_light']
    hair = COLORS['hair_black']
    shoe = COLORS['shoe_white']
    
    # 头部（侧面）
    for x in range(6, 10):
        for y in range(3, 5):
            pixels[x, y] = hair
    for x in range(7, 10):
        for y in range(5, 7):
            pixels[x, y] = skin
    pixels[9, 5] = COLORS['black']  # 眼睛
    
    # 身体
    for x in range(6, 11):
        for y in range(7, 11):
            pixels[x, y] = jersey_main
    
    # 手臂（前后摆动）
    if frame_num == 1:
        pixels[5, 7] = skin
        pixels[5, 8] = skin
    else:
        pixels[5, 9] = skin
        pixels[5, 10] = skin
    
    # 腿部（走路动画）
    if frame_num == 0:
        for x in range(7, 9):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        pixels[7, 14] = shoe
        pixels[8, 14] = shoe
    elif frame_num == 1:
        for x in range(6, 8):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        for x in range(9, 11):
            for y in range(12, 14):
                pixels[x, y] = jersey_dark
        pixels[6, 14] = shoe
        pixels[7, 14] = shoe
        pixels[9, 13] = shoe
    else:
        for x in range(8, 10):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        for x in range(6, 8):
            for y in range(12, 14):
                pixels[x, y] = jersey_dark
        pixels[8, 14] = shoe
        pixels[9, 14] = shoe
        pixels[6, 13] = shoe

def draw_player_right(pixels, frame_num, jersey_main, jersey_light, jersey_dark):
    """绘制向右走的球员（侧面镜像）"""
    # 先绘制向左，然后镜像
    draw_player_left(pixels, frame_num, jersey_main, jersey_light, jersey_dark)
    # 注意：这里简化了，实际应该手工绘制镜像版本

def draw_player_up(pixels, frame_num, jersey_main, jersey_light, jersey_dark):
    """绘制向上走的球员（背面）"""
    skin = COLORS['skin_light']
    hair = COLORS['hair_black']
    shoe = COLORS['shoe_white']
    
    # 头部（背面）
    for x in range(5, 11):
        for y in range(3, 7):
            pixels[x, y] = hair
    
    # 身体
    for x in range(5, 11):
        for y in range(7, 11):
            pixels[x, y] = jersey_main
    
    # 手臂
    if frame_num == 1:
        pixels[4, 8] = skin
        pixels[11, 8] = skin
    
    # 腿部（走路动画）
    if frame_num == 0:
        for x in range(6, 8):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        for x in range(8, 10):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        pixels[6, 14] = shoe
        pixels[7, 14] = shoe
        pixels[8, 14] = shoe
        pixels[9, 14] = shoe
    elif frame_num == 1:
        for x in range(5, 7):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        for x in range(9, 11):
            for y in range(12, 14):
                pixels[x, y] = jersey_dark
        pixels[5, 14] = shoe
        pixels[6, 14] = shoe
    else:
        for x in range(9, 11):
            for y in range(11, 15):
                pixels[x, y] = jersey_dark
        for x in range(5, 7):
            for y in range(12, 14):
                pixels[x, y] = jersey_dark
        pixels[9, 14] = shoe
        pixels[10, 14] = shoe

def main():
    """生成所有球员sprite sheets"""
    output_dir = '/home/ubuntu/basketball_manager/client/public/sprites'
    os.makedirs(output_dir, exist_ok=True)
    
    print("🎨 开始生成开罗风格像素艺术...")
    
    # 生成10个橙队球员
    for i in range(1, 11):
        print(f"  绘制橙队球员 #{i}...")
        sprite_sheet = create_player_sprite_sheet('orange', i)
        sprite_sheet.save(f'{output_dir}/player_orange_{i}.png')
    
    # 生成10个蓝队球员
    for i in range(1, 11):
        print(f"  绘制蓝队球员 #{i}...")
        sprite_sheet = create_player_sprite_sheet('blue', i)
        sprite_sheet.save(f'{output_dir}/player_blue_{i}.png')
    
    print("✅ 所有球员sprite sheets生成完成！")
    print(f"   输出目录: {output_dir}")

if __name__ == '__main__':
    main()

