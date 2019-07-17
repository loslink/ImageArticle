// pages/home/home.js
var articleList = require('../../data/globalData.js');
var ccFile = require('../../utils/calendar-converter.js')
var calendarConverter = new ccFile.CalendarConverter();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: articleList.list,
    date:"",
    week:"",
    luner:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var result=calendarConverter.solar2lunar(new Date());
    // console.log(result);
    const date = result.sYear + "-" + result.sMonth + "-" + result.sDay
    const week = "星期" +result.week
    const luner = "农历" + result.lunarMonth + "月" + result.lunarMonth
    this.setData({
      date: date,
      week: week,
      luner: luner
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  itemTap(event){
    var index = event.currentTarget.dataset['index'];
    // console.log('itemTap' + index)
    wx.navigateTo({
      url: '../article/article?index='+index,
    })
  }
})