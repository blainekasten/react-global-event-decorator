# react-global-event-decorator
An abuse of the decorator pattern

##### What is this for?
Ever had a React component that needed to do things when you clicked anywhere in the DOM?

It required you to write code like this:

```js
componentDidMount() {
  window.addEventListener('click', myGlobalClickHandler.bind(this));
}
```

That's fine, but then you have to remember to remove the listener when you unmount also. This is a simple thing to miss which leads to memory leaks and bad practice.

### Enter the abuse
I decided to mess with the system, and abuse a new spec, Decorators. Now we can refactor the above code into this:

```js
import reactGlobalEvent from 'react-global-event-decorator';

@reactGlobalEvent('click')
myGlobalClickHandler() {
  // impl
}
```

This will handle the binding and unbinding with your components lifecycle. How's this work? Well, we destroyed your ability to define `componentDidMount` and `componentWillUnmount`.

##### Uhhh
Yeah. It's a dumb idea. But it's an idea. Which is all this was.
But you can just do that dumb coding thing we do in javascript where we put a `_` before everything and it'll work fine.

```
@reactGlobalEvent('click')
myGlobalClickHandler() {
  // impl
}

_componentDidMount() {
  // mount logic
}
```


#### Roadmap
Probably nothing. As this is likely a bad idea.
If anything,
* make sure all events are covered
* Tie directly into Reacts event system, rather than `window.{add|remove}EventListener`
