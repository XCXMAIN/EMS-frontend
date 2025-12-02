import { useNavigate } from 'react-router-dom';
import './DetailPage.css';

function PowerDetail({ data }) {
  const navigate = useNavigate();

  if (!data) {
    return <div className="detail-page"><p>데이터 로딩 중...</p></div>;
  }

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 대시보드로 돌아가기
        </button>
        <h1>⚡ 전력 현황 상세</h1>
        <p className="last-update">마지막 업데이트: {new Date(data.timestamp).toLocaleString('ko-KR')}</p>
      </div>

      <div className="detail-content">
        <div className="detail-main-card">
          <div className="main-value">
            <span className="value">{data.power?.toLocaleString() || 0}</span>
            <span className="unit">W</span>
          </div>
          <p className="main-label">현재 전력</p>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-card-header">전압</div>
            <div className="detail-card-value">
              <span className="value">{data.voltage || 0}</span>
              <span className="unit">V</span>
            </div>
            <div className="detail-card-desc">시스템 전압</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">전류</div>
            <div className="detail-card-value">
              <span className="value">{data.current || 0}</span>
              <span className="unit">A</span>
            </div>
            <div className="detail-card-desc">시스템 전류</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">역률</div>
            <div className="detail-card-value">
              <span className="value">{data.voltage && data.current ? ((data.power / (data.voltage * data.current)) * 100).toFixed(1) : 0}</span>
              <span className="unit">%</span>
            </div>
            <div className="detail-card-desc">Power Factor</div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">피상전력</div>
            <div className="detail-card-value">
              <span className="value">{((data.voltage || 0) * (data.current || 0)).toFixed(0)}</span>
              <span className="unit">VA</span>
            </div>
            <div className="detail-card-desc">Apparent Power</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PowerDetail;
