class List {
  constructor(container, template = $('<li></li>'), render = null, data = []) {
    this.template = template;
    this.elements = {
      container: $(container)
    };
    this.render = render;

    this.data = new Map(data);

    this.listeners = new Map();

    this.mount();
  }

  on(event, handler) {
    if (typeof handler !== 'function') {
      return this;
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(handler);
    return this;
  }

  off(event, handler) {
    if (typeof handler !== 'function') {
      return this;
    }

    if (!this.listeners.has(event)) {
      return this;
    }

    const handlers = this.listeners.get(event);
    handlers.delete(handler);
    if (!handlers.size) {
      this.listeners.delete(event);
    }

    return this;
  }

  emit(event, ...args) {
    const handlers = this.listeners.get('event');
    if (!handlers) {
      return this;
    }

    for (const handler of handlers) {
      try {
        handler(...args);
      } catch (e) {
        console.error(e);
      }
    }

    return this;
  }

  add([id, item]) {
    this.data.set(id, Object.assign({ id }, item));
    if (this.elements[id]) {
      this.elements[id].remove();
    }

    this.elements[id] = this.render(Object.assign({ id }, item), this.template, this)
      .appendTo(this.elements.container)
      .addClass('list-item')
      .prop('id', id);
  }

  mount() {
    for (const item of this.data) {
      this.add(item);
    }
  }
}