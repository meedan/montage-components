import React from 'react';
import { Editor, EditorState } from 'draft-js';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

import { generateDecorator } from './transcriptUtils';

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

// this
export default React.memo(
  ({
    editorState,
    editorKey,
    previewState,
    search,
    searchFocused,
    customStyleMap,
    customBlockRenderer,
    scrollingContainer,
    filterKeyBindingFn,
    handleKeyCommand,
    handleChange,
    setDomEditorRef,
  }) => (
    <EditorWrapper key={`s-${editorKey}`} data-editor-key={editorKey}>
      <VisibilitySensor
        key={`vs-${editorKey}`}
        intervalCheck={false}
        intervalDelay={1000}
        containment={scrollingContainer}
        scrollCheck={true}
        partialVisibility={true}
      >
        {({ isVisible }) => (
          <div className="row">
            <div className="column">
              <Editor
                editorKey={editorKey}
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
                blockRendererFn={customBlockRenderer}
                customStyleMap={customStyleMap}
                keyBindingFn={event => filterKeyBindingFn(event)}
                handleKeyCommand={(command, editorState) => handleKeyCommand(command, editorState, editorKey)}
                onChange={editorState => handleChange(editorState, editorKey)}
                ref={ref => setDomEditorRef(editorKey, ref)}
              />
            </div>
            <div className="column">
              <Editor
                editorKey={`t${editorKey}`}
                readOnly={true || !isVisible}
                stripPastedStyles
                editorState={
                  isVisible
                    ? searchFocused
                      ? EditorState.set(previewState, { decorator: generateDecorator(search) })
                      : search !== ''
                      ? EditorState.set(previewState, { decorator: generateDecorator(search) })
                      : previewState
                    : search.length > 2
                    ? EditorState.set(previewState, { decorator: generateDecorator(search) })
                    : previewState
                }
                blockRendererFn={customBlockRenderer}
                customStyleMap={customStyleMap}
                keyBindingFn={event => filterKeyBindingFn(event)}
                handleKeyCommand={(command, editorState) => handleKeyCommand(command, editorState, editorKey)}
                onChange={editorState => handleChange(editorState, editorKey)}
                ref={ref => setDomEditorRef(`t${editorKey}`, ref)}
              />
            </div>
          </div>
        )}
      </VisibilitySensor>
    </EditorWrapper>
  )
);
