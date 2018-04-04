import playSongFromFile, { node } from "./playFromFile";
import smoothfade from "smoothfade";

const seconds = 1000;

// An instance of this class can only be once started and stopped
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

  static getNode() {
    return node;
  }

  async start() {
    if (this.stopped) {
      return;
    }

    await this.promise;

    this.gain.gain.setValueAtTime(0, this.context.currentTime);
    this.source.start(0);
    this.smooth.fadeIn();
    this.started = true;
  }

  async stop(fadeTime) {
    this.stopped = true;
    if (!this.started) {
      return;
    }
    await this.promise;

    if (this.smooth) {
      return new Promise(resolve => {
        this.smooth.fadeOut();
        setTimeout(() => {
          this.source.stop();
          resolve();
        }, fadeTime * seconds);
      });
    } else {
      return Promise.resolve();
    }
  }
}

export default SongController;
