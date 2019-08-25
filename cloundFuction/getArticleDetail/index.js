// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var article = null
  var msg
  try {
    article = await db.collection(event.tableName).where({
      _id: event.id
    }).get()
    msg = "获取成功"
  } catch (e) {
    msg = e
  }

  var first = null
  if (article != null && article.data.length>0){
    first = article.data[0]
  }
  
  var data = {
    data: first,
    msg: msg
  }
  return data
}