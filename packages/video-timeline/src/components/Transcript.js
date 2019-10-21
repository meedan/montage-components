// import Combinatorics from 'js-combinatorics';
import React from 'react';
import { connect } from 'react-redux';
// import produce from 'immer';
import chunk from 'lodash.chunk';
import styled from 'styled-components';
import { EditorState, convertFromRaw } from 'draft-js';

import { update } from '../reducers/data';

import '@montage/ui/assets/fonts/iconfont/style.css';

import BlockWrapper from './ofTranscript/BlockWrapper';
import CommentPopover from './ofTranscript/CommentPopover';
import HoverPopover from './ofTranscript/HoverPopover';
import Segment from './ofTranscript/Segment';
import SelectionPopover from './ofTranscript/SelectionPopover';
import TranscriptToolbar from './ofTranscript/TranscriptToolbar';
import TranscriptWrapper from './ofTranscript/TranscriptWrapper';
import { createEntityMap, generateDecorator, memoizedGetBlockTimings } from './ofTranscript/transcriptUtils';

const EMPTY_TRANSLATION = false;
const OVERLAPS = ['#b5cae1', '#91b0d3', '#6c95c4', '#467ebd', '#1c62b1', '#0250a9', 'red', 'red', 'red', 'red', 'red'];

const TranscriptRoot = styled.div`
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  user-select: none;
`;
const TranscriptChild = styled.div`
  flex: 1 1 100%;
  overflow-y: auto;
`;

class Transcript extends React.Component {
  state = {
    transcript: {},
    segments: [
      {
        start: 0,
        end: 0,
        editorStateA: EditorState.createEmpty(),
        key: 'editor-ZERO',
        editorStateB: EditorState.createEmpty(),
        customStyleMap: [],
        comments: [],
        tags: [],
        places: [],
      },
    ],
    comment: null,
    commentAnchor: null,
    customStyleMap: [],
    search: '',
    searchFocused: false,
    editable: false,
    // showTranslation: true,
    selectedTranslation: EMPTY_TRANSLATION ? null : 'it',
    translations: EMPTY_TRANSLATION ? null : ['it', 'pl'],
    css: '',
  };

  componentDidMount() {
    const { transcript, commentThreads, videoTags, videoPlaces } = this.props;
    this.loadTranscript(transcript, commentThreads, videoTags, videoPlaces);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { transcript, commentThreads, videoTags, videoPlaces } = nextProps;

    if (this.props.transcript !== transcript || videoTags !== this.props.videoTags) {
      this.loadTranscript(transcript, commentThreads, videoTags, videoPlaces);
    }

    if (nextProps.currentTime !== this.props.currentTime) {
      const time = nextProps.currentTime * 1e3;
      this.state.segments
        .filter(({ start, end }) => start <= time && time < end)
        .forEach(({ editorStateA, key }) => {
          const contentState = editorStateA.getCurrentContent();
          const blocks = contentState.getBlocksAsArray();
          let playheadBlockIndex = -1;

          playheadBlockIndex = blocks.findIndex(block => {
            const { start, end } = memoizedGetBlockTimings(contentState, block);
            return start <= time && time < end;
          });

          if (playheadBlockIndex > -1) {
            const playheadBlock = blocks[playheadBlockIndex];
            const playheadEntity = [
              ...new Set(
                playheadBlock
                  .getCharacterList()
                  .toArray()
                  .map(character => character.getEntity())
              ),
            ]
              .filter(value => !!value)
              .find(entity => {
                const { start, end } = contentState.getEntity(entity).getData();
                return start <= time && time < end;
              });

            // if (playheadEntity) {
            //   const { key } = contentState.getEntity(playheadEntity).getData();
            //   this.setState({
            //     playheadEditorKey: `editor-${blocks[0].key}`,
            //     playheadBlockKey: playheadBlock.getKey(),
            //     playheadEntityKey: key,
            //   });
            // } else {
            //   this.setState({ playheadEditorKey: `editor-${blocks[0].key}`, playheadBlockKey: playheadBlock.getKey() });
            // }

            if (this.idlePlayhead) cancelIdleCallback(this.idlePlayhead);
            this.idlePlayhead = requestIdleCallback(
              () => {
                if (playheadEntity) {
                  const { key } = contentState.getEntity(playheadEntity).getData();
                  this.setState({
                    playheadEditorKey: `editor-${blocks[0].key}`,
                    playheadBlockKey: playheadBlock.getKey(),
                    playheadEntityKey: key,
                  });

                  console.log({
                    playheadEditorKey: `editor-${blocks[0].key}`,
                    playheadBlockKey: playheadBlock.getKey(),
                    playheadEntityKey: key,
                  });
                } else {
                  this.setState({
                    playheadEditorKey: `editor-${blocks[0].key}`,
                    playheadBlockKey: playheadBlock.getKey(),
                  });
                  console.log({
                    playheadEditorKey: `editor-${blocks[0].key}`,
                    playheadBlockKey: playheadBlock.getKey(),
                  });
                }
              },
              { timeout: 500 }
            );
          }
        });
    }

    return true;
  }

  loadTranscript = (transcript, commentThreads, videoTags, videoPlaces) => {
    const customStyleMap = {
      ...commentThreads.reduce((acc, { id }) => ({ ...acc, [`C-${id}`]: { className: `C-${id}` } }), []),
      ...videoTags.reduce((acc, { id }) => ({ ...acc, [`T-${id}`]: { className: `T-${id}` } }), []),
      ...videoPlaces.reduce((acc, { id }) => ({ ...acc, [`G-${id}`]: { className: `G-${id}` } }), []),
    };

    const tagInstances = videoTags.reduce((acc, entity) => {
      const instances = entity.instances.map(instance => ({
        ...instance,
        entity,
      }));
      return [...acc, ...instances];
    }, []);

    const css = [videoTags.map(({ id }) => `.T-${id} { background-color: ${OVERLAPS[0]}; }`).join('\n')];

    const placesInstances = videoPlaces.reduce((acc, entity) => {
      const instances = entity.instances.map(instance => ({
        ...instance,
        entity,
      }));
      return [...acc, ...instances];
    }, []);

    const segments = chunk(transcript.segments, 2)
      .slice(0, 2)
      .map(segment => {
        const segmentStart = segment[0].start;
        const segmentEnd = segment[segment.length - 1].end;

        const comments = commentThreads.filter(
          ({ start_seconds }) => segmentStart <= start_seconds * 1e3 && start_seconds * 1e3 < segmentEnd
        );

        const tags = tagInstances.filter(
          ({ start_seconds, end_seconds }) =>
            (segmentStart <= start_seconds * 1e3 && start_seconds * 1e3 < segmentEnd) ||
            (segmentStart < end_seconds * 1e3 && end_seconds * 1e3 <= segmentEnd)
        );

        const places = placesInstances.filter(
          ({ start_seconds, end_seconds }) =>
            (segmentStart <= start_seconds * 1e3 && start_seconds * 1e3 < segmentEnd) ||
            (segmentStart < end_seconds * 1e3 && end_seconds * 1e3 <= segmentEnd)
        );

        const blocks = segment
          .map(({ text, start, end, speaker, id, words, translation }, index) => ({
            text,
            key: id,
            type: 'paragraph',
            data: { start, end, speaker, id, translation },
            // entityRanges: [],
            entityRanges: words.map(({ start, end, text, offset, length, id }) => ({
              start,
              end,
              text,
              offset,
              length,
              key: id,
            })),
            inlineStyleRanges: [],
          }))
          .map(block => {
            const { start, end } = block.data;

            block.inlineStyleRanges = [
              ...tags
                .filter(
                  ({ start_seconds, end_seconds }) =>
                    (start <= start_seconds * 1e3 && start_seconds * 1e3 < end) ||
                    (start < end_seconds * 1e3 && end_seconds * 1e3 <= end)
                )
                .map(({ start_seconds, end_seconds, entity }, index) => {
                  const entities = block.entityRanges.filter(
                    ({ start, end }) =>
                      start_seconds * 1e3 <= start &&
                      start < end_seconds * 1e3 &&
                      start_seconds * 1e3 < end &&
                      end <= end_seconds * 1e3
                  );
                  if (entities.length === 0) return null;

                  const first = entities[0];
                  const last = entities[entities.length - 1];
                  return {
                    offset: first.offset,
                    length: last.offset - first.offset + last.length,
                    style: `T-${entity.id}`,
                  };
                })
                .filter(r => !!r),
              // ...places
              //   .filter(
              //     ({ start_seconds, end_seconds }) =>
              //       (start <= start_seconds * 1e3 && start_seconds * 1e3 < end) ||
              //       (start < end_seconds * 1e3 && end_seconds * 1e3 <= end)
              //   )
              //   .map(({ start_seconds, end_seconds, entity }, index) => {
              //     const entities = block.entityRanges.filter(
              //       ({ start, end }) =>
              //         start_seconds * 1e3 <= start &&
              //         start < end_seconds * 1e3 &&
              //         start_seconds * 1e3 < end &&
              //         end <= end_seconds * 1e3
              //     );
              //     if (entities.length === 0) return null;

              //     const first = entities[0];
              //     const last = entities[entities.length - 1];
              //     return {
              //       offset: first.offset,
              //       length: last.offset + last.length,
              //       style: `G-${entity.id}`,
              //     };
              //   })
              //   .filter(r => !!r),
              ...comments
                .filter(({ start_seconds }) => start <= start_seconds * 1e3 && start_seconds * 1e3 < end)
                .map(({ start_seconds, id }) => {
                  const entity = block.entityRanges.find(({ start, end }) => start_seconds * 1e3 <= start);
                  return entity
                    ? {
                        offset: entity.offset,
                        length: entity.length,
                        style: `C-${id}`,
                      }
                    : null;
                })
                .filter(r => !!r),
            ];

            css.push(
              [
                ...new Set(
                  block.inlineStyleRanges.reduce((acc, { offset, length }) => [...acc, offset, offset + length - 1], [])
                ),
              ]
                .sort((a, b) => a - b)
                .map(t => {
                  const set = block.inlineStyleRanges
                    .filter(({ offset, length }) => offset <= t && t < offset + length)
                    .map(({ style }) => `.${style}`);
                  return set.length > 1 ? `${set.join('')} { background-color: ${OVERLAPS[set.length - 1]}; }` : '';
                })
                .join('\n')
            );
            return block;
          });

        const editorStateA = EditorState.set(
          EditorState.createWithContent(
            convertFromRaw({ blocks, entityMap: createEntityMap(blocks) }),
            generateDecorator()
          ),
          { allowUndo: true }
        );

        const blocksB = blocks.map(block => {
          return {
            ...block,
            text: block.data.translation,
            // entityRanges: [],
            entityRanges: block.data.translation
              .split(' ')
              .map(text => ({
                start: 0,
                end: 0,
                text,
                offset: 0,
                length: text.length,
                // key,
              }))
              .reduce((acc, range, index, ranges) => {
                if (index > 0) range.offset = ranges[index - 1].offset + ranges[index - 1].length + 1;
                return [...acc, range];
              }, []),
            inlineStyleRanges: [],
          };
        });

        const editorStateB = EditorState.set(
          EditorState.createWithContent(
            convertFromRaw({
              blocks: blocksB,
              entityMap: createEntityMap(blocksB),
            }),
            generateDecorator()
          ),
          { allowUndo: false }
        );

        return {
          start: segmentStart,
          end: segmentEnd,
          editorStateA,
          key: `editor-${blocks[0].key}`,
          // editorStateB: createPreview(editorStateA), // EditorState.createEmpty(),
          editorStateB,
          customStyleMap,
          comments,
          tags: [...new Set(tags.map(({ entity }) => entity))],
          places: [...new Set(places.map(({ entity }) => entity))],
        };
      });

    this.setState({ transcript, segments, customStyleMap, css: css.join('\n') });
  };

  customBlockRenderer = contentBlock => {
    const type = contentBlock.getType();
    if (type === 'paragraph') {
      return {
        component: BlockWrapper,
        props: {},
      };
    }
    return null;
  };

  toggleOffset(e) {
    // console.log('toggleOffset()');
    // console.log({ e });
    if (!e) return null;
    this.setState({ transcriptRefScrollTop: e.target.scrollTop });
  }

  handleMouseMove = evt => {
    const {
      srcElement,
      // path = []
    } = evt.nativeEvent;

    let comment = null;
    let tags = [];
    let places = [];
    let tagInstances = [];
    let placeInstances = [];

    srcElement.classList.forEach(c => {
      if (c.startsWith('C-')) comment = c.substring(2);
      if (c.startsWith('T-')) tags.push(c.substring(2));
      if (c.startsWith('G-')) places.push(c.substring(2));
    });

    srcElement.parentElement.classList.forEach(c => {
      if (c.startsWith('T-')) tags.push(c.substring(2));
      if (c.startsWith('G-')) places.push(c.substring(2));
    });

    if (comment) {
      this.setState({
        comment: this.props.commentThreads.find(({ id }) => id === parseInt(comment)),
        commentAnchor: srcElement,
        tags: [],
        places: [],
        tagInstances,
        placeInstances,
      });

      return; // comment menu has precedence over tags
    } else {
      this.setState({
        comment: null,
        commentAnchor: null,
      });
    }

    let start;
    let end;
    if (tags.length > 0 || places.length > 0) {
      let element = srcElement;
      while (element && !element.hasAttribute('data-start') && element.parentElement) element = element.parentElement;
      if (element && element.hasAttribute('data-start')) {
        start = parseFloat(element.getAttribute('data-start')) / 1e3;
        end = parseFloat(element.getAttribute('data-end')) / 1e3;
      }
    }

    if (tags.length > 0) {
      tags = tags.map(t => this.props.videoTags.find(({ id }) => id === parseInt(t)));
      tagInstances = tags.reduce(
        (acc, t) => [
          ...acc,
          t.instances
            .filter(
              ({ start_seconds, end_seconds }) =>
                (start_seconds <= start && start < end_seconds) || (start_seconds < end && end <= end_seconds)
            )
            .sort((a, b) => a.end_seconds - a.start_seconds - (b.end_seconds - b.start_seconds)),
        ],
        []
      );
    }

    if (places.length > 0) {
      places = places.map(t => this.props.videoPlaces.find(({ id }) => id === parseInt(t)));
      placeInstances = places.reduce(
        (acc, t) => [
          ...acc,
          t.instances
            .filter(
              ({ start_seconds, end_seconds }) =>
                (start_seconds <= start && start < end_seconds) || (start_seconds < end && end <= end_seconds)
            )
            .sort((a, b) => a.end_seconds - a.start_seconds - (b.end_seconds - b.start_seconds)),
        ],
        []
      );
    }

    // console.group();
    // if (tags.length > 0 || places.length > 0)
    //   console.log({
    //     tags,
    //     places,
    //     tagInstances,
    //     placeInstances,
    //     tagAnchor: tags.length > 0 || places.length > 0 ? srcElement : null,
    //   });
    // console.log(tags.length > 0 || places.length > 0 ? srcElement : null);
    // console.groupEnd();

    this.setState({
      tags,
      places,
      tagInstances,
      placeInstances,
      tagAnchor: tags.length > 0 || places.length > 0 ? srcElement : null,
    });
  };

  handleClick = event => {
    let element = event.nativeEvent.target;

    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !this.state.editable) {
      const {
        collapsed,
        commonAncestorContainer: { nodeType, classList },
        startContainer,
        endContainer,
        startContainer: { nodeType: startNodeType, parentNode },
        endContainer: { nodeType: endNodeType, parentNode: endParentNode },
      } = selection.getRangeAt(0);

      if (
        !collapsed &&
        (nodeType === document.TEXT_NODE ||
          (nodeType === document.ELEMENT_NODE && classList.contains('public-DraftStyleDefault-block')))
      ) {
        // console.log(selection.getRangeAt(0));

        const startElement = startNodeType !== document.TEXT_NODE ? startContainer : parentNode;
        const endElement = endNodeType !== document.TEXT_NODE ? endContainer : endParentNode;
        // console.log(startElement, endElement);

        let start = startElement;
        let t0 = 0;
        while (start && !start.hasAttribute('data-start') && start.parentElement) start = start.parentElement;
        if (start && start.hasAttribute('data-start')) {
          t0 = parseFloat(start.getAttribute('data-start'));
          // console.log('found data-start', t0, start);

          if (start.classList.contains('BlockWrapper')) {
            start = startElement.parentElement.previousSibling;
            while (start && !start.hasAttribute('data-start') && start.previousSibling) start = start.previousSibling;
            if (start && start.hasAttribute('data-start')) {
              t0 = parseFloat(start.getAttribute('data-start'));
              // console.log('found sibling data-start', t0, start);
            }
          }
        }

        let end = endElement;
        let t1 = 0;
        while (end && !end.hasAttribute('data-end') && end.parentElement) end = end.parentElement;
        if (end && end.hasAttribute('data-end')) {
          t1 = parseFloat(end.getAttribute('data-end'));
          // console.log('found data-end', t1, end);

          if (end.classList.contains('BlockWrapper')) {
            end = startElement.parentElement.previousSibling;
            while (end && !end.hasAttribute('data-end') && end.previousSibling) end = end.previousSibling;
            if (end && end.hasAttribute('data-end')) {
              t1 = parseFloat(end.getAttribute('data-end'));
              // console.log('found sibling data-end', t1, end);
            }
          }
        }

        // console.log({ start: t0 / 1e3, end: t1 / 1e3 });

        this.setState({
          anchor: startElement,
          commentAnchor: null,
          tagAnchor: null,
          selection: { start: t0 / 1e3, end: t1 / 1e3 },
        });
        return;
      } else {
        // window.getSelection().removeAllRanges();
      }
    }

    if (element.classList.contains('public-DraftStyleDefault-block')) return;
    while (element && !element.hasAttribute('data-start') && element.parentElement) element = element.parentElement;
    if (element && element.hasAttribute('data-start')) {
      let t = parseFloat(element.getAttribute('data-start'));
      // console.log('found data-start', t, element);

      if (element.classList.contains('BlockWrapper')) {
        element = event.nativeEvent.target.parentElement.previousSibling;
        while (element && !element.hasAttribute('data-start') && element.previousSibling)
          element = element.previousSibling;
        if (element && element.hasAttribute('data-start')) {
          t = parseFloat(element.getAttribute('data-start'));
          // console.log('found sibling data-start', t, element);
        }
      }

      this.props.seekTo(t / 1e3);
    }

    // console.log('no data-start, stopping at', element);
    // element = event.nativeEvent.target;
    // while (!element.hasAttribute('data-block') && element.parentElement) element = element.parentElement;
    // if (element.hasAttribute('data-block') && element.hasAttribute('data-offset-key')) {
    //   const blockKey = element
    //     .getAttribute('data-offset-key')
    //     .split('-')
    //     .reverse()
    //     .pop();
    //   console.log('found block?', blockKey);
    // }
  };

  handleChange = (editorState, key, suffix = 'A') => {
    const editorIndex = this.state.segments.findIndex(editor => editor.key === key);
    const segment = this.state.segments[editorIndex];

    const contentChange =
      editorState.getCurrentContent() === this.state.segments[editorIndex][`editorState${suffix}`].getCurrentContent()
        ? null
        : editorState.getLastChangeType();

    if (contentChange) {
      console.log(contentChange);

      // this.past.push(this.state.segments);
      // this.future = [];

      this.setState({
        segments: [
          ...this.state.segments.slice(0, editorIndex),
          { ...segment, [`editorState${suffix}`]: editorState },
          ...this.state.segments.slice(editorIndex + 1),
        ],
      });
    } else {
      this.setState({
        segments: [
          ...this.state.segments.slice(0, editorIndex),
          { ...segment, [`editorState${suffix}`]: editorState },
          ...this.state.segments.slice(editorIndex + 1),
        ],
      });
    }
  };

  onSearch = payload => {
    if (payload === this.state.search) return;
    this.setState({
      search: payload,
      searchFocused: true,
    });
  };

  handleSearchFocus = searchFocused => {
    console.log('searchFocused', searchFocused);
    this.setState({ searchFocused });
  };

  higlightTag = className => {
    this.setState({ activeTag: className });
  };

  toggleSourceEdit = () => {
    this.setState(prevState => ({
      editable: !prevState.editable,
    }));
  };
  toggleTranslate = () => {
    this.setState(prevState => ({
      showTranslation: !prevState.showTranslation,
    }));
  };

  toggleTranslation = languageISO => {
    console.log('toggleTranslation()', languageISO);
    this.setState({ selectedTranslation: languageISO });
  };

  createTranslation = languageISO => {
    console.log('createTranslation()', languageISO);
    // push new translation to translations array and then:
    this.toggleTranslation(languageISO);
  };

  // deleteInstance = ({ tagInstances, tags }) => {
  //   // entityId, instanceId
  //   const instanceId = tagInstances[0].id;
  //   const entityId = tagInstances[0].video_tag_id;

  //   const entities = produce(this.props.videoTags, nextEntities => {
  //     const ti = nextEntities.findIndex(t => t.id === entityId);
  //     const ii = nextEntities[ti].instances.findIndex(i => i.id === instanceId);
  //     nextEntities[ti].instances.splice(ii, 1);
  //   });
  //   this.props.update({ videoTags: entities });
  // };

  deleteInstance = args => {
    console.log('deleteInstance', 'TODO: define instance', { args });
  };

  copyToClips = args => {
    console.log('copyToClips', 'TODO: define instance', { args });
  };

  render() {
    const {
      playheadEditorKey,
      playheadBlockKey,
      playheadEntityKey,
      activeTag,
      search,
      searchFocused,
      editable,
      showTranslation,
      // selectedTranslation,
      customStyleMap,
      css,
    } = this.state;
    const { customBlockRenderer, handleChange, higlightTag } = this;

    // console.group('Transcript.js');
    // console.log('props', this.props);
    // console.log('state', this.state);
    // console.groupEnd();

    return (
      <TranscriptRoot
        onMouseDown={() => this.setState({ mouseDown: true })}
        onMouseUp={() => this.setState({ mouseDown: false })}>
        <TranscriptToolbar
          isEditable={this.state.editable}
          isTranslated={this.state.showTranslation}
          onSearch={this.onSearch}
          onSearchBlur={() => this.handleSearchFocus(false)}
          onToggleEdit={this.toggleSourceEdit}
          onToggleTranslate={this.toggleTranslate}
          pin={this.state.transcriptRefScrollTop > 0}
          toggleTranslation={this.toggleTranslation}
          createTranslation={this.createTranslation}
          selectedTranslation={this.state.selectedTranslation}
          translations={this.state.translations}
        />
        <TranscriptChild
          className="sticky-scroll-area"
          // onScroll={this.toggleOffset.bind(this)}
          ref={ref => {
            this.scrollingContainer = ref;
          }}>
          {this.state.anchor && this.state.selection ? (
            <SelectionPopover
              isVisible={this.state.anchor}
              start={this.state.selection.start}
              end={this.state.selection.end}
              onClose={() => this.setState({ anchor: null, selection: null })}
              projectplaces={this.props.data.project.projectplaces}
              projecttags={this.props.data.project.projecttags}
              videoTags={this.props.data.videoTags}
              videoPlaces={this.props.data.videoPlaces}
            />
          ) : null}
          {this.state.tagAnchor && !this.state.selection && !this.state.mouseDown ? (
            <HoverPopover
              copyToClips={() => this.copyToClips(this.state.tagAnchor)}
              deleteInstance={() => this.deleteInstance(this.state.tagAnchor)}
              isVisible={this.state.tagAnchor}
              onClose={() => this.setState({ tagAnchor: null })}
              placeInstances={this.state.placeInstance}
              places={this.state.place}
              tagInstances={this.state.tagInstances}
              tags={this.state.tags}
            />
          ) : null}
          {this.state.comment && this.state.commentAnchor ? (
            <CommentPopover
              commentData={this.state.comment}
              isActionable={false}
              isVisible={this.state.commentAnchor}
              onClose={() => this.setState({ comment: null, commentAnchor: null })}></CommentPopover>
          ) : null}
          <TranscriptWrapper stretch={this.state.showTranslation}>
            <div
              ref={ref => {
                this.transcriptRef = ref;
              }}
              onClick={event => this.handleClick(event)}
              onMouseMove={event => this.handleMouseMove(event)}>
              <style scoped>{css}</style>
              <style scoped>
                {`
                  section[data-editor-key="${playheadEditorKey}"] ~ section .BlockWrapper.BlockWrapper > div[data-offset-key] > span { color: #696969 }
                  div[data-offset-key="${playheadBlockKey}-0-0"] ~ div > .BlockWrapper > div[data-offset-key] > span { color: #696969; }
                  span[data-entity-key="${playheadEntityKey}"] ~ span[data-entity-key] { color: #696969; }


                `}
              </style>
              <style scoped>
                {`
                  span[class*='C-']{
                    position: relative;
                  }

                  .public-DraftEditor-content {
                    white-space: normal !important;
                  }
                `}
              </style>
              <style scoped>
                {activeTag
                  ? `
                    span[class*='T-'] {
                      background-color: transparent !important;
                    }
                    span[class*='C-']:before {
                      transform: scale(1.1);
                    }
                    .${activeTag}.${activeTag} {
                      background-color: rgba(71, 123, 181, .4) !important;
                    }
                  `
                  : ''}
              </style>

              {this.state.segments.map(({ key, editorStateA, editorStateB, comments, tags, places }) => (
                <Segment
                  {...{
                    comments,
                    customBlockRenderer,
                    customStyleMap,
                    editable,
                    editorKey: key,
                    editorStateA,
                    editorStateB,
                    handleChange,
                    higlightTag,
                    key,
                    places,
                    scrollingContainer: this.scrollingContainer,
                    search,
                    searchFocused,
                    tags,
                    showTranslation,
                  }}
                />
              ))}
            </div>
          </TranscriptWrapper>
        </TranscriptChild>
      </TranscriptRoot>
    );
  }
}

// export default Transcript;
export default connect(
  null,
  { update }
)(Transcript);
