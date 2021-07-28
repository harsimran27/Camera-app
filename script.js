let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector("#capture")
let allFilters = document.querySelectorAll(".filter");
let body = document.querySelector("body");

let mediRecorder;
let chunks = [];
let isRecording = false;
let filter = "";

for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", function (e) {

        let previousFilter = document.querySelector(".filter-div");
        if (previousFilter) previousFilter.remove();

        let color = e.currentTarget.style.backgroundColor;
        filter = color;
        let div = document.createElement("div");
        div.classList.add("filter-div");
        div.style.backgroundColor = color;
        body.append(div);
    })
}

captureBtn.addEventListener("click", function () {
    let innerSpan = captureBtn.querySelector("span");
    innerSpan.classList.add("captured-animation");

    setTimeout(() => {
        innerSpan.classList.remove("captured-animation");
    }, 1000);

    let canvas = document.createElement("canvas");
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(videoPlayer, 0, 0);

    if (filter != "") {
        tool.fillStyle = filter;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "image.png";
    a.click();
    a.remove();
})

recordBtn.addEventListener("click", function (e) {
    let innerSpan = recordBtn.querySelector("span");

    let previousFilter = document.querySelector(".filter-div");
    if (previousFilter) previousFilter.remove();

    filter = "";

    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        innerSpan.classList.remove("record-animation");
    } else {
        mediaRecorder.start();
        isRecording = true;
        innerSpan.classList.add("record-animation");
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

