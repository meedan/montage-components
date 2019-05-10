// import 'rc-slider/assets/index.css';
// import React, { Component } from 'react';
// import Slider from 'rc-slider';
// import produce from 'immer';
// import Flatted from 'flatted/esm';
// import { connect } from 'react-redux';
//
// import AddIcon from '@material-ui/icons/Add';
// import IconButton from '@material-ui/core/IconButton';
// import PauseIcon from '@material-ui/icons/Pause';
// import PlayArrowIcon from '@material-ui/icons/PlayArrow';
// import Tooltip from '@material-ui/core/Tooltip';
//
// import ContentCutIcon from '@montage/ui/src/components/icons/ContentCutIcon';
//
// import EntityInstanceHandle from './ofEntities/EntityInstanceHandle';
// import EntityInstancePopover from './ofEntities/EntityInstancePopover';
// import EntitySliderWrapper from './ofEntities/EntitySliderWrapper';
// import EntityControls from './ofEntities/EntityControls';
// import TableBlock from './TableBlock';
// import TableSection from './TableSection';
//
// import { play, pause, seekTo } from '../../reducers/player';
//
// const Range = Slider.Range;
//
// class TimelinePlaces extends Component {
//   state = {
//     choords: { x: 0, y: 0 },
//     playlist: false,
//     values: {},
//   };
//
//   static getDerivedStateFromProps(props, state) {
//     const { data, duration, skip } = props;
//     let { videoPlaces } = data;
//
//     if (skip) return null;
//
//     const persisted = window.localStorage.getItem('videoPlaces');
//     if (persisted) videoPlaces = Flatted.parse(persisted);
//     // console.log(videoPlaces);
//
//     if (state.videoPlaces && state.segments) return null;
//
//     // merge overlapping place instances
//     videoPlaces.forEach(t => {
//       t.isCreating = false;
//       t.instances = t.instances
//         .sort((j, i) => j.start_seconds - i.start_seconds)
//         .reduce((acc = [], i) => {
//           const j = acc.pop();
//
//           if (j) {
//             if (
//               j.start_seconds <= i.start_seconds &&
//               i.start_seconds < j.end_seconds
//             ) {
//               j.start_seconds = Math.min(j.start_seconds, i.start_seconds);
//               j.end_seconds = Math.max(j.end_seconds, i.end_seconds);
//               acc.push(j);
//               return acc;
//             }
//
//             acc.push(j);
//           }
//
//           return [...acc, i];
//         }, []);
//     });
//
//     const segments = recomputeSegments(videoPlaces, duration);
//     return { videoPlaces, segments };
//   }
//
//   shouldComponentUpdate(nextProps, nextState) {
//     if (nextState !== this.state) {
//       window.localStorage.setItem(
//         'videoPlaces',
//         Flatted.stringify(nextState.videoPlaces)
//       );
//       // if (window.BIGNONO && Object.keys(window.BIGNONO).length > 0) window.localStorage.setItem('videoPlacesData', Flatted.stringify(window.BIGNONO));
//     }
//
//     if (nextProps.skip) return false;
//
//     if (
//       nextProps.currentTime !== this.props.currentTime &&
//       this.state.playlist
//     ) {
//       const segment = this.state.segments.find(
//         ([i, s, e]) => s <= nextProps.currentTime && nextProps.currentTime < e
//       );
//       if (!segment) {
//         const nextSegment = this.state.segments.find(
//           ([i, s]) => nextProps.currentTime < s
//         );
//         if (nextSegment) {
//           this.props.seekTo(nextSegment[1]);
//         } else {
//           if (this.props.playing) this.props.pause();
//           this.setState({ playlist: false });
//         }
//       }
//     }
//
//     // TODO handle extenal video override, like end of video, buffering, etc
//
//     return true;
//   }
//
//   handlePlayPause = () => {
//     const { playlist } = this.state;
//     console.log(playlist, this.props.playing);
//
//     if (!playlist) {
//       if (!this.props.playing) this.props.play();
//       this.setState({ playlist: true });
//     } else {
//       if (this.props.playing) this.props.pause();
//       this.setState({ playlist: false });
//     }
//   };
//
//   onAfterChange = (v, id) => {
//     const { values } = this.state;
//     const p = values[id] || [];
//
//     if (p.length === v.length) {
//       const val = v.find((d, i) => p[i] !== d);
//       if (val) this.props.onAfterChange(val);
//     }
//
//     values[id] = v;
//     this.setState({ values, isDragging: false });
//   };
//
//   onBeforeChange = (v, id) => {
//     const { values } = this.state;
//     const p = values[id] || [];
//
//     // deleteCurrent = () => {
//     //   this.setState({
//     //     drawPolygon: false,
//     //     dropPin: false,
//     //     marker: {},
//     //     saved: true,
//     //   });
//     // };
//     if (p.length === v.length) {
//       const val = v.find((d, i) => p[i] !== d);
//       if (val) this.props.onBeforeChange(val);
//     }
//
//     values[id] = v;
//     this.setState({
//       values,
//       targetInstance: null,
//       targetPlace: null,
//       isDragging: true,
//     });
//   };
//
//   onChange = (v, id) => {
//     const { values } = this.state;
//     const { duration } = this.props;
//     const p = values[id] || [];
//
//     let val;
//     if (p.length === v.length) {
//       val = v.find((d, i) => p[i] !== d);
//       if (val) this.props.onChange(val);
//     }
//
//     const j = v.findIndex(d => d === val);
//
//     const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
//       const ti = nextVideoPlaces.findIndex(t => t.id === id);
//       const t = nextVideoPlaces[ti];
//
//       const i = t.instances.sort((p, q) => p.start_seconds - q.start_seconds)[
//         (j - (j % 2)) / 2
//       ];
//
//       if (i && j % 2 === 0) i.start_seconds = val;
//       if (i && j % 2 === 1) i.end_seconds = val;
//     });
//
//     values[id] = v;
//     const segments = recomputeSegments(videoPlaces, duration);
//     this.setState({ videoPlaces, segments, values });
//   };
//
//   startNewInstance = id => {
//     const { currentTime, duration } = this.props;
//
//     const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
//       const ti = nextVideoPlaces.findIndex(t => t.id === id);
//       const t = nextVideoPlaces[ti];
//
//       const i = t.instances.find(
//         i => i.start_seconds <= currentTime && currentTime < i.end_seconds
//       );
//       if (i) {
//         console.log('cannot make overlapping instances');
//       } else {
//         t.instances.push({
//           id: Math.random()
//             .toString(36)
//             .substring(2),
//           start_seconds: currentTime,
//           end_seconds: currentTime + 5,
//         });
//       }
//     });
//
//     const segments = recomputeSegments(videoPlaces, duration);
//     this.setState({ videoPlaces, segments });
//   };
//
//   startNewPlace = () => {
//     const { currentTime, duration } = this.props;
//     const id = Math.random()
//       .toString(36)
//       .substring(2);
//
//     const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
//       nextVideoPlaces.splice(0, 0, {
//         id,
//         isCreating: true,
//         instances: [
//           {
//             id: Math.random()
//               .toString(36)
//               .substring(2),
//             start_seconds: currentTime,
//             end_seconds: currentTime + 5,
//           },
//         ],
//         project_location: {
//           name: '',
//         },
//       });
//     });
//
//     const segments = recomputeSegments(videoPlaces, duration);
//     this.setState({ videoPlaces, segments });
//   };
//
//   stopNewPlace = () => {
//     console.log('this.stopNewPlace()');
//     const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
//       nextVideoPlaces.splice(0, 1);
//     });
//
//     this.setState({ videoPlaces });
//   };
//
//   leMenuOff = ({ clientX, clientY, currentTarget }) => {
//     const rect = currentTarget.getBoundingClientRect();
//     // console.log(rect, clientX, clientY);
//
//     if (
//       rect.x < clientX &&
//       clientX < rect.x + rect.width &&
//       rect.y < clientY &&
//       clientY < rect.y + rect.height
//     ) {
//       // all fine
//     } else {
//       // console.log('outside', rect, clientX, clientY);
//       this.setState({
//         targetInstance: null,
//         targetPlace: null,
//       });
//     }
//   };
//
//   leMenu = (e, id) => {
//     if (!e) {
//       this.setState({
//         targetInstance: null,
//         targetPlace: null,
//       });
//       return;
//     }
//
//     const { videoPlaces } = this.state;
//     const { duration } = this.props;
//
//     const rect = e.currentTarget.getBoundingClientRect();
//     const mousePos = e.clientX - rect.left;
//     const relativeMousePos = mousePos > 0 ? mousePos : 0;
//     const mouseTime = (duration * relativeMousePos) / rect.width;
//
//     const targetPlace = videoPlaces.find(t => t.id === id);
//     if (!targetPlace) {
//       this.setState({
//         mousePos,
//         mouseTime,
//         targetInstance: null,
//         targetPlace: null,
//       });
//       return;
//     }
//
//     const pxs = rect.width / duration;
//
//     // 4px handle -> time
//     const handle = 4 / pxs;
//     const targetInstance = targetPlace.instances.find(
//       i =>
//         i.start_seconds - handle <= mouseTime &&
//         mouseTime < i.end_seconds + handle
//     );
//
//     const instanceStartX = targetInstance
//       ? pxs * targetInstance.start_seconds - 2
//       : 0;
//     const instanceEndX = targetInstance
//       ? pxs * targetInstance.end_seconds + 2
//       : 0;
//
//     const isOverHandle =
//       !targetPlace.instances.find(
//         i =>
//           i.start_seconds + handle <= mouseTime &&
//           mouseTime < i.end_seconds - handle
//       ) &&
//       !!targetPlace.instances.find(
//         i =>
//           i.start_seconds - handle <= mouseTime &&
//           mouseTime < i.end_seconds + handle
//       );
//
//     const handleOverStart = targetPlace.instances.find(
//       i => i.start_seconds - handle <= mouseTime && mouseTime < i.start_seconds
//     );
//
//     const handleOverEnd = targetPlace.instances.find(
//       i => i.end_seconds <= mouseTime && mouseTime < i.end_seconds + handle
//     );
//
//     // get x choords
//     const getXChoord = () => {
//       if (handleOverStart) {
//         return instanceStartX;
//       } else if (handleOverEnd) {
//         return instanceEndX;
//       } else {
//         return instanceStartX + (instanceEndX - instanceStartX) / 2;
//       }
//     };
//
//     this.setState({
//       choords: {
//         x: getXChoord() + rect.left,
//         y: rect.top + rect.height,
//       },
//       isOverHandle,
//       targetInstance,
//       targetPlace,
//     });
//   };
//
//   deletePlace = id => {
//     const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
//       const i = nextVideoPlaces.findIndex(t => t.id === id);
//       nextVideoPlaces.splice(i, 1);
//     });
//
//     this.setState({ videoPlaces });
//   };
//
//   renamePlace = (id, name, marker) => {
//     const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
//       const i = nextVideoPlaces.findIndex(t => t.id === id);
//       nextVideoPlaces[i].project_location.name = name;
//       if (marker)
//         nextVideoPlaces[i].instances.forEach(j => {
//           j.data = marker;
//           j.data.time = j.start_seconds;
//           j.data.duration = j.end_seconds - j.start_seconds;
//         });
//     });
//
//     this.setState({ videoPlaces });
//   };
//
//   deleteInstance(id) {
//     const { targetInstance } = this.state;
//
//     const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
//       const ti = nextVideoPlaces.findIndex(t => t.id === id);
//       const ii = nextVideoPlaces[ti].instances.findIndex(
//         i => i.id === targetInstance.id
//       );
//       nextVideoPlaces[ti].instances.splice(ii, 1);
//     });
//
//     const segments = recomputeSegments(videoPlaces, this.props.duration);
//     this.setState({
//       videoPlaces,
//       segments,
//       targetInstance: null,
//       targetTag: null,
//     });
//   }
//
//   duplicateAsClip = id => {
//     const { targetInstance } = this.state;
//
//     const place = this.state.videoPlaces.find(t => t.id === id);
//     this.props.duplicateAsClip(place, targetInstance);
//
//     this.setState({
//       targetInstance: null,
//       targetTag: null,
//     });
//   };
//
//   expandInstance(id) {
//     const { targetInstance } = this.state;
//
//     const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
//       const ti = nextVideoPlaces.findIndex(t => t.id === id);
//       const i = nextVideoPlaces[ti].instances.find(
//         i => i.id === targetInstance.id
//       );
//       i.start_seconds = 0;
//       i.end_seconds = this.props.duration;
//       nextVideoPlaces[ti].instances = [i];
//     });
//
//     const segments = recomputeSegments(videoPlaces, this.props.duration);
//     this.setState({
//       videoPlaces,
//       segments,
//       targetInstance: null,
//       targetTag: null,
//     });
//   }
//
//   render() {
//     const { currentTime, duration, data } = this.props;
//     const { videoPlaces, playlist } = this.state;
//     const { projectplaces } = data.project;
//
//     return (
//       <TableSection
//         plain={videoPlaces ? videoPlaces.length > 0 : false}
//         title="Places"
//         actions={
//           <>
//             <Tooltip title={playlist ? 'Pause places' : 'Play places'}>
//               <IconButton onClick={this.handlePlayPause}>
//                 {playlist ? (
//                   <PauseIcon fontSize="small" />
//                 ) : (
//                   <PlayArrowIcon fontSize="small" />
//                 )}
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="New Place">
//               <IconButton onClick={this.startNewPlace}>
//                 <AddIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </>
//         }
//         onMouseLeave={this.leMenuOff}
//       >
//         {videoPlaces
//           ? videoPlaces.map((place, i) => {
//               const { project_location, instances } = place;
//               const arr = [];
//
//               Array.from(instances)
//                 .sort((p, q) => p.start_seconds - q.start_seconds)
//                 .map(instance => {
//                   arr.push(instance.start_seconds);
//                   arr.push(instance.end_seconds);
//                   return null;
//                 });
//
//               arr.sort((p, q) => p - q);
//
//               const trackStyle = arr.reduce((acc, j, i) => {
//                 return [
//                   ...acc,
//                   {
//                     backgroundColor:
//                       i % 2 === 0 ? 'rgba(71, 123, 181, 0.4)' : 'transparent',
//                   },
//                 ];
//               }, []);
//
//               // console.log(place.id, arr);
//
//               return (
//                 <TableBlock
//                   key={place.id}
//                   plain={i < videoPlaces.length - 1}
//                   leftColContent={
//                     <EntityControls
//                       deleteEntity={() => this.deletePlace(place.id)}
//                       entityId={place.id}
//                       entityName={project_location.name}
//                       entityType="place"
//                       isCreating={place.isCreating}
//                       startNewInstance={() => this.startNewInstance(place.id)}
//                       stopNewEntity={this.stopNewPlace}
//                       suggestions={projectplaces}
//                       updateEntity={name => this.renamePlace(place.id, name)}
//                     />
//                   }
//                   rightColContent={
//                     <>
//                       <EntitySliderWrapper
//                         onMouseMove={
//                           !this.state.isDragging
//                             ? e => this.leMenu(e, place.id)
//                             : null
//                         }
//                         onMouseOver={
//                           !this.state.isDragging
//                             ? e => this.leMenu(e, place.id)
//                             : null
//                         }
//                       >
//                         <MemoizedRange
//                           key={place.id}
//                           defaultValue={arr}
//                           value={arr}
//                           handle={handleProps => (
//                             <EntityInstanceHandle {...handleProps} />
//                           )}
//                           max={duration}
//                           min={0}
//                           trackStyle={trackStyle}
//                           pushable
//                           onAfterChange={v => this.onAfterChange(v, place.id)}
//                           onBeforeChange={v => this.onBeforeChange(v, place.id)}
//                           onChange={v => this.onChange(v, place.id)}
//                         />
//                       </EntitySliderWrapper>
//                       <EntityInstancePopover
//                         choords={{
//                           x: this.state.choords.x,
//                           y: this.state.choords.y,
//                         }}
//                         entity={this.state.targetPlace}
//                         entityId={place.id}
//                         instance={this.state.targetInstance}
//                         isOverHandle={this.state.isOverHandle}
//                         onDelete={() => this.deleteInstance(place.id)}
//                         onExit={this.leMenuOff}
//                         onExtend={() => this.expandInstance(place.id)}
//                       >
//                         <Tooltip title="Copy to Clips">
//                           <IconButton
//                             onClick={() => this.duplicateAsClip(place.id)}
//                           >
//                             <ContentCutIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </EntityInstancePopover>
//                       <style scoped>
//                         {'#instanceControlsPopover { pointer-events: none; }'}
//                       </style>
//                     </>
//                   }
//                 />
//               );
//             })
//           : null}
//       </TableSection>
//     );
//   }
// }
//
// const recomputeSegments = (videoPlaces, duration) => {
//   const instances = videoPlaces
//     .reduce((acc, t) => [...acc, ...t.instances], [])
//     .sort((j, i) => j.start_seconds - i.start_seconds);
//
//   const events = [
//     ...new Set(
//       instances.reduce((acc, i) => [...acc, i.start_seconds, i.end_seconds], [
//         0,
//         duration,
//       ])
//     ),
//   ].sort((j, i) => j - i);
//
//   const segments = events
//     .reduce(
//       (acc, e, i) => {
//         if (i === 0) return acc;
//         return [...acc, events[i - 1] + (events[i] - events[i - 1]) / 2];
//       },
//       [0]
//     )
//     .reduce(
//       (acc, s, i) =>
//         !!instances.find(j => j.start_seconds <= s && s < j.end_seconds)
//           ? [...acc, i]
//           : acc,
//       []
//     )
//     .map(i => [i, events[i - 1], events[i]]);
//
//   return segments;
// };
//
// const MemoizedRange = React.memo(props => <Range {...props} />);
//
// // export default React.memo(props => <TimelinePlaces {...props} />);
// export default connect(
//   null,
//   { play, pause, seekTo }
// )(React.memo(props => <TimelinePlaces {...props} />));