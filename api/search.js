const request = require('../utils/request')
exports.search = function (q) {
  return request({
    url: '/search',
    method: 'get',
    params: {
      q
    }
  })
}
