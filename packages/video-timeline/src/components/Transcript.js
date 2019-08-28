import Combinatorics from 'js-combinatorics';
import React from 'react';
import chunk from 'lodash.chunk';
import styled from 'styled-components';
import { EditorState, convertFromRaw, getDefaultKeyBinding } from 'draft-js';

import BlockWrapper from './ofTranscript/BlockWrapper';
import FloatingToolbar from './ofTranscript/FloatingToolbar';
import Segment from './ofTranscript/Segment';
import TranscriptToolbar from './ofTranscript/TranscriptToolbar';
import TranscriptWrapper from './ofTranscript/TranscriptWrapper';
import { createEntityMap, generateDecorator, memoizedGetBlockTimings } from './ofTranscript/transcriptUtils';

const EMPTY_TRANSCRIPT = true;
const MAX_OVERLAP = 5;

const TranscriptRoot = styled.div`
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;
const TranscriptChild = styled.div`
  flex: 1 1 100%;
  overflow-y: auto;
`;

class Transcript extends React.Component {
  state = {
    search: '',
    searchFocused: false,
    editable: false,
    // visibleB: true,
    selectedTranslation: null,
    translations: ['it', 'pl'],
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
      if (EMPTY_TRANSCRIPT) {
        return {
          transcript: {},
          segments: [
            {
              start: 0,
              end: 0,
              editorStateA: EditorState.createEmpty(),
              key: 'editor-ZERO',
              editorStateB: EditorState.createEmpty(),
              customStyleMap,
              comments: commentThreads,
              tags: [...new Set(tagInstances.map(({ entity }) => entity))],
              places: [...new Set(placesInstances.map(({ entity }) => entity))],
            },
          ],
          customStyleMap,
        };
      }

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

  toggleOffset(e) {
    // console.log('toggleOffset()');
    // console.log({ e });
    if (!e) return null;
    this.setState({ transcriptRefScrollTop: e.target.scrollTop });
  }

  handleClick = event => {
    let element = event.nativeEvent.target;
    console.log('click', element);

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const {
        collapsed,
        commonAncestorContainer: { nodeType, classList },
        startContainer,
        startContainer: { nodeType: startNodeType, parentNode },
      } = selection.getRangeAt(0);

      if (
        !collapsed &&
        (nodeType === document.TEXT_NODE ||
          (nodeType === document.ELEMENT_NODE && classList.contains('public-DraftStyleDefault-block')))
      ) {
        const anchor = startNodeType !== document.TEXT_NODE ? startContainer : parentNode;
        console.log(anchor);
        this.setState({ anchor });
        return;
      } else window.getSelection().removeAllRanges();
    }

    if (element.classList.contains('public-DraftStyleDefault-block')) return;
    while (element && !element.hasAttribute('data-start') && element.parentElement) element = element.parentElement;
    if (element && element.hasAttribute('data-start')) {
      let t = parseFloat(element.getAttribute('data-start'));
      console.log('found data-start', t, element);

      if (element.classList.contains('BlockWrapper')) {
        element = event.nativeEvent.target.parentElement.previousSibling;
        while (element && !element.hasAttribute('data-start') && element.previousSibling)
          element = element.previousSibling;
        if (element && element.hasAttribute('data-start')) {
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
      visibleB: !prevState.visibleB,
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
      selectedTranslation,
      customStyleMap,
    } = this.state;
    const { videoTags } = this.props;
    const { customBlockRenderer, filterKeyBindingFn, handleKeyCommand, handleChange, higlightTag } = this;

    return (
      <TranscriptRoot>
        <TranscriptToolbar
          isEditable={this.state.editable}
          isTranslated={this.state.visibleB}
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
          onScroll={this.toggleOffset.bind(this)}
          ref={ref => {
            this.scrollingContainer = ref;
          }}
        >
          {this.state.anchor ? (
            <FloatingToolbar isVisible={this.state.anchor} onClose={() => this.setState({ anchor: null })} />
          ) : null}
          <TranscriptWrapper stretch={this.state.visibleB}>
            <div
              ref={ref => {
                this.transcriptRef = ref;
              }}
              onClick={event => this.handleClick(event)}
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
                    filterKeyBindingFn,
                    handleChange,
                    handleKeyCommand,
                    higlightTag,
                    key,
                    places,
                    scrollingContainer: this.scrollingContainer,
                    search,
                    searchFocused,
                    tags,
                    visibleB,
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

export default Transcript;
