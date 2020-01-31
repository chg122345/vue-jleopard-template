import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/menu',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/sys/menu/${data.id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/menu/${id}`,
    method: 'delete',
  })
}
