import React from 'react';
import {
  Editor,
  EditorBlock,
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
  RichUtils,
} from 'draft-js';
import encodeInlineStyleRanges from '../../../node_modules/draft-js/lib/encodeInlineStyleRanges';
import chunk from 'lodash.chunk';
import range from 'lodash.range';
import Combinatorics from 'js-combinatorics';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

const MAX_OVERLAP = 5;
const OVERLAPS = range(MAX_OVERLAP).map(n => `.B${n}`);
const customStyleMap = OVERLAPS.map(n => n.substring(1)).reduce((acc, n) => ({ ...acc, [n]: { className: n } }), {});

console.log(customStyleMap);

const TranscriptWrapper = styled.div`
  text-align: left;
  background-color: #f0f0f0;
  color: #222;
  font-family: 'PT Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  ${Combinatorics.power(OVERLAPS)
    .filter(subset => subset.length > 0)
    .map(subset => `${subset.join('')} { background-color: rgba(255, 0, 0, ${0.2 + subset.length / MAX_OVERLAP}); }`)}
`;

const BlockWrapper = styled.div`
  margin-bottom: 1em;
  position: relative;
`;

const Speaker = styled.div`
  user-select: none;
  font-family: 'PT Sans Narrow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

const Token = styled.span`
  background-color: rgba(255, 255, 255, 1);
`;

const EditorWrapper = styled.section`
  position: relative;

  ::before {
    position: absolute;
    top: -5px;
    font-size: 7px;
    content: attr(data-editor-key);
    color: red;
  }

  .public-DraftStyleDefault-block {
    font-family: 'PT Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }
`;

class Transcript extends React.Component {
  state = {};
  past = [];
  future = [];
  editorRefs = {};
  setDomEditorRef = (key, ref) => (this.editorRefs[key] = ref);

  static getDerivedStateFromProps(props, state) {
    const { transcript } = props;

    if (transcript && !state.editors) {
      const tagInstances = props.data.videoTags.reduce((acc, entity) => {
        // const instances = entity.instances.map(instance => ({ ...instance, entity }));
        return [...acc, ...entity.instances];
      }, []);

      const editors = chunk(transcript.segments, 2).map(segments => {
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
          EditorState.createWithContent(convertFromRaw({ blocks, entityMap: createEntityMap(blocks) }), decorator),
          { allowUndo: false }
        );
        return {
          editorState,
          key: `editor-${blocks[0].key}`,
          previewState: createPreview(editorState),
        };
      });

      return { editors };
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentTime !== this.props.currentTime) {
      this.onTimeUpdate(nextProps.currentTime * 1e3);
    }

    return true;
  }

  customBlockRenderer = contentBlock => {
    const type = contentBlock.getType();
    if (type === 'paragraph') {
      return {
        component: props => {
          const { block } = props;
          const key = block.getKey();
          const speaker = block.getData().get('speaker') || '';
          const start = block.getData().get('start') || '';

          return (
            <BlockWrapper className="BlockWrapper" key={`W${key}`}>
              <Speaker contentEditable={false}>
                {speaker}: {start}
              </Speaker>
              <EditorBlock {...props} />
            </BlockWrapper>
          );
        },
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
      this.props.seekTo({ seekTo: t / 1e3, transport: 'transcript' });
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

  onTimeUpdate = time => {
    this.state.editors.forEach(({ editorState, key }) => {
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
  };

  onChange = (editorState, key) => {
    const editorIndex = this.state.editors.findIndex(editor => editor.key === key);

    const contentChange =
      editorState.getCurrentContent() === this.state.editors[editorIndex].editorState.getCurrentContent()
        ? null
        : editorState.getLastChangeType();

    if (contentChange) {
      console.log(contentChange);

      this.past.push(this.state.editors);
      this.future = [];
      this.setState({
        editors: [
          ...this.state.editors.slice(0, editorIndex),
          { editorState, key, previewState: createPreview(editorState) },
          ...this.state.editors.slice(editorIndex + 1),
        ],
      });
    } else {
      this.setState({
        editors: [
          ...this.state.editors.slice(0, editorIndex),
          { editorState, key, previewState: createPreview(editorState) },
          ...this.state.editors.slice(editorIndex + 1),
        ],
      });
    }
  };

  handleUndo = () => {
    const { editors: present } = this.state;
    const futurePresent = this.past.pop();

    if (futurePresent) {
      this.future.push(present);
      this.setState({
        editors: futurePresent,
      });
    }
  };

  handleRedo = () => {
    const { editors: present } = this.state;
    const futurePresent = this.future.pop();

    if (futurePresent) {
      this.past.push(present);
      this.setState({
        editors: futurePresent,
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

  renderEditor = ({ editorState, key, previewState }) => (
    <EditorWrapper key={`s-${key}`} data-editor-key={key}>
      <VisibilitySensor
        key={`vs-${key}`}
        intervalCheck={false}
        intervalDelay={1000}
        containment={this.props.scrollingContainer}
        scrollCheck={true}
        partialVisibility={true}
      >
        {({ isVisible }) => (
          <Editor
            editorKey={key}
            readOnly={true || !isVisible}
            stripPastedStyles
            editorState={isVisible ? editorState : previewState}
            blockRendererFn={this.customBlockRenderer}
            customStyleMap={customStyleMap}
            keyBindingFn={event => this.filterKeyBindingFn(event)}
            handleKeyCommand={(command, editorState) => this.handleKeyCommand(command, editorState, key)}
            onChange={editorState => this.onChange(editorState, key)}
            ref={ref => this.setDomEditorRef(key, ref)}
          />
        )}
      </VisibilitySensor>
    </EditorWrapper>
  );

  render() {
    const { playheadEditorKey, playheadBlockKey, playheadEntityKey } = this.state;

    return (
      <TranscriptWrapper onClick={event => this.handleClick(event)}>
        <style scoped>
          {`
            span[data-entity-key="${playheadEntityKey}"] { border-bottom: 1px solid blue; }

            section[data-editor-key="${playheadEditorKey}"] ~ section .BlockWrapper > div[data-offset-key] > span { color: #696969 }
            /* div[data-offset-key="${playheadBlockKey}-0-0"] > .BlockWrapper > div[data-offset-key] > span { color: black; } */
            div[data-offset-key="${playheadBlockKey}-0-0"] ~ div > .BlockWrapper > div[data-offset-key] > span { color: #696969; }
            span[data-entity-key="${playheadEntityKey}"] ~ span[data-entity-key] { color: #696969; }
          `}
        </style>
        {this.state.editors.map((editorState, index) => this.renderEditor(editorState))}
      </TranscriptWrapper>
    );
  }
}

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const getEntityStrategy = mutability => (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey && contentState.getEntity(entityKey).getMutability() === mutability;
  }, callback);
};

const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('MUTABLE'),
    component: ({ entityKey, contentState, children }) => {
      const data = entityKey ? contentState.getEntity(entityKey).getData() : {};
      return (
        <Token data-start={data.start} data-entity-key={data.key} className="Token">
          {children}
        </Token>
      );
    },
  },
]);

const createPreview = editorState =>
  EditorState.set(
    EditorState.createWithContent(
      convertFromRaw({
        blocks: convertToRaw(editorState.getCurrentContent()).blocks.map(block => ({
          ...block,
          entityRanges: [],
          // inlineStyleRanges: [],
        })),
        entityMap: {},
      }),
      decorator
    ),
    { allowUndo: false }
  );

const createEntityMap = blocks =>
  flatten(blocks.map(block => block.entityRanges)).reduce(
    (acc, data) => ({
      ...acc,
      [data.key]: { type: 'TOKEN', mutability: 'MUTABLE', data },
    }),
    {}
  );

const createRaw = (blocks, contentState) =>
  blocks.map(block => {
    const key = block.getKey();
    const type = block.getType();
    const text = block.getText();
    const data = block.getData();

    const entityRanges = [];
    block.findEntityRanges(
      character => !!character.getEntity(),
      (start, end) =>
        entityRanges.push({
          offset: start,
          length: end - start,
        })
    );

    const inlineStyleRanges = encodeInlineStyleRanges(block);

    return {
      key,
      type,
      text,
      data,
      entityRanges: entityRanges.map(({ offset, length }) => {
        const entityKey = block.getEntityAt(offset);
        const entity = contentState.getEntity(entityKey);
        return {
          ...entity.getData(),
          offset,
          length,
        };
      }),
      inlineStyleRanges: inlineStyleRanges.map(({ offset, length }) => {
        const style = block.getInlineStyleAt(offset);
        return {
          style: Array.from(style.keys()).pop(),
          offset,
          length,
        };
      }),
    };
  });

export default Transcript;
