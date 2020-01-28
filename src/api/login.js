import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: params
  })
}

export function getInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get',
  })
}
