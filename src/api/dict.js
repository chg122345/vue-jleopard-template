import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/dict',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/sys/dict/${data.id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/dict/${id}`,
    method: 'delete',
  })
}
