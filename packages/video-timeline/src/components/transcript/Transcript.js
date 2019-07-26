import React from 'react';
import styled from 'styled-components';
import { EditorState, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import chunk from 'lodash.chunk';
import Combinatorics from 'js-combinatorics';

import { TranscriptSearch } from '@montage/ui';

import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { createEntityMap, generateDecorator, memoizedGetBlockTimings } from './transcriptUtils';
import BlockWrapper from './BlockWrapper';
import Segment from './Segment';
import TranscriptWrapper from './TranscriptWrapper';
import TranscriptContainer from './TranscriptContainer';
import TranscriptSide from './TranscriptSide';
import TranscriptMain from './TranscriptMain';
import TranscriptText from './TranscriptText';

const MAX_OVERLAP = 5;

const styles = {
  toolbarHeading: {
    lineHeight: '50px',
  },
};

const TranscriptToolbar = styled.div`
  background: ${({ pin }) => (pin ? 'white' : 'transparent')};
  box-shadow: ${({ pin }) => (pin ? '0 1px 5px rgba(0,0,0,0.1)' : '')};
  height: ${({ pin }) => (pin ? '50px' : 'inherit')};
  left: 0;
  position: ${({ pin }) => (pin ? 'fixed' : 'inherit')};
  right: 0;
  z-index: 100;
`;

class Transcript extends React.Component {
  state = {
    search: '',
    searchFocused: false,
    editable: false,
    visibleB: false,
  };
  past = [];
  future = [];

  static getDerivedStateFromProps(props, state) {
    const { transcript, commentThreads, videoTags, videoPlaces } = props;

    const customStyleMap = {
      ...commentThreads.reduce((acc, { id }) => ({ ...acc, [`C-${id}`]: { className: `C-${id}` } }), []),
      ...videoTags.reduce((acc, { id }) => ({ ...acc, [`T-${id}`]: { className: `T-${id}` } }), []),
      ...videoPlaces.reduce((acc, { id }) => ({ ...acc, [`G-${id}`]: { className: `G-${id}` } }), []),
    };
    // console.log(customStyleMap);

    const tagInstances = videoTags.reduce((acc, entity) => {
      const instances = entity.instances.map(instance => ({ ...instance, entity }));
      return [...acc, ...instances];
    }, []);

    const placesInstances = videoPlaces.reduce((acc, entity) => {
      const instances = entity.instances.map(instance => ({ ...instance, entity }));
      return [...acc, ...instances];
    }, []);

    if (transcript !== state.transcript) {
      const segments = chunk(transcript.segments, 1).map(segment => {
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
                    length: last.offset + last.length,
                    style: `T-${entity.id}`,
                  };
                })
                .filter(r => !!r),
              ...places
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
                    length: last.offset + last.length,
                    style: `G-${entity.id}`,
                  };
                })
                .filter(r => !!r),
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

            // block.entityRanges = [];
            return block;
          });

        // console.log(blocks);
        const editorStateA = EditorState.set(
          EditorState.createWithContent(
            convertFromRaw({ blocks, entityMap: createEntityMap(blocks) }),
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
          editorStateB: EditorState.set(
            EditorState.createWithContent(
              convertFromRaw({
                blocks: blocks.map(block => {
                  return { ...block, text: block.data.translation, entityRanges: [], inlineStyleRanges: [] };
                }),
                entityMap: createEntityMap(blocks),
              }),
              generateDecorator()
            ),
            { allowUndo: false }
          ),
          customStyleMap,
          comments,
          tags: [...new Set(tags.map(({ entity }) => entity))],
          places: [...new Set(places.map(({ entity }) => entity))],
        };
      });

      return { transcript, segments, customStyleMap };
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentTime !== this.props.currentTime) {
      const time = nextProps.currentTime * 1e3;
      this.state.segments
        .filter(({ start, end }) => start <= time && time < end)
        .forEach(({ editorStateA, key }) => {
          const contentState = editorStateA.getCurrentContent();
          const blocks = contentState.getBlocksAsArray();
          let playheadBlockIndex = -1;

          playheadBlockIndex = blocks.findIndex(block => {
            // const start = block.getData().get('start');
            // const end = block.getData().get('end');
            const { start, end } = memoizedGetBlockTimings(contentState, block);
            // console.log({start, end});
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

  handleClick = event => {
    let element = event.nativeEvent.target;
    console.log('click', element);

    while (!element.hasAttribute('data-start') && element.parentElement) element = element.parentElement;
    if (element.hasAttribute('data-start')) {
      let t = parseFloat(element.getAttribute('data-start'));
      console.log('found data-start', t, element);

      if (element.classList.contains('BlockWrapper')) {
        element = event.nativeEvent.target.parentElement.previousSibling;
        while (!element.hasAttribute('data-start') && element.previousSibling) element = element.previousSibling;
        if (element.hasAttribute('data-start')) {
          t = parseFloat(element.getAttribute('data-start'));
          console.log('found sibling data-start', t, element);
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

      this.past.push(this.state.segments);
      this.future = [];

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

  handleUndo = () => {
    const { segments: present } = this.state;
    const futurePresent = this.past.pop();

    if (futurePresent) {
      this.future.push(present);
      this.setState({
        segments: futurePresent,
      });
    }
  };

  handleRedo = () => {
    const { segments: present } = this.state;
    const futurePresent = this.future.pop();

    if (futurePresent) {
      this.past.push(present);
      this.setState({
        segments: futurePresent,
      });
    }
  };

  handleKeyCommand = (command, editorState, key, suffix = 'A') => {
    console.log(command);
    if (command === 'undo' || command === 'redo') return 'handled';

    return 'not-handled';
  };

  filterKeyBindingFn = event => {
    const { nativeEvent } = event;

    if (nativeEvent.keyCode === 90 && nativeEvent.metaKey && !nativeEvent.shiftKey) {
      setTimeout(() => this.handleUndo(), 0);
      return 'undo';
    }

    if (nativeEvent.keyCode === 90 && nativeEvent.metaKey && nativeEvent.shiftKey) {
      setTimeout(() => this.handleRedo(), 0);
      return 'redo';
    }

    return getDefaultKeyBinding(event);
  };

  // handleSearch = e => {
  //   const search = e.target.value;
  //   if (search === this.state.search) return;

  //   this.setState({
  //     search,
  //     searchFocused: true,
  //   });
  // };

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

  handleCheckbox = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  toggleSourceEdit = () => {
    this.setState(prevState => ({
      editable: !prevState.editable,
    }));
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
      visibleB,
      customStyleMap,
    } = this.state;
    const { classes, scrollingContainer, videoTags } = this.props;
    const { customBlockRenderer, filterKeyBindingFn, handleKeyCommand, handleChange, higlightTag } = this;

    return (
      <>
        <TranscriptToolbar pin={true}>
          <TranscriptWrapper stretch={this.state.visibleB}>
            <TranscriptContainer>
              <TranscriptSide></TranscriptSide>
              <TranscriptMain>
                <TranscriptText stretch={!this.state.visibleB}>
                  <Typography align="left" color="textSecondary" variant="subtitle2" className={classes.toolbarHeading}>
                    Original Transcript
                  </Typography>
                </TranscriptText>
                {this.state.visibleB ? (
                  <TranscriptText>
                    <Typography
                      align="left"
                      color="textSecondary"
                      variant="subtitle2"
                      className={classes.toolbarHeading}
                    >
                      Translation
                    </Typography>
                  </TranscriptText>
                ) : null}
              </TranscriptMain>
              <TranscriptSide>
                <TranscriptSearch onSearch={this.onSearch} onBlur={() => this.handleSearchFocus(false)} />
                <Tooltip title="Edit transcript">
                  <Fab color={this.state.editable ? 'primary' : null} aria-label="Edit" onClick={this.toggleSourceEdit}>
                    {this.state.editable ? <CheckIcon fontSize="large" /> : <EditIcon fontSize="medium" />}
                  </Fab>
                </Tooltip>
              </TranscriptSide>
            </TranscriptContainer>
          </TranscriptWrapper>
        </TranscriptToolbar>
        <TranscriptWrapper stretch={this.state.visibleB}>
          {/* <fieldset>
                <legend>Search</legend>
                <input
                  value={this.state.search}
                  onChange={this.handleSearch}
                  onFocus={() => this.handleSearchFocus(true)}
                  onBlur={() => this.handleSearchFocus(false)}
                  onMouseOver={() => this.handleSearchFocus(true)}
                  onMouseOut={() => this.handleSearchFocus(false)}
                />
              </fieldset> */}
          <div
            ref={ref => {
              this.transcriptWrapper = ref;
            }}
            onClick={event => this.handleClick(event)}
            style={{ paddingTop: '50px' }}
          >
            <style scoped>
              {`
            section[data-editor-key="${playheadEditorKey}"] ~ section .BlockWrapper.BlockWrapper > div[data-offset-key] > span { color: #696969 }
            div[data-offset-key="${playheadBlockKey}-0-0"] ~ div > .BlockWrapper > div[data-offset-key] > span { color: #696969; }
            span[data-entity-key="${playheadEntityKey}"] ~ span[data-entity-key] { color: #696969; }

            span[class*='C-']{
              position: relative;
            }

            span[class*='C-']:before {
              position: absolute;
              top: -0.5em;
              left: -0.5em;
              color: white;
              background-color: red;
              content: 'C';
              font-size: 10px;
            }

            ${Combinatorics.power(videoTags.map(({ id }) => id))
              .filter(subset => subset.length > 0)
              .map(
                subset => `
                  .T-${subset.join('.T-')} { background-color: rgba(71, 123, 181, ${0.2 +
                  subset.length / MAX_OVERLAP}); }
                `
              )
              .join('\n')}
          `}
              {activeTag
                ? `
              span[class*='T-']{
                background-color: transparent;
              }
              .${activeTag}.${activeTag} {
                background-color: rgba(71, 123, 181, .6);
                border-bottom: 1px solid red;
              }
            `
                : ''}
            </style>

            {/* <fieldset>
                    <legend>A. Original</legend>
                    <label>
                      <input
                        name="editable"
                        type="checkbox"
                        checked={this.state.originalEditable}
                        onChange={this.handleCheckbox}
                      />
                      editable
                    </label>
                  </fieldset> */}
            <fieldset>
              <legend>B. Translation</legend>
              <label>
                <input
                  name="visibleB"
                  type="checkbox"
                  checked={this.state.translationVisible}
                  onChange={this.handleCheckbox}
                />
                enabled
              </label>
              {/* <label>
                      <input
                        name="editableB"
                        type="checkbox"
                        checked={this.state.translationEditable}
                        onChange={this.handleCheckbox}
                      />
                      editable
                    </label> */}
            </fieldset>
            {this.state.segments.map(({ key, editorStateA, editorStateB, comments, tags, places }) => (
              <Segment
                {...{
                  key,
                  editorKey: key,
                  editorStateA,
                  editorStateB,
                  comments,
                  tags,
                  places,
                  search,
                  searchFocused,
                  visibleB,
                  // editableB,
                  // editableA,
                  editable,
                  customStyleMap,
                  customBlockRenderer,
                  scrollingContainer,
                  filterKeyBindingFn,
                  handleKeyCommand,
                  handleChange,
                  higlightTag,
                }}
              />
            ))}
          </div>
        </TranscriptWrapper>
      </>
    );
  }
}

export default withStyles(styles)(Transcript);
