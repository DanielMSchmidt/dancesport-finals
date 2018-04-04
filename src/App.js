import React, { Component } from "react";
import Recorder from "recorderjs";

import "./App.css";

import MusicDrop from "./MusicDrop";
import SongList from "./SongList";
import SongController from "./SongController";

function forceDownload(blob, filename) {
  var url = URL.createObjectURL(blob);

  // Create hidden anchor and click it to initiate the download
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = filename;
  console.log(a);
  a.click();
  URL.revokeObjectURL(url);
}

const seconds = 1000;

class App extends Component {
  constructor() {
    super();

    this.state = {
      songs: [],
      defaultLength: 20,
      fadeTime: 10,
      playing: false,
      recording: false
    };
  }

  async playFinal(record) {
    this.setState({ playing: true, recording: record });
    const rec = new Recorder(SongController.getNode(), {
      workerPath: "/recorderWorker.js"
    });

    const { defaultLength, fadeTime, songs } = this.state;

    const songSources = [];
    for (let i = 0; i < songs.length; i++) {
      const source = new SongController(songs[i]);
      songSources.push(source);
    }

    this.setState({ songSources });

    rec.record();
    // play songs for given length after each other
    for (let i = 0; i <= songSources.length; i++) {
      setTimeout(async () => {
        const num = i;
        if (num !== 0) {
          await songSources[num - 1].stop(fadeTime);
        }

        if (num !== songSources.length) {
          songSources[num].start();
        } else {
          // The end
          this.setState({
            songSources: null,
            playing: false,
            recording: false
          });

          rec.stop();

          rec.exportWAV(blob => {
            forceDownload(blob, "final.wav");
          });
        }
      }, (defaultLength - fadeTime) * seconds * i);
    }
  }

  abortFinal(record) {
    if (this.state.songSources) {
      this.state.songSources.forEach(source => source.stop());
      this.setState({
        songSources: null,
        playing: false,
        recording: false
      });
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

          {this.state.songs.length ? (
            this.state.recording ? (
              <a onClick={this.abortFinal.bind(this, true)}>Abort Recording</a>
            ) : (
              <a onClick={this.playFinal.bind(this, true)}>Record Final</a>
            )
          ) : null}
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
