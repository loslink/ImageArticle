
var globalData = require('../../data/globalData.js');
var ccFile = require('../../utils/calendar-converter.js')
var calendarConverter = new ccFile.CalendarConverter();
var util = require("../../utils/util.js")
wx.cloud.init()
const db = wx.cloud.database()
// const articles = db.collection('articles').orderBy('_id', 'desc')
var context
var pageNum = 0
var pageSize = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "人生日历",
    articleList: {},
    date: "",
    week: "",
    luner: "",
    hiddenLoad: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().mtj.trackEvent('article_tab_ent');
    var id = options.id
    var url
    url = '../article/article?id=' + id
    if (id) {
      wx.navigateTo({
        url: url,
      })
    }

    context = this
    var result = calendarConverter.solar2lunar(new Date());
    console.log(result);
    const date = result.sYear + "-" + result.sMonth + "-" + result.sDay
    const week = "星期" + result.week
    const luner = "农历" + result.lunarMonth + "月" + result.lunarDay
    this.setData({
      date: date,
      week: week,
      luner: luner,
      flowerBorders: util.flowerBorders,
    })



    wx.cloud.callFunction({
      // 云函数名称
      name: 'getHomeList',
      // name: 'getHomeListTest',
      success: function (res) {
        // console.log(res.result.data) // 3
        var list = globalData.list.concat(res.result.data)
        globalData.list = list
        context.setData({
          articleList: list,
          hiddenLoad: true
        })

      },
      fail: console.error
    })

    // this.getArticles(0, pageSize)

    db.collection('homeShere').get({
      success: function (res) {
        console.log(res.data)
        globalData.homeShareTitle = res.data[0].shareTitle
        globalData.homeSharePhoto = res.data[0].sharePhoto
        globalData.headBg = res.data[0].headBg
        context.setData({
          title: res.data[0].title,
          headBg: globalData.headBg
        })
      }
    })


    buttonAnim()
    const that = this
    function buttonAnim() {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      var next = true;
      //连续动画关键步骤
      setInterval(function () {
        if (next) {
          animation.scale(0.85).step()
          next = !next;
        } else {
          animation.scale(1).step()
          next = !next;
        }
        that.setData({
          animationButton: animation.export()
        })
      }.bind(this), 500)
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('beauty onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('beauty onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('beauty onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    // this.getArticles(pageNum * pageSize, pageSize)
  },
  getArticles: function (skip, limit) {
    articles
      .skip(skip) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(limit) // 限制返回数量为 10 条
      .get()
      .then(res => {
        pageNum = pageNum + 1
        // console.log(res.data)
        var list = globalData.list.concat(res.data)
        globalData.list = list
        context.setData({
          articleList: list,
          hiddenLoad: true
        })
      })
      .catch(err => {
        console.error(err)
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    let that = this;
    return {
      title: globalData.homeShareTitle, // 转发后 所显示的title
      path: 'pages/home/home', // 相对的路径
      imageUrl: globalData.homeSharePhoto,
      success: (res) => { // 成功后要做的事情
        console.log(res.shareTickets[0])

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  itemTap(event) {
    var id = event.currentTarget.dataset['index'];
    var url
    url = '../article/article?id=' + id
    wx.navigateTo({
      url: url,
    })
  }
})