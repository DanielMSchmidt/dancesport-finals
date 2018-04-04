import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
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

const Centered = ({ children }) => (
  <Row style={{ marginTop: 20, marginBottom: 20 }}>
    <Col xs="0" lg="3" />
    <Col xs="12" lg="6">
      {children}
    </Col>
    <Col xs="0" lg="3" />
  </Row>
);

const seconds = 1000;

class App extends Component {
  constructor() {
    super();

    this.state = {
      songs: [],
      songLength: 90,
      pauseLength: 30,
      playing: false,
      recording: false
    };
  }

  async playFinal(record) {
    this.setState({ playing: true, recording: record });
    const rec = new Recorder(SongController.getNode(), {
      workerPath: "/recorderWorker.js"
    });

    const { songLength, pauseLength, songs } = this.state;

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
          await songSources[num - 1].stop(pauseLength);
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
      }, songLength * seconds * i - pauseLength);
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
    const playButton = this.state.songs.length ? (
      this.state.playing ? (
        <Button color="danger" onClick={this.abortFinal.bind(this)}>
          Abort Final
        </Button>
      ) : (
        <Button color="primary" onClick={this.playFinal.bind(this)}>
          Play Final
        </Button>
      )
    ) : null;

    const recordButton = this.state.songs.length ? (
      this.state.recording ? (
        <Button color="danger" onClick={this.abortFinal.bind(this, true)}>
          Abort Recording
        </Button>
      ) : (
        <Button color="primary" onClick={this.playFinal.bind(this, true)}>
          Record & Play Final
        </Button>
      )
    ) : null;

    return (
      <Container className="App">
        <Centered>
          <h1 className="display-5">Let's mix some finals</h1>
        </Centered>

        <Centered>
          <MusicDrop
            onNewMusic={file =>
              this.setState(state => ({
                songs: [...state.songs, file]
              }))
            }
          />
        </Centered>

        <Centered>
          <ButtonGroup>
            {playButton}
            {recordButton}
          </ButtonGroup>
        </Centered>

        <Row>
          <Col xs="12" md="6">
            <Form>
              <FormGroup>
                <Label for="exampleNumber">
                  Length of the final in seconds
                </Label>
                <Input
                  type="number"
                  name="length"
                  placeholder="90"
                  value={this.state.songLength}
                  onChange={event =>
                    this.setState({
                      songLength: parseInt(event.target.value, 10)
                    })
                  }
                />
              </FormGroup>
            </Form>
          </Col>

          <Col xs="12" md="6">
            <Form>
              <FormGroup>
                <Label for="exampleNumber">
                  Pause between the dances in seconds
                </Label>
                <Input
                  type="number"
                  name="length"
                  placeholder="30"
                  value={this.state.pauseLength}
                  onChange={event =>
                    this.setState({
                      pauseLength: parseInt(event.target.value, 10)
                    })
                  }
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>

        <Centered>
          {this.state.songs.length ? (
            <p>You can drag this list to sort it</p>
          ) : null}

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
        </Centered>
      </Container>
    );
  }
}

export default App;
