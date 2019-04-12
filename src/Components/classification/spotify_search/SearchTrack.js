import React from 'react';
import { Input } from 'semantic-ui-react';

export default function SearchTrack(props) {
  return (
    <div id="cover">
      <form onSubmit={props.handleSubmitSong}>
        <div className="tb">
          <input
            type="text"
            placeholder="Search for a song..."
            name="songQuery"
            onChange={props.handleChange}
            value={props.songQuery}
          />
          <div className="td" id="s-cover">
            <button type="submit">
              <div id="s-circle" />
              <span />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

{
  /* <form onSubmit={props.handleSubmitSong}>
      <br />
      <input
        placeholder="Search for a song..."
        name="songQuery"
        onChange={props.handleChange}
        value={props.songQuery}
        style={{
          marginBottom: '40px',
          fontSize: '70%',
          width: '100%',
          height: '40px',
          borderRadius: '10px',
        }}
      />
    </form> */
}
