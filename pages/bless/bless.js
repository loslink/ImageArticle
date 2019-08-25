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
    // console.log('onLoad')
    context = this
    var result = calendarConverter.solar2lunar(new Date());
    // console.log(result);
    const date = result.sYear + "-" + result.sMonth + "-" + result.sDay
    const week = "星期" + result.week
    const luner = "农历" + result.lunarMonth + "月" + result.lunarDay
    this.setData({
      date: date,
      week: week,
      luner: luner,
      flowerBorders: util.flowerBorders,
    })

    db.collection('homeShere').get({
      success: function (res) {
        // console.log(res.data)
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


    wx.cloud.callFunction({
      // 云函数名称
      name: 'getHomeBlessArticles',
      success: function (res) {
        console.log(res.result) // 3
        var jingxuan = globalData.blessHomeJingxuanArticles.concat(res.result.jingxuan)
        globalData.blessHomeJingxuanArticles = jingxuan
        var lRListJingxuan = []
        for (let i = 0; i < jingxuan.length/2; i++) { 
          lRListJingxuan.push({ left: jingxuan[i * 2], right: jingxuan[i * 2+1] })
        }

        var jieri = res.result.jieri
        var lRListJieri = []
        for (let i = 0; i < jieri.length / 2; i++) {
          lRListJieri.push({ left: jieri[i * 2], right: jieri[i * 2 + 1] })
        }

        var friend = res.result.friend
        var lRListfriend = []
        for (let i = 0; i < friend.length / 2; i++) {
          lRListfriend.push({ left: friend[i * 2], right: friend[i * 2 + 1] })
        }

        var allList = globalData.allBlessList.concat(res.result.allList)
        globalData.allBlessList = allList
        
        // console.log(lRList) 
        context.setData({
          articleList: allList,
          blessHomeJingxuanArticles: lRListJingxuan,
          lRListJieri: lRListJieri,
          lRListfriend: lRListfriend,
          hiddenLoad: true
        })

        // var index = context.options.index
        // var type = context.options.type
        // var url
        // if (type === "81") {
        //   console.log("81")
        //   url = '../armyDay/armyDay?index=' + index
        // } else {
        //   console.log("normal")
        //   url = '../article/article?index=' + index
        // }
        // if (index) {
        //   wx.navigateTo({
        //     url: url,
        //   })
        // }
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
    var url
    url = '../blessDetail/blessDetail?id=' + id
    wx.navigateTo({
      url: url,
    })
  },
  moreTap(event) {
    var type = event.currentTarget.dataset['index'];
    var url
    url = '../moreBlessList/moreBlessList?type=' + type
    wx.navigateTo({
      url: url,
    })
  }
})