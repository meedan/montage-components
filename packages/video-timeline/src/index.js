import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { react2angular } from 'react2angular';
import owtj from 'owtj';
import { SnackbarProvider } from 'notistack';

import { configureAppStore } from './configureStore';
import App from './App';

class VideoTimeline extends Component {
  render() {
    let data = {};
    if (this.props.$scope) {
      const { gdVideoData, ytVideoData, nextUrl, prevUrl, nextVideo, project, videoCollection } = JSON.parse(
        owtj(this.props.$scope.$parent.ctrl)
      );

      data = {
        gdVideoData,
        ytVideoData,
        nextUrl,
        prevUrl,
        nextVideo,
        project,
        videoCollection,
      };
    }

    const store = configureAppStore(this.props.$scope ? { data } : {});

    return (
      <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </Provider>
    );
  }
}

// const VideoTimeline = props => {
//   let data = {};
//   if (props.$scope) {
//     const { gdVideoData, ytVideoData, nextUrl, prevUrl, nextVideo, project, videoCollection } = JSON.parse(
//       owtj(props.$scope.$parent.ctrl)
//     );

//     data = {
//       gdVideoData,
//       ytVideoData,
//       nextUrl,
//       prevUrl,
//       nextVideo,
//       project,
//       videoCollection,
//     };
//   }

//   const store = configureAppStore(props.$scope ? { data } : {});

//   return (
//     <Provider store={store}>
//       <SnackbarProvider maxSnack={3}>
//         <App />
//       </SnackbarProvider>
//     </Provider>
//   );
// };

const root = document.getElementById('react-root');
if (root) {
  ReactDOM.render(<VideoTimeline />, root);
} else {
  console.log('no react-root, angular?');
}

console.log(VideoTimeline);

window.VT = VideoTimeline;
export default VideoTimeline;

// export const AngularVideoTimeline = react2angular(
//   VideoTimeline,
//   ['foo'],
//   ['$scope', '$http']
// );
// window.AngularVideoTimeline = AngularVideoTimeline;
