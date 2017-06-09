(() => {
  class App {
    constructor(body) {
      this.elements = {};
      this.references = {};
      this.templates = {};
      this.elementsTypes = new Map();
      this.elements.body = $(body);

      this.parameters = {};

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

        length: content.find('#dimensions-length'),
        width: content.find('#dimensions-width'),
        height: content.find('#dimensions-height'),

        area: content.find('#dimensions-area'),
        areaWet: content.find('#dimensions-area-wet'),

        internalR: content.find('#dimensions-internal-r'),
        externalR: content.find('#dimensions-external-r'),
        wetR     : content.find('#dimensions-wet-r'),

        optionsBlock: content.find('#parameters').find('.block'),
      });

      const elements = this.elementsTypes.keys();
      for (const element of elements) {
        if (element === 'floors') {
          const floors = Math.floor(this.elements.floors.val());
          for (let index = 0; index < floors; ++index) {
            const block = this.templates.options.clone().appendTo(this.elements.optionsBlock);
            this.elements[`options-${element}`] = block;
            const checkbox = block
              .find('input[type="checkbox"].collapse')
              .prop('id', `options-${element}-collapse`);
            block.find('label').prop('for', `options-${element}-collapse`).text(element);

            const elementItems = this.elementsTypes.get(element).values();
            const data = [];
            for (const option of elementItems) {
              data.push({ data: option });
            }

            const grid = this.createGrid(block.find('.required').find('div'), data);
            checkbox.on('change', () => {
              console.log('change');
              grid.mount();
              grid.render();
            });

          }
          continue;
        }

        const block = this.templates.options.clone().appendTo(this.elements.optionsBlock);
        this.elements[`options-${element}`] = block;
        block.find('input[type="checkbox"].collapse').prop('id', `options-${element}-collapse`);
        block.find('label').prop('for', `options-${element}-collapse`).text(element);
        const elementItems = this.elementsTypes.get(element).values();
        const data = [];
        for (const option of elementItems) {
          data.push({ data: option });
        }
        this.createGrid(block.find('.required').find('div'), data);
      }

      this.elements.length.bind('change', () => {
        this.build({ length: this.elements.length.val() });
      });
      this.elements.width.bind('change', () => {
        this.build({ width: this.elements.width.val() });
      });
      this.elements.height.bind('change', () => {
        this.build({ height: this.elements.height.val() });
      });
      this.elements.floors.bind('change', () => {
        this.build({ floors: this.elements.floors.filter(':checked').val() });
      });
    }

    createGrid(container, data) {
      const columns = [
        'name',
        'count',
        'unit',
        {
          name : 'price',
          field: 'price',
          cellFormatter: (row, item, key) => {
            const { dry, wet } = item[key];
            $(row).find(`.${key}`).find('.wet').text((wet || 0).toFixed(2));
            $(row).find(`.${key}`).find('.dry').text((dry || 0).toFixed(2));
          }
        },
        {
          name: 'total',
          field: 'total',
          cellFormatter: (row, item, key) => {
            const { dry, wet } = item[key];
            $(row).find(`.${key}`).find('.wet').text((wet || 0).toFixed(2));
            $(row).find(`.${key}`).find('.dry').text((dry || 0).toFixed(2));
          }
        }, 'currency'
      ];
      return new Grid(container, columns, data, {
        id: 'id',
        templateRow: this.templates.option,
        templateHeader: this.templates.option,
      });
    }

    build(data) {
      Object.assign(this.parameters, data);
      this.calcBase();

      this.elements.area.val(this.parameters.area || 0);
      this.elements.areaWet.val(this.parameters.areaWet || 0);
      this.elements.internalR.val(this.parameters.internalR || 0);
      this.elements.externalR.val(this.parameters.externalR || 0);
      this.elements.wetR.val(this.parameters.wetR || 0);

      this.calcOptions()
    }

    calcBase() {
      this.parameters.area = (this.parameters.length || 0) * (this.parameters.width || 0);
      this.parameters.area += (this.parameters.area || 0) * 0.01;
      this.parameters.areaWet = (this.parameters.area || 0) * 0.1;
      this.parameters.externalR = (this.parameters.length || 0) * 2 + (this.parameters.width || 0) * 2;
      this.parameters.internalR = (this.parameters.externalR || 0) * 1.2;
      this.parameters.wetR = (this.parameters.externalR || 0) * 0.1 + (this.parameters.internalR || 0) * 0.15;
    }

    calcOptions() {
      for (const id in this.references) {
        const { elements, calcCount, calcPrice } = this.references[id];
        const options = this.elements.optionsBlock.find(`.${elements}-${id}`);
        const context = Object.assign({}, this.parameters, this.references[id]);
        options.find('.count').text((context.count = (calcCount.call(context) || 0).toFixed(2)));
        const total = options.find('.total');
        total.find('.dry').text(calcPrice.call(context, 'dry').toFixed(2));
        console.log(calcPrice.toString(),context);
        total.find('.wet').text(calcPrice.call(context, 'wet').toFixed(2));
        console.log(calcPrice.toString(),context);
      }
    }

    async loadReferences() {
      const { data } = await Api.get('/calc/references', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.references;
      }

      this.references = {};
      for (const option of data) {
        option.calcCount = new Function('type', option.amount_formula ? `return ${option.amount_formula.replace(/:/g, 'this.')}` : `return 0`);
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
