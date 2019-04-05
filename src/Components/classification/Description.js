import React from 'react';
import { PredictionChart } from './';

export default function Description(props) {
  return (
    <div className="center-all">
      <div>
        <h3>Algorithm</h3>
        <p>
          The model used is random forest provided by sklearn. There were a 100
          trees in the forest with no max depth as well as max features being
          the square of the number of features. The data was split into a 4:1
          for test and train. This gave me the best accuracy score (there is no
          class inbalance and thus is a good metric to gauge...) Other
          algorithms tested were KNN and XGboost
        </p>
      </div>
      <div>
        <h3>Results</h3>
        <p>
          I looked at accuracy, as well as precision and recall for all genres.
          The model did especially well with regards to Classical and Jazz
          music. Interestingly it would get confused with only jazz music when
          prediciting classical, however it was more broad when predicting jazz.
          <br />
          Graphed bellow represent how the model predicted for each genre with
          the holdout test data.
        </p>
        <PredictionChart data={props.data} precision={props.precision} />
      </div>
    </div>
  );
}
