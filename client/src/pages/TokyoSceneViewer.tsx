/**
 * Tokyo Scene Viewer
 * 简单的场景查看器，展示50个东京场景和角色精灵
 */

import { useState } from 'react';
import { TOKYO_SCENES, getSceneById, TokyoScene } from '../data/tokyoScenes';

export default function TokyoSceneViewer() {
  const [currentSceneId, setCurrentSceneId] = useState('shibuya_crossing');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCharacters, setShowCharacters] = useState(true);

  const currentScene = getSceneById(currentSceneId);

  const categories = {
    all: '全部场景',
    commercial: '商业区',
    cultural: '文化区',
    residential: '居住区',
    sports: '体育设施',
    special: '特色场景'
  };

  const filteredScenes = selectedCategory === 'all' 
    ? TOKYO_SCENES 
    : TOKYO_SCENES.filter(s => s.category === selectedCategory);

  const characters = [
    { id: 'player', name: '主角', sprite: '/sprites/player_main.png' },
    { id: 'coach', name: '教练', sprite: '/sprites/coach.png' },
    { id: 'pg', name: '控球后卫', sprite: '/sprites/pg_player.png' },
    { id: 'sg', name: '得分后卫', sprite: '/sprites/sg_player.png' },
    { id: 'sf', name: '小前锋', sprite: '/sprites/sf_player.png' },
    { id: 'pf', name: '大前锋', sprite: '/sprites/pf_player.png' },
    { id: 'c', name: '中锋', sprite: '/sprites/c_player.png' },
    { id: 'npc_m', name: '路人男', sprite: '/sprites/npc_male.png' },
    { id: 'npc_f', name: '路人女', sprite: '/sprites/npc_female.png' },
    { id: 'shop', name: '商店老板', sprite: '/sprites/shop_owner.png' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '20px'
    }}>
      {/* 标题 */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
          🏀 篮球经理RPG - 东京开放世界
        </h1>
        <p style={{ fontSize: '18px', color: '#aaa' }}>
          50个开罗游戏风格的东京场景 | 10个可爱角色精灵
        </p>
      </div>

      {/* 分类过滤器 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(categories).map(([key, name]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedCategory === key ? '#FF6B35' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== key) {
                e.currentTarget.style.backgroundColor = '#444';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== key) {
                e.currentTarget.style.backgroundColor = '#333';
              }
            }}
          >
            {name} ({key === 'all' ? TOKYO_SCENES.length : TOKYO_SCENES.filter(s => s.category === key).length})
          </button>
        ))}
      </div>

      {/* 主要内容区域 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        {/* 左侧场景列表 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          padding: '20px',
          maxHeight: '800px',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>
            场景列表 ({filteredScenes.length})
          </h3>
          {filteredScenes.map((scene) => (
            <div
              key={scene.id}
              onClick={() => setCurrentSceneId(scene.id)}
              style={{
                padding: '12px',
                backgroundColor: currentSceneId === scene.id ? '#FF6B35' : '#333',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (currentSceneId !== scene.id) {
                  e.currentTarget.style.backgroundColor = '#444';
                }
              }}
              onMouseLeave={(e) => {
                if (currentSceneId !== scene.id) {
                  e.currentTarget.style.backgroundColor = '#333';
                }
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {scene.nameZh}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>
                {scene.nameEn}
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                {scene.hasBasketballCourt && '🏀 '}
                等级{scene.unlockLevel}
              </div>
            </div>
          ))}
        </div>

        {/* 右侧场景展示 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          padding: '20px'
        }}>
          {currentScene && (
            <>
              {/* 场景信息 */}
              <div style={{
                backgroundColor: '#333',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>
                  📍 {currentScene.nameZh}
                </h2>
                <div style={{ fontSize: '16px', color: '#aaa', marginBottom: '10px' }}>
                  {currentScene.nameEn} | {currentScene.nameJa}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  {currentScene.description}
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                  <span>
                    🏷️ 分类: {categories[currentScene.category as keyof typeof categories]}
                  </span>
                  <span>
                    {currentScene.hasBasketballCourt ? '🏀 有篮球场' : '❌ 无篮球场'}
                  </span>
                  <span>
                    ⭐ 等级 {currentScene.unlockLevel}
                  </span>
                  {currentScene.difficulty && (
                    <span>
                      💪 难度: {currentScene.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* 场景图片 */}
              <div style={{
                position: 'relative',
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}>
                <img 
                  src={currentScene.imagePath} 
                  alt={currentScene.nameZh}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
                
                {/* 角色精灵覆盖层 */}
                {showCharacters && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none'
                  }}>
                    {/* 随机放置一些角色 */}
                    {[0, 1, 2, 3].map((index) => {
                      const char = characters[Math.floor(Math.random() * characters.length)];
                      const x = 20 + (index * 25);
                      const y = 30 + (index % 2) * 30;
                      return (
                        <img
                          key={index}
                          src={char.sprite}
                          alt={char.name}
                          style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${y}%`,
                            width: '64px',
                            height: '64px',
                            imageRendering: 'pixelated'
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 控制按钮 */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => setShowCharacters(!showCharacters)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: showCharacters ? '#4CAF50' : '#666',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {showCharacters ? '✅ 显示角色' : '❌ 隐藏角色'}
                </button>
              </div>

              {/* 角色精灵展示 */}
              <div style={{
                backgroundColor: '#333',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>
                  🎮 角色精灵 (10个)
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '15px'
                }}>
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      style={{
                        textAlign: 'center',
                        padding: '10px',
                        backgroundColor: '#2a2a2a',
                        borderRadius: '8px'
                      }}
                    >
                      <img
                        src={char.sprite}
                        alt={char.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          imageRendering: 'pixelated',
                          margin: '0 auto 8px'
                        }}
                      />
                      <div style={{ fontSize: '12px' }}>{char.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 底部统计信息 */}
      <div style={{
        maxWidth: '1600px',
        margin: '30px auto 0',
        padding: '20px',
        backgroundColor: '#2a2a2a',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>
          📊 项目统计
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '32px', color: '#FF6B35', fontWeight: 'bold' }}>
              50
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>东京场景</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#4CAF50', fontWeight: 'bold' }}>
              10
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>角色精灵</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#2196F3', fontWeight: 'bold' }}>
              10
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>篮球场</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#FFC107', fontWeight: 'bold' }}>
              5
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>场景分类</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', color: '#9C27B0', fontWeight: 'bold' }}>
              100%
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>开罗风格</div>
          </div>
        </div>
      </div>
    </div>
  );
}

