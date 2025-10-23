
import React from 'react';
import { KairoGameState } from '../../types/kairo';

interface ClubOverviewProps {
  gameState: KairoGameState;
}

const ClubOverview: React.FC<ClubOverviewProps> = ({ gameState }) => {
  const { money, popularity, clubRank } = gameState;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>俱乐部总览</h2>
      <div style={infoRowStyle}>
        <span style={labelStyle}>资金:</span>
        <span style={valueStyle}>¥{money.toLocaleString()}</span>
      </div>
      <div style={infoRowStyle}>
        <span style={labelStyle}>人气:</span>
        <span style={valueStyle}>{popularity.toLocaleString()}</span>
      </div>
      <div style={infoRowStyle}>
        <span style={labelStyle}>排名:</span>
        <span style={valueStyle}>No.{clubRank}</span>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  fontFamily: '"Press Start 2P", cursive', // 像素字体，需要引入
  backgroundColor: '#2e2e2e', // 深色背景，模拟像素游戏UI
  border: '2px solid #555', // 边框
  padding: '16px',
  margin: '16px',
  borderRadius: '8px',
  color: '#eee', // 浅色文字
  width: '300px',
  boxShadow: '4px 4px 0px 0px #1a1a1a', // 像素风格阴影
  imageRendering: 'pixelated', // 确保像素渲染
};

const titleStyle: React.CSSProperties = {
  fontSize: '20px',
  marginBottom: '12px',
  color: '#ffdd00', // 亮黄色标题
  textShadow: '2px 2px #000', // 标题阴影
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
  fontSize: '16px',
};

const labelStyle: React.CSSProperties = {
  color: '#aaa',
};

const valueStyle: React.CSSProperties = {
  color: '#fff',
  fontWeight: 'bold',
};

export default ClubOverview;

