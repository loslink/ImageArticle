// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const allList = await listArticle(event.type)

  // data.data.reverse()
  return allList
}


async function listArticle(type) {
  const articles = db.collection('blessArticles')
  // 先取出集合记录总数
  const countResult = await articles.count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = articles.skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({ type: type }).get()
    tasks.push(promise)
  }
  // 等待所有
  var data
  var msg
  data = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data).reverse()
    }
  })
  data.data.reverse()

  return data.data
}