
var snow = require('../../utils/Snow.js');
var fallingObj = require('../../utils/FallingObj.js');
var util = require("../../utils/util.js")
var globalData = require("../../data/globalData.js")
const app = getApp()
var id
var article
var innerAudioContext
var isPlay = false
var context

const W = wx.getSystemInfoSync().windowWidth;
const H = wx.getSystemInfoSync().windowHeight;

wx.cloud.init()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    animationButton: {},
    hiddenLoad: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    article = null
    context = this
    this.setData({
      musicHide: globalData.musicHide
    })
    var image = "../../image/float_star.png"
    fallingObj.play("")
    wx.setNavigationBarTitle({
      title: '文章详情'
    })
    id = options.id
    var week = util.currentDateWeek()
    console.log("id:" + id + week.time + week.week)

    wx.cloud.callFunction({
      // 云函数名称
      name: 'getArticleDetail',
      data:{
        id:id,
        tableName: "blessArticles"
      },
      success: function (res) {
        console.log(res.result) // 3
        article = res.result.data
        getApp().mtj.trackEvent('article_list_click', {
          article_name: article.title,
        });
        var bottomText="";
        if (article.type == "节日祝福"){
          bottomText = "祝您" + article.title.replace("祝福", "快乐");
        }else{
          bottomText = "祝您天天快乐";
        }
        context.setData({
          detailData: article,
          colors: util.colors,
          date: week.time,
          week: week.week,
          headPhoto: headPhoto,
          bottomText: bottomText,
          hiddenLoad: true,
          animationData: {}
        })
        context.playMusic()
      },
      fail: console.error
    })
    
    var headPhoto
    const timeType = util.currentTimeType()
    if (timeType == 0) {
      headPhoto = "https://img.wowoqq.com/allimg/150327/1-15032F05541.gif"
    } else if (timeType == 1) {
      headPhoto = "https://img.wowoqq.com/allimg/170527/1-1F52H24G4-52.gif"
    } else {//晚上
      headPhoto = "https://tu.jiuwa.net/pic/20180202/1517580151249109.gif"
    }
    


    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    })
    this.animation = animation
    this.setData({
      animationData: animation.export()
    })
    var n = 0;
    isPlay = true
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      if (isPlay) {
        n = n + 1;
        // console.log(n);
        this.animation.rotate(10 * (n)).step()
        this.setData({
          animationData: this.animation.export()
        })
      }

    }.bind(this), 200)

    this.getUser2()

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
    this.setData({
      canvasHeight: H
    })
    this.playMusic()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
    isPlay = false
    innerAudioContext.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
    innerAudioContext.stop()
    innerAudioContext = null
    isPlay = false
    fallingObj.release()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    var cover = ""
    if (article.shareUrl == null){
      cover = article.coverUrl
    }else{
      cover = article.shareUrl
    }
    return {
      title: article.shareText, // 转发后 所显示的title
      path: 'pages/bless/bless?id=' + id, // 绝对的路径
      imageUrl: cover,
      success: (res) => {    // 成功后要做的事情
        console.log(res.shareTickets[0])
        if (!res.shareTickets) {
          //分享到个人
          getApp().mtj.trackEvent('share_friend_click', {
            article_name: article.title,
          });
        } else {
          //分享到群
          getApp().mtj.trackEvent('share_group_click', {
            article_name: article.title,
          });
        }
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getUser2: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }

  , musicTap(event) {
    if (isPlay) {
      isPlay = false
      innerAudioContext.pause()
    } else {
      isPlay = true
      innerAudioContext.play()
    }

  }

  ,
  playMusic() {
    if (article == null || article == "undefined" || globalData.musicHide) {
      return
    }
    if (innerAudioContext == null) {
      // 音频播放
      innerAudioContext = wx.createInnerAudioContext()
      
    }
    innerAudioContext.autoplay = true
    innerAudioContext.src = article.music
    isPlay = true
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })

    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
})