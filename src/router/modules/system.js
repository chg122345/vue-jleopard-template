import Layout from '@/layout'

const SystemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  children: [{
    path: 'user',
    name: 'UserList',
    component: () => import('@/views/system/user/index'),
    meta: {title: '用户管理', icon: 'dashboard'}
  }]
}

export default SystemRouter
