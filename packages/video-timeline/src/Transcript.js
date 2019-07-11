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
  /* background-color: rgba(255, 255, 255, 1); */
`;

const SearchHighlight = styled.span`
  color: orange;
  border-bottom: 2px solid orange;
  background-color: navajowhite;
  span {
    background-color: navajowhite;
  }
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
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
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

      return { transcript, editors };
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentTime !== this.props.currentTime) {
      const time = nextProps.currentTime * 1e3;
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

  handleChange = (editorState, key) => {
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

  Editor = React.memo(({ editorState, key, previewState, search, searchFocused }) => (
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
            editorState={
              isVisible
                ? searchFocused
                  ? EditorState.set(previewState, { decorator: generateDecorator(search) })
                  : search !== ''
                  ? EditorState.set(editorState, { decorator: generateDecorator(search) })
                  : editorState
                : search.length > 2
                ? EditorState.set(previewState, { decorator: generateDecorator(search) })
                : previewState
            }
            blockRendererFn={this.customBlockRenderer}
            customStyleMap={customStyleMap}
            keyBindingFn={event => this.filterKeyBindingFn(event)}
            handleKeyCommand={(command, editorState) => this.handleKeyCommand(command, editorState, key)}
            onChange={editorState => this.handleChange(editorState, key)}
            ref={ref => this.setDomEditorRef(key, ref)}
          />
        )}
      </VisibilitySensor>
    </EditorWrapper>
  ));

  render() {
    const { playheadEditorKey, playheadBlockKey, playheadEntityKey, matchKey, search, searchFocused } = this.state;

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
          containment={this.props.scrollingContainer}
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
        {this.state.editors.map(({ editorState, key, previewState }) => (
          <this.Editor {...{ editorState, key, previewState, search, searchFocused }} />
        ))}
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

const generateDecorator = (highlightTerm = '') => {
  const regex = new RegExp(highlightTerm, 'gi');

  return new CompositeDecorator([
    {
      strategy: (contentBlock, callback) => {
        if (highlightTerm !== '') {
          findWithRegex(regex, contentBlock, callback);
        }
      },
      component: ({ children }) => <SearchHighlight>{children}</SearchHighlight>,
    },
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
};

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
  }
};

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
      generateDecorator()
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
