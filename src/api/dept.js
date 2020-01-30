import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/dept',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/sys/dept/${data.id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/dept/${id}`,
    method: 'delete',
  })
}
