import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/job',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/sys/job/${data.id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/job/${id}`,
    method: 'delete',
  })
}
