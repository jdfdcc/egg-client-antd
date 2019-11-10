import request from '@/utils/request';

export async function queryList(params) {
  return request('/api/common/getList', {
    data: params,
    method: 'post',
  });
}

export async function save(params) {
  return request('/api/common/save', {
    data: params,
    method: 'post',
  });
}

export async function queryOne(params) {
  return request('/api/common/queryOne', {
    data: params,
    method: 'post',
  });
}
