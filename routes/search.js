
const express = require('express')
const router = express.Router()

const SearchController = require('../controller/search')
console.log(SearchController)
router.get('', SearchController.search)

module.exports = router
