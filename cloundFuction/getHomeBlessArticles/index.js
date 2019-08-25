// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {

  const articles = db.collection('blessArticles')
  const jingxuan = await articles.limit(4).where({ type: "精选祝福" }).get()
  const jieri = await articles.limit(2).where({ type: "节日祝福" }).get()
  const friend = await articles.limit(2).where({ type: "朋友祝福" }).get()

  const allList = await allArticle()
  
  var data = {
    allList: allList,
    jingxuan: jingxuan.data.reverse(),
    jieri: jieri.data.reverse(),
    friend: friend.data.reverse()
  }
  // data.data.reverse()
  return data
}



async function allArticle() {
  const articles = db.collection('blessArticles')
  // 先取出集合记录总数
  const countResult = await articles.count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = articles.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
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