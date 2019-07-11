import React from 'react';
import { EditorState, convertFromRaw, getDefaultKeyBinding, RichUtils } from 'draft-js';

import { createEntityMap, generateDecorator, createPreview } from './transcriptUtils';

import chunk from 'lodash.chunk';
import range from 'lodash.range';
import Combinatorics from 'js-combinatorics';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

import BlockWrapper from './BlockWrapper';
import Segment from './Segment';

const MAX_OVERLAP = 5;
const OVERLAPS = range(MAX_OVERLAP).map(n => `.B${n}`);
const customStyleMap = OVERLAPS.map(n => n.substring(1)).reduce((acc, n) => ({ ...acc, [n]: { className: n } }), {});

const TranscriptWrapper = styled.div`
  text-align: left;
  /* background-color: #f0f0f0; */
  color: #222;
  font-family: 'PT Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  ${Combinatorics.power(OVERLAPS)
    .filter(subset => subset.length > 0)
    .map(
      subset => `${subset.join('')} { background-color: rgba(71, 123, 181, ${0.2 + subset.length / MAX_OVERLAP}); }`
    )}

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
  }
`;

class Transcript extends React.Component {
  state = {
    search: '',
    searchFocused: false,
    activeHighlightIndex: 0,
  };
  past = [];
  future = [];
  editorRefs = {};
  setDomEditorRef = (key, ref) => (this.editorRefs[key] = ref);

  static getDerivedStateFromProps(props, state) {
    const { transcript, data } = props;

    if (transcript !== state.transcript) {
      const tagInstances = data.videoTags.reduce((acc, entity) => {
        // const instances = entity.instances.map(instance => ({ ...instance, entity }));
        return [...acc, ...entity.instances];
      }, []);

      const segments = chunk(transcript.segments, 1).map(segments => {
        const blocks = segments
          .map(({ text, start, end, speaker, id, words }, index) => ({
            text,
            key: id,
            type: 'paragraph',
            data: { start, end, speaker, id },
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

            const instances = tagInstances.filter(
              ({ start_seconds, end_seconds }) =>
                (start <= start_seconds * 1e3 && start_seconds * 1e3 < end) ||
                (start < end_seconds * 1e3 && end_seconds * 1e3 <= end)
            );

            block.inlineStyleRanges = instances
              .map(({ start_seconds, end_seconds }) =>
                block.entityRanges.filter(
                  ({ start, end }) =>
                    start_seconds * 1e3 <= start &&
                    start < end_seconds * 1e3 &&
                    start_seconds * 1e3 < end &&
                    end <= end_seconds * 1e3
                )
              )
              .map((entities, index) => {
                if (entities.length === 0) return null;
                const first = entities[0];
                const last = entities[entities.length - 1];
                return {
                  offset: first.offset,
                  length: last.offset + last.length,
                  style: `B${index % MAX_OVERLAP}`,
                };
              })
              .filter(r => !!r);

            // block.entityRanges = [];
            return block;
          });

        const editorState = EditorState.set(
          EditorState.createWithContent(
            convertFromRaw({ blocks, entityMap: createEntityMap(blocks) }),
            generateDecorator()
          ),
          { allowUndo: false }
        );
        return {
          editorState,
          key: `editor-${blocks[0].key}`,
          previewState: createPreview(editorState),
        };
      });

      return { transcript, segments };
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentTime !== this.props.currentTime) {
      const time = nextProps.currentTime * 1e3;
      this.state.segments.forEach(({ editorState, key }) => {
        const contentState = editorState.getCurrentContent();
        const blocks = contentState.getBlocksAsArray();
        let playheadBlockIndex = -1;

        playheadBlockIndex = blocks.findIndex(block => {
          const start = block.getData().get('start');
          const end = block.getData().get('end');
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

          if (playheadEntity) {
            const { key } = contentState.getEntity(playheadEntity).getData();
            this.setState({
              playheadEditorKey: key,
              playheadBlockKey: playheadBlock.getKey(),
              playheadEntityKey: key,
            });
            console.log({
              playheadEditorKey: key,
              playheadBlockKey: playheadBlock.getKey(),
              playheadEntityKey: key,
            });
          } else {
            // this.setState({ playheadEditorKey: key, playheadBlockKey: playheadBlock.getKey() });
            // console.log({ playheadEditorKey: key, playheadBlockKey: playheadBlock.getKey() });
          }
        }
      });
    }

    return true;
  }

  YTseekTo = time => {
    if (window.internalPlayer && window.internalPlayer.seekTo) {
      window.internalPlayer.seekTo(time, true);
    }
  };

  customBlockRenderer = contentBlock => {
    const type = contentBlock.getType();
    if (type === 'paragraph') {
      return {
        component: BlockWrapper,
        props: {
          // TODO
        },
      };
    }
    return null;
  };

  handleClick = event => {
    let element = event.nativeEvent.target;
    while (!element.hasAttribute('data-start') && element.parentElement) element = element.parentElement;
    if (element.hasAttribute('data-start')) {
      const t = parseFloat(element.getAttribute('data-start'));
      this.YTseekTo(t / 1e3);
    } else {
      element = event.nativeEvent.target;
      while (!element.hasAttribute('data-block') && element.parentElement) element = element.parentElement;
      if (element.hasAttribute('data-block') && element.hasAttribute('data-offset-key')) {
        const blockKey = element
          .getAttribute('data-offset-key')
          .split('-')
          .reverse()
          .pop();
        console.log(blockKey);
      }
    }
  };

  handleChange = (editorState, key) => {
    const editorIndex = this.state.segments.findIndex(editor => editor.key === key);

    const contentChange =
      editorState.getCurrentContent() === this.state.segments[editorIndex].editorState.getCurrentContent()
        ? null
        : editorState.getLastChangeType();

    if (contentChange) {
      console.log(contentChange);

      this.past.push(this.state.segments);
      this.future = [];
      this.setState({
        segments: [
          ...this.state.segments.slice(0, editorIndex),
          { editorState, key, previewState: createPreview(editorState) },
          ...this.state.segments.slice(editorIndex + 1),
        ],
      });
    } else {
      this.setState({
        segments: [
          ...this.state.segments.slice(0, editorIndex),
          { editorState, key, previewState: createPreview(editorState) },
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

  handleKeyCommand = (command, editorState, key) => {
    console.log(command);
    if (command === 'undo' || command === 'redo') return 'handled';

    const richTextState = RichUtils.handleKeyCommand(editorState, command);
    if (richTextState) {
      this.onChange(richTextState, key);
      return true;
    }

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

  handleSearch = e => {
    const search = e.target.value;
    if (search === this.state.search) return;

    this.setState({
      search,
      searchFocused: true,
      activeHighlightIndex: 0,
    });
  };

  handleSearchFocus = searchFocused => {
    console.log('searchFocused', searchFocused);
    this.setState({ searchFocused });
  };

  render() {
    const { playheadEditorKey, playheadBlockKey, playheadEntityKey, search, searchFocused } = this.state;
    const { scrollingContainer } = this.props;

    return (
      <TranscriptWrapper
        ref={ref => {
          this.transcriptWrapper = ref;
        }}
        onClick={event => this.handleClick(event)}
      >
        <style scoped>
          {`
            span[data-entity-key="${playheadEntityKey}"] { border-bottom: 1px solid blue; }

            section[data-editor-key="${playheadEditorKey}"] ~ section .BlockWrapper > div[data-offset-key] > span { color: #696969 }
            /* div[data-offset-key="${playheadBlockKey}-0-0"] > .BlockWrapper > div[data-offset-key] > span { color: black; } */
            div[data-offset-key="${playheadBlockKey}-0-0"] ~ div > .BlockWrapper > div[data-offset-key] > span { color: #696969; }
            span[data-entity-key="${playheadEntityKey}"] ~ span[data-entity-key] { color: #696969; }
          `}
        </style>
        <VisibilitySensor
          intervalCheck={false}
          intervalDelay={1000}
          containment={scrollingContainer}
          scrollCheck={true}
          partialVisibility={true}
          onChange={isVisible => !isVisible && searchFocused && this.handleSearchFocus(false)}
        >
          {({ isVisible }) => (
            <input
              value={this.state.search}
              onChange={this.handleSearch}
              onFocus={() => this.handleSearchFocus(true)}
              onBlur={() => this.handleSearchFocus(false)}
              onMouseOver={() => this.handleSearchFocus(true)}
              onMouseOut={() => this.handleSearchFocus(false)}
              placeholder="Search…"
            />
          )}
        </VisibilitySensor>
        {this.state.segments.map(({ editorState, key, previewState }) => (
          <Segment
            {...{
              editorState,
              key,
              previewState,
              search,
              searchFocused,
              customStyleMap,
              customBlockRenderer: this.customBlockRenderer,
              scrollingContainer,
              filterKeyBindingFn: this.filterKeyBindingFn,
              handleKeyCommand: this.handleKeyCommand,
              handleChange: this.handleChange,
              setDomEditorRef: this.setDomEditorRef,
            }}
          />
        ))}
      </TranscriptWrapper>
    );
  }
}

export default Transcript;
