import React, { Component } from "react";
import Dropzone from "react-dropzone";

// Supported by web audio api: https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats
const SUPPORTED_AUDIO_FORMATS = [
  "audio/mp3",
  "audio/mpeg",
  "audio/webm",
  "audio/wav",
  "audio/flac"
];

class MusicDrop extends Component {
  constructor() {
    super();
    this.state = { error: false };
  }

  onDrop(files) {
    console.log(files);
    const supportedFiles = files.filter(file =>
      SUPPORTED_AUDIO_FORMATS.includes(file.type)
    );

    if (!supportedFiles.length) {
      this.setState({
        error: true
      });
    } else {
      this.setState({ error: false });
      supportedFiles.map(file => this.props.onNewMusic(file));
    }
  }

  render() {
    const error = (
      <div>
        <p class="error">
          This file type is not supported, please use on of these:
        </p>
        <ul>
          {SUPPORTED_AUDIO_FORMATS.map(format => (
            <li key={format}>{format}</li>
          ))}
        </ul>
      </div>
    );

    return (
      <div className="dropzone">
        <Dropzone onDrop={this.onDrop.bind(this)}>
          {this.state.error ? error : <p>Please drop your music here</p>}
        </Dropzone>
      </div>
    );
  }
}

export default MusicDrop;
