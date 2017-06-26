(() => {
  class Elements {
    constructor(body) {
      this.templates = {};
      this.sets = [];

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

    addItem(itemData = {}) {
      const { id = 'new',  name = null, label = null, elements = [] } = itemData || {};
      const item = this.templates.configuration.clone().appendTo(this.elements.list).prop('id', `configuration-${id}`);
      const nameInput = item.find('input[name="name"]').val(name).prop({
        id: `configuration-${id}-name`,
        name: `configuration-${id}-name`
      });
      nameInput.on('change', () => {
        this.registerChange(id, 'name', nameInput.val());
      });

      const labelInput = item.find('input[name="label"]').val(label).prop({
        id: `configuration-${id}-label`,
        name: `configuration-${id}-label`
      });
      labelInput.on('change', () => {
        this.registerChange(id, 'label', labelInput.val());
      });

      const elementsList = item.find('ul').prop({
        id  : `configuration-${id}-elements`,
        //name: `configuration-${id}-elements`
      });
      const list = new List(elementsList, $('<li><input type="checkbox"><label></label></li>'), ({ id: itemId, label: itemLabel }, template) => {
        template = $(template).clone();
        const checkbox = template.find('input[type="checkbox"]')
          .prop({
            id     : `checkbox-${itemId}`,
            checked: elements.includes(itemId)
          })
          .val(itemId);

        checkbox.on('change', () => {
          const result = Array.from(elementsList
            .find('input[type="checkbox"]:checked')
            .map((i, element) => $(element).val())
          ).join(',');
          this.registerChange(id, 'elements', result);
        });

        template.find('label').prop('for', `checkbox-${itemId}`).text(itemLabel);
        return template;
      });

      for (const { id, label } of this.sets) {
        list.add([id, { label }]);
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
          if (this.changes[id].elements) {
            this.changes[id].elements = this.changes[id].elements.split(',');
          }
        }

        Api.post('/calc/admin/configurations', { data: JSON.stringify(this.changes) }, () => {}).then(() => {
          this.changes = {}
        }).catch(() => {
          this.changes = {};
        });

      });

      this.elements.submit.toggle(!!Object.keys(this.changes).length);
    }

    async init() {
      await Promise.all([
        this.loadTemplates(),
        this.loadConfigurations(),
        this.loadElements()
      ]);
      this.changes = {};
      this.mount();
      console.log(this);
    }

    async loadTemplates() {
      const { data } = await Api.get('/calc/templates?name=admin.configuration', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.templates;
      }

      this.templates = {};
      for (const name in data) {
        this.templates[name.replace('admin.', '')] = $(data[name]);
      }
      return this.templates;
    }

    async loadConfigurations() {
      const { data } = await Api.get('/calc/configurations', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.source;
      }

      for (const { id, name, label, elements } of data || []) {
        this.source[id] = {
          id, name, label,
          elements: elements.map(x => +x)
        };
      }
    };

    async loadElements() {
      const { data } = await Api.get('/calc/elements', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.sets;
      }

      for (const { id, label } of data || []) {
        this.sets.push({ id, label });
      }
    };


  }

  window.onload = () => {
    new Elements($(document.body));
  }
})();