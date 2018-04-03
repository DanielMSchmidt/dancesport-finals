import React, { Component } from "react";
import playSongFromFile from "./playFromFile";

class Song extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: false, source: null };
  }
  async playSong() {
    this.setState({ playing: true });
    try {
      const source = await playSongFromFile(this.props.song);
      this.setState({ source });
      source.start(0);
    } catch (e) {
      console.error(e);
    }
  }

  cancelSong() {
    this.state.source.stop();

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
