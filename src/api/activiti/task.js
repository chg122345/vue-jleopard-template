import request from '@/utils/request'

/**
 * 激活/挂起流程
 */
export function suspend(params) {
  return request({
    url: `/activiti/task/${params.id}`,
    method: 'put',
    params
  })
}

/**
 * 审核
 */
export function audit(id, data) {
  return request({
    url: `/activiti/task/${id}`,
    method: 'post',
    data
  })
}
