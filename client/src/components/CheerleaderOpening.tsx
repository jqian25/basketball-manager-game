import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';

const CHEERLEADER_VIDEOS = [
  '/videos/cheerleader_blonde.mp4',
  '/videos/cheerleader_asian.mp4',
  '/videos/cheerleader_latina.mp4',
  '/videos/cheerleader_bunny.mp4',
  '/videos/cheerleader_redhead.mp4',
  '/cheerleader-opening.mp4',
  '/cheerleader-halftime.mp4',
];

export default function CheerleaderOpening() {
  const [, setLocation] = useLocation();
  const [selectedVideo, setSelectedVideo] = useState('');
  const [showSkipButton, setShowSkipButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 随机选择一个啦啦队视频
    const randomIndex = Math.floor(Math.random() * CHEERLEADER_VIDEOS.length);
    setSelectedVideo(CHEERLEADER_VIDEOS[randomIndex]);

    // 3秒后显示跳过按钮
    const timer = setTimeout(() => {
      setShowSkipButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    // 视频播放完成后跳转到主页
    setLocation('/');
  };

  const handleSkip = () => {
    setLocation('/');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* 啦啦队视频 */}
      {selectedVideo && (
        <video
          ref={videoRef}
          src={selectedVideo}
          autoPlay
          onEnded={handleVideoEnd}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* 文字叠加层 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: '60px',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
          marginBottom: '20px',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          🎉 啦啦队热场表演 🎉
        </div>
        <div style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.8)',
          animation: 'fadeInOut 3s ease-in-out infinite',
        }}>
          比赛即将开始...
        </div>
        <div style={{
          fontSize: '20px',
          color: 'white',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
          marginTop: '20px',
          opacity: 0.8,
        }}>
          （点击屏幕跳过）
        </div>
      </div>

      {/* 跳过按钮 */}
      {showSkipButton && (
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            padding: '15px 40px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            background: 'rgba(255, 215, 0, 0.9)',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            zIndex: 100,
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
            transition: 'all 0.3s',
            animation: 'bounceIn 0.5s ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.5)';
          }}
        >
          跳过 ⏭️
        </button>
      )}

      {/* 点击整个屏幕也可以跳过 */}
      <div
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          zIndex: 5,
        }}
      />

      {/* CSS动画 */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

