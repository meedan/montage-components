# Variations

## Default

```react
state: {time: 0}
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => setState({time: time})}
/>
```

```react
span: 2
state: {time: 0}
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => setState({time: time})}
/>
```

```react
span: 2
state: {time: 50}
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => setState({time: time})}
/>
```

```react
span: 2
state: {time: 100}
---
<TimelinePlayhead
  duration={100}
  time={state.time}
  onTimeChange={time => setState({time: time})}
/>
```
