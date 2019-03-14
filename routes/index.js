
const api = require('../constant/api.js').api
module.exports = app => {
  for (let index = 0; index < api.length; index++) {
    const n = api[index]
    app.use(`/${n}`, require(`./${n}`))
  }
}
