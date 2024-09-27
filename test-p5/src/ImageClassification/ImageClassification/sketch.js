let classifier;
let img;
let lable = "";
let confidence = "";
let width = 400;
let height = 400;

function gotResult(results) {
  fill(255);
  stroke(0);
  textSize(18);
  label = "Label: " + results[0].label;
  confidence = "Confidence: " + nf(results[0].confidence, 0, 2);
  text(label, 10, 360);
  text(confidence, 10, 380);

  console.log(results);
}

function preload() {
  console.log("preload");
  classifier = ml5.imageClassifier("MobileNet");
  img = loadImage("../images/bird.png");
}

function setup() {
  console.log("setup");
  createCanvas(400, 400);
  classifier.classify(img, gotResult);
  image(img, 0, 0, width, height);
}

function draw() {}
