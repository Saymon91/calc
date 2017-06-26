(() => {
  class Elements {
    constructor(body) {
      this.templates = {};
      this.options = new Map();

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
      const item = this.templates.element.clone().appendTo(this.elements.list).prop('id', `element-${id}`);
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

      const requiredContainer = item.find('ul.required').prop({
        id  : `element-${id}-options-required`,
        //name: `configuration-${id}-elements`
      });
      const requiredList = new List(requiredContainer, $('<li><input type="checkbox"><label></label></li>'), ({ id: itemId, label: itemLabel }, template) => {
        template = $(template).clone();
        const checkbox = template.find('input[type="checkbox"]')
          .prop({
            id     : `checkbox-required-${itemId}`,
            checked: required.includes(itemId)
          })
          .val(itemId);

        checkbox.on('change', () => {
          const result = Array.from(requiredContainer
            .find('input[type="checkbox"]:checked')
            .map((i, element) => $(element).val())
          ).join(',');
          this.registerChange(id, 'required', result);
        });

        template.find('label').prop('for', `checkbox-required-${itemId}`).text(itemLabel);
        return template;
      });

      const additionalContainer = item.find('ul.additional').prop({
        id  : `element-${id}-options-required`,
        //name: `configuration-${id}-elements`
      });
      const additionalList = new List(additionalContainer, $('<li><input type="checkbox"><label></label></li>'), ({ id: itemId, label: itemLabel }, template) => {
        template = $(template).clone();
        const checkbox = template.find('input[type="checkbox"]')
          .prop({
            id     : `checkbox-additional-${itemId}`,
            checked: additional.includes(itemId)
          })
          .val(itemId);

        checkbox.on('change', () => {
          const result = Array.from(additionalContainer
            .find('input[type="checkbox"]:checked')
            .map((i, element) => $(element).val())
          ).join(',');
          this.registerChange(id, 'additional', result);
        });

        template.find('label').prop('for', `checkbox-additional-${itemId}`).text(itemLabel);
        return template;
      });


      for (const [id, { name }] of this.options) {
        requiredList.add([id, { label: name }]);
        additionalList.add([id, { label: name }]);
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

        for (const id in this.changes) {
          if (this.changes[id].required) {
            this.changes[id].required = this.changes[id].required.split(',');
          }
          if (this.changes[id].additional) {
            this.changes[id].additional = this.changes[id].additional.split(',');
          }
        }

        Api.post('/calc/admin/elements', { data: JSON.stringify(this.changes) }, () => {})
          .then(() => this.changes = {}).catch(() => this.changes = {});
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
      const { data } = await Api.get('/calc/templates?name=admin.element', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.templates;
      }

      this.templates = {};
      for (const name in data) {
        this.templates[name.replace('admin.', '')] = $(data[name]);
      }
      return this.templates;
    }

    async loadReferences() {
      const { data } = await Api.get('/calc/references', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.options;
      }

      for (const { id, name } of data) {
        this.options.set(id, { id, name });
      }

      return this.options;
    };

    async loadElements() {
      const { data } = await Api.get('/calc/elements', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.source;
      }

      for (const { id, name, label, options } of data || []) {
        this.source[id] = {
          id, name, label,
          required  : options.required ? options.required.map(x => +x) : [],
          additional: options.additional ? options.additional.map(x => +x) : [],
        };
      }
    };


  }

  window.onload = () => {
    new Elements($(document.body));
  }
})();