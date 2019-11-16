export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: 'login',
            icon: 'smile',
            path: '/user/login',
            component: './user/login',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/dashboard',
            name: 'dashboard',
            icon: 'dashboard',
            routes: [
              {
                name: 'analysis',
                icon: 'smile',
                path: '/dashboard/analysis',
                component: './dashboard/analysis',
              },
            ],
          },
          {
            name: 'account',
            icon: 'user',
            path: '/account',
            hideInMenu: true,
            routes: [
              {
                name: 'settings',
                icon: 'smile',
                path: '/account/settings',
                component: './account/settings',
              },
            ],
          },
          {
            name: 'orders',
            icon: 'table',
            path: '/orders',
            routes: [
              {
                name: 'list',
                icon: 'profile',
                path: '/orders/list',
                component: './orders/list',
              },
            ]
          },
          {
            name: 'shop',
            icon: 'shopping',
            path: '/shop',
            routes: [
              {
                name: 'shops',
                icon: 'profile',
                path: '/shop/shops/list',
                component: './shop/shops/list',
              },
              {
                name: 'prices',
                icon: 'profile',
                path: '/shop/prices/list',
                component: './shop/prices/list',
              },
              {
                hideInMenu: true,
                name: 'shopdetail',
                icon: 'read',
                path: '/shop/shops/detail',
                component: './shop/shops/detail',
              },
              {
                hideInMenu: true,
                name: 'pricedetail',
                icon: 'read',
                path: '/shop/prices/detail',
                component: './shop/prices/detail',
              },

              {
                name: 'category',
                icon: 'profile',
                path: '/shop/category/list',
                component: './shop/category/list',
              },
            ],
          },
          {
            path: '/',
            redirect: '/dashboard/analysis',
            authority: ['admin', 'user'],
          },
          {
            component: '404',
          },
        ],
      },
    ],
  },
];
