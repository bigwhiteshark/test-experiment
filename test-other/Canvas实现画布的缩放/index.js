let canvas;
let ctx;
let coordinates = [[50, 50], [250, 50], [250, 250], [50, 250]];
const scale = 0.8;
let [initX, initY] = [0, 0];

let multi = 1;
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    draw();
    drawText();
    addEvent();
}

function draw() {
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(153, 153, 153, 1)';
    ctx.moveTo(...coordinates[0]);
    ctx.beginPath();
    for (let i = 0; i < coordinates.length; i++) {
        ctx.lineTo(...coordinates[i]);
    }
    ctx.closePath();
    ctx.stroke();
}

function getMaxMin() {
    const x = coordinates.map(e => e[0]);
    const y = coordinates.map(e => e[1]);

    return {
        maxX: Math.max(...x),
        minX: Math.min(...x),
        maxY: Math.max(...y),
        minY: Math.min(...y),
    }
}

function getCenter() {
    const maxMin = getMaxMin();
    return [(maxMin.maxX + maxMin.minX) / 2, (maxMin.minY + maxMin.maxY) / 2];
}

/**
 * 绘制文本内容
 */
function drawText() {
    const maxMin = getMaxMin();
    ctx.save();
    ctx.translate((maxMin.maxX + maxMin.minX) / 2, (maxMin.maxY + maxMin.minY) / 2);
    ctx.font = '20px serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('测试Canvas缩放功能', 0, 0, maxMin.maxX - maxMin.minX);
    ctx.restore();
}

/**
 * 通过改变canvas的样式来实现缩放，原理是通过canvas的style中height和width 以及自带的width和height属性不同的比例实现缩放
 * flag true:放大 false: 缩小
 */
function zoom1(flag = true) {
    const curH = Number(canvas.getAttribute('height'));
    const curW = Number(canvas.getAttribute('width'));
    canvas.setAttribute('width', flag ? curW * scale : curW / scale);
    canvas.setAttribute('height', flag ? curH * scale : curH / scale);
}

/**
 * 通过改变canvas的样式来实现缩放，原理是通过canvas的scale属性缩放横纵轴
 * 优点：代码量少
 * 缺点：会改变数据的原始属性
 * flag true:放大 false: 缩小
 */
function zoom2(flag = true) {
    const beta = flag ? 1 / scale : scale;
    ctx.scale(beta, beta);
}

/**
 * 通过改变坐标点信息实现缩放，可以设置缩放的中心点
 * 优点：代码量较大，需要修改每个要素的坐标点
 * 缺点：会改变数据的原始属性
 * flag true:放大 false: 缩小
 */
function zoom3(flag = true, event) {
    // 记录当前鼠标的相对位置
    initX = event.offsetX;
    initY = event.offsetY;
    // 计算放大缩小的比例
    multi = 1 * (flag ? 1 / scale : scale);

    // 获取图形中心点
    const center = getCenter();
    // 获取图形最大最小的顶点坐标
    const maxMin = getMaxMin();
    // 计算缩放后的中心点坐标
    const newC = [center[0] - (initX - center[0]) * (multi - 1), center[0] - (initY - center[1]) * (multi - 1)];

    // 根据缩放后的中心点计算各个顶点信息
    coordinates = coordinates.map(e => {
        const operateX = center[0] - e[0] > 0 ? 1 : -1;
        const operateY = center[1] - e[1] > 0 ? 1 : -1;
        return [newC[0] - (maxMin.maxX - maxMin.minX) * multi / 2 * operateX, newC[1] - (maxMin.maxY - maxMin.minY) * multi / 2 * operateY];
    })
}

function addEvent() {
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.stroke();
    const minMax = getMaxMin(coordinates);
    canvas.addEventListener('mousewheel', event => {
        ctx.clearRect(0, 0, 1600, 1600);
        // zoom1(event.wheelDelta > 0);

        // zoom2(event.wheelDelta > 0);

        zoom3(event.wheelDelta > 0, event);
        draw();
        drawText();

        ctx.restore();
    });
}

export default { init, addEvent };