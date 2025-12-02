import api from './axios';

// 실시간 에너지 데이터 조회
export const getLatestData = () => {
  return api.get('/energy/latest');
};

// 특정 사이트 데이터 조회
export const getSiteData = (siteId) => {
  return api.get(`/energy/site/${siteId}`);
};

// 히스토리 데이터 조회
export const getHistoryData = (siteId, startDate, endDate) => {
  return api.get(`/energy/history`, {
    params: { siteId, startDate, endDate }
  });
};

// 모든 사이트 목록 조회
export const getSites = () => {
  return api.get('/sites');
};
