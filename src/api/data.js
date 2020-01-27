import request from '@/utils/request'

/**
 * 拉取列表数据
 * @param url
 * @param params
 * @param method
 */
export function initData(url, params, method = 'get') {
  return request({
    url: url,
    method: method,
    params: params
  })
}
