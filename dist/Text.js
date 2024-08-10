/**
 * 文本类
 */
import DisplayObject from './DisplayObject';
import { FillText } from './text/FillText';
import SetFillStyle from './text/SetFillStyle';
import SetTextAlign from './text/SetTextAlign';
import SetTextBaseline from './text/SetTextBaseline';
const defaultFontSize = 10;
// font: font-stretch font-variant font-style font-weight font-size font-family
// 
export default class Text extends DisplayObject {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = v;
    }
    constructor(t) {
        super();
        this.name = 'Text';
        // 当前字体样式的属性。符合 CSS font 语法 的 DOMString 字符串，至少需要提供字体大小和字体族名。默认值为 10px sans-serif
        this.font = `${defaultFontSize}px sans-serif`;
        // 暂时只支持 px 为单位
        this._fontSize = 12;
        this._width = 0;
        this._height = 0;
        this._wrapHeight = -1;
        this._wrapWidth = -1;
        this._writeMode = '';
        this._text = '';
        this._fontStretch = '';
        this._fontVariant = '';
        this._fontStyle = '';
        this._fontWeight = '';
        this._lineGap = 0;
        this._letterSpace = 0;
        this.textBlocks = [];
        this.textAlign = 'left';
        this.textBaseline = 'top';
        this.color = '#000';
        this._fontFamily = 'sans-serif';
        this._drawGraphics = super._drawGraphics;
        this.init(t !== null && t !== void 0 ? t : {});
    }
    init(t) {
        var _a;
        let { text, font, color } = t;
        if (t.fontStretch) {
            this._fontStretch = t.fontStretch;
        }
        if (t.fontVariant) {
            this._fontVariant = t.fontVariant;
        }
        if (t.fontStyle) {
            this._fontStyle = t.fontStyle;
        }
        if (t.fontSize) {
            this._fontSize = t.fontSize;
            this._height = t.fontSize;
        }
        if (t.fontFamily) {
            this._fontFamily = t.fontFamily;
        }
        if (t.letterSpace) {
            this._letterSpace = t.letterSpace;
        }
        // 如果传入了简写的 font 则直接使用 font 
        if (font) {
            this.font = font;
            const _fontSize = (_a = font.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0];
            if (_fontSize) {
                this._fontSize = parseInt(_fontSize);
                this._height = this._fontSize + this.lineGap;
            }
        }
        else {
            this.font = this.getComposedFont();
        }
        this._height = this.fontSize + this.lineGap;
        if (!this.fontSize) {
            this.fontSize = defaultFontSize;
        }
        if (color) {
            this.color = color;
        }
        this.textAlign = 'left';
        this.textBaseline = 'top';
        // 初始化就设置文本
        if (text) {
            this.text = text;
            this._width = this.getWidth();
        }
    }
    getWidth() {
        const ctx = DisplayObject.getContext();
        // 测宽度前必须先设置字体大小
        ctx.font = this.font;
        let w = ctx.measureText(this._text).width;
        return w;
    }
    // 凑成 font 减写
    // font: font-stretch font-variant font-style font-weight font-size font-family
    getComposedFont() {
        return `${this._fontStretch} ${this._fontVariant} ${this._fontStyle} ${this._fontWeight} ${this._fontSize}px ${this._fontFamily}`.trim();
    }
    get text() {
        return this._text;
    }
    set text(t) {
        t = String(t);
        this._text = t;
        this._width = this.getWidth();
        // console.log(this._width)
    }
    get lineGap() {
        return this._lineGap;
    }
    set lineGap(h) {
        this._lineGap = h;
    }
    get letterSpace() {
        return this._letterSpace;
    }
    set letterSpace(v) {
        this._letterSpace = v;
    }
    /**
     * 限制文本框高度
     * 超过设置的高度则文本换行
     */
    get wrapHeight() {
        return this._wrapHeight;
    }
    set wrapHeight(v) {
        this._wrapHeight = v;
        this.height = v;
    }
    /**
     * 限制文本框宽度
     * 超过设置的宽度则文本换行
     */
    get wrapWidth() {
        return this._wrapWidth;
    }
    set wrapWidth(v) {
        this._wrapWidth = v;
        this._width = v;
    }
    /**
     * 设置字体大小
     */
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(v) {
        this._fontSize = v;
        this.font = this.getComposedFont();
        this._height = this._fontSize;
    }
    get fontFamily() {
        return this._fontFamily;
    }
    set fontFamily(v) {
        this._fontFamily = v;
        this.font = this.getComposedFont();
    }
    /**
     * 文本横排与竖排模式
     */
    get writeMode() {
        return this._writeMode;
    }
    set writeMode(v) {
        this._writeMode = v;
        // 设置竖排模式后需要重新计算尺寸
        if (v.length > 0) {
            // this._assembleText();
        }
    }
    assembleOneLine(textArr) {
        var _a;
        // const ctx = DisplayObject.getContext()
        this.textBlocks[0] = (_a = this.textBlocks[0]) !== null && _a !== void 0 ? _a : [];
        let sumWidth = 0;
        for (let i = 0, l = textArr.length; i < l; i++) {
            // 测宽度前必须先设置字体大小
            // ctx.font = this.font
            // let w = ctx.measureText(textArr[i]).width
            let w = this._fontSize;
            sumWidth += w + this._letterSpace;
            this.textBlocks[0].push({
                rowNum: 0,
                colomnNum: i,
                text: textArr[i],
                width: w,
                height: w,
                lineGap: this._lineGap,
                letterSpace: this._letterSpace,
            });
        }
        this._width = sumWidth - this._letterSpace;
        this._height = this._fontSize + this._lineGap;
    }
    assembleMultiLine(textArr) {
        var _a, _b;
        // const ctx = DisplayObject.getContext()
        this.textBlocks[0] = (_a = this.textBlocks[0]) !== null && _a !== void 0 ? _a : [];
        let widthSum = 0;
        let widthBound = this._wrapWidth;
        let rowNum = 0;
        let colomnNum = 0;
        for (let i = 0, l = textArr.length; i < l; i++) {
            let w = this._fontSize;
            // 留出
            if (widthSum + w + this._letterSpace > widthBound) {
                // console.log(w, (widthSum + w ), widthBound)
                rowNum++;
                widthSum = 0;
                colomnNum = 0;
            }
            this.textBlocks[rowNum] = (_b = this.textBlocks[rowNum]) !== null && _b !== void 0 ? _b : [];
            this.textBlocks[rowNum].push({
                rowNum: rowNum,
                colomnNum: colomnNum,
                text: textArr[i],
                width: w,
                height: w,
                lineGap: this._lineGap,
                letterSpace: this._letterSpace,
            });
            widthSum += w;
            colomnNum++;
        }
        this._width = this._wrapWidth;
        this._height = (this._fontSize + this._lineGap) * this.textBlocks.length;
    }
    assembleMultiLineVertical(textArr) {
        var _a, _b;
        this.textBlocks[0] = (_a = this.textBlocks[0]) !== null && _a !== void 0 ? _a : [];
        let heightSum = 0;
        let heightBound = this._wrapHeight;
        let rowNum = 0;
        let colomnNum = 0;
        // 最大列数
        let maxColomnNum = colomnNum;
        for (let i = 0, l = textArr.length; i < l; i++) {
            let w = this._fontSize;
            if (heightSum > heightBound) {
                colomnNum++;
                heightSum = 0;
                rowNum = 0;
            }
            if (colomnNum > maxColomnNum) {
                maxColomnNum = colomnNum;
            }
            this.textBlocks[rowNum] = (_b = this.textBlocks[rowNum]) !== null && _b !== void 0 ? _b : [];
            this.textBlocks[rowNum].push({
                rowNum: rowNum,
                colomnNum: colomnNum,
                text: textArr[i],
                width: w,
                height: w,
                lineGap: this._lineGap,
                letterSpace: this._letterSpace,
            });
            heightSum += this._fontSize + this._lineGap;
            rowNum++;
        }
        // 如果是从右向左写，则需要将 textBlocks 数组内每行数组内容反一反，且重新调整 colomnNum 值
        if (this._writeMode === 'vertical-rl') {
            this.textBlocks = this.textBlocks.map(textBlockRow => {
                textBlockRow.forEach((textBlock, index) => {
                    textBlock.colomnNum = maxColomnNum - index;
                });
                return textBlockRow.reverse();
            });
        }
        this._width = (this._fontSize + this._letterSpace) * (maxColomnNum + 1);
        this._height = this._wrapHeight;
    }
    assembleRowText() {
        let textArr = this._text.split('');
        if (this._wrapWidth > -1) {
            this.assembleMultiLine(textArr);
        }
        else {
            this.assembleOneLine(textArr);
        }
    }
    assembleOneLineVertical(textArr) {
        var _a;
        this.textBlocks[0] = (_a = this.textBlocks[0]) !== null && _a !== void 0 ? _a : [];
        for (let i = 0, l = textArr.length; i < l; i++) {
            let w = this._fontSize;
            this.textBlocks[0].push({
                rowNum: i,
                colomnNum: 0,
                text: textArr[i],
                width: w,
                height: w,
                lineGap: 0,
                letterSpace: 0,
            });
        }
        this._width = this._fontSize;
        this._height = (this._fontSize + this._lineGap) * this.text.length;
    }
    assembleVerticalText() {
        let textArr = this._text.split('');
        if (this.wrapHeight > -1) {
            this.assembleMultiLineVertical(textArr);
        }
        else {
            this.assembleOneLineVertical(textArr);
        }
    }
    /**
     * 整理文本状态
     */
    collectStatus() {
        this._setTextAlign(this.textAlign);
        this._setTextBaseline(this.textBaseline);
        this._setFillStyle(this.color);
        if (!this._needComposeText()) {
            this._fillText();
        }
    }
    // 是否需要进行文本组装
    _needComposeText() {
        return this._letterSpace > 0 || this._writeMode.length > 0 || this._wrapWidth > -1;
    }
    _assembleText() {
        // 收集竖写模式
        if (this._writeMode.length) {
            this.assembleVerticalText();
        }
        else {
            this.assembleRowText();
        }
    }
    // 执行指令集
    _draw(ctx) {
        var _a;
        this.collectStatus();
        // 优先执行 graphics 指令
        this._drawGraphics(ctx);
        // 如果需要排版则需要进行文本组装
        if (this._needComposeText()) {
            this._assembleText();
            this._composeText(ctx);
        }
        if (this.mask && this.mask.name === 'Shape') {
            // this.mask.masked = this
            (_a = this._mask) === null || _a === void 0 ? void 0 : _a._draw(ctx, true);
        }
    }
    /**
     * setFillStyle 设置文本颜色
     * @param {String} color [description]
     */
    _setFillStyle(color = 'black') {
        this.color = color;
        this._append(new SetFillStyle(color));
        return this;
    }
    /**
    * fillText 绘制文本
    * @param  {String} text
    * @param  {Number} x
    * @param  {Number} y
    */
    _fillText() {
        // 如果之前有fillText,则需要先清一下之前填文本的命令
        this._remove('FillText');
        this._append(new FillText(this._text, this.x, this.y));
        return this;
    }
    _composeText(ctx) {
        // 如果是复杂排版,则 textAlign 不起作用,直接默认为左侧
        ctx.textAlign = 'left';
        // console.log(this._letterSpace)
        this.textBlocks.forEach(row => {
            row.forEach(_textBlock => {
                const left = this.x + (_textBlock.colomnNum * (_textBlock.width + this._letterSpace));
                const top = this.y + (_textBlock.rowNum * (_textBlock.height + this._lineGap));
                ctx.font = this.font;
                ctx.fillText(_textBlock.text, left, top);
            });
        });
        return this;
    }
    /**
     * setTextBaseline 设置文字垂直对齐方式，推荐 top 顶部对齐比较好算
     * @param { String } textBaseline top	顶部对齐	 bottom	底部对齐	middle	居中对齐	normal 默认（基线对齐）
     */
    _setTextBaseline(textBaseline) {
        this.textBaseline = textBaseline;
        this._append(new SetTextBaseline(textBaseline));
        return this;
    }
    /**
     * [setTextAlign 设置文本水平对齐方式]
     * @param { String } textAlign [left, center, right]
     */
    _setTextAlign(textAlign) {
        this.textAlign = textAlign;
        this._append(new SetTextAlign(textAlign));
        return this;
    }
    addChild() {
        throw new Error('不能给 Text 类添加子元素');
    }
}