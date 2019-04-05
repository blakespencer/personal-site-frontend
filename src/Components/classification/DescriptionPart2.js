import React from 'react';

export default function DescriptionPart2() {
  return (
    <div className="center-all">
      <p>
        The models feature importance showed that Dancablility gave the most
        information to the model. In the histogram chart above one can notice
        the seporation of each genre. Energy gave the second most information to
        the model, however
      </p>
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
      </div>
    </div>
  );
}
