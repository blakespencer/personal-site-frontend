import React, { Component } from 'react';

export default class FinalProject extends Component {
  state = {
    songs: [],
    uploading: false,
    songsData: [],
    playlist: [],
  };

  async componentDidMount() {
    const res = await fetch('/api/songs');
    console.log('response', res);
    const data = await res.json();
    this.setState({ songsData: data });
  }

  handleChange = evt => {
    this.setState({ uploading: true });
    const file = evt.target.files[0];
    // <----- Look here ----->
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = evt => {
      const formData = {
        file: evt.target.result,
      };
      fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          this.setState({ songs: data });
        });
    };
  };

  handleSubmit = evt => {
    evt.preventDefault();
  };

  handleClick = async idx => {
    const res = await fetch(`/api/playlist?idx=${idx}`);
    console.log('clicked', res);
    const data = await res.json();
    this.setState({ playlist: data });
  };

  render() {
    return (
      <div>
        <h1 style={{ paddingTop: 100 }}>FinalProject</h1>
        <audio ref="audio_tag" src="/music/test.mp3" controls />
        {/* <form onSubmit={this.handleSubmit}>
          <input type="file" name="song" onChange={this.handleChange} />
          <input type="submit" value="Upload File" />
        </form> */}
        {this.state.songs.map(el => {
          const [artist, song] = el
            .split('-->ARITST<--')[1]
            .split('-->SONG<--');
          return (
            <div>
              Artist: {artist}, Song: {song.replace('_H.png', '')}
            </div>
          );
        })}
        <div>
          {this.state.playlist.length ? (
            <div>
              <h3>PLAYLIST</h3>
              {this.state.playlist.map((el, idx) => {
                const [artist, song] = el
                  .split('-->ARITST<--')[1]
                  .split('-->SONG<--');
                return (
                  <div onClick={() => this.handleClick(idx)}>
                    Artist: {artist}, Song: {song.replace('_H.png', '')}
                  </div>
                );
              })}
              <h3>PLAYLIST</h3>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div>
          {this.state.songsData.map((el, idx) => {
            const [artist, song] = el
              .split('-->ARITST<--')[1]
              .split('-->SONG<--');
            return (
              <div onClick={() => this.handleClick(idx)}>
                Artist: {artist}, Song: {song.replace('_H.png', '')}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
