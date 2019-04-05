import React from 'react';

export default function TrackProfile(props) {
  let { uri, name } = props;
  let artist = props.artists[0].name;
  const albumImageURI = props['album']['images'][0]['url'];
  if (name.length > 17) {
    name = name.slice(0, 17) + '...';
  }
  if (artist.length > 17) {
    artist = artist.slice(0, 17) + '...';
  }

  return (
    <div
      className="artist-profile"
      onClick={() =>
        props.handleClick(uri, {
          name,
          artists: [{ name: artist }],
          album: { images: [{ url: albumImageURI }] },
        })
      }
    >
      <img className="artist-img" src={albumImageURI} alt="" />
      <div className="artist-container">
        <div>{name}</div>
        <div className="artist-name">{artist}</div>
      </div>
    </div>
  );
}
