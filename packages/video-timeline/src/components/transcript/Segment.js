import React from 'react';
import { Editor, EditorState } from 'draft-js';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

import { generateDecorator, memoizedCreatePreview } from './transcriptUtils';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import LabelIcon from '@material-ui/icons/Label';
import CommentIcon from '@material-ui/icons/ModeComment';
import LocationIcon from '@material-ui/icons/LocationOn';

import TranscriptSide from './TranscriptSide';
import TranscriptMain from './TranscriptMain';
import TranscriptContainer from './TranscriptContainer';
import TranscriptText from './TranscriptText';

const EditorWrapper = styled.section`
  .public-DraftStyleDefault-block {
    font-family: 'PT Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
  }
`;

const LegendContainer = styled.div`
  padding-left: 24px;
  position: relative;
`;
const LegendLabel = styled.div`
  position: absolute;
  left: 0;
`;

const Legend = ({ comments, tags, places, higlightTag }) => (
  <>
    <LegendContainer>
      {comments.length > 0 ? (
        <LegendLabel>
          <Tooltip title="Comments">
            <CommentIcon fontSize="small" color="disabled" size=""></CommentIcon>
          </Tooltip>
        </LegendLabel>
      ) : null}
      {comments.map(({ id, text }) => (
        <div key={`C-${id}`} onMouseOver={() => higlightTag(`C-${id}`)} onMouseOut={() => higlightTag(null)}>
          <Typography variant="caption" noWrap>
            {text}
          </Typography>
        </div>
      ))}
    </LegendContainer>

    <LegendContainer>
      {tags.length > 0 ? (
        <LegendLabel>
          <Tooltip title="Tags">
            <LabelIcon fontSize="small" color="disabled" size=""></LabelIcon>
          </Tooltip>
        </LegendLabel>
      ) : null}
      {tags.map(entity => (
        <div
          key={`T-${entity.id}`}
          onMouseOver={() => higlightTag(`T-${entity.id}`)}
          onMouseOut={() => higlightTag(null)}
        >
          <Typography variant="caption" noWrap>
            {entity.project_tag.name}
          </Typography>
        </div>
      ))}
    </LegendContainer>

    <LegendContainer>
      {places.length > 0 ? (
        <LegendLabel>
          <Tooltip title="Locations">
            <LocationIcon fontSize="small" color="disabled" size=""></LocationIcon>
          </Tooltip>
        </LegendLabel>
      ) : null}
      {places.map(entity => (
        <div
          key={`G-${entity.id}`}
          onMouseOver={() => higlightTag(`G-${entity.id}`)}
          onMouseOut={() => higlightTag(null)}
        >
          <Typography variant="caption" noWrap>
            {entity.project_location.name}
          </Typography>
        </div>
      ))}
    </LegendContainer>
  </>
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
    editable,
    customStyleMap,
    customBlockRenderer,
    scrollingContainer,
    filterKeyBindingFn,
    handleKeyCommand,
    handleChange,
    higlightTag,
  }) => {
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
            <TranscriptContainer>
              <TranscriptSide>
                {!editable ? <Legend {...{ comments, tags, places, higlightTag }} /> : null}
              </TranscriptSide>
              <TranscriptMain>
                <TranscriptText lang={languageA} stretch={!visibleB}>
                  <Editor
                    editorKey={`A${editorKey}`}
                    readOnly={!editable || !isVisible}
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
                    spellCheck={false}
                    placeholder="Transcribe here…"
                  />
                </TranscriptText>

                {visibleB ? (
                  <TranscriptText lang={languageB}>
                    <Editor
                      editorKey={`B${editorKey}`}
                      readOnly={!editable || !isVisible}
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
                      spellCheck={false}
                      placeholder="Translate here…"
                    />
                  </TranscriptText>
                ) : null}
              </TranscriptMain>
              <TranscriptSide></TranscriptSide>
            </TranscriptContainer>
          )}
        </VisibilitySensor>
      </EditorWrapper>
    );
  }
);
