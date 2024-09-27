//获取HTML页面中的video标签  
var videoplay = document.querySelector('video');
//播放视频流
function gotMediaStream(stream){
        videoplay.srcObject = stream;
}
function handleError(err){
        console.log('getUserMedia error:', err);
}
//对采集的数据做一些限制
var constraints = {
    video : {
            width: 1280,
            height: 720,
            frameRate:15,
    },
    audio : false
}
//采集音视频数据流
navigator.mediaDevices.getUserMedia(constraints)
                        .then(gotMediaStream)
                        .catch(handleError);




// picture.drawImage(image, dx, dy, dWidth, dHeight);

function downLoad(url){
    var oA = document.createElement("a");
    oA.download = 'photo';// 设置下载的文件名，默认是'下载'
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
}
let filtersSelect = document.querySelector("select#filter")
// 拍照功能
document.querySelector("button#TakePhoto").onclick = function (){
        var filterMap = {
                blur: "blur(3px)",
                grayscale: "grayscale(1)",
                invert: "invert(1)",
                sepia: "sepia(1)",
                none: "none"
              };
 var picture = document.querySelector('canvas#picture');
 var ctx  = picture.getContext('2d')
  picture.width = 640;
  picture.height = 480;
  ctx.filter = filterMap[filtersSelect.value]; //给保存的图片添加滤镜
  ctx.drawImage(videoplay, 0, 0, picture.width, picture.height);
}
// 下载功能
document.querySelector("button#save").onclick = function (){
var canvas = document.querySelector('canvas#picture');
    downLoad(canvas.toDataURL("image/jpeg"));
}
