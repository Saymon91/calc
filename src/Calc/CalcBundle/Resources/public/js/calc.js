(() => {
  class App {
    constructor(body) {
      this.elements = {};
      this.references = {};
      this.templates = {};
      this.elementsTypes = new Map();
      this.elements.body = $(body);

      this.parameters = {
        floors: 1,
        floor1: {},
        floor2: {}
      };

      this.options = {};

      this.init();
    }

    async init() {
      await Promise.all([
        this.loadReferences(),
        this.loadTemplates()
      ]);
      this.mount();
      console.log(this);
    }

    mount() {
      const { body } = this.elements;
      const content = body.find('article.content');
      Object.assign(this.elements, {
        content,

        floors: content.find('input[name="floors"]'),

        lengthFloor1: content.find('#dimensions-floor1-length'),
        widthFloor1 : content.find('#dimensions-floor1-width'),
        heightFloor1: content.find('#dimensions-floor1-height'),

        areaFloor1   : content.find('#dimensions-floor1-area'),
        areaWetFloor1: content.find('#dimensions-floor1-area-wet'),

        internalRFloor1: content.find('#dimensions-floor1-internal-r'),
        externalRFloor1: content.find('#dimensions-floor1-external-r'),
        wetRFloor1     : content.find('#dimensions-floor1-wet-r'),

        lengthFloor2: content.find('#dimensions-floor2-length'),
        widthFloor2 : content.find('#dimensions-floor2-width'),
        heightFloor2: content.find('#dimensions-floor2-height'),

        areaFloor2   : content.find('#dimensions-floor2-area'),
        areaWetFloor2: content.find('#dimensions-floor2-area-wet'),

        internalRFloor2: content.find('#dimensions-floor2-internal-r'),
        externalRFloor2: content.find('#dimensions-floor2-external-r'),
        wetRFloor2     : content.find('#dimensions-floor2-wet-r'),

        optionsBlock: content.find('#parameters').find('.block'),
      });

      this.elements.lengthFloor1.bind('change', () => {
        this.build('floor1', { length: +this.elements.lengthFloor1.val() });
        this.calcOptions('floors', 'floor1');
      });
      this.elements.lengthFloor2.bind('change', () => {
        this.build('floor2', { length: +this.elements.lengthFloor2.val() });
        this.calcOptions('floors', 'floor2');
      });
      this.elements.widthFloor1.bind('change', () => {
        this.build('floor1', { width: +this.elements.widthFloor1.val() });
        this.calcOptions('floors', 'floor1');
      });
      this.elements.widthFloor2.bind('change', () => {
        this.build('floor2', { width: +this.elements.widthFloor2.val() });
        this.calcOptions('floors', 'floor2');
      });
      this.elements.heightFloor1.bind('change', () => {
        this.build('floor1', { height: +this.elements.heightFloor1.val() });
        this.calcOptions('floors', 'floor1');
      });
      this.elements.heightFloor2.bind('change', () => {
        this.build('floor2', { height: +this.elements.heightFloor2.val() });
        this.calcOptions('floors', 'floor2');
      });

      this.elements.floors.bind('change', () => {
        this.build(null, { floors: +this.elements.floors.filter(':checked').val() });
        for (const name in this.options) {
          const [type, element] = name.split(':');
          if (type === 'floors') {
            this.options[name].destruct();
            delete this.options[name];
            this.elements.optionsBlock.find(`#parameters-${element}`).empty().remove();
          }
        }

        const floor2Dimensions = this.elements.content.find('#dimensions-floor2');
        this.parameters.floors < 2 ? floor2Dimensions.hide() : floor2Dimensions.show();

        for (let index = 1; index <= Math.floor(this.elements.floors.filter(':checked').val()); index++) {
          this.buildOptions('floors', `floor${index}`);
        }
      });

      for (let index = 1; index <= Math.floor(this.elements.floors.filter(':checked').val()); index++) {
        this.buildOptions('floors', `floor${index}`);
        this.calcOptions('floors', `floor${index}`);
      }
    }

    createGrid(sourceFloor, container, data) {
      const source = this.parameters[sourceFloor];
      const columns = [
        'name',
        {
          name : 'count',
          field: 'count',
          cellFormatter: (row, item, key) => {
            const { calcCount } = item;
            $(row).find(`.${key}`).text((calcCount.call(Object.assign({}, item, source)) || 0).toFixed(2));
          }
        },
        'unit',
        {
          name : 'price',
          field: 'price',
          cellFormatter: (row, item, key) => {
            $(row).find(`.${key}`).find('.wet').text((item.price_wet || 0).toFixed(2));
            $(row).find(`.${key}`).find('.dry').text((item.price_dry || 0).toFixed(2));
          }
        },
        {
          name: 'total',
          field: 'total',
          cellFormatter: (row, item, key) => {
            const { calcCount, calcPrice } = item;
            const context = Object.assign({}, item, source);
            context.count = calcCount.call(context);
            item.total = {
              wet: calcPrice.call(context, 'wet'),
              dry: calcPrice.call(context, 'dry')
            };

            $(row).find(`.${key}`).find('.wet').text((item.total.wet || 0).toFixed(2));
            $(row).find(`.${key}`).find('.dry').text((item.total.dry || 0).toFixed(2));
          }
        }, 'currency'
      ];
      return new Grid(container, columns, data, {
        id: 'id',
        rowTemplate: this.templates.option.clone(),
        headerTemplate: this.templates.option.clone(),
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

    buildOptions(type, source) {
      const floors = this.elementsTypes.get(type);
      let block = this.templates.options.clone().appendTo(this.elements.optionsBlock);
      block.prop('id', `parameters-${source}`);
      const grid = this.createGrid(source, block.find('.required').find('div'), [...floors].map(data => { return { data };}));
      let checkbox = block
        .find('input[type="checkbox"].collapse')
        .prop('id', `options-${source}-collapse`);
      block.find('label').prop('for', `options-${source}-collapse`).text(type);
      checkbox.on('change', () => {
        grid.mount();
        grid.render();
      });
      grid.mount();
      grid.render();

      this.options[`${type}:${source}`] = grid;
    }

    calcOptions(name, element) {
      const key = `${name}:${element}`;
      this.options[key] && this.options[key].render();
    }

    async loadReferences() {
      const { data } = await Api.get('/calc/references', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.references;
      }

      this.references = {};
      for (const option of data) {
        option.calcCount = new Function(option.amount_formula ? `return ${option.amount_formula.replace(/:/g, 'this.')}` : `return 0`);
        option.calcPrice = new Function('type', option.price_formula ? `return ${option.price_formula.replace(/:/g, 'this.').replace(/\.price/g, '["price_" + type]')}` : `return this['price_' + type]`);
        this.references[option.id] = option;
        if (!this.elementsTypes.has(option.elements)) {
          this.elementsTypes.set(option.elements, new Set());
        }
        this.elementsTypes.get(option.elements).add(option);
      }

      return this.references;
    };

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
  }

  window.onload = () => {
    new App(document.body);
  };
})();

function submit() {
  console.log('submit');
  return false;
}
