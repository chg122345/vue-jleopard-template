import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/monitor/task',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/monitor/task`,
    method: 'patch',
    data
  })
}

export function editPause(id) {
  return request({
    url: `/monitor/task/${id}`,
    method: 'put'
  })
}

export function del(id) {
  return request({
    url: `/monitor/task/${id}`,
    method: 'delete',
  })
}

/**
 * 批量删除 传以ids 数组
 * @param ids
 */
export function deleteBach(ids) {
  return request({
    url: `/monitor/task/delBach`,
    method: 'delete',
    params: {ids}
  })
}

/**
 * 执行定时任务
 * @param id
 */
export function exec(id) {
  return request({
    url: `/monitor/task/exec/${id}`,
    method: 'put'
  })
}

