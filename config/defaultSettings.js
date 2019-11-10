let rootUrl = 'http://127.0.0.1:8989';

// const getCookie = function (name) {
//   if (document) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return parts.pop().split(';').shift();
//     }
//   }
//   return 0;
// };

if (document && document.cookie === 'PRO'){
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
