/**
 *  
 * 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。
 * load 页面所有资源全部加载完毕
    navigationStart: 1602568503297 => 前一个网页卸载的时间 默认值：fetchStart
    unloadEventStart: 1602568503334 => 前一个网页关掉的事件结束 默认值：0
    unloadEventEnd: 1602568503334 => 前一个网页关掉的事件开始 默认值：0
    redirectStart: 0 => 重定向开始时间 默认值：0 需同域
    redirectEnd: 0 => 重定向结束时间 默认值：0 需同域

    fetchStart: 1602568503298 => 开始请求网页
    domainLookupStart: 1602568503308 => DNS查询开始 默认值：fetchStart
    domainLookupEnd: 1602568503308 => DNS查询结束 默认值：fetchStart
    connectStart: 1602568503308 => 向服务器建立握手开始 默认值：fetchStart
    connectEnd: 1602568503308 => 向服务器建立握手结束 默认值：fetchStart
    secureConnectionStart: 0 => 安全握手开始 默认值：0 非https的没有
    requestStart: 1602568503308 => 向服务器发送请求开始
    responseStart: 1602568503319 => 服务器返回数据结束
    responseEnd: 1602568503332 => 服务器返回数据开始

    domLoading: 1602568503336 => 解析dom开始 document.readyState 为 interactive
    domInteractive: 1602568503521 => 解析dom结束 document.readyState 为 loading
    domContentLoadedEventStart: 1602568503521 => ContentLoaded开始
    domContentLoadedEventEnd: 1602568503522 => ContentLoaded结束
    domComplete: 1602568503643 => 文档解析完成
    loadEventStart: 1602568503643 => load 事件发送前
    loadEventEnd: 1602568503644 => load 事件发送后
    
 */

// 页面性能监控
let processData = (obj) => {
  let info = {
    prevPage: obj.fetchStart - obj.navigationStart,     // 上个页面卸载时间
    redirect: obj.redirectEnd - obj.redirectStart,      // 重定向的时长
    dns: obj.domainLookupEnd - obj.domainLookupStart,   // dns 解析时间
    connect: obj.connectEnd - obj.connectStart,         // tcp 链接时长
    // 从请求到响应时长
    send: obj.responseEnd - obj.requestStart,           // 请求结束到响应结束时长
    ttfb: obj.responseStart - obj.navigationStart,      // 首字节接收到到的时长
    domReady: obj.domInteractive - obj.domLoading,      // dom 准备时间
    whiteScreen: obj.domLoading - obj.navigationStart,  // 白屏时间
    dom: obj.domComplete - obj.domLoading,              // dom解析时长
    load: obj.loadEventEnd - obj.loadEventStart,        // load执行时间
    total: obj.loadEventEnd - obj.navigationStart       // 总时间
  }
  return info
}

let load = (cb) => {
  let timer;
  let checkLoad = () => {
    if(performance.timing.loadEventEnd){
      clearTimeout(timer)
      cb()
    }else{
      timer = setTimeout(checkLoad, 100)
    }
  }
  window.addEventListener('load', checkLoad, false)
}
let domReady = (cb) => {
  let timer;
  let checkLoad = () => {
    if(performance.timing.loadEventEnd){
      clearTimeout(timer)
      cb()
    }else{
      timer = setTimeout(checkLoad, 100)
    }
  }
  window.addEventListener('DOMContentLoaded', checkLoad, false)
}
export default {
  init: (cb) => {
    // dom加载完成统计一次，可能用户在没有加载完成就关闭页面
    // domReady(() => {
    //   let perData = window.performance.timing;
    //   let data = processData(perData)
    //   data.type = 'domReady'
    //   cb(data);
    // })
    // 一面加载完成统计一次
    load(() => {
      let perData = window.performance.timing;
      let data = processData(perData)
      data.type = 'loaded'
      cb(data);
    })
  }
}