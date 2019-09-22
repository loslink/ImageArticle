
var globalData = require('../../data/globalData.js');
var ccFile = require('../../utils/calendar-converter.js')
var calendarConverter = new ccFile.CalendarConverter();
var util = require("../../utils/util.js")
wx.cloud.init()
const db = wx.cloud.database()

var context
var pageNum = 0
var pageSize = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: {},
    hiddenLoad: false,

  },

  /**
   * 生命周期函数--监听页面加载 z
   */
  onLoad: function (options) {
    context = this
    getApp().mtj.trackEvent('yangsheng_tab_ent');
    var id = options.id
    var url
    url = '../healthDetail/healthDetail?id=' + id
    if (id) {
      wx.navigateTo({
        url: url,
      })
    }

    wx.cloud.callFunction({
      // 云函数名称
      name: 'getHealthList',
      success: function (res) {
        // console.log(res.result.data) // 
        var list = res.result.data
        // globalData.list = list
        context.setData({
          articleList: list,
          hiddenLoad: true
        })

        var index = context.options.index
        var type = context.options.type
        var url
        if (type === "81") {
          console.log("81")
          url = '../armyDay/armyDay?index=' + index
        } else {
          console.log("normal")
          url = '../article/article?index=' + index
        }
        if (index) {
          wx.navigateTo({
            url: url,
          })
        }
      },
      fail: function(){
        console.error 
        context.setData({
          hiddenLoad: true
        })
      }
    })

    db.collection('homeShere').get({
      success: function (res) {
        console.log(res.data)
        globalData.homeShareTitle = res.data[0].shareTitle
        globalData.homeSharePhoto = res.data[0].sharePhoto
        globalData.headBg = res.data[0].headBg
        globalData.musicHide = res.data[0].musicHide
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    url = '../healthDetail/healthDetail?id=' + id
    wx.navigateTo({
      url: url,
    })
  }
})