(() => {
  class Options {
    constructor(body) {
      this.templates = {};
      this.options = {};

      this.elements = { body };
      this.changes = {};
      this.added = {};
      this.init();
    }

    registerChange(id, key, value) {
      if (!this.options[id]) {
        if (!this.added[id]) {
          this.added[id] = {};
        }

        this.added[id][key] = value;
        return this.elements.submit.toggle(!!Object.keys(this.changes).length || !!Object.keys(this.added).length);
      }

      if (this.options[id][key] === value && this.changes[id]) {
        delete this.changes[id][key];
        if (Object.keys(this.changes[id]).length === 1) {
          delete this.changes[id];
        }

        return this.elements.submit.toggle(!!Object.keys(this.changes).length || !!Object.keys(this.added).length);
      }

      if (!this.changes[id]) {
        this.changes[id] = { id };
      }

      this.changes[id][key] = value;
      this.elements.submit.toggle(!!Object.keys(this.changes).length || !!Object.keys(this.added).length);
    }

    addItem(item = {}) {
      const id = item.id || 0;
      const template = this.elements.list.append(this.templates.option.clone()).prop('id', `option-${id}`);

      const nameInput = template.find('input[name="name"]').val(item.name).prop({
        id: `option-${id}-name`,
        name: `option-${id}-name`
      });
      nameInput.on('change', () => {
        this.registerChange(id, 'name', nameInput.val());
      });

      const amountFormulaInput = template.find('input[name="amount_formula"]').val(item.amount_formula).prop({
        id: `option-${id}-amount_formula`,
        name: `option-${id}-amount_formula`
      });
      amountFormulaInput.on('change', () => {
        this.registerChange(id, 'amount_formula', amountFormulaInput.val());
      });

      const unitInput = template.find('input[name="unit"]').val(item.unit).prop({
        id: `option-${id}-unit`,
        name: `option-${id}-unit`
      });
      unitInput.on('change', () => {
        this.registerChange(id, 'unit', unitInput.val());
      });

      const priceFormulaInput = template.find('input[name="price_formula"]').val(item.price_formula).prop({
        id: `option-${id}-price_formula`,
        name: `option-${id}-price_formula`
      });
      priceFormulaInput.on('change', () => {
        this.registerChange(id, 'price_formula', priceFormulaInput.val());
      });

      const priceDryInput = template.find('input[name="price_dry"]').val(item.price_dry).prop({
        id: `option-${id}-price_dry`,
        name: `option-${id}-price_dry`
      });
      priceDryInput.on('change', () => {
        this.registerChange(id, 'price_dry', priceDryInput.val());
      });

      const priceWetInput = template.find('input[name="price_wet"]').val(item.price_wet).prop({
        id: `option-${id}-price_wet`,
        name: `option-${id}-price_wet`
      });
      priceWetInput.on('change', () => {
        this.registerChange(id, 'price_wet', priceWetInput.val());
      });

      const currencyInput = template.find('input[name="currency"]').val(item.currency).prop({
        id: `option-${id}-currency`,
        name: `option-${id}-currency`
      });
      currencyInput.on('change', () => {
        this.registerChange(id, 'currency', currencyInput.val());
      });
    }

    mount() {
      this.elements.base = this.elements.body.find('form');
      this.elements.list = this.elements.base.find('.list');
      this.elements.list.empty();
      for (const id in this.options) {
        this.addItem(this.options[id]);
      }

      this.elements.add = this.elements.base.find('.add');
      this.elements.submit = this.elements.base.find('.submit');

      this.elements.add.on('click', event => {
        event && event.preventDefault();
        this.addItem();
      });

      this.elements.submit.on('click', event => {
        event && event.preventDefault();
        if (!Object.keys(this.changes).length && !Object.keys(this.added).length) {
          return false;
        }

        let data = [];

        for (const id in this.changes) {
          data.push(this.changes[id]);
        }

        for (const id in this.added) {
          delete this.added[id].id;
          data.push(this.added[id]);
        }

        data = data.map(item => {
          for (const [reg, replace] of operations.encoded) {
            if (item.price_formula) {
              item.price_formula = item.price_formula.replace(reg, replace);
            }
            if (item.amount_formula) {
              item.amount_formula = item.amount_formula.replace(reg, replace);
            }
          }
          return item;
        });

        console.log(data);

        Api.post('/calc/admin/references', { data: JSON.stringify(data) }, () => {});
      });

      this.elements.submit.toggle(!!Object.keys(this.changes).length || !!Object.keys(this.added).length);
    }

    async init() {
      await Promise.all([
        this.loadTemplates(),
        this.loadOptions()
      ]);
      this.changes = {};
      this.mount();
      console.log(this);
    }

    async loadTemplates() {
      const { data } = await Api.get('/calc/templates?name=admin.option', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.templates;
      }

      this.templates = {};
      for (const name in data) {
        this.templates[name.replace('admin.', '')] = $(data[name]);
      }

      return this.templates;
    }

    async loadOptions() {
      const { data } = await Api.get('/calc/references', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.options;
      }

      for (const item of data) {
        for (const [reg, replace] of operations.decoded) {
          item.price_formula = item.price_formula
            ? item.price_formula.replace(reg, replace)
            : item.price_formula;
          item.amount_formula = item.amount_formula
            ? item.amount_formula.replace(reg, replace)
            : item.amount_formula;
        }
        this.options[item.id] = item;
      }

      return this.options;
    };

  }

  window.onload = () => {
    new Options($(document.body));
  }
})();