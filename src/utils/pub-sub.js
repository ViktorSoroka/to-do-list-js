class _PubSub {
  constructor() {
    this.subToken = 0;
    this.topics = {};
  }

  publish(topic) {
    const { topics } = this;
    const args = [].slice.call(arguments, 1);

    if (!topics[topic]) {
      return false;
    }

    topics[topic].forEach(function (item) {
      item.func.apply(item, args);
    });
  }

  subscribe(topic, cb) {
    const { topics } = this;

    if (!topics[topic]) {
      topics[topic] = [];
    }

    const token = ++this.subToken;

    topics[topic].push({
      token,
      func: cb
    });

    return token;
  }

  unsubscribe(token) {
    const { topics } = this;

    for (let m in topics) {
      if (topics[m]) {
        for (let i = 0, l = topics[m].length; i < l; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
          }
        }
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
