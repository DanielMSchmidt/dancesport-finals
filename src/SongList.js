import React, { Component } from "react";

import Song from "./Song";

class SongList extends Component {
  render() {
    return (
      <ul>
        {this.props.songs.map(song => <Song key={song.name} song={song} />)}
      </ul>
    );
  }
}

export default SongList;
