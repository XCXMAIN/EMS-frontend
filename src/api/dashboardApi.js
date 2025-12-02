import api from './axios';

// 최신 데이터 1개 조회
export const getLatestData = () => {
  return api.get('/dashboard/latest');
};

// 그래프용 최근 N개 데이터 조회
export const getRecentData = (limit = 50) => {
  return api.get(`/dashboard/recent?limit=${limit}`);
};

// 기간별 데이터 조회
export const getHistoryData = (start, end) => {
  return api.get(`/dashboard/history?start=${start}&end=${end}`);
};

// 통계 데이터 조회
export const getStatsData = (limit = 100) => {
  return api.get(`/dashboard/stats?limit=${limit}`);
};

// 서버 상태 확인
export const getServerStatus = () => {
  return api.get('/dashboard/status');
};

// WebSocket URL
export const WS_URL = import.meta.env.VITE_WS_URL || 'wss://ems-backend-e79r.onrender.com/';
