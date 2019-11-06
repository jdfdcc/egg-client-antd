import request from '@/utils/request';

export async function queryCurrent() {
  return request('/api/client/user/info');
}
export async function queryProvince() {
  return request('/api/geographic/province');
}
export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}
export async function query() {
  return request('/api/users');
}
