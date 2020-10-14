import { perf, resource, xhr, errorCatch } from './sdk/index'
console.log(perf, resource, xhr, errorCatch)
// 对象转url
let formatObj = (data) => {
  let arr = []
  for(let key in data) {
    arr.push(`${key}=${data[key]}`)
  }
  return arr.join('&')
}


// 监控页面性能相关数据
// perf.init((data) => {
//   // 使用图片发送数据
//   new Image().src = '/p.gif?' + formatObj(data)
// })

// 监控页面静态资源的加载情况
// resource.init(data => {
//   console.log(data)
// })

// 监控数据请求
// xhr.init(data => {
//   console.log(data)
// })

// 监控用户行为
// errorCatch.init(data => {
//   console.log(data)
// })