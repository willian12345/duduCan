## Duducanvas 小程序海报生成基础库
version alpha 1.0.0
##### todoList
- [x] flex
- [ ] inline-flex
- [x] align-items
- [x] justify-content
- [ ] align-self
- [x] flex-direction

#### 快速开始

##### 页面内添加 canvas 标签
```
  <canvas id="myCanvas" canvas-id="myCanvas" style="width: 375px; height: 800px"></canvas>
```
##### 添加图片
```
  // 从 duducanvas 引入使用到的类
  import { ImgLoader, Stage, Image} from '../../duducanvas/index.js'
  
  // 如果有图片先加载图片
  new ImgLoader([{
        id: 'avatar',
        src: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK4ZVUCL6zw7Uia4gIG7bLrll0sD6AA96b8mzDd42UyoMYaxdl6icOOFQ6vTWeW3rU9ynB1q5uvnibcg/132'
      }
  ])
  .then((loader) => {
    // 通过页面中的 id 新建 Stage 舞台, 所有可视对象 (DisplayObject) 都将绘制在舞台
    new Stage('#myCanvas', stage => {
      // 添加图片，
      const avatar = new Image({
        image: loader.get('avatar'),
        width: 100, 
        height: 100,
      })
      // 将头像变成圆形
      avatar.borderRadius = '100%'
      
      // 添加至舞台
      stage.addChild(img)
    }, this)
  })
```

##### 添加文本
```
import { Stage, Text } from '../../duducanvas/index.js'
new Stage('#myCanvas', stage => {
  const t1 = new Text()
  t1.text = '你好世界Hello'
  t1.color = 'red'
  t1.x = 100
  t1.y = 300
  // 添加至舞台
  stage.addChild(t1)
})
```

##### 添加形状
```
  const shape = new Shape()
  shape.graphics.fillStyle('green')
  shape.graphics.fillCircle(160, 160, 40)
  stage.addChild(shape)
```
##### Shape内可以画多个图形形状
```
  const muliShape = new Shape()
  muliShape.graphics
  .fillStyle('red')
  .fillRect(10, 110, 100, 50)
  .fillStyle('yellow')
  .fillCircle(10, 180, 30, 40)
  .fillStyle('green')
  .fillRect(10, 220, 40, 20)
  stage.addChild(muliShape)
```

##### 获取 context 直接操作 canvas 
###### 如果封装的 api 无法满足业务需求，可直接操作 context 手动绘制
```
  new Stage('#myCanvas', (stage, context) => {
    context.fillStyle = 'blue'
    context.fillRect(50, 100, 100, 100)
  })
```

##### 重新渲染舞台
###### ***异步添加的元素***，需要手动调用 stage.update 方法
```
  // 重新渲染舞台
  stage.update()
```


#### 类
- ImgLoader
- Stage
- DisplayObject
- Group
- Image
- Shape
- Sprite
- Text

#### 注意事项
- Shape 类没有没有自动计算 width 与 height 属性，如有需要可自行主动设置
- Group 类没有自动计算 width 与 height 属性，可通过实例方法 getBound 获取 {left, top, right, bottom}



### 小程序 canvas 海报生成注意事项
- 网络图片必须先通过 getImageInfo 下载后才能绘制
- 微信头像需要下载后上传至自己的服务器绘制，直接使用微信服务器上的头像绘制时某些 Android 机型上会下载超时导致绘制失败
- canvas page页面下不能嵌在Component组件内，否则某些机型会导致绘制失败
- canvas 不能像h5中的canvas那样通过style来缩小，所以为了生成海报不模糊必须将 canvas 至少设置放大两倍，然后将canvas通过 css position 负值移到屏幕外，绘制后可以直接通过image标签来实现预览



#### 资料参考
- 小程序 canvas 开发文档 https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html
- 小程序开发工具 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- canvas 参考手册  https://www.w3school.com.cn/tags/html_ref_canvas.asp
- canvas API https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API