import React, { Component } from 'react';
import { SearchTrack, TrackProfile, TrackProbChart } from './';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songQuery: '',
      tracks: [],
      probs: [],
      isLoading: false,
    };
  }

  handleSubmitSong = async event => {
    event.preventDefault();
    try {
      const { songQuery } = this.state;
      const songQueryURI = encodeURIComponent(songQuery);
      const response = await fetch(`/api/search?query=${songQueryURI}`);
      const tracks = await response.json();
      this.setState({
        songQuery: '',
        tracks,
        selected: {},
        probs: [],
        isLoaded: true,
      });
    } catch (err) {
      this.setState({ message: 'error', isLoaded: false });
      console.log(err.message);
    }
  };

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value, isLoading: false });
  };

  getPredictions = async (uri, selected) => {
    try {
      const response = await fetch(`/api/data?uri=${uri}`);
      const data = await response.json();
      this.setState({
        message: data.message,
        selected,
        probs: data.probs,
        trackInfo: data.track_info,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleClick = async (uri, selected) => {
    this.setState({ isLoading: true, tracks: [] });
    this.getPredictions(uri, selected);
  };

  render() {
    if (this.state.isLoaded && this.state.tracks.length > 2) {
      // this.props.history.push();
    }
    return (
      <div className="center-all" id="search-form">
        <SearchTrack
          {...this.state}
          handleChange={this.handleChange}
          handleSubmitSong={this.handleSubmitSong}
        />
        {this.state.tracks.length > 2 ? (
          <section id="results">
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
          </section>
        ) : (
          <div style={{ height: '50px', width: '100%' }} />
        )}
        {this.state.probs.length ? (
          <div style={{ maxWidth: '1000px', width: '100%' }}>
            <TrackProbChart
              data={this.state.probs}
              track={this.state.selected}
            />
          </div>
        ) : this.state.isLoading ? (
          <ReactLoading type="spinningBubbles" color="rgba(255,255,255,0.5)" />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default withRouter(Search);
