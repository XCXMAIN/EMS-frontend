import api from './axios';

// 전체 부서 목록 조회
export const getDepartments = () => {
  return api.get('/departments');
};

// 부서 상세 조회
export const getDepartmentById = (id) => {
  return api.get(`/departments/${id}`);
};

// 부서 등록
export const createDepartment = (departmentData) => {
  return api.post('/departments', departmentData);
};

// 부서 정보 수정
export const updateDepartment = (id, departmentData) => {
  return api.put(`/departments/${id}`, departmentData);
};

// 부서 삭제
export const deleteDepartment = (id) => {
  return api.delete(`/departments/${id}`);
};
