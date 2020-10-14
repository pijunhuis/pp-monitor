export default {
  init (cb) {
    let xhr = window.XMLHttpRequest;
    let oldOpen = xhr.prototype.open
    xhr.prototype.open = function (method, url, async, username, password) {
      this.info = {
        method, url, async, username, password
      }
      return oldOpen.apply(this, arguments)
    }
    let oldSend = xhr.prototype.send
    xhr.prototype.send = function(value) {
      let startTime = Date.now()
      let fn = (type) => () => {
        this.info.time = Date.now() - startTime;
        this.info.requestSize = value ? value.length : 0
        this.info.responseSize = this.responseText.length
        this.info.status = this.status
        this.info.type = type
        cb(this.info)
      }
      this.addEventListener('load', fn('load'), false)
      this.addEventListener('error', fn('error'), false)
      this.addEventListener('abort', fn('abort'), false)
      return oldSend.apply(this, arguments)
    }
    if(window.fetch) {
      let oldFetch = window.fetch
      window.fetch = function () {
        let startTime = Date.now()
        let args = [].slice.call(arguments)
        let fetchInput = args[0]
        let method = 'GET';
        let url = null;
        if(typeof fetchInput === 'string') {
          url = fetchInput;
        }else if ('Request' in window && fetchInput instanceof window.Request) {
          url = fetchInput.url;
          method = fetchInput.method ? fetchInput.method : method
        }else{
          url = '' + fetchInput;
        }
        let info = {
          method, url, status: null
        }
        return oldFetch.apply(this, args).then(function(response) {
          info.time = Date.now() - startTime;
          // info.requestSize = value ? value.length : 0
          // info.responseSize = response.responseText.length
          info.status = response.status
          info.type = 'fetch'
          cb(info)
          return response
        })
      }
    }
  }
} 