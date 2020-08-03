const path = require('path')
const multer = require('multer')
const express = require('express')

const DEBUG = true

function resolvePath (file) {
  return path.resolve(__dirname, file)
}

const multerInstance = multer({
  storage: multer.diskStorage({
    destination: resolvePath('./upload'),
    filename: function (req, file, callback) {
      let error = null
      DEBUG && console.log('file information: ', file)
      if (!file) {
        error = new Error('未检测到文件存在!!')
        error.status = 400
      }
      callback(error, file.originalname)
    }
  })
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', function getIndexHtml (req, res, next) {
  res.sendFile(resolvePath('index.html'))
})

app.post('/files', multerInstance.any(), function filesUpload (req, res, next) {
  DEBUG & console.log('In /files path -> req.files: ', req.files)
  
  if (!req.files.length) {
    const error = new Error('未检测到文件存在!!')
    error.status = 400
    return next(error)
  }
  res.json({
    code: 200,
    data: {
      message: '数据上传成功'
    }
  })
})

app.use(function handleError (error, req, res, next) {
  res.status(error.status || 500)
  res.json({
    code: error.status || 500,
    error: {
      message: `${error.status} | ${error.message}`
    }
  })
})

app.listen(3000, function serverListener () {
  console.log('服务器启动成功，请访问: http://localhost:3000')
})