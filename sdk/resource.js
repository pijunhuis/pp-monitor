let serializeData = (item) => {
  let info = {
    name: item.name,
    initiatorType: item.initiatorType,
    duration: item.duration,
    // 链接过程
    redirect: item.redirectEnd - item.redirectStart, // 重定向
    dns: item.domainLookupEnd - item.domainLookupStart, // dns查找
    connect: item.connectEnd - item.connectStart, // TCP链接
    network: item.connectEnd - item.startTime,  // 网络总耗时
    // 接收过程
    send: item.responseStart - item.requestStart, // 发送开始到接收的总时长
    receive: item.responseEnd - item.responseStart, // 接收的总时长
    request: item.responseEnd - item.requestStart,  // 请求到接收的总耗时
    // 核心指数
    ttfb: item.responseStart - item.requestStart  // 首字节时间
  }
  return info
}
export default {
  init: (cb) => {
    // 获取资源相关的信息
    // 获取资源相关信息，可以就收一个发送一个
    if(window.PerformanceObserver){
      let observer = new PerformanceObserver(list => {
        let data = list.getEntries();
        cb(serializeData(data[0]))
      })
      observer.observe({entryTypes: ['resource']})
    } else {
      window.onload = function () {
        let resourceData = performance.getEntriesByType('resource')
        let data = resourceData.map(item => serializeData(item))
        cb(data)
      }
    }
    
  }
}