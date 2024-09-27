const sketch = p => {
  p.setup = ()=> {
    p.createCanvas(400, 400);
  }
  
  p.draw = ()=> {
    p.background(255,255,0);
    p.circle(100, 100, 80);
    p.ellipse(p.mouseX, p.mouseY, 80, 80);
    p.fill(255, 0, 0);
    p.stroke(0, 255, 0);
     //emojis
    p.textSize(75)
    p.text("🌸", 100, 250) //flower
    let moveDis = p.frameCount % p.width
    if(moveDis> p.width){
      moveDis = 0
    }
    p.text("🐞",moveDis , 250) //ladybug
  }   
}

const p5_1 = new p5(sketch);
setInterval(() => {
  p5_1.background(255, 255, 0)
  p5_1.x = 100
  p5_1.y = 100
  console.log(p5_1.x)
},3000)

