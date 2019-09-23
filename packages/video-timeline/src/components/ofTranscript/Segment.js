import React from 'react';
import { Editor, EditorState } from 'draft-js';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';
import Sticky from 'react-sticky-el';

import { generateDecorator, memoizedCreatePreview } from './transcriptUtils';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import LabelIcon from '@material-ui/icons/Label';
import CommentIcon from '@material-ui/icons/Comment';
import LocationIcon from '@material-ui/icons/LocationOn';

import TranscriptSide from './TranscriptSide';
import TranscriptMain from './TranscriptMain';
import TranscriptContainer from './TranscriptContainer';
import TranscriptText from './TranscriptText';

const EditorWrapper = styled.section`
  user-select: auto;
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
`;

const LegendContainer = styled.div`
  margin-top: 10px;
  padding-left: 24px;
  position: relative;
  user-select: none;
`;
const LegendItem = styled.div`
  &:hover * {
    color: #2f80ed;
    text-decoration: underline;
  }
`;
const LegendLabel = styled.div`
  position: absolute;
  left: 0;
`;

const Legend = ({ comments, tags, places, higlightTag }) => (
  <Sticky boundaryElement=".sticky-boundary-el" scrollElement=".sticky-scroll-area" hideOnBoundaryHit={false}>
    {comments.length > 0 ? (
      <LegendContainer>
        <LegendLabel>
          <Tooltip title="Comments">
            <CommentIcon fontSize="small" color="disabled" size="" style={{ height: '0.85em' }}></CommentIcon>
          </Tooltip>
        </LegendLabel>
        <LegendItem onMouseOver={() => higlightTag('C-*')} onMouseOut={() => higlightTag(null)}>
          <Typography color="textSecondary" noWrap style={{ display: 'block', width: '120px' }} variant="caption">
            {comments.length} comment thread{comments.length > 1 ? 's' : ''}
          </Typography>
        </LegendItem>
      </LegendContainer>
    ) : null}

    {tags.length > 0 ? (
      <LegendContainer>
        <LegendLabel>
          <Tooltip title="Tags">
            <LabelIcon fontSize="small" color="disabled" size=""></LabelIcon>
          </Tooltip>
        </LegendLabel>
        {tags.map(entity => (
          <LegendItem
            key={`T-${entity.id}`}
            onMouseOver={() => higlightTag(`T-${entity.id}`)}
            onMouseOut={() => higlightTag(null)}>
            <Typography
              color="textSecondary"
              noWrap
              style={{ display: 'block', width: '120px' }}
              title={entity.project_tag.name}
              variant="caption">
              {entity.project_tag.name}
            </Typography>
          </LegendItem>
        ))}
      </LegendContainer>
    ) : null}

    {places.length > 0 ? (
      <LegendContainer>
        <LegendLabel>
          <Tooltip title="Locations">
            <LocationIcon fontSize="small" color="disabled" size=""></LocationIcon>
          </Tooltip>
        </LegendLabel>
        {places.map(entity => (
          <div
            key={`G-${entity.id}`}
            onMouseOver={() => higlightTag(`G-${entity.id}`)}
            onMouseOut={() => higlightTag(null)}>
            <Typography
              color="textSecondary"
              noWrap
              style={{ display: 'block', width: '120px' }}
              title={entity.project_location.name}
              variant="caption">
              {entity.project_location.name}
            </Typography>
          </div>
        ))}
      </LegendContainer>
    ) : null}
  </Sticky>
);

export default React.memo(
  ({
    comments,
    customBlockRenderer,
    customStyleMap,
    editable,
    editorKey,
    editorStateA,
    editorStateB,
    // filterKeyBindingFn,
    handleChange,
    // handleKeyCommand,
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
  }) => {
    const previewStateA = memoizedCreatePreview(editorStateA);

    return (
      <EditorWrapper key={`segment-${editorKey}`} data-editor-key={editorKey}>
        <VisibilitySensor
          delayedCall={true}
          intervalCheck={true}
          intervalDelay={1000}
          containment={scrollingContainer}
          scrollCheck={true}
          scrollDelay={500}
          partialVisibility={true}>
          {({ isVisible }) => (
            <TranscriptContainer className="sticky-boundary-el">
              <TranscriptSide left separate>
                {!editable ? <Legend {...{ comments, tags, places, higlightTag }} /> : null}
              </TranscriptSide>
              <TranscriptMain>
                <TranscriptText lang={languageA} stretch={!showTranslation}>
                  <Editor
                    editorKey={`A${editorKey}`}
                    readOnly={!editable || !isVisible}
                    stripPastedStyles
                    editorState={
                      isVisible
                        ? searchFocused
                          ? EditorState.set(previewStateA, {
                              decorator: generateDecorator(search),
                            })
                          : search !== ''
                          ? EditorState.set(previewStateA, {
                              decorator: generateDecorator(search),
                            })
                          : editorStateA
                        : search.length > 2
                        ? EditorState.set(previewStateA, {
                            decorator: generateDecorator(search),
                          })
                        : previewStateA
                    }
                    blockRendererFn={customBlockRenderer}
                    customStyleMap={customStyleMap}
                    // keyBindingFn={event => filterKeyBindingFn(event)}
                    // handleKeyCommand={(command, editorState) => handleKeyCommand(command, editorState, editorKey)}
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
                      // keyBindingFn={event => filterKeyBindingFn(event)}
                      // handleKeyCommand={(command, editorState) => handleKeyCommand(command, editorState, editorKey)}
                      onChange={editorState => handleChange(editorState, editorKey, 'B')}
                      textDirectionality={textDirectionalityB}
                      spellCheck={false}
                      placeholder="Translate here…"
                    />
                  </TranscriptText>
                ) : null}
              </TranscriptMain>
              <TranscriptSide right separate></TranscriptSide>
            </TranscriptContainer>
          )}
        </VisibilitySensor>
      </EditorWrapper>
    );
  }
);
