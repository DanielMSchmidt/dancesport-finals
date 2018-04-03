window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

function playFromFile(file) {
  let fileBlob;
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    const decode = blob =>
      context.decodeAudioData(blob, function(buffer) {
        try {
          const source = context.createBufferSource();
          source.buffer = buffer;
          source.connect(context.destination);
          resolve(source);
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
