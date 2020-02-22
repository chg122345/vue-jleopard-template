import request from '@/utils/request'

/**
 * 激活/挂起流程
 */
export function suspend(params) {
  return request({
    url: `/activiti/process/${params.id}`,
    method: 'put',
    params
  })
}

export function del(deployId) {
  return request({
    url: `/activiti/process/${deployId}`,
    method: 'delete',
  })
}
