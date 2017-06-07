(() => {

  class Api {
    static async call(method, url, query, reject) {
      if (!Api.ALLOWED_METHODS.includes(method)) {
        const error = new Error('Not allowed method');
        return reject instanceof Function ? reject(error) : Request.error(error)
      }

      const call = fetch(new Request(url, { method, body: query }));
      if (reject instanceof Function) {
        call.catch(reject);
      }

      return call.then(resp => resp.json());
    }
    static async get(url, query = {}, reject = null) {
      return Api.call('GET', url, query, reject);
    }

    static async post(url, query = {}, reject = null) {
      return Api.call('POST', url, query, reject);
    }

    static async patch(url, query = {}, reject = null) {
      return Api.call('PATCH', url, query, reject);
    }

    static async delete(url, query = {}, reject = null) {
      return Api.call('DELETE', url, query, reject);
    }

  }

  Api.ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'DELETE'];

  class App {
    constructor(body) {
      this.elements = {};
      this.references = {};
      this.templates = {};
      this.elementsTypes = new Set();
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
        wetR     : content.find('#dimensions-wet-r')
      });

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
        this.references[id].calc(this.references[id], this.parameters)
      }
    }

    async loadReferences() {
      const { data } = await Api.get('/calc/references', {}, () => { return {} });
      if (!data || !Object.keys(data).length) {
        return this.references;
      }

      this.references = {};
      for (const option of data) {
        option.
        this.references[option.id] = option;

        this.elementsTypes.add(option.elements);
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
