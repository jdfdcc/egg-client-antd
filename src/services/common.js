import request from '@/utils/request';

export async function queryList(params) {
  return request('/api/common/getList', {
    data: params,
    method: 'post',
  });
}
