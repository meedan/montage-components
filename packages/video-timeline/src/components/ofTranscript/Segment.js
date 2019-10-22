import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

import { generateDecorator, memoizedCreatePreview } from './transcriptUtils';

import TranscriptSide from './TranscriptSide';
import TranscriptMain from './TranscriptMain';
import TranscriptText from './TranscriptText';
import Legend from './Legend';

const EditorWrapper = styled.section`
  user-select: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 1500px;

  .public-DraftStyleDefault-block {
    font-family: noto_monoregular, 'PT Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 28px;
    * {
      box-sizing: border-box;
    }
  }
  .sticky {
    transition: transform 0.2s, top 0.2s;
  }
  .sticky-boundary-el {
    position: relative;
  }
`;

class Segment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      delayedIsVisible: false,
    };
  }

  render() {
    const {
      comments,
      customBlockRenderer,
      customStyleMap,
      editable,
      editorKey,
      editorStateA,
      editorStateB,
      handleChange,
      higlightTag,
      languageA = 'en-US',
      languageB = 'en-US',
      places,
      scrollingContainer,
      search,
      searchFocused,
      showTranslation,
      tags,
      textDirectionalityA = 'LTR',
      textDirectionalityB = 'LTR',
    } = this.props;

    const { delayedIsVisible } = this.state;

    return (
      <EditorWrapper key={`segment-${editorKey}`} data-editor-key={editorKey} className="sticky-boundary-el">
        <VisibilitySensor
          delayedCall={true}
          intervalCheck={true}
          intervalDelay={1000}
          containment={scrollingContainer}
          scrollCheck={false}
          scrollDelay={1000}
          partialVisibility={true}
          onChange={isVisible => {
            this.setState({ isVisible });
            window.setTimeout(() => {
              window.requestIdleCallback(
                () => {
                  this.setState({ delayedIsVisible: isVisible });
                },
                { timeout: 1000 }
              );
            }, 700);
          }}>
          {({ isVisible }) => (
            <>
              <TranscriptSide left separate>
                {!editable ? (
                  <Legend
                    {...{ isVisible, comments, tags, places, higlightTag }}
                    scrollingContainer={scrollingContainer}
                  />
                ) : null}
              </TranscriptSide>
              <TranscriptMain>
                <TranscriptText lang={languageA} stretch={!showTranslation}>
                  <Editor
                    editorKey={`A${editorKey}`}
                    readOnly={!editable || !isVisible}
                    stripPastedStyles
                    editorState={
                      delayedIsVisible
                        ? searchFocused
                          ? EditorState.set(previewState(editorStateA), {
                              decorator: generateDecorator(search),
                            })
                          : search !== ''
                          ? EditorState.set(previewState(editorStateA), {
                              decorator: generateDecorator(search),
                            })
                          : editorStateA
                        : search.length > 2
                        ? EditorState.set(previewState(editorStateA), {
                            decorator: generateDecorator(search),
                          })
                        : previewState(editorStateA)
                    }
                    blockRendererFn={customBlockRenderer}
                    customStyleMap={customStyleMap}
                    onChange={editorState => handleChange(editorState, editorKey)}
                    textDirectionality={textDirectionalityA}
                    spellCheck={false}
                    placeholder="Transcribe here…"
                  />
                </TranscriptText>

                {showTranslation ? (
                  <TranscriptText lang={languageB}>
                    <Editor
                      editorKey={`B${editorKey}`}
                      readOnly={!editable || !isVisible}
                      stripPastedStyles
                      editorState={
                        isVisible
                          ? searchFocused
                            ? EditorState.set(editorStateB, {
                                decorator: generateDecorator(search),
                              })
                            : search !== ''
                            ? EditorState.set(editorStateB, {
                                decorator: generateDecorator(search),
                              })
                            : editorStateB
                          : search.length > 2
                          ? EditorState.set(editorStateB, {
                              decorator: generateDecorator(search),
                            })
                          : editorStateB
                      }
                      blockRendererFn={customBlockRenderer}
                      customStyleMap={customStyleMap}
                      onChange={editorState => handleChange(editorState, editorKey, 'B')}
                      textDirectionality={textDirectionalityB}
                      spellCheck={false}
                      placeholder="Translate here…"
                    />
                  </TranscriptText>
                ) : null}
              </TranscriptMain>
              <TranscriptSide right separate></TranscriptSide>
            </>
          )}
        </VisibilitySensor>
      </EditorWrapper>
    );
  }
}

const previewState = editorState => memoizedCreatePreview(editorState);

export default React.memo(Segment);
