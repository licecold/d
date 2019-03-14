
const { search: SearchOpendota } = require('../../api/search')
const BaseError = require('../../prototype/bussinessError')

class SearchController {
  constructor () {
    this.search = this.search.bind(this)
  }

  async search (req, res, next) {
    try {
      const q = req.query.q
      if (!q) throw new BaseError(400, '参数不能为空')
      const data = await SearchOpendota(q)
      res.json({
        code: 200,
        data,
        message: 'success'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new SearchController()
