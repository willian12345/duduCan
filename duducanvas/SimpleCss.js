import DisplayObject from './DisplayObject.js'
import { draw } from './config'
import Shape from './Shape.js'

const extendsClassDraw = Symbol('extendsClassDraw')

function getChangedBorderRadiusValue(value){
	let borderRadiusValue
  const roundCorner = { tl: 0, tr: 0, br: 0, bl: 0 }
	value = String(value).split(' ').map(v => parseFloat(v))
	const valueLength = value.length
	if(valueLength === 1){
		borderRadiusValue = value[0]
	}else if(valueLength === 2){
		roundCorner.tl = roundCorner.br = value[0]
		roundCorner.tr = roundCorner.bl = value[1]
		borderRadiusValue = roundCorner
	}else if(valueLength === 3){
		roundCorner.tl = value[0]
		roundCorner.br = value[2]
		roundCorner.tr = roundCorner.bl = value[1]
		borderRadiusValue = roundCorner
	}else if(valueLength === 4){
		roundCorner.tl = value[0]
		roundCorner.tr = value[1]
		roundCorner.br = value[3]
		roundCorner.bl = value[4]
		borderRadiusValue = roundCorner
	}
	return borderRadiusValue
}

// 仅支持二种风格的边框
const BORDER_STYLES = ['solid', 'dashed']

/**
 * SimpleCss 
 * 样式类
 */
export default class SimpleCss extends DisplayObject {
	backgroundColor = ''
	border = ''
	borderTop = ''
	borderRight = ''
	borderBottom = ''
	borderLeft = ''
  borderRadiusValue = ''
	/**
	 * 1、borderRadius值设置请参与 css3 的 border-radius 属性;
	 * eg1: 10
	 * eg2: '10 20'
	 * eg3: '10 20 10'
	 * eg4: '10, 20, 30, 40'
	 * 
	 * 2、borderRadius设置为 '100%'，则认为是圆形遮罩
	 * eg: '100%'
	 */
	get borderRadius(){
		return this.borderRadiusValue
	}
	set borderRadius(value){
		if(!value) return
		if(value != '100%'){
			this.borderRadiusValue = getChangedBorderRadiusValue(value)
		}else{
			this.borderRadiusValue = value
		}
  }
  constructor(){
    super()
    this[extendsClassDraw] = super[draw]
  }
  [draw](ctx){
    // 如果设置了 borderRadius 值则需要使用遮罩实现圆角
		if(this.borderRadiusValue){
			this.initBorderRadiusMask()
    }

    if(this.backgroundColor){
      this.initBackgroundColor()
		}

		if(this.border || this.borderTop || this.borderRight || this.borderBottom || this.borderLeft){
			this.initBorder()
		}
    
		// 如果有遮罩，只能使用 圆形，矩形，圆角矩形
		if(this.mask){
			if(this.mask.name === 'Shape'){
				// 遮罩层不参与显示所以也没有父级元素
        this.mask.masked = this
        this.mask[draw](ctx, true)
			}
    }
    // 重载 DisplayObject draw 
    this[extendsClassDraw](ctx)
	}
	getBorderAttr(border){
		let [ borderWidth, borderStyle, borderColor] = border.split(' ')
		borderWidth = parseFloat(borderWidth)
		if(BORDER_STYLES.indexOf(borderStyle) < 0){
			console.warn('不支持的边框样式')
		}
		
		return [ borderWidth, borderStyle, borderColor ]
	}
	setBorderStyles(borderWidth, borderStyle, borderColor){
		this.graphics.beginPath()
		if(borderStyle === 'dashed'){
			this.graphics.setLineDash([borderWidth,borderWidth])
		}
		// 边框都是向内画
		this.graphics.lineWidth(borderWidth)
		.strokeStyle(borderColor)
	}
	initBorder(){
		// 四边都有边框
		if(this.border){
			const [ borderWidth, borderStyle, borderColor ] = this.getBorderAttr(this.border)
			this.setBorderStyles(borderWidth, borderStyle, borderColor)
			const halfBorderWidth = borderWidth * .5
			// 如果有圆角属性，则需要画圆角边框
			if(this.borderRadius){
				this.graphics.strokeRoundRect(halfBorderWidth, halfBorderWidth, this.width - borderWidth, this.height - borderWidth, this.borderRadius)
			}else{
				this.graphics.strokeRect(halfBorderWidth, halfBorderWidth, this.width - borderWidth, this.height - borderWidth)
			}
		} else {
			if(this.borderTop){
				this.setBorderStyles(...this.getBorderAttr(this.borderTop))
				this.graphics.moveTo(0, 0)
				.lineTo(this.width, 0)
				.stroke()
			}else if(this.borderRight){
				this.setBorderStyles(...this.getBorderAttr(this.borderRight))
				this.graphics.moveTo(this.width, 0)
				.lineTo(this.width, this.height)
				.stroke()
			}else if(this.borderBottom){
				this.setBorderStyles(...this.getBorderAttr(this.borderBottom))
				this.graphics.moveTo(0, this.height)
				.lineTo(this.width, this.height)
				.stroke()
			}else if(this.borderLeft){
				this.setBorderStyles(...this.getBorderAttr(this.borderLeft))
				this.graphics.moveTo(0, 0)
				.lineTo(0, this.height)
				.stroke()
			}
		}
	}
	/**
	 * borderRadius 
	 * 为图像元素添加遮罩以实现圆角
	 */
	initBorderRadiusMask(){
		const s = new Shape()
		if(this.borderRadiusValue === '100%'){
			s.graphics.fillCircle(this.width * .5,  this.height * .5, this.width * .5)
		}else{
			s.graphics.fillRoundRect(0, 0, this.width, this.height, this.borderRadiusValue)
    }
		this.mask = s
  }
  initBackgroundColor(){
    this.graphics.beginPath()
    .fillStyle(this.backgroundColor)
    .fillRect(0, 0, this.width, this.height)
  }
}