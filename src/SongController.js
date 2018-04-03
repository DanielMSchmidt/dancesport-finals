import playSongFromFile from "./playFromFile";
import smoothfade from "smoothfade";

const seconds = 1000;

class SongController {
  constructor(file) {
    this.file = file;
    this.promise = playSongFromFile(this.file).then(
      ({ source, gain, context }) => {
        const smooth = smoothfade(context, gain);
        this.source = source;
        this.smooth = smooth;
        this.gain = gain;
        this.context = context;
      }
    );
  }

  async start() {
    await this.promise;

    this.gain.gain.setValueAtTime(0, this.context.currentTime);
    this.source.start(0);
    this.smooth.fadeIn();
  }

  async stop(fadeTime) {
    await this.promise;

    if (this.smooth) {
      this.smooth.fadeOut();
      setTimeout(() => {
        this.source.stop();
      }, fadeTime * seconds);
    }
  }
}

export default SongController;
