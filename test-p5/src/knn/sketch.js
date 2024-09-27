let video;
let features;
let knn;
let labelP;
let ready = false;

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      labelP.html(result.label);
      goClassify();
    }
  });
}


function modelReady() {
  console.log("MobileNet Model is ready!");
  knn = ml5.KNNClassifier();
  /* knn.load("model.json", function () {
    console.log("KNN Data is loaded!");
    goClassify();
  }); */
}
function setup() {
  createCanvas(320, 240);
  labelP = createP("need training data");
  labelP.style("font-size", "32px");
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  features = ml5.featureExtractor("MobileNet", modelReady);
}

function draw() {
  background(220);
  image(video, 0, 0);
  /* if (!ready && knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  } */
}

function gotResult(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  labelP.html(result.label);
}

function mousePressed() {
  /* if (knn.getNumLabels() > 0) {
    goClassify();
  } */
}

function keyPressed() {
  const logits = features.infer(video);
  if (key === "l") {
    console.log("left");
    knn.addExample(logits, "left");
  } else if (key === "r") {
    console.log("right");
    knn.addExample(logits, "right");
  } else if (key === "u") {
    console.log("up");
    knn.addExample(logits, "up");
  } else if (key === "d") {
    console.log("down");
    knn.addExample(logits, "down");
  } else if (key === "s") {
    knn.save("model.json");
  }
}
