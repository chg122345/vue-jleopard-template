import request from '@/utils/request'

export function login(params) {
  params['grant_type'] = 'password'
  return request({
    headers: {'Authorization': 'Basic amxlb3BhcmQ6MTIzNDU2'},
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
