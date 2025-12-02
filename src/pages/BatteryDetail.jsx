import { useNavigate } from 'react-router-dom';
import './DetailPage.css';

function BatteryDetail({ data }) {
  const navigate = useNavigate();

  if (!data) {
    return <div className="detail-page"><p>데이터 로딩 중...</p></div>;
  }

  const getSocColor = (soc) => {
    if (soc >= 60) return '#10b981';
    if (soc >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const getSocStatus = (soc) => {
    if (soc >= 80) return '충분';
    if (soc >= 60) return '양호';
    if (soc >= 30) return '보통';
    if (soc >= 15) return '부족';
    return '위험';
  };

  const getTempStatus = (temp) => {
    if (temp <= 25) return { text: '최적', color: '#10b981' };
    if (temp <= 35) return { text: '정상', color: '#3b82f6' };
    if (temp <= 45) return { text: '주의', color: '#f59e0b' };
    return { text: '위험', color: '#ef4444' };
  };

  const tempStatus = getTempStatus(data.battery_temp || 0);

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 대시보드로 돌아가기
        </button>
        <h1>🔋 배터리 상태 상세</h1>
        <p className="last-update">마지막 업데이트: {new Date(data.timestamp).toLocaleString('ko-KR')}</p>
      </div>

      <div className="detail-content">
        <div className="detail-main-card battery-main">
          <div className="soc-large">
            <svg viewBox="0 0 100 100">
              <circle className="soc-bg-large" cx="50" cy="50" r="45" />
              <circle 
                className="soc-progress-large" 
                cx="50" 
                cy="50" 
                r="45"
                style={{ 
                  strokeDasharray: `${(data.soc || 0) * 2.83} 283`,
                  stroke: getSocColor(data.soc || 0)
                }}
              />
            </svg>
            <div className="soc-center">
              <span className="value">{data.soc || 0}</span>
              <span className="unit">%</span>
              <span className="status" style={{ color: getSocColor(data.soc || 0) }}>
                {getSocStatus(data.soc || 0)}
              </span>
            </div>
          </div>
          <p className="main-label">충전 상태 (SOC)</p>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-card-header">배터리 전압</div>
            <div className="detail-card-value">
              <span className="value">{data.battery_voltage?.toFixed(1) || 0}</span>
              <span className="unit">V</span>
            </div>
            <div className="detail-card-desc">Battery Voltage</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">배터리 온도</div>
            <div className="detail-card-value" style={{ color: tempStatus.color }}>
              <span className="value">{data.battery_temp || 0}</span>
              <span className="unit">°C</span>
            </div>
            <div className="detail-card-desc">{tempStatus.text}</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">예상 용량</div>
            <div className="detail-card-value">
              <span className="value">{((data.soc || 0) * 0.5).toFixed(1)}</span>
              <span className="unit">kWh</span>
            </div>
            <div className="detail-card-desc">50kWh 기준</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">상태</div>
            <div className="detail-card-value">
              <span className="value status-text" style={{ color: getSocColor(data.soc || 0) }}>
                {(data.soc || 0) > 50 ? '충전 대기' : '방전 중'}
              </span>
            </div>
            <div className="detail-card-desc">Battery Status</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatteryDetail;
