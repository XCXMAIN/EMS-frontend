import { useNavigate } from 'react-router-dom';
import './DetailPage.css';

function GridDetail({ data }) {
  const navigate = useNavigate();

  if (!data) {
    return <div className="detail-page"><p>데이터 로딩 중...</p></div>;
  }

  const isConnected = (data.grid_voltage || 0) > 0;
  
  const getLoadColor = (percent) => {
    if (percent <= 50) return '#10b981';
    if (percent <= 80) return '#f59e0b';
    return '#ef4444';
  };

  const getLoadStatus = (percent) => {
    if (percent <= 30) return '여유';
    if (percent <= 50) return '정상';
    if (percent <= 70) return '보통';
    if (percent <= 85) return '높음';
    return '과부하';
  };

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 대시보드로 돌아가기
        </button>
        <h1>🔌 계통 및 출력 상세</h1>
        <p className="last-update">마지막 업데이트: {new Date(data.timestamp).toLocaleString('ko-KR')}</p>
      </div>

      <div className="detail-content">
        <div className="detail-main-card grid-main">
          <div className={`grid-status-display ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-icon">{isConnected ? '✓' : '⚠️'}</span>
            <span className="status-text">{isConnected ? '계통 연결' : '계통 분리'}</span>
          </div>
          <div className="main-value grid-value">
            <span className="value">{data.ac_output_w?.toLocaleString() || 0}</span>
            <span className="unit">W</span>
          </div>
          <p className="main-label">AC 출력</p>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-card-header">그리드 전압</div>
            <div className="detail-card-value">
              <span className="value">{data.grid_voltage || 0}</span>
              <span className="unit">V</span>
            </div>
            <div className="detail-card-desc">Grid Voltage</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">부하율</div>
            <div className="detail-card-value" style={{ color: getLoadColor(data.load_percent || 0) }}>
              <span className="value">{data.load_percent || 0}</span>
              <span className="unit">%</span>
            </div>
            <div className="detail-card-desc">{getLoadStatus(data.load_percent || 0)}</div>
          </div>

          <div className="detail-card full-width">
            <div className="detail-card-header">부하 상태</div>
            <div className="load-bar-large">
              <div 
                className="load-fill" 
                style={{ 
                  width: `${data.load_percent || 0}%`,
                  background: getLoadColor(data.load_percent || 0)
                }}
              ></div>
            </div>
            <div className="load-labels">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">출력 상태</div>
            <div className="detail-card-value">
              <span className="value status-text" style={{ color: isConnected ? '#10b981' : '#ef4444' }}>
                {isConnected ? '정상 출력' : '출력 중단'}
              </span>
            </div>
            <div className="detail-card-desc">Output Status</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">운전 모드</div>
            <div className="detail-card-value">
              <span className="value status-text">
                {isConnected ? '계통연계' : '독립운전'}
              </span>
            </div>
            <div className="detail-card-desc">Operation Mode</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GridDetail;
