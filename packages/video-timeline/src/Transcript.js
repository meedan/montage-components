import React from 'react';
import {
  Editor,
  EditorBlock,
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
  Modifier,
  RichUtils,
} from 'draft-js';
import encodeInlineStyleRanges from '../../../node_modules/draft-js/lib/encodeInlineStyleRanges';
import chunk from 'lodash.chunk';
import VisibilitySensor from 'react-visibility-sensor';

import './transcript.css';

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
                  style: `B${index % 3}`,
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
            <div className="WrapperBlock" key={`W${key}`}>
              <div contentEditable={false} className="speaker">
                {speaker}: {start}
              </div>
              <EditorBlock {...props} />
            </div>
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
    console.log(contentChange);

    const blockKey = editorState.getSelection().getStartKey();

    const blocks = editorState.getCurrentContent().getBlocksAsArray();
    const blockIndex = blocks.findIndex(block => block.getKey() === blockKey);
    // console.log(blockIndex);

    // if (!contentChange && blockIndex === blocks.length - 1 && editorIndex < this.state.editors.length - 1) {
    //   const editorStateA = editorState;
    //   const editorStateB = this.state.editors[editorIndex + 1].editorState;
    //
    //   const blocksA = editorStateA
    //     .getCurrentContent()
    //     .getBlockMap()
    //     .toArray();
    //   const blocksB = editorStateB
    //     .getCurrentContent()
    //     .getBlockMap()
    //     .toArray();
    //
    //   const blocks = [
    //     ...createRaw(blocksA, editorStateA.getCurrentContent()),
    //     ...createRaw(blocksB, editorStateB.getCurrentContent()),
    //   ];
    //
    //   console.log(blocks, convertToRaw(editorState.getCurrentContent()));
    //
    //   const entityMap = createEntityMap(blocks);
    //
    //   // const editorStateAB = EditorState.createWithContent(
    //   //   convertFromRaw({
    //   //     blocks,
    //   //     entityMap,
    //   //   }),
    //   //   decorator
    //   // );
    //
    //   const editorStateAB = EditorState.set(
    //     EditorState.createWithContent(
    //       convertFromRaw({
    //         blocks,
    //         entityMap,
    //       }),
    //       decorator
    //     ),
    //     {
    //       selection: editorStateA.getSelection(),
    //       // undoStack: editorStateA.getUndoStack(),
    //       // redoStack: editorStateA.getRedoStack(),
    //       lastChangeType: editorStateA.getLastChangeType(),
    //       allowUndo: false,
    //     }
    //   );
    //
    //   // const editorStateNoUndo = EditorState.set(editorStateA, { allowUndo: false });
    //   // const editorState2 = EditorState.push(
    //   //   editorStateNoUndo,
    //   //   convertFromRaw({
    //   //     blocks,
    //   //     entityMap,
    //   //   }),
    //   //   'insert-fragment'
    //   // );
    //   // const editorStateAllowUndo = EditorState.set(editorState2, { allowUndo: true });
    //   // const editorStateAB = EditorState.forceSelection(editorStateAllowUndo, editorStateA.getSelection());
    //
    //   this.past.push(this.state.editors);
    //   this.future = [];
    //   this.setState({
    //     editors: [
    //       ...this.state.editors.slice(0, editorIndex),
    //       {
    //         editorState: editorStateAB,
    //         key,
    //         previewState: createPreview(editorStateAB),
    //       },
    //       ...this.state.editors.slice(editorIndex + 2),
    //     ],
    //   });
    // } else
    if (contentChange) {
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
      // console.log(editorState.getSelection());
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

  handleFocus = (key, event) => {
    console.log('click2');
    // this.editorRefs[key].focus();
    // Object.keys(this.editorRefs)
    //   .filter(k => k !== key)
    //   .forEach(k => this.editorRefs[k].blur());
  };
  // onClick={event => this.handleFocus(key, event)}
  // onFocus={event => console.log(event.nativeEvent)}
  // customStyleFn={customStyleFn}
  renderEditor = ({ editorState, key, previewState }) => {
    // const isVisible = true;

    return (
      <section key={`s-${key}`} data-editor-key={key}>
        <VisibilitySensor
          key={`vs-${key}`}
          intervalCheck={true}
          intervalDelay={1000}
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
      </section>
    );
  };

  render() {
    return (
      <div className="Transcript" onClick={event => this.handleClick(event)}>
        <style scoped>
          {`/* section[data-editor-key="${this.state.playheadEditorKey}"] { border-left: 1px solid blue; } */`}
          {`/* div[data-offset-key="${this.state.playheadBlockKey}-0-0"] { border-right: 1px solid blue; } */`}
          {`/* span[data-entity-key="${this.state.playheadEntityKey}"] { border-bottom: 1px solid blue; } */`}

          {`section[data-editor-key="${this.state.playheadEditorKey}"] ~ section .WrapperBlock > div[data-offset-key] > span { color: #696969 }`}
          {`/* div[data-offset-key="${this.state.playheadBlockKey}-0-0"] > .WrapperBlock > div[data-offset-key] > span { color: black; } */`}
          {`div[data-offset-key="${this.state.playheadBlockKey}-0-0"] ~ div > .WrapperBlock > div[data-offset-key] > span { color: #696969; }`}
          {`span[data-entity-key="${this.state.playheadEntityKey}"] ~ span[data-entity-key] { color: #696969; }`}
        </style>
        {this.state.editors.map((editorState, index) => this.renderEditor(editorState))}
      </div>
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
        <span data-start={data.start} data-entity-key={data.key} className="Token">
          {children}
        </span>
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

const customStyleMap = {
  B0: {
    className: 'B0',
  },
  B1: {
    className: 'B1',
  },
  B2: {
    className: 'B2',
  },
};

export default Transcript;
