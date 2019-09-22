// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// const MAX_LIMIT = 10
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // const articles = db.collection('articles').orderBy('_id', 'desc')
  const articles = db.collection('articles')
  // 先取出集合记录总数
  const countResult = await articles.count()
  const total = countResult.total
  // 计算需分几次取
  var batchTimes = Math.ceil(total / 100)
  // batchTimes = 1
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = articles.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  // return (await Promise.all(tasks)).reduce((acc, cur) => {
  //   return {
  //     data: acc.data.concat(cur.data).reverse(),
  //     errMsg: acc.errMsg,
  //   }
  // })
  var data
  var msg
  data=(await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data).reverse(),
      errMsg: acc.errMsg,
    }
  })
  data.data.reverse()
  return data
}