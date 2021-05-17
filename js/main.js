const vizScale = 1700
const volumeMax = 500
const vHigh = 400
const high = 300
const med = 200
const low = 100
const info = document.getElementById("info")
const volumeValue = document.getElementById("volume");
const interval = 500 * Math.pow(200, 200)
const level = document.getElementById("level")

function engageVolume(){
  try {
    window.audioContext = new AudioContext();
  } catch (e) {
    alert('Web Audio API not supported.');
  }

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess)
    .catch(function(err) {
      /* handle the error */
      alert("failed to connect to mic")
    });
}

function VolumeMeter(context) {
  this.context = context;
  this.volume = 0.0;
  this.script = context.createScriptProcessor(2048, 1, 1);
  const vol = this;
  this.script.onaudioprocess = function(event) {
    const input = event.inputBuffer.getChannelData(0);
    let sum = 0.0;
    for (let i = 0; i < input.length; ++i) {
      sum += input[i] * input[i];
    }
    vol.volume = Math.sqrt(sum / input.length) * vizScale;
    //the width of the bar is correlated to the volume
    let volSize = vol.volume / 2
    if (volSize > volumeMax)
      volSize = volumeMax
    level.style.width = (volSize).toFixed(0).toString() + "px"

    //the color for extra aesthetic, is changed
    if (volSize > vHigh)
        level.style.backgroundColor = "red"
    else if (volSize > high)
        level.style.backgroundColor = "orange"
    else if (volSize > med)
        level.style.backgroundColor = "yellow"
    else if (volSize > low)
        level.style.backgroundColor = "green"
    else
        level.style.backgroundColor = "black"
    //info.innerText = (volSize / 10).toFixed(0).toString()
  };
}

//if the stream capture is successful we create the volume monitor
function handleSuccess(stream) {
  const volumeMeter = new VolumeMeter(window.audioContext);
  volumeMeter.connectToSource(stream, function() {
    setInterval(() => {
      volumeValue.value = volumeMeter.volume.toFixed(2);
    }, interval);
  });
}

VolumeMeter.prototype.connectToSource = function(stream, callback) {
  try {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    this.script.connect(this.context.destination);
    if (typeof callback !== 'undefined') {
      callback(null);
    }
  } catch (e) {
    alert(e)
  }
};






