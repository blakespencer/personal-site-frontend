import React from 'react';
import { HisogramChart } from './';
import { HashLink as Link } from 'react-router-hash-link';
import ReactLoading from 'react-loading';

export default function Intro(props) {
  return (
    <div className="center-all" id="classification-content">
      <div>
        <h1>Classifying Music Genre</h1>
        <p>
          Music genre is fluid, dynamic and ever evolving. I wanted to see if it
          was possible to correctly classify music into predetermined genres
          based on a limited set of features. To try out my model by{' '}
          <Link smooth to="/classification#model">
            Clicking Here
          </Link>
        </p>
      </div>
      <div>
        <h3>The Design</h3>
        <p>
          Pick six high-level genres to group songs. Then find a data source to
          provide a sufficiant amount of song data for each genre. Once the data
          has been aquired, train a random forest model. Then test the model on
          a hold out dataset to appropriately tune hyperparameters.
        </p>
      </div>
      <div>
        <h3>The Data</h3>
        <p>
          The six geners chosen were classical, jazz, reggae, rap, rock, dance.
          Using Spotify's API, 1000 songs were obtained for each genre. These
          came from premade Spotify curated playlists. Spotify realeases many
          different features for songs that include Danceability, Valence, Tempo
          etc. These were then gathered and stored for the 6000 songs with genre
          labels.
          <br />
          <br />
          Below is a graph of the distrobutions for each feature across genres
        </p>
        {props.histogram ? (
          <HisogramChart data={props.histogram} />
        ) : (
          <ReactLoading
            type="spinningBubbles"
            color="rgba(255,255,255,0.5)"
            className="loading"
          />
        )}
      </div>
    </div>
  );
}
