import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ data, connectionStatus }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getSocColor = (soc) => {
    if (soc >= 60) return '#10b981';
    if (soc >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '실시간 연결됨';
      case 'connecting': return '연결 중...';
      default: return '연결 끊김';
    }
  };

  // 데이터 로딩 중
  if (!data) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>에너지 모니터링 대시보드</h1>
          <p className="site-info">사이트: {data.site}</p>
        </div>
        <div className="header-right">
          <div className="current-time">
            <span className="time">{formatTime(currentTime)}</span>
            <span className="date">{formatDate(currentTime)}</span>
          </div>
          <div className="status-badge" style={{ background: getConnectionStatusColor() }}>
            <span className="status-dot"></span>
            {getConnectionStatusText()}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* 전력 현황 카드 */}
        <div className="card power-card clickable" onClick={() => navigate('/power')}>
          <div className="card-header">
            <span className="card-icon">⚡</span>
            <h3>전력 현황</h3>
            <span className="card-arrow">→</span>
          </div>
          <div className="card-content">
            <div className="power-display">
              <span className="power-value">{(data.power || 0).toFixed(2)}</span>
              <span className="power-unit">W</span>
            </div>
            <div className="power-details">
              <div className="detail-item">
                <span className="label">전압</span>
                <span className="value">{(data.voltage || 0).toFixed(2)} V</span>
              </div>
              <div className="detail-item">
                <span className="label">전류</span>
                <span className="value">{(data.current || 0).toFixed(2)} A</span>
              </div>
            </div>
          </div>
        </div>

        {/* 배터리 상태 카드 */}
        <div className="card battery-card clickable" onClick={() => navigate('/battery')}>
          <div className="card-header">
            <span className="card-icon">🔋</span>
            <h3>배터리 상태</h3>
            <span className="card-arrow">→</span>
          </div>
          <div className="card-content">
            <div className="soc-display">
              <div className="soc-circle">
                <svg viewBox="0 0 100 100">
                  <circle className="soc-bg" cx="50" cy="50" r="45" />
                  <circle 
                    className="soc-progress" 
                    cx="50" 
                    cy="50" 
                    r="45"
                    style={{ 
                      strokeDasharray: `${(data.soc || 0) * 2.83} 283`,
                      stroke: getSocColor(data.soc || 0)
                    }}
                  />
                </svg>
                <div className="soc-value">
                  <span className="value">{data.soc || 0}</span>
                  <span className="unit">%</span>
                </div>
              </div>
            </div>
            <div className="battery-details">
              <div className="detail-item">
                <span className="label">배터리 전압</span>
                <span className="value">{data.battery_voltage?.toFixed(1) || 0} V</span>
              </div>
              <div className="detail-item">
                <span className="label">배터리 온도</span>
                <span className="value">{data.battery_temp || 0} °C</span>
              </div>
            </div>
          </div>
        </div>

        {/* 태양광 발전 카드 */}
        <div className="card pv-card clickable" onClick={() => navigate('/pv')}>
          <div className="card-header">
            <span className="card-icon">☀️</span>
            <h3>태양광 발전</h3>
            <span className="card-arrow">→</span>
          </div>
          <div className="card-content">
            <div className="power-display">
              <span className="power-value pv">{data.pv_power?.toLocaleString() || 0}</span>
              <span className="power-unit">W</span>
            </div>
            <div className="pv-details">
              <div className="detail-item">
                <span className="label">PV 전압</span>
                <span className="value">{data.pv_voltage || 0} V</span>
              </div>
              <div className="detail-item">
                <span className="label">PV 전류</span>
                <span className="value">{data.pv_current || 0} A</span>
              </div>
            </div>
            <div className="pv-status">
              {(data.pv_power || 0) === 0 ? (
                <span className="status-inactive">발전 대기 중</span>
              ) : (
                <span className="status-active">발전 중</span>
              )}
            </div>
          </div>
        </div>

        {/* 계통/출력 카드 */}
        <div className="card output-card clickable" onClick={() => navigate('/grid')}>
          <div className="card-header">
            <span className="card-icon">🔌</span>
            <h3>계통 및 출력</h3>
            <span className="card-arrow">→</span>
          </div>
          <div className="card-content">
            <div className="grid-status">
              {(data.grid_voltage || 0) === 0 ? (
                <div className="grid-offline">
                  <span className="status-icon">⚠️</span>
                  <span>계통 분리</span>
                </div>
              ) : (
                <div className="grid-online">
                  <span className="status-icon">✓</span>
                  <span>계통 연결</span>
                </div>
              )}
            </div>
            <div className="output-details">
              <div className="detail-item">
                <span className="label">그리드 전압</span>
                <span className="value">{data.grid_voltage || 0} V</span>
              </div>
              <div className="detail-item">
                <span className="label">AC 출력</span>
                <span className="value">{data.ac_output_w?.toLocaleString() || 0} W</span>
              </div>
              <div className="detail-item full-width">
                <span className="label">부하율</span>
                <div className="load-bar-container">
                  <div 
                    className="load-bar" 
                    style={{ 
                      width: `${data.load_percent || 0}%`,
                      background: (data.load_percent || 0) > 80 ? '#ef4444' : (data.load_percent || 0) > 50 ? '#f59e0b' : '#10b981'
                    }}
                  ></div>
                  <span className="load-value">{data.load_percent || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 시스템 정보 */}
      <div className="system-info">
        <div className="info-item">
          <span className="label">마지막 업데이트</span>
          <span className="value">{data.timestamp ? new Date(data.timestamp).toLocaleString('ko-KR') : '-'}</span>
        </div>
        <div className="info-item">
          <span className="label">연결 상태</span>
          <span className="value" style={{ color: getConnectionStatusColor() }}>{getConnectionStatusText()}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
