(() => {
  class Elements {
    constructor(body) {
      this.templates = {};
      this.options = {};

      this.elements = { body };
      this.source = {};
      this.changes = {};
      this.init();
    }

    registerChange(id, key, value) {
      if (this.source[id] && this.source[id][key] === value && this.changes[id]) {
        delete this.changes[id][key];
        if (!Object.keys(this.changes[id]).length) {
          delete this.changes[id];
        }

        return this.elements.submit.toggle(!!Object.keys(this.changes).length);
      }

      if (!this.changes[id]) {
        this.changes[id] = {};
      }

      this.changes[id][key] = value;
      this.elements.submit.toggle(!!Object.keys(this.changes).length);
    }

    addItem({id = 'new',  name = null, label = null, required = [], additional = [] } = {}) {
      const item = this.elements.list.append(this.templates.element.clone()).prop('id', `element-${id}`);
      const nameInput = item.find('input[name="name"]').val(name).prop({
        id: `element-${id}-name`,
        name: `element-${id}-name`
      });
      nameInput.on('change', () => {
        this.registerChange(id, 'name', nameInput.val());
      });

      const labelInput = item.find('input[name="label"]').val(label).prop({
        id: `element-${id}-label`,
        name: `element-${id}-label`
      });
      labelInput.on('change', () => {
        this.registerChange(id, 'label', labelInput.val());
      });

      const requiredSelector = item.find('select[name="required"]').prop({
        id  : `element-${id}-options-required`,
        name: `element-${id}-options-required`
      });
      requiredSelector.on('change', () => {
        this.registerChange(id, 'required', requiredSelector.val());
      });

      const additionalSelector = item.find('select[name="additional"]').prop({
        id  : `element-${id}-options-additional`,
        name: `element-${id}-options-additional`
      });
      additionalSelector.on('change', () => {
        this.registerChange(id, 'additional', additionalSelector.val());
      });

      for (const { id, name } of this.options) {
        requiredSelector.append(new Option(name, id, false, required.includes(id)));
        additionalSelector.append(new Option(name, id, false, additional.includes(id)));
      }
    }

    mount() {
      this.elements.base = this.elements.body.find('form');
      this.elements.list = this.elements.base.find('.list');
      this.elements.list.empty();
      for (const id in this.source) {
        this.addItem(this.source[id]);
      }

      this.elements.add = this.elements.base.find('.add');
      this.elements.submit = this.elements.base.find('.submit');

      this.elements.add.on('click', event => {
        event && event.preventDefault();
        this.addItem();
      });

      this.elements.submit.on('click', event => {
        event && event.preventDefault();
        if (!Object.keys(this.changes).length) {
          return false;
        }

        console.log(new FormData(this.elements.base.html()));

        Api.post('/calc/admin/elements', { data: JSON.stringify(this.changes) }, () => {}).then(console.log).catch(console.error);
      });

      this.elements.submit.toggle(!!Object.keys(this.changes).length);
    }

    async init() {
      await Promise.all([
        this.loadTemplates(),
        this.loadReferences(),
        this.loadElements()
      ]);
      this.changes = {};
      this.mount();
      console.log(this);
    }

    async loadTemplates() {
      const { data } = await Api.get('/calc/templates?name=element', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.templates;
      }

      this.templates = {};
      for (const name in data) {
        this.templates[name] = $(data[name]);
      }
      return this.templates;
    }

    async loadReferences() {
      const { data } = await Api.get('/calc/references', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.options;
      }

      this.options = data;
      return this.options;
    };

    async loadElements() {
      const { data } = await Api.get('/calc/elements', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.source;
      }

      for (const { id, name, label, options } of data || []) {
        this.source[id] = Object.assign({ id, name, label }, options);
      }
    };


  }

  window.onload = () => {
    new Elements($(document.body));
  }
})();