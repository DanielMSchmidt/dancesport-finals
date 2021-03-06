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

    const songStartTimes = songSources.map(
      (_, index) => index * songLength + index * pauseLength
    );
    const songEndTimes = songSources.map(
      (_, index) => (index + 1) * songLength + index * pauseLength
    );

    songStartTimes.forEach((startTime, index) => {
      setTimeout(() => {
        songSources[index].start();
      }, startTime * seconds);
    });

    songEndTimes.forEach((endTime, index) => {
      setTimeout(() => {
        songSources[index].stop(pauseLength);
      }, endTime * seconds);
    });

    const endOfFinal =
      (songEndTimes[songEndTimes.length - 1] + pauseLength) * seconds;

    setTimeout(() => {
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
    }, endOfFinal);
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
        {this.state.songs.length ? (
          <div>
            <Centered>
              <ButtonGroup>{recordButton}</ButtonGroup>
              <p style={{ marginTop: 10 }}>
                Unfortunately we need to play the final one time to save it.
                Afterwards the final will automatically be downloaded to your
                computer.
              </p>
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
              <p>You can drag this list to sort it</p>

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
          </div>
        ) : null}
      </Container>
    );
  }
}

export default App;
