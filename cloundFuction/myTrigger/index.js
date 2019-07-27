// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const tempArticles = await db.collection('tempArticles').limit(1).get()
    const _ = db.command
    var resultStr
    if (tempArticles.data.length > 0) {
      // var data = JSON.stringify(tempArticles.data);
      const id = tempArticles.data[0]._id
      tempArticles.data[0]._id=_.inc(1)
      await db.collection('articles').add({
        data: tempArticles.data[0]
      })
      const result = await db.collection('tempArticles').where({
        _id: id
      }).remove()

      resultStr = "更新列表成功,标题：" + tempArticles.data[0].title
    }else{
      resultStr = "更新列表失败，备份列表为空，请添加数据"
    }

    return {
      event,
      msg: resultStr
    }
  } catch (e) {
    console.error(e)
  }

}