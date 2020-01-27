import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/sys/login',
    method: 'post',
    params: params
  })
}
export function logout(token) {
  return request({
    url: '/logoutToken',
    method: 'get',
    params: { token }
  })
}

export function getInfo(params) {
  return request({
    url: 'api/user/info',
    method: 'get',
    params
  })
}
