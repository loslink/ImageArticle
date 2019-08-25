var screenW = 0;
var screenH = 0;
var image
wx.getSystemInfo({
  success: (res) => {
    screenW = res.screenWidth
    screenH = res.screenHeight
  },
})
class Snow {
  constructor() {
    this.canvas = {}
    this.snow = []
    this.init()
  }

  init() {
    this.canvas = wx.createCanvasContext("myCanvas", this)
    this.generateSnow()
  }

  //随机生成雪花半径
  rand(num) {
    return Math.floor(Math.random() * num + 1)
  }
  //雪花飘落速度
  getRanNum(n, m) {
    return Math.floor(Math.random() * (m - n) + n);
  }
  //生成雪花
  generateSnow() {
    setInterval(() => {
      let snows = {
        r: this.rand(10),        //雪花半径
        x: this.rand(screenW),   //雪花坐标位置
        y: 0,
        speedx: this.getRanNum(-5, 5),  //雪花飘落速度
        speedy: this.getRanNum(10, 20)
      }
      this.snow.push(snows)
    }, 200)
  }

  //判断字符是否为空的方法
 isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}
  //绘制雪花
  drawSnow() {
    let canvas = this.canvas
    let snow = this.snow
    canvas.clearRect(0, 0, screenW, screenH)
    // console.log(this.snow.length)
    for (let i = 0; i < snow.length; i++) {
      snow[i].x += snow[i].speedx
      snow[i].y += snow[i].speedy
      //超出屏幕高度时移除雪花
      if (snow[i].y > screenH) {
        this.snow.splice(i, 1)
      }

      if (this.isEmpty(image)){
      canvas.beginPath()
      let snowColor = canvas.createCircularGradient(snow[i].x, snow[i].y, snow[i].r)
      snowColor.addColorStop(0, "rgba(255,255,255,1)")
      snowColor.addColorStop(1, "rgba(255,255,255,0.2)")
      canvas.setFillStyle(snowColor)
      canvas.arc(snow[i].x, snow[i].y, snow[i].r, 0, 2 * Math.PI)
      canvas.fill()
      }else{
        canvas.drawImage(image, snow[i].x, snow[i].y, snow[i].r * 2, snow[i].r * 2)
      }
      
    }
    canvas.draw()
  
  }

}

function play(img) {
  image = img
  let snow = new Snow()
  var timer = setInterval(() => {
    snow.drawSnow()
  }, 100)
}

// export { play }
module.exports = {
  play: play
}