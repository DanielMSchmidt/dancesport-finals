window.AudioContext = window.AudioContext || window.webkitAudioContext;

function playFromFile(file) {
  let fileBlob;
  return new Promise((resolve, reject) => {
    const context = new AudioContext();
    const fileReader = new FileReader();
    const decode = blob =>
      context.decodeAudioData(blob, function(buffer) {
        try {
          const source = context.createBufferSource();
          const gain = context.createGain();
          source.buffer = buffer;
          source.connect(gain);
          gain.connect(context.destination);
          resolve({ source, gain, context });
        } catch (e) {
          reject(e);
        }
      });

    if (fileBlob) {
      decode(fileBlob);
    } else {
      fileReader.onload = function() {
        fileBlob = fileReader.result;
        decode(fileBlob);
      };
    }

    fileReader.readAsArrayBuffer(file);
  });
}

export default playFromFile;
