import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete',
  })
}
