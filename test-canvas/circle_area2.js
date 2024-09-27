const turf = require('@turf/turf');

// 创建多个圆的几何对象
const circle1 = turf.circle([116.6, 35.4691], 3, { steps: 100 });
const circle2 = turf.circle([116.1921, 35.463455], 2, { steps: 100 });
const circle3 = turf.circle([116.2342, 35.463245], 8, { steps: 100 });

// 计算所有圆的面积
const area1 = turf.area(circle1);
const area2 = turf.area(circle2);
const area3 = turf.area(circle3);

// 计算所有圆的交集
const intersections = turf.union(circle1, circle2, circle3);

// 计算相交部分的面积
const intersectionArea = turf.area(intersections);

// 计算排除相交部分的面积
const totalArea = area1 + area2 + area3 - intersectionArea;

console.log('Total area:', totalArea);
