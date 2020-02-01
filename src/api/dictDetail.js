import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/dictDetail',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/sys/dictDetail/${data.id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/dictDetail/${id}`,
    method: 'delete',
  })
}
