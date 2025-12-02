import api from './axios';

// 전체 직원 목록 조회
export const getEmployees = () => {
  return api.get('/employees');
};

// 직원 상세 조회
export const getEmployeeById = (id) => {
  return api.get(`/employees/${id}`);
};

// 직원 등록
export const createEmployee = (employeeData) => {
  return api.post('/employees', employeeData);
};

// 직원 정보 수정
export const updateEmployee = (id, employeeData) => {
  return api.put(`/employees/${id}`, employeeData);
};

// 직원 삭제
export const deleteEmployee = (id) => {
  return api.delete(`/employees/${id}`);
};

// 부서별 직원 조회
export const getEmployeesByDepartment = (departmentId) => {
  return api.get(`/employees/department/${departmentId}`);
};
