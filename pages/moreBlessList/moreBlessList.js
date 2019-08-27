// pages/home/home.js
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('onLoad')
    context = this
    var type = options.type
    wx.setNavigationBarTitle({
      title: type
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

    
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMoreBlessArticles',
      data: {
        type: type
      },
      success: function (res) {
        console.log(res.result) // 3
        // var jingxuan = globalData.blessHomeJingxuanArticles.concat(res.result.jingxuan)
        // globalData.blessHomeJingxuanArticles = jingxuan
        var list = res.result
        var lRListJingxuan = []
        for (let i = 0; i < list.length / 2; i++) {
          lRListJingxuan.push({ left: list[i * 2], right: list[i * 2 + 1] })
        }

        // console.log(lRList) 
        context.setData({
          list: lRListJingxuan,
          hiddenLoad: true
        })

      },
      fail: console.error
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log('onUnload')
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
      path: 'pages/bless/bless', // 相对的路径
      imageUrl: globalData.homeSharePhoto,
      success: (res) => { // 成功后要做的事情
        // console.log(res.shareTickets[0])

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            // console.log(that.setData.isShow)
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
    if(id == null){
      return
    }
    var url
    url = '../blessDetail/blessDetail?id=' + id
    wx.navigateTo({
      url: url,
    })
  }
})