import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete',
  })
}

/**
 * 给角色赋权限
 * @param params
 * @returns {AxiosPromise}
 */
export function setPermission(params) {
  return request({
    url: `/sys/role/setPermission`,
    method: 'post',
    params
  })
}

