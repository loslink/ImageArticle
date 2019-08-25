const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTime2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return year + "年" + month + "月" + day + "日";
}


function currentTimeType() {
  var date=new Date()
  var hour = date.getHours()
  var type=0
  if (hour > 6 && hour <= 12){//早上
    type = 0
  } else if (hour > 12 && hour <= 18){//下午
    type = 1
  }else{//晚上
    type = 2
  }
  return type;
}

function currentDateWeek() {
  let dateObj = {};
  let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let date = new Date();
  let day = date.getDay();
  let yearDate = date.getFullYear();
  // let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  // let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  let month = date.getMonth() + 1;
  let dayFormate = date.getDate();
  // dateObj.time = yearDate + '年' + month + '月' + dayFormate + "日";
  dateObj.time =  month + '月' + dayFormate + "日";
  dateObj.week = show_day[day];
  return dateObj;
}

// const colors = ["#323232"]
const colors = ["#ffffff"]
// const colors = ["#d42b2b","#2bd46c"]
const flowerBorders = [
"https://img.zcool.cn/community/01aef55d3c29c1a80120695c17760b.png@1280w_1l_2o_100sh.png",
"https://img.zcool.cn/community/0120b85d3c29c1a8012187f4d517c9.png@1280w_1l_2o_100sh.png",
"https://img.zcool.cn/community/0170065d3c29c1a8012187f43c0edb.png@1280w_1l_2o_100sh.png"]

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  currentDateWeek: currentDateWeek,
  colors:colors,
  currentTimeType: currentTimeType,
  flowerBorders: flowerBorders
}