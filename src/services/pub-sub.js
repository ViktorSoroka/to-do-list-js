class _PubSub {
  constructor() {
    this.subToken = 0;
    this.topics = {};
  }

  publish(topic, ...args) {
    const { topics } = this;

    if (!topics[topic]) {
      return false;
    }

    topics[topic].forEach(item => item.func.apply(item, args));
  }

  subscribe(topic, func) {
    const { topics } = this;
    const token = ++this.subToken;

    topics[topic] = topics[topic] || [];

    topics[topic].push({
      token,
      func
    });

    return token;
  }

  unsubscribe(token) {
    const { topics } = this;

    for (let key in topics) {
      if (topics.hasOwnProperty(key)) {
        topics[key].forEach(eventTopic => {
          if (eventTopic[i].token === token) {
            eventTopic.splice(i, 1);
          }
        });
      }
    }
  }

  applyTo(obj) {
    if (typeof obj !== 'undefined') {
      obj.publish = this.publish.bind(this);
      obj.subscribe = this.subscribe.bind(this);
    }
  }
}

export default new _PubSub();
