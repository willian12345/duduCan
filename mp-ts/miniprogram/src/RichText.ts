/**
 * 文本类
 */
import DisplayObject, { TContext2d } from './DisplayObject'
import Text from './Text'

// const ROTATE_90DEG = 1.5707963267948966
/**
 * RichText 文本类
 * 显示文本，支持横、竖排文字，换行
 */
export type TTextParams = { text?: string, font?: string, color?: string, fontSize?: number, fontFamily?: string, fontStretch?: string, fontVariant?: string, fontStyle?: string, fontWeight?: string | number, letterSpace?: number };


export type TElementListItem = {
  value: string;
  style: {
    width: number;
    height: number;
    ascent: number;
    descent: number;
  };
}
export type TRow = {
  width: number,
  height: number,
  originHeight: number,
  elementList: TElementListItem[]
}

export default class RichText extends Text {
  name = 'RichText'
  protected _wrapHeight = -1
  protected _wrapWidth = -1
  protected _writeMode: 'vertical-lr' | 'vertical-rl' | '' = ''
  protected _lineGap = 0;
  protected _letterSpace = 0;
  private _lineHeight = 1.5
  rows: TRow[] = []
  color = '#000'
  get width(): number {
    this._computeSize();
    return this._width;
  }
  get height(): number {
    this._computeSize();
    return this._height;
  }
  set height(v: number) {
    this._height = v;
  }
  constructor(t?: TTextParams) {
    super(t);
  }
  getWidth() {
    const ctx = DisplayObject.getContext()
    // 测宽度前必须先设置字体大小
    ctx.font = this.font
    let w = ctx.measureText(this._text).width
    return w;
  }
  // 凑成 font 减写
  // font: font-stretch font-variant font-style font-weight font-size font-family
  getComposedFont() {
    return `${this._fontStretch} ${this._fontVariant} ${this._fontStyle} ${this._fontWeight} ${this._fontSize}px ${this._fontFamily}`.trim();
  }
  get text() {
    return this._text
  }
  set text(t) {
    t = String(t)
    this._text = t
    this._width = this.getWidth();
    // console.log(this._width)
  }
  get lineGap() {
    return this._lineGap
  }
  set lineGap(h) {
    this._lineGap = h
  }
  get letterSpace() {
    return this._letterSpace
  }
  set letterSpace(v: number) {
    this._letterSpace = v
  }
  /**
   * 限制文本框高度
   * 超过设置的高度则文本换行
   */
  get wrapHeight() {
    return this._wrapHeight
  }
  set wrapHeight(v) {
    this._wrapHeight = v
    this.height = v
  }
  /**
   * 限制文本框宽度
   * 超过设置的宽度则文本换行
   */
  get wrapWidth() {
    return this._wrapWidth
  }
  set wrapWidth(v) {
    this._wrapWidth = v
    this._width = v
  }
  /**
   * 设置字体大小
   */
  get fontSize() {
    return this._fontSize
  }
  set fontSize(v) {
    this._fontSize = v
    this.font = this.getComposedFont();
    this._height = this._fontSize;
  }
  get fontFamily() {
    return this._fontFamily
  }
  set fontFamily(v: string) {
    this._fontFamily = v
    this.font = this.getComposedFont();
  }
  /**
   * 文本横排与竖排模式
   */
  get writeMode() {
    return this._writeMode
  }
  set writeMode(v) {
    this._writeMode = v
    // 设置竖排模式后需要重新计算尺寸
    if (v.length > 0) {
      // this._computeSize();
    }
  }
  private _computeSize() {
    this.computeRows(DisplayObject.getContext());
    let renderHeight = 0;
    let renderWidth = 0;
    this.rows.forEach((row) => {
      console.log(row)
      renderHeight += row.height
      renderWidth = Math.max(renderWidth, row.width)
    })
    this._height = renderHeight;
    this._width = renderWidth;
  }
  // 计算行渲染数据
  computeRows(ctx: TContext2d) {
    this.rows = [];
    // 实际内容可用宽度
    let contentWidth = this._wrapWidth === -1 ? 10000 : this._wrapWidth;
    console.log(contentWidth)
    // 行数据
    this.rows.push({
      width: 0,
      height: 0,
      originHeight: 0,
      elementList: [],
    })

    this.text.split('').forEach(value => {
      ctx.font = this.font
      let { width, actualBoundingBoxAscent, actualBoundingBoxDescent } =
        ctx.measureText(value)
      // 尺寸信息
      let style = {
        width,
        height: actualBoundingBoxAscent + actualBoundingBoxDescent,
        ascent: actualBoundingBoxAscent,
        descent: actualBoundingBoxDescent
      }
      // 完整数据
      let element = {
        value,
        style,
      }

      // 判断当前行是否能容纳
      let curRow = this.rows[this.rows.length - 1]
      if (curRow.width + style.width <= contentWidth && value !== '\n') {
        curRow.elementList.push(element)
        curRow.width += style.width
        // 保存加上 lineGap 后的高度
        curRow.height = Math.max(curRow.height, style.height + this._lineGap)
        // 保存原始最高的文本高度
        curRow.originHeight = Math.max(curRow.originHeight, style.height)
      } else {
        this.rows.push({
          width: style.width,
          height: style.height + this._lineGap,
          originHeight: style.height,
          elementList: [element]
        })
      }
    })
    console.log(this.rows);
  }
  renderRows(ctx: TContext2d) {
    let renderHeight = this.y;
    this.rows.forEach((row) => {
      let renderWidth = this.x;
      console.log(renderWidth, row)
      // 辅助线
      ctx.moveTo(this.x, renderHeight + row.height)
      ctx.lineTo(400, renderHeight + row.height)
      ctx.stroke()
      row.elementList.forEach((item: TElementListItem) => {
        // 跳过换行符
        if (item.value === '\n') {
          return
        }
        ctx.save()
        // 渲染文字
        ctx.font = this.font
        ctx.fillText(item.value, renderWidth, renderHeight + (row.height - row.originHeight) / 2)
        // 更新当前行绘制到的宽度
        renderWidth += item.style.width
        ctx.restore()
      })
      renderHeight += row.height
    })
  }
  /**
   * 整理文本状态
   */
  collectStatus() {
    this._setTextAlign(this.textAlign)
    this._setTextBaseline(this.textBaseline)
    this._setFillStyle(this.color)
  }
  // 执行指令集
  _draw(ctx: TContext2d) {
    this.collectStatus()
    // 优先执行 graphics 指令
    this._drawGraphics(ctx)
    // 如果需要排版则需要进行文本组装
    this.computeRows(ctx);
    this.renderRows(ctx);
    if (this.mask && this.mask.name === 'Shape') {
      this.mask.masked = this
      this._mask?._draw(ctx, true)
    }
  }
}