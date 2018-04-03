import React, { Component } from "react";
import "./App.css";

import MusicDrop from "./MusicDrop";
import SongList from "./SongList";

class App extends Component {
  constructor() {
    super();
    this.state = { songs: [] };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Let's mix some finals</h1>
        </header>

        <section>
          <MusicDrop
            onNewMusic={file =>
              this.setState(state => ({
                songs: [...state.songs, file]
              }))
            }
          />
        </section>

        <section>
          <SongList
            songs={this.state.songs.map(song => ({
              id: song.name,
              content: song
            }))}
            setReorderedSongs={newSongs =>
              this.setState({ songs: newSongs.map(song => song.content) })
            }
          />
        </section>
      </div>
    );
  }
}

export default App;
