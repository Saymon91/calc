(() => {
  class App {
    constructor(body) {
      this.elements = {};
      this.references = {};
      this.sets = {};
      this.templates = {};

      this.elementsTypes = new Map();
      this.elements.body = $(body);

      this.parameters = {
        floors: 1,
        floor1: {},
        floor2: {},
        lastFloor: 'floor1'
      };

      this.options = {};

      this.init();
    }

    async init() {
      await Promise.all([
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
        for (const name in this.options) {
          this.options[name].grid.destruct();
          this.options[name].block.remove();
          delete this.options[name];
        }

        this.build(null, { floors: +this.elements.floors.filter(':checked').val() });
        this.parameters.lastFloor = `floor${Math.floor(this.parameters.floors)}`;

        const floor2Dimensions = this.elements.content.find('#dimensions-floor2');
        this.parameters.floors < 2 ? floor2Dimensions.hide() : floor2Dimensions.show();


        for (let index = 1; index <= Math.floor(this.elements.floors.filter(':checked').val()); index++) {
          this.buildOptions(`floor${index}`, `floor${index}`);
        }

        this.buildOptions('attic', this.parameters.lastFloor);
        this.buildOptions('roof', this.parameters.lastFloor);
      });

      for (const name in this.options) {
        this.options[name].grid.destruct();
        this.options[name].block.remove();
        delete this.options[name];
      }

      for (let index = 1; index <= Math.floor(this.elements.floors.filter(':checked').val()); index++) {
        this.buildOptions(`floor${index}`, `floor${index}`);
        this.calcOptions(`floor${index}`);
      }

      this.buildOptions(`attic`, this.parameters.lastFloor);
      this.calcOptions(`attic`);
      this.buildOptions(`roof`, this.parameters.lastFloor);
      this.calcOptions(`roof`);
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
        rowTemplate   : this.templates.option.clone(),
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

    buildOptions(element, source) {
      const data = this.sets[element].required.map(id => { return { data: this.references[id] }; });
      let block = this.templates.options.clone().appendTo(this.elements.optionsBlock);
      block.prop('id', `parameters-${element}`);
      const grid = this.createGrid(source, block.find('.required').find('div'), data);
      let checkbox = block
        .find('input[type="checkbox"].collapse')
        .prop('id', `options-${element}-collapse`);
      block.find('label').prop('for', `options-${element}-collapse`).text(this.sets[element].label);
      checkbox.on('change', () => {
        grid.mount();
        grid.render();
      });
      grid.mount();
      grid.render();

      this.options[element] = { block, grid };
    }

    calcOptions(element) {
      if (this.options[element]) {
        this.options[element].grid.render();
      } else {
        for (const name in this.options) {
          this.options[name].grid.render();
        }
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
        /*
        console.log(option);
        console.log(countFunc);
        console.log(priceFunc);
        */
        option.calcCount = new Function(countFunc);
        option.calcPrice = new Function('type', priceFunc);
        this.references[option.id] = option;
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

    async loadElements() {
      const { data } = await Api.get('/calc/elements', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.sets;
      }

      for (const { name, label, options } of data) {
        this.sets[name] = {
          label,
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
