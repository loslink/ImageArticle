// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    
    var resultStr = ""
    for(let i=0;i<2;i++){
      resultStr += "  第" + i + "篇美文文章：" + (await freshArticle("tempArticles", "articles"))
    }

    return {
      event,
      msg: resultStr
    }
  } catch (e) {
    console.error(e)
  }

}

async function freshArticle(fromTable, toTable){
  var resultStr = ""
  // var fromTable = "tempArticles"
  // var toTable = "articles"
  // var toTable = "testArticles"
  try {
    const tempArticles = await db.collection(fromTable).limit(1).get()
    const _ = db.command
    
    if (tempArticles.data.length > 0) {
      // var data = JSON.stringify(tempArticles.data);
      const id = tempArticles.data[0]._id
      tempArticles.data[0]._id = _.inc(1)
      tempArticles.data[0].createTime = db.serverDate()  //增加创建时间
      await db.collection(toTable).add({
        data: tempArticles.data[0]
      })
      const result = await db.collection(fromTable).where({
        _id: id
      }).remove()

      resultStr = "更新列表成功,标题：" + tempArticles.data[0].title
    } else {
      resultStr = "更新列表失败，备份列表为空，请添加数据"
    }

  } catch (e) {
    console.error(e)
    resultStr = "更新列表失败，备份列表为空，请添加数据"
  }

  return resultStr
}