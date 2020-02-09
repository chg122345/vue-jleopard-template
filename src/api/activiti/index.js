import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/activiti/model',
    method: 'post',
    params: data
  })
}

export function edit(data) {
  return request({
    url: `/activiti/model/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 发布模型
 * @param id
 */
export function deploy(id) {
  return request({
    url: `/activiti/model/deploy/${id}`,
    method: 'post',
  })
}

export function del(id) {
  return request({
    url: `/activiti/model/${id}`,
    method: 'delete',
  })
}
