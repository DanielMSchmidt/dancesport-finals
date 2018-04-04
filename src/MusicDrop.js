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
    const supportedFiles = files.filter(file =>
      SUPPORTED_AUDIO_FORMATS.includes(file.type)
    );

    if (!supportedFiles.length) {
      this.setState({
        error: true
      });
    } else {
      supportedFiles.forEach(file => this.props.onNewMusic(file));
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
      <Dropzone
        style={{
          width: "calc(100% - 15px)",
          height: "100px",
          margin: "5px",
          borderWidth: "2px",
          borderColor: "rgb(102, 102, 102)",
          borderStyle: "dashed",
          borderRadius: "5px"
        }}
        onDrop={this.onDrop.bind(this)}
      >
        {this.state.error ? (
          error
        ) : (
          <h5 style={{ marginTop: 30 }}>Please drop your music here</h5>
        )}
      </Dropzone>
    );
  }
}

export default MusicDrop;
