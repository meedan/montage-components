import React from 'react';
import { Editor, EditorState } from 'draft-js';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

import { generateDecorator, memoizedCreatePreview } from './transcriptUtils';

const EditorWrapper = styled.section`
  .public-DraftStyleDefault-block {
    font-family: 'PT Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
  }
`;

const Legend = ({ comments, tags, places, higlightTag }) => (
  <dl className="column" style={{ width: 200 }}>
    <dt>comments</dt>
    {comments.map(({ id, text }) => (
      <dd onMouseOver={() => higlightTag(`C-${id}`)} onMouseOut={() => higlightTag(null)}>
        {text}
      </dd>
    ))}

    <dt>tags</dt>
    {tags.map(entity => (
      <dd onMouseOver={() => higlightTag(`T-${entity.id}`)} onMouseOut={() => higlightTag(null)}>
        {entity.project_tag.name}
      </dd>
    ))}

    <dt>places</dt>
    {places.map(entity => (
      <dd onMouseOver={() => higlightTag(`G-${entity.id}`)} onMouseOut={() => higlightTag(null)}>
        {entity.project_location.name}
      </dd>
    ))}
  </dl>
);

export default React.memo(
  ({
    editorKey,
    editorStateA,
    editorStateB,
    languageA = 'en-US',
    languageB = 'en-US',
    textDirectionalityA = 'LTR',
    textDirectionalityB = 'LTR',
    comments,
    tags,
    places,
    search,
    searchFocused,
    visibleB,
    editableB,
    editableA,
    customStyleMap,
    customBlockRenderer,
    scrollingContainer,
    filterKeyBindingFn,
    handleKeyCommand,
    handleChange,
    higlightTag,
  }) => {
    const editable = editableA || editableB;
    const previewStateA = memoizedCreatePreview(editorStateA);

    return (
      <EditorWrapper key={`segment-${editorKey}`} data-editor-key={editorKey}>
        <VisibilitySensor
          intervalCheck={false}
          intervalDelay={1000}
          containment={scrollingContainer}
          scrollCheck={true}
          partialVisibility={true}
        >
          {({ isVisible }) => (
            <div className="row">
              {!editable ? <Legend {...{ comments, tags, places, higlightTag }} /> : null}
              <div className={visibleB ? 'column' : ''} lang={languageA}>
                <Editor
                  editorKey={`A${editorKey}`}
                  readOnly={!editableA || !isVisible}
                  stripPastedStyles
                  editorState={
                    isVisible
                      ? searchFocused
                        ? EditorState.set(previewStateA, { decorator: generateDecorator(search) })
                        : search !== ''
                        ? EditorState.set(previewStateA, { decorator: generateDecorator(search) })
                        : editorStateA
                      : search.length > 2
                      ? EditorState.set(previewStateA, { decorator: generateDecorator(search) })
                      : previewStateA
                  }
                  blockRendererFn={customBlockRenderer}
                  customStyleMap={customStyleMap}
                  keyBindingFn={event => filterKeyBindingFn(event)}
                  handleKeyCommand={(command, editorState) => handleKeyCommand(command, editorState, editorKey)}
                  onChange={editorState => handleChange(editorState, editorKey)}
                  textDirectionality={textDirectionalityA}
                  autoCapitalize={false}
                  autoComplete={false}
                  autoCorrect={false}
                  spellCheck={false}
                  placeholder="Transcribe here…"
                />
              </div>
              {visibleB ? (
                <div className="column" lang={languageB}>
                  <Editor
                    editorKey={`B${editorKey}`}
                    readOnly={!editableB || !isVisible}
                    stripPastedStyles
                    editorState={
                      isVisible
                        ? searchFocused
                          ? EditorState.set(editorStateB, { decorator: generateDecorator(search) })
                          : search !== ''
                          ? EditorState.set(editorStateB, { decorator: generateDecorator(search) })
                          : editorStateB
                        : search.length > 2
                        ? EditorState.set(editorStateB, { decorator: generateDecorator(search) })
                        : editorStateB
                    }
                    blockRendererFn={customBlockRenderer}
                    customStyleMap={customStyleMap}
                    keyBindingFn={event => filterKeyBindingFn(event)}
                    handleKeyCommand={(command, editorState) => handleKeyCommand(command, editorState, editorKey)}
                    onChange={editorState => handleChange(editorState, editorKey, 'B')}
                    textDirectionality={textDirectionalityB}
                    autoCapitalize={false}
                    autoComplete={false}
                    autoCorrect={false}
                    spellCheck={false}
                    placeholder="Translate here…"
                  />
                </div>
              ) : null}
            </div>
          )}
        </VisibilitySensor>
      </EditorWrapper>
    );
  }
);
