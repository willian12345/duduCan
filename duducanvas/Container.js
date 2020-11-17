import DisplayObject from './DisplayObject.js'
import SimpleCss from './SimpleCss.js'
import { draw, drawGraphics } from './config'

const _width = Symbol('width')
const _height = Symbol('height')
const _alignItems = Symbol('_alignItems')
const _justifyContent = Symbol('_justifyContent')
const _direction = Symbol('_direction')
const _flex = Symbol('_flex')
const extendsClassDraw = Symbol('extendsClassDraw')

/**
 * Container 
 * 拥有 Flex 布局功能的容器，可往容器内添加子元素
 * 实例属性
 * direction 子元素排列方向，可使用的值: [row, row-reverse, column, column-reverse]
 * jusifyContent 子元素水平对齐方式，可使用的值: [flex-start, center, flex-end, space-between, space-around]
 * alignItems 子元素垂直对齐方式，可使用的值: [flex-start, center, flex-end]
 */
export default class Container extends SimpleCss{
	name = 'Container'
	constructor(context){
		super()
		this[extendsClassDraw] = super[draw]
		this.direction = 'row'
		this.justifyContent = 'center'
		this.alignItems = 'center'
	}
	set width(v){
		this[_width] = v
	}
	get width(){
		return this[_width]
	}
	set height(v){
		this[_height] = v
	}
	get height(){
		return this[_height]
	}
	get flex(){
		return this[_flex]
	}
	set flex(v){
		this[_flex] = v
	}
	// 排列方向
	get direction(){
		return this[_direction]
	}
	set direction(v){
		this[_direction] = v
	}
	// 垂直对齐
	get alignItems(){
		return this[_alignItems]
	}
	set alignItems(v){
		this[_alignItems] = v
	}
	// 水平对齐
	get justifyContent(){
		return this[_justifyContent]
	}
	set justifyContent(v){
		this[_justifyContent] = v
	}
	getChildsWidth(){
		let childsWidth = 0
		this.childs.forEach((v) => childsWidth += v.width)
		return childsWidth
	}
	getChildsHeight(){
		let childsHeight = 0
		this.childs.forEach((v) => childsHeight += v.height)
		return childsHeight
	}
	getBetweenGapWidth(parentWidth){
		const childsWidth = this.getChildsWidth()
		return (parentWidth - childsWidth) / (this.childs.length - 1)
	}
	getBetweenGapHeight(parentHeight){
		const childsHeight = this.getChildsHeight()
		return (parentHeight - childsHeight) / (this.childs.length - 1)
	}
	getAroundGapWidth(parentWidth){
		const childsWidth = this.getChildsWidth()
		return (parentWidth - childsWidth) / (this.childs.length)
	}
	getAroundGapHeight(parentHeight){
		const childsHeight = this.getChildsHeight()
		return (parentHeight - childsHeight) / (this.childs.length)
	}
	setRow(){
		this.setJustifyContent()
		this.setAlignItems()
	}
	setRowReverse(){
		// 水平翻转
		this.setJustifyContent(true)
		this.setAlignItems()
	}
	setAlignItems(){
		const childs = this.childs
		const parentHeight = this.height
		if(this.alignItems === 'center'){
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				child.y += parentHeight * .5 - (child.height * .5)
			}
		}else if(this.alignItems === 'flex-start'){
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				child.y = 0
			}
		}else if(this.alignItems === 'flex-end'){
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				child.y += parentHeight - child.height
			}
		}
		// align-self
		childs.forEach((v)=>{
			if(v.alignSelf === 'flex-start'){
				v.y = 0
			}else if(v.alignSelf === 'center'){
				v.y = parentHeight * .5 - (v.height * .5)
			}else if(v.alignSelf === 'flex-end'){
				v.y = parentHeight - v.height
			}
		})
	}
	setJustifyContent(isReverse){
		const parentWidth = this.width
		let childs = this.childs
		let justifyContent = this.justifyContent
		if(isReverse){
			childs = this.childs.reverse()
			if(justifyContent === 'flex-start'){
				justifyContent = 'flex-end'
			}else if(justifyContent === 'flex-end'){
				justifyContent = 'flex-start'
			}
		}

		if(justifyContent === 'flex-start'){
			for (let index = 0; index < childs.length; index++) {
				const child = childs[index];
				if(index > 0){
					child.x += childs[index-1].x + childs[index-1].width
				}else{
					child.x = 0
				}
			}
		}else if(justifyContent === 'flex-end'){
			const childsWidth = this.getChildsWidth()
			for (let index = 0; index < childs.length; index++) {
				const child = childs[index];
				if(index > 0){
					child.x += childs[index-1].x + childs[index-1].width
				}else{
					// x 轴起点是总宽度-子元素总宽度
					child.x += parentWidth - childsWidth
				}
			}
		}else if(justifyContent === 'center'){
			const childsWidth = this.getChildsWidth()
			for (let index = 0; index < childs.length; index++) {
				const child = childs[index];
				if(index > 0){
					child.x += childs[index-1].x + childs[index-1].width
				}else{
					// x 轴起点是总宽度-子元素总宽度的一半
					child.x += ((parentWidth - childsWidth) * .5)
				}
			}
		}else if(justifyContent === 'space-between'){
			// 水平中间间隔相等，两端无间隔
			const betweenGapWidth = this.getBetweenGapWidth(parentWidth)
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				if(index > 0){
					child.x += childs[index-1].x + childs[index-1].width + betweenGapWidth
				}else{
					child.x += 0
				}
			}
		}else if(justifyContent === 'space-around'){
			// 水平中间间隔相等，两端间隔是中间间隔的一半
			const aroundGapWidth = this.getAroundGapWidth(parentWidth)
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				if(index > 0){
					child.x += childs[index-1].x + childs[index-1].width + aroundGapWidth
				}else{
					// x 轴起点是单个间隔的一半
					child.x += aroundGapWidth * .5
				}
			}
		}
	}
	setJustifyContentForColumn(isReverse){
		const parentHeight = this.height
		let childs = this.childs
		let justifyContent = this.justifyContent
		if(isReverse){
			childs = this.childs.reverse()
			if(justifyContent === 'flex-start'){
				justifyContent = 'flex-end'
			}else if(justifyContent === 'flex-end'){
				justifyContent = 'flex-start'
			}
		}

		if(justifyContent === 'flex-start'){
			for (let index = 0; index < childs.length; index++) {
				const child = childs[index];
				if(index > 0){
					child.y += childs[index-1].y + childs[index-1].height
				}else{
					child.y += 0
				}
			}
		}else if(justifyContent === 'flex-end'){
			const childsHeight = this.getChildsHeight()
			for (let index = 0; index < childs.length; index++) {
				const child = childs[index];
				if(index > 0){
					child.y += childs[index-1].y + childs[index-1].height
				}else{
					// y 轴起点是总宽度-子元素总宽度
					child.y += parentHeight - childsHeight
				}
			}
		}else if(justifyContent === 'center'){
			const childsHeight = this.getChildsHeight()
			for (let index = 0; index < childs.length; index++) {
				const child = childs[index];
				if(index > 0){
					child.y += childs[index-1].y + childs[index-1].height
				}else{
					// y 轴起点是总宽度-子元素总宽度的一半
					child.y = ((parentHeight - childsHeight) * .5)
				}
			}
		}else if(justifyContent === 'space-between'){
			// 水平中间间隔相等，两端无间隔
			const betweenGapHeight = this.getBetweenGapHeight(parentHeight)
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				if(index > 0){
					child.y += childs[index-1].y + childs[index-1].height + betweenGapHeight
				}else{
					child.y += 0
				}
			}
		}else if(justifyContent === 'space-around'){
			// 水平中间间隔相等，两端间隔是中间间隔的一半
			const aroundGapHeight = this.getAroundGapHeight(parentHeight)
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				if(index > 0){
					child.y += childs[index-1].y + childs[index-1].height + aroundGapHeight
				}else{
					// x 轴起点是单个间隔的一半
					child.y += aroundGapHeight * .5
				}
			}
		}
	}
	setAlignItemsByColumn(){
		const childs = this.childs
		const parentWidth = this.width
		if(this.alignItems === 'center'){
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				child.x += parentWidth * .5 - (child.width * .5)
			}
		}else if(this.alignItems === 'flex-start'){
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				child.x = 0
			}
		}else if(this.alignItems === 'flex-end'){
			for (let index = 0, l = childs.length; index < l; index++) {
				const child = childs[index];
				child.x += parentWidth - child.width
			}
		}
		// align-self
		childs.forEach((v)=>{
			if(v.alignSelf === 'flex-start'){
				v.x = 0
			}else if(v.alignSelf === 'center'){
				v.x = parentWidth * .5 - (v.width * .5)
			}else if(v.alignSelf === 'flex-end'){
				v.x = parentWidth - v.width
			}
		})
	}
	setColumn(){
		this.setJustifyContentForColumn()
		this.setAlignItemsByColumn()
	}
	setColumnReverse(){
		this.setJustifyContentForColumn(true)
		this.setAlignItemsByColumn()
	}
	[draw](ctx){
		if(this.direction === 'row'){
			this.setRow()
		}else if(this.direction === 'row-reverse'){
			this.setRowReverse()
		}else if(this.direction === 'column'){
			this.setColumn()
		}else if(this.direction === 'column-reverse'){
			this.setColumnReverse()
		}
		// 所有位置计算完后再调用 extends class 的 draw 绘制
		// 因为 Container 本身不需要绘制渲染
		this[extendsClassDraw](ctx)
	}
}

 