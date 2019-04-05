import React from 'react';
import { Input } from 'semantic-ui-react';

export default function SearchTrack(props) {
  return (
    <form onSubmit={props.handleSubmitSong}>
      <br />
      <Input
        placeholder="Search for a song..."
        name="songQuery"
        onChange={props.handleChange}
        value={props.songQuery}
        style={{ marginBottom: '40px', fontSize: '70%' }}
      />
    </form>
  );
}
