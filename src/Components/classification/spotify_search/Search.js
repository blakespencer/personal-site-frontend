import React, { Component } from 'react';
import { SearchTrack, TrackProfile, TrackProbChart } from '.';

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songQuery: '',
      tracks: [],
      probs: [],
    };
  }

  handleSubmitSong = async event => {
    event.preventDefault();
    try {
      const { songQuery } = this.state;
      const songQueryURI = encodeURIComponent(songQuery);
      const response = await fetch(`/api/search?query=${songQueryURI}`);
      const tracks = await response.json();
      this.setState({ songQuery: '', tracks, selected: {}, probs: [] });
    } catch (err) {
      this.setState({ message: 'error' });
      console.log(err.message);
    }
  };

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  handleClick = async (uri, selected) => {
    const response = await fetch(`/api/data?uri=${uri}`);
    const data = await response.json();
    this.setState({
      message: data.message,
      tracks: [],
      selected,
      probs: data.probs,
      trackInfo: data.track_info,
    });
  };

  render() {
    return (
      <div className="center-all" id="search-form">
        <SearchTrack
          {...this.state}
          handleChange={this.handleChange}
          handleSubmitSong={this.handleSubmitSong}
        />
        <div id="profile-container">
          {this.state.tracks.map(track => {
            return (
              <TrackProfile
                key={track.uri}
                {...track}
                handleClick={this.handleClick}
              />
            );
          })}
        </div>
        {this.state.probs.length ? (
          <TrackProbChart data={this.state.probs} track={this.state.selected} />
        ) : (
          <div />
        )}
      </div>
    );
  }
}
