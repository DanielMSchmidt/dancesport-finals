import React, { Component } from "react";
import SongController from "./SongController";

class Song extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: false, songApi: null };
  }
  async playSong() {
    this.setState({ playing: true });
    try {
      const song = new SongController(this.props.song);

      await song.start();
      this.setState({ songApi: song });
    } catch (e) {
      console.error(e);
    }
  }

  async cancelSong() {
    const { songApi } = this.state;
    if (songApi) {
      await songApi.stop(10);
    }

    this.setState({ playing: false, songApi: null });
  }

  render() {
    const { name } = this.props.song;

    return (
      <div>
        <a
          onClick={
            this.state.playing
              ? this.cancelSong.bind(this)
              : this.playSong.bind(this)
          }
        >
          {this.state.playing ? (this.state.songApi ? `▶️` : `⏬`) : `⏸️ `}
        </a>
        {name}
      </div>
    );
  }
}

export default Song;
