import { useNavigate } from 'react-router-dom';
import './DetailPage.css';

function PVDetail({ data }) {
  const navigate = useNavigate();

  if (!data) {
    return <div className="detail-page"><p>데이터 로딩 중...</p></div>;
  }

  const isGenerating = (data.pv_power || 0) > 0;
  const efficiency = data.pv_voltage && data.pv_current 
    ? ((data.pv_power / (data.pv_voltage * data.pv_current)) * 100).toFixed(1) 
    : 0;

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 대시보드로 돌아가기
        </button>
        <h1>☀️ 태양광 발전 상세</h1>
        <p className="last-update">마지막 업데이트: {new Date(data.timestamp).toLocaleString('ko-KR')}</p>
      </div>

      <div className="detail-content">
        <div className="detail-main-card pv-main">
          <div className="pv-status-icon">
            {isGenerating ? '🌞' : '🌙'}
          </div>
          <div className="main-value pv">
            <span className="value">{data.pv_power?.toLocaleString() || 0}</span>
            <span className="unit">W</span>
          </div>
          <p className="main-label">
            {isGenerating ? '발전 중' : '발전 대기'}
          </p>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-card-header">PV 전압</div>
            <div className="detail-card-value pv-value">
              <span className="value">{data.pv_voltage || 0}</span>
              <span className="unit">V</span>
            </div>
            <div className="detail-card-desc">Solar Panel Voltage</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">PV 전류</div>
            <div className="detail-card-value pv-value">
              <span className="value">{data.pv_current || 0}</span>
              <span className="unit">A</span>
            </div>
            <div className="detail-card-desc">Solar Panel Current</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">변환 효율</div>
            <div className="detail-card-value">
              <span className="value">{efficiency}</span>
              <span className="unit">%</span>
            </div>
            <div className="detail-card-desc">Conversion Efficiency</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">오늘 예상 발전량</div>
            <div className="detail-card-value">
              <span className="value">{((data.pv_power || 0) * 8 / 1000).toFixed(1)}</span>
              <span className="unit">kWh</span>
            </div>
            <div className="detail-card-desc">8시간 기준</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PVDetail;
