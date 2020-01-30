import Layout from '@/layout'

const SystemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  meta: {title: '系统管理', icon: 'dashboard'},
  children: [
    {
      path: 'user',
      name: 'UserList',
      component: () => import('@/views/system/user/index'),
      meta: {title: '用户管理', icon: 'user'}
    },
    {
      path: 'dept',
      name: 'DeptList',
      component: () => import('@/views/system/dept/index'),
      meta: {title: '组织管理', icon: 'tree'}
    }
  ]
}

export default SystemRouter
