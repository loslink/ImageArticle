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

    for (let i = 0; i < 2; i++) {
      resultStr += "  第" + i + "篇美文文章：" + (await freshBlessArticle("tempBlessArticles", "blessArticles","精选祝福"))
      resultStr += "  第" + i + "篇美文文章：" + (await freshBlessArticle("tempBlessArticles", "blessArticles", "朋友祝福"))
      resultStr += "  第" + i + "篇美文文章：" + (await freshBlessArticle("tempBlessArticles", "blessArticles", "节日祝福"))
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

async function freshBlessArticle(fromTable, toTable, type) {
  var resultStr = ""
  try {
    const tempArticles = await db.collection(fromTable).limit(1).orderBy('_id', 'desc').where({
      type: type
    }).get()
    const _ = db.command

    if (tempArticles.data.length > 0) {
      const id = tempArticles.data[0]._id
      tempArticles.data[0]._id = _.inc(1) //这个貌似没用
      //增加创建时间
      tempArticles.data[0].createTime = db.serverDate()  

      //线上库是否有这个标题的文章
      const oldArticle = await db.collection(toTable).limit(1).where({
        title: tempArticles.data[0].title
      }).get()
      //线上库存在同标题文章
      if (oldArticle.data.length > 0 && (type == "精选祝福" || type == "节日祝福")){
        delete tempArticles.data[0]._id
        //更新该文章
        const updateResult=await db.collection(toTable).where({
          _id: oldArticle.data[0]._id
        }).update({
            data: tempArticles.data[0],
          })
        resultStr += updateResult+"更新成功,标题：" + tempArticles.data[0].title
      }else{
        //添加进线上库
        await db.collection(toTable).add({
          data: tempArticles.data[0]
        })
        resultStr += "添加成功,标题：" + tempArticles.data[0].title
      }
      
      //删除库存
      const result = await db.collection(fromTable).where({
        _id: id
      }).remove()

    } else {
      resultStr += "更新列表失败，备份列表为空，请添加数据，类型：" + type
    }

  } catch (e) {
    console.error(e)
    resultStr += "更新列表失败，备份列表为空，请添加数据，类型：" + type
  }

  return resultStr
}