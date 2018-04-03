import React, { Component } from "react";
import smoothfade from "smoothfade";

import playSongFromFile from "./playFromFile";

const seconds = 1000;

class Song extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: false, source: null };
  }
  async playSong() {
    this.setState({ playing: true });
    try {
      const { source, gain, context } = await playSongFromFile(this.props.song);

      gain.gain.setValueAtTime(0, context.currentTime);
      const smooth = smoothfade(context, gain);
      this.setState({ source, smooth });

      source.start(0);
      smooth.fadeIn();
    } catch (e) {
      console.error(e);
    }
  }

  cancelSong() {
    const { smooth, source } = this.state;
    if (smooth) {
      smooth.fadeOut();
      setTimeout(() => {
        source.stop();
      }, 10 * seconds);
    }

    this.setState({ playing: false, source: null });
  }

  render() {
    const { name } = this.props.song;

    return (
      <li>
        <a
          onClick={
            this.state.playing
              ? this.cancelSong.bind(this)
              : this.playSong.bind(this)
          }
        >
          {this.state.playing ? (this.state.source ? `▶️` : `⏬`) : `⏸️ `}
        </a>
        {name}
      </li>
    );
  }
}

export default Song;
