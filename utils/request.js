const axios = require('axios')
const qs = require('querystring')
const { openDota } = require('../constant/apiPrefix')
const BaseError = require('../prototype/bussinessError')

const reg = /http|https/

const service = axios.create({
  timeout: 35000
})
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['Content-Type'] = 'application/x-www-fromurlencodeed'
  let url = config.url
  if (!reg.test(url)) {
    config.url = openDota + url
  }
  if (config.data) {
    config.data = qs.stringify(config.data)
  }
  // if (store.getters.token) {
  //   config.headers['token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  // }
  console.log(config)
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    return response.data
  },
  () => {
    // return Promise.reject(error)
    throw new BaseError(500, 'openDota请求错误')
  })

module.exports = service
