import React from 'react';
import { FeatureImportanceChart } from './';

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
        <FeatureImportanceChart featureImportance={props.featureImportance} />
      </div>
    </div>
  );
}
