let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");

let mediRecorder;
let chunks = [];
let isRecording = false;

recordBtn.addEventListener("click", function (e) {
    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
    } else {
        mediaRecorder.start();
        isRecording = true;
    }
})

let promiseUseCamera = navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
})

promiseUseCamera.then(function (mediaStream) {
    videoPlayer.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable", function (e) {
        chunks.push(e.data);
    })

    mediaRecorder.addEventListener("stop", function (e) {

        let blob = new Blob(chunks, { type: "video/mp4" });
        chunks = [];
        let link = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = link;
        a.download = "video.mp4";
        a.click();
        a.remove();
    })
})

