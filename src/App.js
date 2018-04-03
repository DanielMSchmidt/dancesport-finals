import React, { Component } from "react";
import smoothfade from "smoothfade";
import "./App.css";

import MusicDrop from "./MusicDrop";
import SongList from "./SongList";
import SongController from "./SongController";

const seconds = 1000;

class App extends Component {
  constructor() {
    super();
    this.state = { songs: [], defaultLength: 10 };
  }

  async playFinal() {
    console.log("PlayFinal");
    const { defaultLength, fadeTime, songs } = this.state;

    const songSources = [];
    for (let i = 0; i < songs.length; i++) {
      console.log("Decode", i);
      const source = new SongController(songs[i]);
      songSources.push(source);
      console.log("Done", i);
    }

    // play songs for given length after each other
    for (let i = 0; i <= songSources.length; i++) {
      setTimeout(() => {
        const num = i;
        if (num !== 0) {
          songSources[num - 1].stop(10);
          console.timeEnd("NUM" + (num - 1));
        }
        console.time("NUM" + num);

        if (num !== songSources.length) {
          songSources[num].start();
        }
      }, defaultLength * seconds * i);
    }
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

          <a onClick={this.playFinal.bind(this)}>Play Final</a>
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
