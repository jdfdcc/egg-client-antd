import { queryList, save, queryOne } from '@/services/common';

const CommonModel = {
  namespace: 'common',
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

    /**
     * 公共接口 保存活着更新谁
     * @param {*} _
     * @param {*} param1
     */
    *save({ payload, success, fail }, { call }) {
      const data = yield call(save, payload);
      if (data) {
        success && success(data);
      } else {
        fail && fail();
      }
    },

    /**
     * 公共接口 保存活着更新谁
     * @param {*} _
     * @param {*} param1
     */
    *queryOne({ payload, success, fail }, { call }) {
      const data = yield call(queryOne, payload);
      if (data) {
        success && success(data);
      } else {
        fail && fail();
      }
    },
  },
  reducers: {},
};

export default CommonModel;
