import request from '@/utils/request';

export function queryList(params) {
  return request('/api/order/queryList', {
    data: params,
    method: 'post',
  });
}
