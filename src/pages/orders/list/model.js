import { queryList } from './service';

const OrderModel = {
  namespace: 'order',
  state: {
    collapsed: false,
    notices: [],
  },
  effects: {
    /**
     * 公共查询获取列表数据接口
     * @param {*} _
     * @param {*} param1
     */
    *getList({ payload, success, fail }, { call }) {
      const data = yield call(queryList, payload);
      if (data) {
        success && success(data);
      } else {
        fail && fail();
      }
    },
  },
  reducers: {},
};

export default OrderModel;
