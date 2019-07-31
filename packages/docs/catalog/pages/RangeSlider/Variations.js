import React from 'react';
import { markdown, ReactSpecimen } from '@catalog/core';

import { RangeSlider } from '@montage/ui/components';

export default () => markdown`

# Variations

## Clips range slider

${(
  <ReactSpecimen>
    <RangeSlider
      checkInstance={id => console.log('checkInstance, id: ', id)}
      deleteInstance={id => console.log('deleteInstance, id: ', id)}
      updateInstance={(id, payload) =>
        console.log('updateInstance, id, payload: ', id, payload)
      }
      extendInstance={id => console.log('extendInstance, id: ', id)}
      duration={100}
      instances={[
        {
          end_seconds: 5,
          id: 1,
          start_seconds: 0,
        },
        {
          end_seconds: 50,
          id: 2,
          start_seconds: 30,
        },
        {
          end_seconds: 90,
          id: 3,
          start_seconds: 70,
        },
      ]}
      onDrag={newTime => console.log('onDrag: newTime', newTime)}
      onDragEnd={newTime => console.log('onDragEnd: newTime', newTime)}
      onDragStart={newTime => console.log('onDragStart: newTime', newTime)}
    />
  </ReactSpecimen>
)}

## Tags/Places range slider

${(
  <ReactSpecimen>
    <RangeSlider
      clipInstance={id => console.log('clipInstance, id: ', id)}
      deleteInstance={id => console.log('deleteInstance, id: ', id)}
      updateInstance={(id, payload) =>
        console.log('updateInstance, id, payload: ', id, payload)
      }
      extendInstance={id => console.log('extendInstance, id: ', id)}
      duration={100}
      instances={[
        {
          end_seconds: 5,
          id: 1,
          start_seconds: 0,
        },
        {
          end_seconds: 50,
          id: 2,
          start_seconds: 30,
        },
        {
          end_seconds: 90,
          id: 3,
          start_seconds: 70,
        },
      ]}
      onDrag={newTime => console.log('onDrag: newTime', newTime)}
      onDragEnd={newTime => console.log('onDragEnd: newTime', newTime)}
      onDragStart={newTime => console.log('onDragStart: newTime', newTime)}
    />
  </ReactSpecimen>
)}

`;
