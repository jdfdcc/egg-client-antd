import axios from 'axios';
import { notification, Modal } from 'antd';
import router from 'umi/router';
// create an axios instance
const service = axios.create({
  baseURL: 'https://jerome.chaobenxueyuan.com',
  // baseURL: 'http://127.0.0.1:8989',
  withCredentials: true,
  timeout: 5000,
});

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

service.interceptors.request.use(
  config => {
    console.log(config);
    if (config.method === 'get' && typeof config.data === 'object') {
      let { url } = config;
      const { data } = config;
      url += '?';
      for (const key in data) {
        url += `${key}=${data[key]}&`;
      }
      config.url = url;
    }

    return config;
  },
  error => Promise.reject(error),
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (+res.code !== 0) {
      if (+res.code === 50008) {
        Modal.error({
          title: '你的登录已失效，请重新登录',
          okText: '重新登录',
          onOk: () => {
            router.push('/user/login');
          },
        });
      } else {
        notification.error({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000,
        });
      }
      return Promise.reject(false);
    }
    return res.data;
  },
  error => {
    const errorText = codeMessage[error.status] || error.statusText;
    const { status, url } = error;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
    return Promise.reject(error);
  },
);

export default service;
