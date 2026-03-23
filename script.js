const video = document.getElementById('video');
const moodDisplay = document.getElementById('moodDisplay');
console.log('moodDisplay element:', moodDisplay);

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.20.0/weights'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.20.0/weights')
])
  .then(() => {
    console.log('Models loaded successfully');
    startVideo();
  })
  .catch(err => {
    console.error('Model loading error:', err);
    moodDisplay.innerText = 'Error: Failed to load models. Check console.';
  });

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      console.log('Webcam stream started');
      video.srcObject = stream;
    })
    .catch(err => {
      console.error('Webcam error:', err);
      moodDisplay.innerText = 'Error: Failed to access webcam. Check console.';
    });
}

video.addEventListener('play', () => {
  console.log('Video is playing');
  setInterval(async () => {
    console.log('Detection loop running...');
    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.1 }))
        .withFaceExpressions();
      console.log('Detection:', detection);
      if (detection && detection.expressions) {
        console.log('Expressions:', detection.expressions);
        const mood = getDominantMood(detection.expressions);
        console.log('Mood:', mood);
        moodDisplay.innerText = `Mood: ${mood}`;
        document.body.className = mood;
      } else {
        moodDisplay.innerText = 'Mood: Not detected';
        document.body.className = 'neutral';
      }
    } catch (err) {
      console.error('Detection error:', err.message, err.stack);
      moodDisplay.innerText = 'Mood: Detection error';
    }
  }, 2000);
});

function getDominantMood(expressions) {
  if (!expressions || Object.keys(expressions).length === 0) return 'neutral';
  return Object.entries(expressions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}