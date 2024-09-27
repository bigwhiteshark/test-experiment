
// 计算圆的面积
function calculateCircleArea(radius) {
  return Math.PI * Math.pow(radius, 2);
}

// 计算两个圆的相交面积
function calculateIntersectionArea(radius1, radius2, distance) {
  if (distance >= radius1 + radius2) {
    return 0; // 两个圆不相交，相交面积为0
  }

  if (distance <= Math.abs(radius1 - radius2)) {
    return Math.PI * Math.pow(Math.min(radius1, radius2), 2); // 一个圆完全包含于另一个圆内，相交面积为较小圆的面积
  }

  var angle1 = Math.acos((Math.pow(radius1, 2) + Math.pow(distance, 2) - Math.pow(radius2, 2)) / (2 * radius1 * distance));
  var angle2 = Math.acos((Math.pow(radius2, 2) + Math.pow(distance, 2) - Math.pow(radius1, 2)) / (2 * radius2 * distance));
  var intersectionArea = angle1 * Math.pow(radius1, 2) + angle2 * Math.pow(radius2, 2) - 0.5 * Math.sin(2 * angle1) * Math.pow(radius1, 2) - 0.5 * Math.sin(2 * angle2) * Math.pow(radius2, 2);
  return intersectionArea;
}

// 计算多个圆的总面积（排除相交部分）
function calculateTotalArea(circles) {
  var totalArea = 0;
  var intersectionPoints = [];

  for (var i = 0; i < circles.length; i++) {
    var circleArea = calculateCircleArea(circles[i].radius);
    totalArea += circleArea;
  }

  for (var i = 0; i < circles.length; i++) {
    for (var j = i + 1; j < circles.length; j++) {
      var distance = Math.sqrt(Math.pow(circles[i].x - circles[j].x, 2) + Math.pow(circles[i].y - circles[j].y, 2));
      var intersectionArea = calculateIntersectionArea(circles[i].radius, circles[j].radius, distance);
      totalArea -= intersectionArea;

      if (intersectionArea > 0) {
        intersectionPoints.push({ x: circles[i].x, y: circles[i].y });
        intersectionPoints.push({ x: circles[j].x, y: circles[j].y });
      }
    }
  }

  console.log("Intersection Points:", intersectionPoints);
  return totalArea;
}

// 定义多个圆的半径和坐标
var circles = [
  { radius: 3, x: 0, y: 0 },
  { radius: 2, x: 3, y: 0 },
  { radius: 4, x: 6, y: 2 }
];

// 调用函数计算多个圆的总面积
var totalArea = calculateTotalArea(circles);
console.log("Total Area:", totalArea);