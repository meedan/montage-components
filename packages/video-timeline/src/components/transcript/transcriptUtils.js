import React from 'react';
import { EditorState, CompositeDecorator, convertFromRaw, convertToRaw } from 'draft-js';
import moize from 'moize';

import encodeInlineStyleRanges from '../../../../../node_modules/draft-js/lib/encodeInlineStyleRanges';

import Token from './Token';
import SearchHighlight from './SearchHighlight';

export const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

export const getEntityStrategy = mutability => (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return entityKey && contentState.getEntity(entityKey).getMutability() === mutability;
  }, callback);
};

export const generateDecorator = (highlightTerm = '') => {
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

export const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
  }
};

export const createPreview = editorState =>
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

export const memoizedCreatePreview = moize(createPreview);

export const createEntityMap = blocks =>
  flatten(blocks.map(block => block.entityRanges)).reduce(
    (acc, data) => ({
      ...acc,
      [data.key]: { type: 'TOKEN', mutability: 'MUTABLE', data },
    }),
    {}
  );

export const createRaw = (blocks, contentState) =>
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
