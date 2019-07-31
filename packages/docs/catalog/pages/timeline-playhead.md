# Variations

## Default

```react
state: {time: 0}
showSource: true
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => {
    console.log('onTimeChange, time: ', time);
    setState({ time: time });
  }}
/>
```

```react
span: 2
state: {time: 0}
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => {
    console.log('onTimeChange, time: ', time);
    setState({ time: time });
  }}
/>
```

```react
span: 2
state: {time: 50}
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => {
    console.log('onTimeChange, time: ', time);
    setState({ time: time });
  }}
/>
```

```react
span: 2
state: {time: 100}
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => {
    console.log('onTimeChange, time: ', time);
    setState({ time: time });
  }}
/>
```

## Styled

```react
state: {time: 0}
showSource: true
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => {
    console.log('onTimeChange, time: ', time);
    setState({ time: time });
  }}
  style={{width: '200px', height: '100px', background: 'cyan', margin: '0 auto'}}
/>
```
