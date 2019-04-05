import React from 'react';

export default function SearchTrack(props) {
  return (
    <form onSubmit={props.handleSubmitSong}>
      <label>Search for a song</label>
      <br />
      <input
        name="songQuery"
        value={props.songQuery}
        onChange={props.handleChange}
        style={{ marginBottom: '40px' }}
      />

      <button type="submit" value="Submit" className="btn btn-dark">
        Submit
      </button>
    </form>
  );
}
