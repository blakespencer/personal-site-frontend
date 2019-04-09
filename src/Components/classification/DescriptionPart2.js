import React from 'react';
import { FeatureImportanceChart } from './';
import ReactLoading from 'react-loading';

export default function DescriptionPart2(props) {
  return (
    <div className="center-all">
      <div>
        <p>
          The models feature importance showed that Dancablility gave the most
          information to the model. In the histogram chart above one can notice
          the seporation of each genre. Energy gave the second most information
          to the model, however
        </p>
        {props.featureImportance ? (
          <FeatureImportanceChart featureImportance={props.featureImportance} />
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
