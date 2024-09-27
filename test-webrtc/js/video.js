var buffer;
// stream，通过 getUserMedia 获取的本地视频流或通过 RTCPeerConnection 获取的远程视频流。
// options，可选项，指定视频格式、编解码器、码率等相关信息，如 mimeType: 'video/webm;codecs=vp8'。
// MediaRecorder 对象还有一个特别重要的事件，即 ondataavailable 事件。当 MediaRecoder 捕获到数据时就会触发该事件。通过它，我们才能将音视频数据录制下来。
//当该函数被触发后，将数据压入到blob中
function handleDataAvailable(e) {
    if (e && e.data && e.data.size > 0) {
        buffer.push(e.data);
    }
}

let mediaRecorder;
function startRecord() {
    buffer = [];

    //设置录制下来的多媒体格式 
    var options = {
        mimeType: 'video/webm;codecs=vp8'
    }
    //判断浏览器是否支持录制
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported!`);
        return;
    }
    try {
        //创建录制对象
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Failed to create MediaRecorder:', e);
        return;
    }
    //当有音视频数据来了之后触发该事件
    mediaRecorder.ondataavailable = handleDataAvailable;
    //开始录制
    mediaRecorder.start(10);
    //recvideo = null
}
function stopRecord() {
    mediaRecorder.stop();
}

var videoplay = document.querySelector('#vi');
var recvideo = document.querySelector('#recvideo');
//播放视频流
function gotMediaStream(stream) {
    videoplay.srcObject = stream;
    window.stream = stream;
}
function handleError(err) {
    console.log('getUserMedia error:', err);
}
//对采集的数据做一些限制
var constraints = {
    video: {
        width: 1280,
        height: 720,
        frameRate: 15,
    },
    audio: false
}
//采集音视频数据流
navigator.mediaDevices.getUserMedia(constraints)
    .then(gotMediaStream)
    .catch(handleError);


var btnRecord = document.querySelector('#record');
btnRecord.onclick = () => {
    startRecord()
}

var btnRecplay = document.querySelector('#recplay');
btnRecplay.onclick = () => {
    stopRecord()
    var blob = new Blob(buffer, { type: 'video/webm' });

    console.log(blob, 'blob')
    recvideo.src = window.URL.createObjectURL(blob);

    recvideo.srcObject = null;

    recvideo.controls = true;

    recvideo.play();

}

var btnDownload = document.querySelector('#download');
btnDownload.onclick = () => {

    var blob = new Blob(buffer, { type: 'video/webm' });

    var url = window.URL.createObjectURL(blob);

    var a = document.createElement('a');

    a.href = url;

    a.style.display = 'none';

    a.download = 'aaa.webm';

    a.click();
}

