import Group from './Group.js'
import Image from './Image.js'
import type {ImageTexture} from './ImgLoader'

// const rotation = Symbol('rotation')
/**
 * Sprite 雪碧类
 * 用于显示九宫格类型的图片
 */
export type TBound = { left: number, top: number, right: number, bottom: number }
export default class Sprite extends Group{	
	name = 'Sprite'
	img!: ImageTexture
  sliced = false
  _sliceBounds: TBound = { left: 0, top: 0, right: 0, bottom: 0 }
  _left = 0
  _top = 0
  _right = 0
  _bottom = 0
  wRatio = 1
  hRatio = 1

  // 伸缩后的宽、高
  enableWidth = 0
  enableHeight = 0

	get sliceBounds(){
		return this._sliceBounds
	}
	set sliceBounds(bounds){
    // const { left, top, right, bottom } = bounds
		this._setSlice(bounds)
		this._sliceBounds = bounds
	}
	/**
	 * 
	 * @param {*} img Image 对象
	 * @param {*} sliceBound 九宫格图 {left: 0, top: 0, right: 0, bottom: 0}
	 */
	constructor(img: ImageTexture, sliceBound?: TBound){
		super()
		if(img){
			this.img = img	
    }
    //@ts-ignore
		this.parentDraw = super._draw
		if(sliceBound){
			this._setSlice(sliceBound)
		}
	}
	// get rotation(){
	// 	return this[rotation]
	// }
	// set rotation(r){
	// 	if(this.sliced){
	// 		throw new Error('Sprite 因为旋转后会出现拼接缝隙，在九宫格状态下暂时无法旋转, 待小程序完全支持离屏渲染后修复')
	// 	}else{
	// 		this[rotation] = r
	// 	}
	// }
	protected _draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D){
		const [x, y] = this.getPosition()
		
		this.wRatio = this.width / this.img.width
		this.hRatio = this.height / this.img.height

		// 伸缩后的宽、高
		this.enableWidth = (this.width - this._left - this._right) * this.scaleX
		this.enableHeight = (this.height - this._top - this._bottom) * this.scaleY

		// 执行所有命令
		this._instructions.forEach((instruction) => {
			instruction.exec(ctx, this)
		})
		if(this.sliced){
			// sprite 九宫格不允许使用 boxShadow
			this._drawSliced(ctx, x, y, this._getAlpha())
		}else{
			this._drawImage(ctx, x, y)
		}
		
		// 绘制子元素
		this.childs.forEach( v =>{
      //@ts-ignore
			v._draw(ctx)
		})
		
	}
	private _drawImage(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, x: number, y: number){
    const yoyo = this.img.image
		const img = new Image({
			image: yoyo,
			dx: x,
			dy: y,
			dWidth: this.width,
			dHeight: this.height
		})
    img.draw(ctx)
    console.log(img, yoyo)
	}
	// 绘制九宫格图像
	private _drawSliced(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, x: number, y: number, alpha: number){
		// 计算九宫格每块位置信息
		// 上左
		const ltParams = {
			image: this.img.image,
			sx: 0,
			sy: 0,
			sWidth: this._left,
			sHeight: this._top,
			dWidth: this._left * this.scaleX,
			dHeight: this._top * this.scaleY,
			dx: x,
			dy: y,
		}
		
		// 上中
		const tParams = {
			image: this.img.image,
			sx: this._left,
			sy: 0,
			sWidth: this.img.width - this._right - this._left,
			sHeight: this._top,
			dWidth: this.enableWidth,
			dHeight: this._top * this.scaleY,
			dx: ((this._left * this.scaleX) + x),
			dy: y,
		}

		// 上右
		const rtParams = {
			image: this.img.image,
			sx: this.img.width - this._right,
			sy: 0,
			sWidth: this._right,
			sHeight: this._top,
			dWidth: this._right * this.scaleX,
			dHeight: this._top * this.scaleY,
			dx: (this._left * this.scaleX) + tParams.dWidth + x,
			dy: y,
		}

		// 右中
		const rParams = {
			image: this.img.image,
			sx: this.img.width - this._right,
			sy: this._top,
			sWidth: this._right,
			sHeight: this.img.height - this._bottom - this._top,
			dWidth: this._right * this.scaleX,
			dHeight: this.enableHeight,
			dx: rtParams.dx,
			dy: rtParams.dy + (this._top * this.scaleY),
		}


		// 右下
		const rbParams = {
			image: this.img.image,
			sx: this.img.width - this._right,
			sy: this.img.height - this._bottom,
			sWidth: this._right,
			sHeight: this._bottom,
			dWidth: this._right * this.scaleX,
			dHeight: this._bottom  * this.scaleY,
			dx: rtParams.dx - .3,
			dy: rParams.dy + rParams.dHeight,
		}

		// 下中
		const bParams = {
			image: this.img.image,
			sx: this._left,
			sy: this.img.height - this._bottom,
			sWidth: this.img.width - this._left - this._right,
			sHeight: this._bottom,
			dWidth: this.enableWidth,
			dHeight: this._bottom * this.scaleY,
			dx: tParams.dx,
			dy: rParams.dy + rParams.dHeight,
		}

		// 左下
		const lbParams = {
			image: this.img.image,
			sx: 0,
			sy: this.img.height - this._bottom,
			sWidth: this._left,
			sHeight: this._bottom,
			dWidth: this._left * this.scaleX,
			dHeight: this._bottom  * this.scaleX,
			dx: ltParams.dx,
			dy: rParams.dy + rParams.dHeight,
		}
		// 左中
		const lParams = {
			image: this.img.image,
			sx: 0,
			sy: this._top,
			sWidth: this._left,
			sHeight: this.img.height - this._top - this._bottom,
			dWidth: this._left * this.scaleX,
			dHeight: this.enableHeight,
			dx: ltParams.dx,
			dy: rParams.dy,
		}

		// 中间 
		const cParams = {
			image: this.img.image,
			sx: ltParams.sWidth,
			sy: ltParams.sHeight,
			sWidth: tParams.sWidth,
			sHeight: lParams.sHeight,
			dWidth: this.enableWidth,
			dHeight: this.enableHeight,
			dx: ltParams.dx + ltParams.dWidth,
			dy: ltParams.dy + ltParams.dHeight,
		}
		const peices = [ltParams, tParams, rtParams, rParams, rbParams, bParams, lbParams, lParams, cParams]
		// 用离屏渲染成整张图再绘制到主canvas中解决接触缝隙问题以及性能问题
		// const offScreen = wx.createOffscreenCanvas(375, 375)
		// var offScreenCtx = offScreen.getContext("2d")		
		if(this.rotation != 0){
			console.error('Sprite 因为旋转后会出现拼接缝隙，在九宫格状态下暂时无法旋转, 待小程序完全支持离屏渲染后修复')
    }
		peices.forEach( v => {
			const i = new Image(v)
      i.alpha = alpha
			i.draw(ctx)
		})

		return this
	}
	/**
	 * 供内部调用的九宫格边界
	 * @param {*} sliceBound: {left: 0, top: 0, right: 0, bottom: 0}
	 */
	private _setSlice(sliceBound: TBound){
		this.sliced = true
		this._left = sliceBound.left
		this._top = sliceBound.top
		this._right = sliceBound.right
		this._bottom = sliceBound.bottom
		return this
	}
}

 