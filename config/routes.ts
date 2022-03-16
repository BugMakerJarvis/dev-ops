export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  {
    path: '/rbac',
    name: 'rbac',
    icon: 'UserOutlined',
    component: './Rbac',
  },
  {
    path: '/flow',
    name: 'flow',
    icon: 'BranchesOutlined',
    routes: [
      {
        path: '/flow/definition',
        name: 'definition',
        component: './flow/Definition',
      },
      {
        path: '/flow/flowdesigner',
        name: 'flowdesigner',
        component: './flow/FlowDesigner',
        hideInMenu: true,
      },
      {
        path: '/flow/form',
        name: 'form',
        component: './flow/Form',
      },
      {
        path: '/flow/formdesigner',
        name: 'formdesigner',
        component: './flow/FormDesigner',
        hideInMenu: true,
      },
      {
        path: '/flow/myprocess',
        name: 'myprocess',
        component: './flow/MyProcess',
      },
      {
        path: '/flow/finished',
        name: 'finished',
        component: './flow/Finished',
      },
      {
        path: '/flow/todo',
        name: 'todo',
        component: './flow/Todo',
      },
      {
        path: '/flow/taskrecord',
        name: 'taskrecord',
        component: './flow/HandleTask',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/table',
    name: 'table',
    icon: 'table',
    routes: [
      {
        path: '/table/maintain',
        name: 'maintain',
        component: './table/Maintain',
      },
      {
        path: '/table/demo',
        name: 'demo',
        component: './table/DTPageDemo',
      },
    ],
  },
  // {
  //   path: '/program',
  //   name: 'program',
  //   icon: 'BuildOutlined',
  //   component: './Program'
  // },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
