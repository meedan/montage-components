import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { react2angular } from 'react2angular';
import { useLocalQuery, LocalQueryRenderer } from 'react-relay-local-query';
// import { LocalQueryRenderer } from 'react-relay-local-query';
import owtj from 'owtj';
import { SnackbarProvider } from 'notistack';
import { graphql, QueryRenderer } from 'react-relay';
import { ROOT_ID, commitLocalUpdate } from 'relay-runtime';

import baseData from './data/baseData';
import timelineData from './data/timelineData';
import newData from './data/newData';
import transcripts from './data/transcripts';

import { configureAppStore } from './configureStore';
import { createEnvironment } from './Environment';
import App from './App';

const data = {
  ...baseData, // Base data from Laurian’s account
  ...timelineData, // Base data from Laurian’s account
  ...newData, // Add new data missing in the API
  // project: {
  //   ...baseData.project,
  //   projectplaces: [{ id: 2070, name: 'Syria', placeinstance_count: 1 }],
  //   projectclips: [{ id: 2070, name: 'Shareable', clipinstance_count: 1 }],
  // },
  transcripts,
};

console.log({ data });

const VideoTimeline2 = props => {
  let data = {};
  // if (props.$scope) {
  //   const {
  //     gdVideoData,
  //     ytVideoData,
  //     nextUrl,
  //     prevUrl,
  //     nextVideo,
  //     project,
  //     videoCollection,
  //   } = JSON.parse(owtj(props.$scope.$parent.ctrl));

  //   data = {
  //     gdVideoData,
  //     ytVideoData,
  //     nextUrl,
  //     prevUrl,
  //     nextVideo,
  //     project,
  //     videoCollection,
  //   };
  // }

  const store = configureAppStore(props.$scope ? { data } : {});

  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </Provider>
  );
};

const environment = createEnvironment();

commitLocalUpdate(environment, store => {
  store.getRoot().setValue('AAA', 'localValue');
  // store.getRoot().setValue(data, 'data');
});

// const { localValue } = environment
//   .getStore()
//   .getSource()
//   .get(ROOT_ID);

const VideoTimeline = props => {
  return (
    <LocalQueryRenderer
      variables={{}}
      environment={environment}
      query={graphql`
        query srcQuery {
          __typename
          localValue
        }
      `}
      render={({ props }) => {
        return (
          <input
            value={props.localValue || ''}
            onChange={e =>
              commitLocalUpdate(environment, store => {
                store.getRoot().setValue(e.target.value, 'localValue');
              })
            }
          />
        );
      }}
    />
  );
};

const root = document.getElementById('react-root');
if (root) {
  ReactDOM.render(<VideoTimeline />, root);
} else {
  console.log('no react-root');
}
