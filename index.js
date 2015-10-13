/**
 * Copyright 2015
 * All rights reserved.
 *
 * @providesModule reactGlobalEvent
 */

var invariant = require('invariant');

// TODO: Extend for all events
var globalQueues = {
  click: [],
  scroll: [],
  keydown: [],
  keyup: [],
  keypress: [],
};

/*
 * @params {array} queue. one of the `globalQueues[n]`
 * @void
 */
function runQueue(queue) {
  queue.forEach( function callCallback(callback) {
    callback.call(this)
  });
}

/*
 * @params {string} key
 * @params {function} callback
 * @void
 */
function removeCallback(key, callback) {
  window.removeEventListener(key, callback);

  var index = globalQueues[key].indexOf(callback);
  globalQueues[key].splice(index, 1);
}

/*
 * @decorator
 * @params {string} eventType
 */
module.exports = function reactGlobalEvent(eventType) {
  return function decorate(target, key, descriptor) {
    globalQueues[eventType].push(descriptor.value);

    /*
     * add event listeners on mount
     */
    Object.defineProperty(target, 'componentDidMount', {
      configurable: true,
      value: function componentDidMountDecorator() {
        window.addEventListener('click', runQueue.bind(this, globalQueues.click));
        window.addEventListener('scroll', runQueue.bind(this, globalQueues.scroll));
        window.addEventListener('keydown', runQueue.bind(this, globalQueues.keydown));
        target._componentDidMount.call(this);
      },
    });

    /*
     * remove event listener on unmount
     */
    Object.defineProperty(target, 'componentWillUnmount', {
      configurable: true,
      value: function componentWillUnmountDecorator() {
        for (var eventKey in globalQueues) {
          if (globalQueues.hasOwnProperty(eventKey)) {
            globalQueues[eventKey].forEach(
              removeCallback.bind(null, eventKey, globalQueues[eventKey])
            );
          }
        }

        target._componentWillUnmount.call(this);
      },
    });
  };
}
