const video = document.getElementById('video');
const redCanvas = document.getElementById('redCanvas');
const blueCanvas = document.getElementById('blueCanvas');
const redCtx = redCanvas.getContext('2d');
const blueCtx = blueCanvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error("Error accessing the camera: ", err);
    });

video.addEventListener('loadedmetadata', () => {
    redCanvas.width = video.videoWidth;
    redCanvas.height = video.videoHeight;
    blueCanvas.width = video.videoWidth;
    blueCanvas.height = video.videoHeight;
    drawFrames();
});

function drawFrames() {
    if (video.paused || video.ended) {
        return;
    }
    redCtx.drawImage(video, 0, 0, redCanvas.width, redCanvas.height);
    blueCtx.drawImage(video, 0, 0, blueCanvas.width, blueCanvas.height);

    let redFrame = redCtx.getImageData(0, 0, redCanvas.width, redCanvas.height);
    let blueFrame = blueCtx.getImageData(0, 0, blueCanvas.width, blueCanvas.height);

    isolateRed(redFrame.data);
    isolateBlue(blueFrame.data);

    redCtx.putImageData(redFrame, 0, 0);
    blueCtx.putImageData(blueFrame, 0, 0);

    requestAnimationFrame(drawFrames);
}

function isolateRed(data) {
    for (let i = 0; i < data.length; i += 4) {
        data[i + 1] = 0; // Green channel
        data[i + 2] = 0; // Blue channel
    }
}

function isolateBlue(data) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;     // Red channel
        data[i + 1] = 0; // Green channel
    }
}
