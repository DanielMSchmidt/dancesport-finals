import React, { Component } from "react";
import "./App.css";

import MusicDrop from "./MusicDrop";
import SongList from "./SongList";
import SongController from "./SongController";

const seconds = 1000;

class App extends Component {
  constructor() {
    super();
    this.state = { songs: [], defaultLength: 20, fadeTime: 10, playing: false };
  }

  async playFinal() {
    this.setState({ playing: true });
    const { defaultLength, fadeTime, songs } = this.state;

    const songSources = [];
    for (let i = 0; i < songs.length; i++) {
      console.log("Decode", i);
      const source = new SongController(songs[i]);
      songSources.push(source);
      console.log("Done", i);
    }

    this.setState({ songSources });

    // play songs for given length after each other
    for (let i = 0; i <= songSources.length; i++) {
      setTimeout(async () => {
        const num = i;
        if (num !== 0) {
          await songSources[num - 1].stop(fadeTime);
          console.timeEnd("NUM" + (num - 1));
        }
        console.time("NUM" + num);

        if (num !== songSources.length) {
          songSources[num].start();
        } else {
          this.setState({ songSources: null, playing: false });
        }
      }, (defaultLength - fadeTime) * seconds * i);
    }
  }

  abortFinal() {
    if (this.state.songSources) {
      this.state.songSources.forEach(source => source.stop());
      this.setState({ songSources: null, playing: false });
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

          {this.state.songs.length ? (
            this.state.playing ? (
              <a onClick={this.abortFinal.bind(this)}>Abort Final</a>
            ) : (
              <a onClick={this.playFinal.bind(this)}>Play Final</a>
            )
          ) : (
            <p>Please add some songs so that we can start a final</p>
          )}
        </section>

        <section>
          <SongList
            songs={this.state.songs.map(song => ({
              id: song.name,
              content: song
            }))}
            setReorderedSongs={newSongs =>
              this.setState({
                songs: newSongs.map(song => song.content)
              })
            }
          />
        </section>
      </div>
    );
  }
}

export default App;
