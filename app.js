const express = require('express')
const app = express()

const router = require('./routes')
// const cookieParser = require('cookie-parser')

app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers
  const allowOrigin = origin || Origin || referer || Referer || '*'
  res.header('Access-Control-Allow-Origin', allowOrigin)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) // 可以带cookies
  res.header('X-Powered-By', 'Express')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

router(app)

app.use((error, req, res, next) => {
  if (error) {
    res.json({ message: error.message, code: error.code })
  }
})

app.listen(3101, () => {
  console.log('app listening on 3101')
})
