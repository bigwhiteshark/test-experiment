let classifier;
let video;
let label = "Model loading";
/* let width = 640;
let height = 400; */
function preload() {
  console.log("preload");
  classifier = ml5.imageClassifier("MobileNet");
}

function setup() {
  createCanvas(640, 400);
  background(255);
  // Start the video
  video = createCapture(VIDEO);
  video.size(640, 400);
  video.hide();
  classifier.classifyStart(video, gotResult);
}

function draw() {
  image(video, 0, 0);
  fill(255);
  textSize(32);
  text(label, 20, 50);
}
function gotResult(results) {
  label = results[0].label;
}
