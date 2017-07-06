(() => {
  class App {
    constructor(body) {
      this.elements = {};
      this.references = {};
      this.sets = {};
      this.configurations = new Map();
      this.templates = {};

      this.elementsTypes = new Map();
      this.elements.body = $(body);

      this.parameters = {
        floors   : 1,
        floor1   : {},
        floor2   : {},
        lastFloor: 'floor1'
      };

      this.options = {};

      this.init();
    }

    async init() {
      await Promise.all([
        this.loadConfigurations(),
        this.loadReferences(),
        this.loadTemplates(),
        this.loadElements()
      ]);
      this.mount();
      console.log(this);
    }

    mount() {
      const { body } = this.elements;
      const content = body.find('article.content');
      const floorsBlock = content.find('#dimensions-floors').find('.block');
      for (const [id, { name, label }] of this.configurations) {
        floorsBlock.append(`<input type="radio" name="floors" id="configuration-${id}" value="${name}">`);
        floorsBlock.append(`<label for="configuration-${id}">${label}</label>`);
      }

      Object.assign(this.elements, {
        content,

        layoutSelector: content.find('input[name="layout"]:radio'),

        floors: content.find('input[name="floors"]'),

        widthFloor1 : content.find('#dimensions-floor1-width'),
        lengthFloor1: content.find('#dimensions-floor1-length'),
        heightFloor1: content.find('#dimensions-floor1-height'),

        areaFloor1   : content.find('#dimensions-floor1-area'),
        areaWetFloor1: content.find('#dimensions-floor1-area-wet'),

        wetRFloor1     : content.find('#dimensions-floor1-wet-r'),
        internalRFloor1: content.find('#dimensions-floor1-internal-r'),
        externalRFloor1: content.find('#dimensions-floor1-external-r'),

        widthFloor2 : content.find('#dimensions-floor2-width'),
        lengthFloor2: content.find('#dimensions-floor2-length'),
        heightFloor2: content.find('#dimensions-floor2-height'),

        areaFloor2   : content.find('#dimensions-floor2-area'),
        areaWetFloor2: content.find('#dimensions-floor2-area-wet'),

        wetRFloor2     : content.find('#dimensions-floor2-wet-r'),
        internalRFloor2: content.find('#dimensions-floor2-internal-r'),
        externalRFloor2: content.find('#dimensions-floor2-external-r'),

        optionsBlock: content.find('#parameters').find('.block'),
      });

      this.elements.lengthFloor1.bind('change', () => {
        this.build('floor1', { length: +this.elements.lengthFloor1.val() });
        this.calcOptions();
      });
      this.elements.lengthFloor2.bind('change', () => {
        this.build('floor2', { length: +this.elements.lengthFloor2.val() });
        this.calcOptions();
      });
      this.elements.widthFloor1.bind('change', () => {
        this.build('floor1', { width: +this.elements.widthFloor1.val() });
        this.calcOptions();
      });
      this.elements.widthFloor2.bind('change', () => {
        this.build('floor2', { width: +this.elements.widthFloor2.val() });
        this.calcOptions();
      });
      this.elements.heightFloor1.bind('change', () => {
        this.build('floor1', { height: +this.elements.heightFloor1.val() });
        this.calcOptions();
      });
      this.elements.heightFloor2.bind('change', () => {
        this.build('floor2', { height: +this.elements.heightFloor2.val() });
        this.calcOptions();
      });

      this.elements.floors.bind('change', () => {
        let { elements } = this.configurations.get(this.elements.floors.val());
        elements = elements.map(id => Object.assign({ id }, this.sets[id]));

        for (const name in this.options) {
          this.options[name].grid.destruct();
          this.options[name].block.remove();
          delete this.options[name];
        }

        const floor2Dimensions = this.elements.content.find('#dimensions-floor2');
        this.build(null, { floors: 1 });

        floor2Dimensions.hide();
        this.parameters.lastFloor = 'floor1';

        for (const { id, name } of elements) {
          if (name === 'floor2') {
            this.parameters.lastFloor = 'floor2';
            this.build(null, { floors: 2 });
            floor2Dimensions.show();
          }

          this.buildOptions(id, name.startsWith('floor1') ? 'floor1' : this.parameters.lastFloor);
          this.calcOptions(id);
        }
      });

      this.elements.layoutSelector.change(({ target }) => {
        this.elements.body.removeClass();
        this.elements.body.addClass(target.value);
      });

      this.elements.body.addClass(content.find('input[name="layout"]:radio:checked').val());
    }

    createGrid(sourceFloor, container, options, element) {
      const source = this.parameters[sourceFloor];
      const columns = [
        'name',
        {
          name         : 'count',
          field        : 'count',
          cellFormatter: (row, { data }, key) => {
            const { calcCount } = data;
            $(row).find(`.${key}`).text((calcCount.call(Object.assign({}, data, source)) || 0).toFixed(2));
          }
        },
        'unit',
        {
          name         : 'price',
          field        : 'price',
          cellFormatter: (row, { data }, key) => {
            $(row).find(`.${key}`).find('.wet').text((data.price_wet || 0).toFixed(2));
            $(row).find(`.${key}`).find('.dry').text((data.price_dry || 0).toFixed(2));
          }
        },
        {
          name         : 'total',
          field        : 'total',
          cellFormatter: (row, { data }, key) => {
            const { calcCount, calcPrice } = data;
            const context = Object.assign({}, data, source);
            context.count = calcCount.call(context);
            data.total = {
              wet: calcPrice.call(context, 'wet'),
              dry: calcPrice.call(context, 'dry')
            };

            $(row).find(`.${key}`).find('.wet').text((data.total.wet || 0).toFixed(2));
            $(row).find(`.${key}`).find('.dry').text((data.total.dry || 0).toFixed(2));
          }
        },
        'currency',
        {
          name         : 'remove',
          field        : 'remove',
          cellFormatter: (row, item, key, grid) => {
            const { index, data } = item;
            if (this.sets[element].additional.includes(data.id)) {
              $(row).find(`.${key}`).append($('<button>-</button>').on('click', event => {
                event && event.preventDefault();
                grid.removeItem(index);
                this.options[element].selector.find(`option[value=${data.id}]`).prop('disabled', false);
              }));
            }
          }
        }
      ];
      return new Grid(container, columns, options, {
        id             : 'id',
        rowTemplate    : this.templates.option.clone(),
        headerTemplate : this.templates.option.clone(),
        footerTemplate : $('<div class="list-footer options"><span>ВСЕГО:</span><span class="list-total"><span class="dry"></span><span class="wet"></span></span></div>'),
        includeFooter  : true,
        footerFormatter: (template, grid) => {
          const total = { dry: 0, wet: 0 };
          for (const { data } of grid.data) {
            if (data.total) {
              total.dry += +data.total.dry;
              total.wet += +data.total.wet;
            }
          }

          template.find('.list-total').find('.dry').text(`${isFinite(total.dry) ? total.dry.toFixed(2) : 0}`);
          template.find('.list-total').find('.wet').text(`${isFinite(total.wet) ? total.wet.toFixed(2) : 0}`);
        },
        autoHeight     : true
      });
    }

    build(source, data) {
      Object.assign(source ? this.parameters[source] : this.parameters, data);
      this.calcBase();

      this.elements.areaFloor1.val(this.parameters.floor1.area || 0);
      this.elements.areaWetFloor1.val(this.parameters.floor1.areaWet || 0);
      this.elements.internalRFloor1.val(this.parameters.floor1.internalR || 0);
      this.elements.externalRFloor1.val(this.parameters.floor1.externalR || 0);
      this.elements.wetRFloor1.val(this.parameters.floor1.wetR || 0);

      this.elements.areaFloor2.val(this.parameters.floor2.area || 0);
      this.elements.areaWetFloor2.val(this.parameters.floor2.areaWet || 0);
      this.elements.internalRFloor2.val(this.parameters.floor2.internalR || 0);
      this.elements.externalRFloor2.val(this.parameters.floor2.externalR || 0);
      this.elements.wetRFloor2.val(this.parameters.floor2.wetR || 0);
    }

    calcBase() {
      this.parameters.floor1.area = (this.parameters.floor1.length || 0) * (this.parameters.floor1.width || 0);
      this.parameters.floor1.area += (this.parameters.floor1.area || 0) * 0.01;
      this.parameters.floor1.areaWet = (this.parameters.floor1.area || 0) * 0.1;
      this.parameters.floor1.externalR = (this.parameters.floor1.length || 0) * 2 + (this.parameters.floor1.width || 0) * 2;
      this.parameters.floor1.internalR = (this.parameters.floor1.externalR || 0) * 1.2;
      this.parameters.floor1.wetR = (this.parameters.floor1.externalR || 0) * 0.1 + (this.parameters.floor1.internalR || 0) * 0.15;

      this.parameters.floor2.area = (this.parameters.floor2.length || 0) * (this.parameters.floor2.width || 0);
      this.parameters.floor2.area += (this.parameters.floor2.area || 0) * 0.01;
      this.parameters.floor2.areaWet = (this.parameters.floor2.area || 0) * 0.1;
      this.parameters.floor2.externalR = (this.parameters.floor2.length || 0) * 2 + (this.parameters.floor2.width || 0) * 2;
      this.parameters.floor2.internalR = (this.parameters.floor2.externalR || 0) * 1.2;
      this.parameters.floor2.wetR = (this.parameters.floor2.externalR || 0) * 0.1 + (this.parameters.floor2.internalR || 0) * 0.15;
    }

    buildOptions(element, source) {
      const required = this.sets[element].required.map(id => { return { data: this.references[id] }; });
      const additional = this.sets[element].additional.map(id => { return { data: this.references[id] }; });
      let block = this.templates.options.clone().appendTo(this.elements.optionsBlock);
      block.prop('id', `parameters-${element}`);
      block.find('label').prop('for', `options-${element}-collapse`).text(this.sets[element].label);
      this.options[element] = { block };
      this.buildRequiredGrid(element, source, block, required);
      this.buildAdditionalSelector(element, source, block, additional);
    }

    buildRequiredGrid(element, source, container, data) {
      const checkbox = container
        .find('input[type="checkbox"].collapse')
        .prop('id', `options-${element}-collapse`);
      const grid = this.createGrid(source, container.find('.required').find('div'), data, element);

      grid.mount();

      checkbox.on('change', () => {
        grid.mount();
        checkbox.is(':checked') && grid.render();
      });

      checkbox.is(':checked') && grid.render();
      Object.assign(this.options[element], { grid });
      return grid;
    }

    buildAdditionalSelector(element, source, container, options) {
      const selector = container.find('select').prop('name', `additional-options-${element}`);
      const button = container.find('.add').on('click', event => {
        event && event.preventDefault();
        const item = { data: this.references[selector.val()] };
        this.options[element].grid.addItem(item);
        selector.find(`option[value=${selector.val()}]`).prop('disabled', true);
      });

      for (const { data } of options) {
        selector.append(new Option(data.name, data.id, false, false));
      }

      selector.on('change', () => button.prop('disabled', !selector.val()));
      button.prop('disabled', !selector.val());

      Object.assign(this.options[element], { selector });

      return selector;
    }

    calcOptions(element) {
      if (this.options[element]) {
        return this.options[element].grid.render()
      }

      for (const name in this.options) {
        this.options[name].grid.render();
      }
    }

    async loadReferences() {
      const { data } = await Api.get('/calc/references', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.references;
      }

      this.references = {};
      for (const option of data) {
        for (const [reg, replace] of operations.decoded) {
          option.price_formula = option.price_formula
            ? option.price_formula.replace(reg, replace)
            : option.price_formula;
          option.amount_formula = option.amount_formula
            ? option.amount_formula.replace(reg, replace)
            : option.amount_formula;
        }

        const countFunc = option.amount_formula
          ? `return ${option.amount_formula.replace(/:/g, 'this.')};`
          : 'return 0;';
        const priceFunc = option.price_formula
          ? `return ${option.price_formula.replace(/:/g, 'this.').replace(/\.price/g, '[\'price_\' + type]')};`
          : 'return this[\'price_\' + type];';

        option.calcCount = new Function(countFunc);
        option.calcPrice = new Function('type', priceFunc);

        this.references[option.id] = option;
      }

      return this.references;
    };

    async loadConfigurations() {
      const { data } = await Api.get('/calc/configurations', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.configurations;
      }

      this.configurations = new Map();
      for (const { name, label, elements } of data) {
        this.configurations.set(name, { name, label, elements: elements.map(x => +x) });
      }

      return this.configurations;
    }

    async loadTemplates() {
      const { data } = await Api.get('/calc/templates?name=options,option,fieldset', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.templates;
      }

      this.templates = {};
      for (const name in data) {
        this.templates[name] = $(data[name]);
      }

      return this.templates;
    };

    async loadElements() {
      const { data } = await Api.get('/calc/elements', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.sets;
      }

      for (const { id,  name, label, options } of data) {
        this.sets[id] = {
          name, label,
          required  : options.required ? options.required.map(x => +x) : [],
          additional: options.additional ? options.additional.map(x => +x) : [],
        };
      }

      return this.sets;
    }
  }

  window.onload = () => {
    new App(document.body);
  };
})();

function submit() {
  console.log('submit');
  return false;
}
