/**
 *  Bezier.js 公式都搜自网上
 */



 /**
 * 一次贝塞尔曲线(一次贝塞尔曲线就是直线，没有控制点)求点的坐标
 * @param {*} t 是当前点所占的比例取值是0-1
 * @param {*} p1 起始点
 * @param {*} p2 终点
 */
// function oneOrderBezier(t: number, p1: [number, number], p2: [number, number]) {    
// 	const [x1, y1] = p1;
// 	const [x2, y2] = p2;
// 	var x = x1 * (x2 - x1) * t,
// 	    y = y1 * (y2 - y1) * t;
// 	return [x, y];
// }
/**
 * 二次贝塞尔曲线(有一个控制点)求点的坐标
 * @param {*} t 是当前点所占的比例取值是0-1
 * @param {*} p1 起始点
 * @param {*} cp1 控制点
 * @param {*} p2 终点
 */

// function twoOrderBezier(t: number, p1: [number, number], cp: [number, number], p2: [number, number]) {
// 	var [x1, y1] = p1,
// 		[cx, cy] = cp,
// 		[x2, y2] = p2;
// 	var x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2,
// 		y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
// 	return [x, y];
// }
// /**
//  * 三次贝塞尔曲线(有两个控制点)求点的坐标
//  * @param {*} t 是当前点所占的比例取值是0-1
//  * @param {*} p1 起始点
//  * @param {*} cp1 控制点
//  * @param {*} cp2 控制点
//  * @param {*} p2 终点
//  */
// function threeOrderBezier(t: number, p1: [number, number], cp1: [number, number], cp2: [number, number], p2: [number, number]) {
// 	var [x1, y1] = p1,
// 		[cx1, cy1] = cp1,
// 		[cx2, cy2] = cp2,
// 		[x2, y2] = p2;
// 	var x =
// 		x1 * (1 - t) * (1 - t) * (1 - t) +
// 		3 * cx1 * t * (1 - t) * (1 - t) +
// 		3 * cx2 * t * t * (1 - t) +
// 		x2 * t * t * t;
// 	var y =
// 		y1 * (1 - t) * (1 - t) * (1 - t) +
// 		3 * cy1 * t * (1 - t) * (1 - t) +
// 		3 * cy2 * t * t * (1 - t) +
// 		y2 * t * t * t;
// 	return [x, y];
// }


/**
 * 计算二次贝赛尔曲线 boundary 
 * https://stackoverflow.com/questions/18141190/how-to-calculate-width-height-and-position-of-bezier-curve
 * @param {*} ax 起点x
 * @param {*} ay 起点y
 * @param {*} bx 控制点x
 * @param {*} by 控制点y
 * @param {*} cx 控制点x
 * @param {*} cy 控制点y
 * @param {*} dx 终点x
 * @param {*} dy 终点y
 */
export function getCurveBoundary(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number) {
    let tobx = bx - ax;
    let toby = by - ay;
    let tocx = cx - bx;
    let tocy = cy - by;
    let todx = dx - cx;
    let tody = dy - cy;
    let step = 1 / 40;    // precission
    let d: number, px: number, py: number, qx: number, qy: number, rx: number, ry: number, tx: number, ty: number, sx: number, sy: number, x: number, y: number, i: number, minx: number = 0, miny: number = 0, maxx: number = 0, maxy: number = 0;

    function min(num1: number, num2: number): number {
        if (num1 > num2) {
            return num2;
        }
        if (num1 < num2) {
            return num1;
        }
        return num1;
    }

    function max(num1: number, num2: number): number {
        if (num1 > num2) {
            return num1;
        }
        if (num1 < num2) {
            return num2;
        }
        return num1;
    }

    for (i = 0; i < 41; i++) {
        d = i * step;
        px = ax + d * tobx;
        py = ay + d * toby;
        qx = bx + d * tocx;
        qy = by + d * tocy;
        rx = cx + d * todx;
        ry = cy + d * tody;
        const toqx = qx - px;
        const toqy = qy - py;
        const torx = rx - qx;
        const tory = ry - qy;

        sx = px + d * toqx;
        sy = py + d * toqy;
        tx = qx + d * torx;
        ty = qy + d * tory;
        const totx = tx - sx;
        const toty = ty - sy;

        x = sx + d * totx;
        y = sy + d * toty;
        if (i === 0) {
            minx = x;
            miny = y;
            maxx = x;
            maxy = y;
        } else {
            minx = min(minx, x);
            miny = min(miny, y);
            maxx = max(maxx, x);
            maxy = max(maxy, y);
        }
    }
    return { x: Math.round(minx), y: Math.round(miny), width: Math.round(maxx - minx), height: Math.round(maxy - miny) };
}