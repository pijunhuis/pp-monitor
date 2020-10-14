export default {
  init(cb) {
    // window.addEventListener('error', fn, true) 捕获图片错误
    // promise 失败了不能通过onerror捕获
    window.onerror = function(message, source, lineno, colno, error) {
      console.log(error)
      let info = {
        message: error.message,
        name: error.name
      }
      let stack = error.stack
      let matchUrl = stack.match(/(http|https):\/\/[^\n]*/)[0]
      info.fileName = matchUrl.match(/(http|https):\/\/(?:\S*)\.js/)[0]
      let [,row, column] = matchUrl.match(/:(\d+):(\d+)/)
      info.row = row
      info.column = column
      console.log(matchUrl, info.fileName)
      cb(info)
    }
  }
}