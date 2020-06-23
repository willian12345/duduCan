//index.js
//获取应用实例
const app = getApp()

import DuduCanvas from '../../libs/DuduCanvas.js'

Page({
  data: {
    motto: 'Hello World',
  },
  onLoad: function () {
    let t = DuduCanvas.load([{
        id: 'avatar',
        src: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK4ZVUCL6zw7Uia4gIG7bLrll0sD6AA96b8mzDd42UyoMYaxdl6icOOFQ6vTWeW3rU9ynB1q5uvnibcg/132'
      },{
        id: 'health',
        src: '/image/health-bad.png'
      },{
        id: 'btn1',
        src: '/image/btn1.png'
      },{
        id: 'btn',
        src: '/image/btn.png'
      }
    ])
    .done( loader => {
      DuduCanvas.Stage('myCanvas', (stage, ctx) => {
        // const container = DuduCanvas.Container()
        // container.x = 120
        // container.y = 120
        // container.rotation = 90
        // container.regX = 60
        // container.regY = 60
        const shape = DuduCanvas.Shape()
        shape.graphics.fillStyle('red')
        // shape.graphics.fillCircle(60, 60, 180)
        shape.graphics.fillRoundRect(10, 20, 100, 100, 8, true, false)
        // shape.rotation = 30


        const img = DuduCanvas.Image({
          image: loader.get('health'),
          sx: 0,
          sy: 0, 
          sWidth: 72, 
          sHeight: 72,
          dx: 0, 
          dy: 0, 
          dWidth: 120,
          dHeight: 120
        })
        img.mask = shape
        img.regX = 60
        img.regY = 60
        img.y = 0
        img.x = 0
        img.rotation = 180
        
        // x y regX regY 初始都为 0，需要手动更改
        // const muliShape = DuduCanvas.Shape()
        // muliShape.graphics
        // .fillStyle('red')
        // .fillRect(10, 110, 100, 50)
        // .fillStyle('yellow')
        // .fillCircle(10, 180, 30, 40)
        // .fillStyle('green')
        // .fillRect(10, 220, 40, 20)
        // stage.addChild(muliShape)
        stage.addChild(img)

        // let sprite = DuduCanvas.Sprite(loader.get('btn1'))
        // sprite.setSlice(30, 33, 30, 33)
        // sprite.width = 346
        // sprite.height = 185
        // sprite.scaleX = .5
        // sprite.scaleY = .5
        // sprite.x = 200
        // sprite.y = 200
        // sprite.rotation = 45

        // const t0 = DuduCanvas.Text({font: 'italic 18px sans-serif'})
        // .fillStyle('green')
        // .fillText('余杭区')
        // t0.x = 100
        // t0.rotation = 45
        // sprite.addChild(t0)
        // stage.addChild(sprite)
        
        
        // const t1 = DuduCanvas.Text({
        //   font: 'italic 18px sans-serif',
        //   text: '你好因s你而美丽阑珊春意秋意浓常用要地人地要w-寺s ff'
        // })
        // .setWrapWidth(100)
        // t1.color = 'red'
        // t1.x = 100
        // t1.y = 100
        // stage.addChild(t1)

        stage.render()
        // setInterval(()=>{
        //   rect.rotation +=1
        //   stage.render()
        // }, 600)
        
      }, this)
    })
    
  }
})
