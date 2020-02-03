import request from '@/utils/request'

export function del(id) {
  return request({
    url: `/monitor/log/${id}`,
    method: 'delete',
  })
}

/**
 * 批量删除 传以ids 数组
 * @param ids
 */
export function deleteBach(ids) {
  return request({
    url: `/monitor/log/delBach`,
    method: 'delete',
    params: {ids}
  })
}

/**
 * 删除所有 传日志类型
 * @param type
 */
export function deleteAll(type) {
  return request({
    url: `/monitor/log/deleteAll`,
    method: 'delete',
    params: {type}
  })
}
