let rootUrl = 'http://127.0.0.1:8989';
if (process.env.DEPLOY_ENV === 'PRO'){
  rootUrl = 'https://jerome.chaobenxueyuan.com';
}
export default {
  navTheme: 'dark',
  primaryColor: '#1890FF',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: true,
  menu: {
    locale: true,
  },
  title: 'Jerome System',
  pwa: false,
  iconfontUrl: '',
  rootUrl,
};
