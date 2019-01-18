import React from 'react';
import { markdown, ReactSpecimen } from '@catalog/core';

import { Action } from '../../src';

export default () => markdown`

# Action

## Primary

${(
  <ReactSpecimen span={3} showSource>
    <Action primary>Action</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={3} showSource>
    <Action primary isDisabled>
      Action
    </Action>
  </ReactSpecimen>
  )}

## Secondary

${(
  <ReactSpecimen span={3} showSource>
    <Action>Action</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={3} showSource>
    <Action isDisabled>Action</Action>
  </ReactSpecimen>
  )}

## Plain

${(
  <ReactSpecimen span={3} showSource>
    <Action plain>Plain Action</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={3} showSource>
    <Action plain isDisabled>
      Action
    </Action>
  </ReactSpecimen>
  )}

## Other variations

### Block

${(
  <ReactSpecimen span={2} showSource>
    <Action block primary>
      Action
    </Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2} showSource>
    <Action block>Action</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2} showSource>
    <Action block isDisabled>
      Action
    </Action>
  </ReactSpecimen>
  )}

### Iconic

${(
  <ReactSpecimen span={2} showSource>
    <Action iconic primary>
      +
    </Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2} showSource>
    <Action iconic>+</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2} showSource>
    <Action iconic isDisabled>
      +
    </Action>
  </ReactSpecimen>
  )}

## Sizes

### Small

${(
  <ReactSpecimen span={2} showSource>
    <Action size="s">Small action</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2} showSource>
    <Action block size="s">
      Small action
    </Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2} showSource>
    <Action iconic size="s">
      +
    </Action>
  </ReactSpecimen>
  )}

### Medium

${(
  <ReactSpecimen span={2}>
    <Action>Medium-size action</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2}>
    <Action block>Medium-size action</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2}>
    <Action iconic>+</Action>
  </ReactSpecimen>
  )}

### Large

${(
  <ReactSpecimen span={2}>
    <Action size="l">Large action</Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2}>
    <Action block size="l">
      Large action
    </Action>
  </ReactSpecimen>
  )}

${(
  <ReactSpecimen span={2}>
    <Action iconic size="l">
      +
    </Action>
  </ReactSpecimen>
  )}

`;
