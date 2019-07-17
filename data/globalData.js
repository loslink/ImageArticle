//文章列表，每一个大括号代表一篇文章，coverUrl（封面），photo（正文图片GIF）
var listArticle = [
  {
    title: "文章1标题文章1标题文章1标题文章1标题文章1标题文章1标题文章1标题文章1标题文章1标题",
    coverUrl: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2594287337,3052279307&fm=26&gp=0.jpg",
    music:"https://cdn.caomall.net/15290437711272352156.mp3",
    contents: [{
        photo: "http://img1.ph.126.net/-sYQu45u3d_RVMYO93PnLQ==/593912200860713038.gif",
      msg: ["这里是正文", "正文啊", "正文啊3"]
      },
      {
        photo: "http://img1.ph.126.net/-sYQu45u3d_RVMYO93PnLQ==/593912200860713038.gif",
        msg: ["这里是正文2", "正文啊2"]
      }
    ]
  },
  {
    title: "文章2标题",
    coverUrl: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2594287337,3052279307&fm=26&gp=0.jpg",
    music: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46",
    contents: [{
        photo: "http://img1.ph.126.net/-sYQu45u3d_RVMYO93PnLQ==/593912200860713038.gif",
        msg: ["这里是正文", "正文啊"]
      },
      {
        photo: "http://img1.ph.126.net/-sYQu45u3d_RVMYO93PnLQ==/593912200860713038.gif",
        msg: ["这里是正文2", "正文啊2"]
      }
    ]
  },
  {
    title: "文章3标题",
    coverUrl: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2594287337,3052279307&fm=26&gp=0.jpg",
    music: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46",
    contents: [{
      photo: "http://img1.ph.126.net/-sYQu45u3d_RVMYO93PnLQ==/593912200860713038.gif",
      msg: ["这里是正文", "正文啊"]
    },
    {
      photo: "http://img1.ph.126.net/-sYQu45u3d_RVMYO93PnLQ==/593912200860713038.gif",
      msg: ["这里是正文2", "正文啊2"]
    }
    ]
  }
]

module.exports = {
  list: listArticle
}
