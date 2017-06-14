/**
 * Max fixed data count = 1677680 items;
 * @type {{headerHeight: string, filterHeight: string, rowHeight: string, footerHeight: string, filters: boolean, footer: boolean, header: boolean, rowFormatter: null, cellFormatter: null, headerFormatter: null, filterFormatter: null, footerFormatter: null, rowTemplate: (*), headerTemplate: (*), filterTemplate: (*), footerTemplate: (*)}}
 */


const DEFAULT_OPTIONS = {
  // style options
  headerHeight: 25,
  filterHeight: 25,
  rowHeight   : 25,
  footerHeight: 20,

  // include options
  includeFilters: false,
  includeFooter : false,
  includeHeader : true,

  // formatters
  rowFormatter   : null,
  cellFormatter  : null,
  headerFormatter: null,
  filterFormatter: null,
  footerFormatter: null,
  editorFormatter: null,

  // renders
  rowRender    : null,
  headerRender : null,
  filtersRender: null,
  footerRender : null,
  editorRender: null,

  // templates
  rowTemplate   : $('<div></div>'),
  cellTemplate  : $('<div></div>'),
  headerTemplate: $('<div></div>'),
  filterTemplate: $('<div></div>'),
  footerTemplate: $('<div></div>'),
  editorTemplate: $('<div></div>'),

  // render
  renderTimeout: 20,

  // id field
  id: 'id'
};

const DEFAULT_GRID_STYLE = {
  width   : '100%',
  height  : '400px',
  display : 'grid',
  padding : 0,
  margin  : 0,
};

const DEFAULT_HEADER_STYLE = {};
const DEFAULT_FILTER_STYLE = {};
const DEFAULT_LIST_STYLE = {
  display : 'grid',
  height  : '100%',
  width   : '100%',
  position: 'relative',
  overflow: 'scroll'
};

class Grid {
  constructor(container, columns, data = [], options = {}) {
    Object.assign(this, { data, columns, options: Object.assign({}, DEFAULT_OPTIONS, options) });
    this.elements = {
      container: $(container)
    };

    this.selected = new Set();
    this.filtered = new Set();

    this.renderAwait = null;

    this.displayItems = [];
    this.filtered = [];
    this.selected = [];

    this.mount();
    this.render();
  }

  mount() {
    this.mountContainer();
    this.options.includeHeader &&this.mountHeader();
    this.options.includeFilters && this.mountFilter();
    this.mountList();
    this.options.includeFooter && this.mountFooter();
  }

  mountContainer() {
    if (this.elements.grid) {
      this.elements.grid.empty().remove();
    }
    this.elements.grid = $('<div></div>')
      .addClass('grid')
      .css(Object.assign({}, DEFAULT_GRID_STYLE, this.options.gridStyle || {}))
      .appendTo(this.elements.container);

    let height = this.elements.grid.height();
    let gridTemplate = '';

    if (this.options.includeHeader) {
      height -= this.options.headerHeight;
      gridTemplate += `${this.options.headerHeight}px `;
    }

    if (this.options.includeFilters) {
      height -= this.options.filterHeight;
      gridTemplate += `${this.options.filterHeight}px `;
    }
    if (this.options.includeFooter) {
      height -= this.options.footerHeight;
    }

    gridTemplate += `${height}px `;

    if (this.options.includeFooter) {
      gridTemplate += ` ${this.options.footerHeight}px`;
    }

    this.elements.grid.css('grid-template-rows', gridTemplate.trim());
  }

  mountHeader() {
    if (this.options.renderHeader instanceof Function) {
      this.elements.header = $(this.options.renderHeader(this.columns)).appendTo(this.elements.grid);
      return;
    }

    if (this.options.headerTemplate) {
      this.elements.header = $(this.options.headerTemplate).appendTo(this.elements.grid);
    } else {
      this.elements.header = $('<div></div>').appendTo(this.elements.grid);
    }

    if (!this.options.headerTemplate) {
      this.elements.header
        .css({}, DEFAULT_HEADER_STYLE, this.options.headerStyle || {})
        .height(this.options.headerHeight)
        .addClass('grid-header')
    }

    this.elements.header
      .appendTo(this.elements.grid);

    for (const column of this.columns) {
      const field = typeof column === 'string' ? column : (column.field || column.id || column.name);
      const name = typeof column === 'string' ? column : column.name;
      let cell = this.elements.header.find(`.${field}`);
      if (!cell.length) {
        cell = $(`<span class="${field}"><span>`);
      }
      cell.text(name).appendTo(this.elements.header);
    }
  }

  mountFilter() {
    this.elements.filter = $('<div></div>')
      .addClass('grid-filter')
      .css(Object.assign({}, DEFAULT_FILTER_STYLE, this.options.filterStyle || {}))
      .appendTo(this.elements.grid);
  }

  mountList() {
    this.elements.list = $('<div></div>')
      .addClass('grid-list')
      .css(Object.assign({}, DEFAULT_LIST_STYLE, this.options.listStyle || {}))
      .appendTo(this.elements.grid);
    this.elements.listBackground = $('<div></div>')
      .addClass('grid-list-background')
      .css({
        width   : '100%',
        position: 'relative'
      })
      .appendTo(this.elements.list);
    const elementsBlockHeight = this.elements.list.height();
    this.elementsCount = elementsBlockHeight / this.options.rowHeight;
    this.elements.elements = $('<div></div>')
      .addClass('grid-list-elements')
      .css({
        width               : '100%',
        height              : `${elementsBlockHeight}.px,`,
        position            : 'absolute',
        top                 : 0,
        display             : 'grid',
        'grid-template-rows': `repeat(${this.elementsCount}, ${this.options.rowHeight}px)`
      })
      .appendTo(this.elements.listBackground);

    this.elements.list.on('scroll', () => {
      this.renderAwait && clearTimeout(this.renderAwait);
      this.renderAwait = setTimeout(() => {
        let { top } = this.elements.listBackground.offset();
        if (top < this.maxPosition) {
          top = this.maxPosition;
        }
        this.position = Math.abs(this.startListPosition - top);
        this.elements.elements.css('top', this.position);
        this.render();
      }, this.options.renderTimeout);
    });

    this.calcList();
  }

  calcList() {
    const listBackgroundHeight = this.data.length * this.options.rowHeight;
    this.elements.listBackground.height(listBackgroundHeight);
    this.startListPosition = this.elements.listBackground.offset().top;
    this.position = Math.abs(this.startListPosition - this.elements.listBackground.offset().top);
    this.maxPosition = this.startListPosition - listBackgroundHeight + this.elements.elements.height();
  }

  mountFooter() {
    const template = this.options.footerTemplate;
    this.elements.footer = this.options.grid.append(template);
    this.elements.footer
      .addClass('grid-footer')
      .height(this.options.footerHeight);
  }

  render() {
    this.elements.elements.empty();
    const start = Math.floor(this.position / this.options.rowHeight);
    let finish = start + this.elementsCount;
    if (finish > this.data.length) {
      finish = this.data.length;
    }

    for (let index = 0, length = this.displayItems.length; index < length; index++) {
      this.displayItems[index].template.remove();
    }

    for (let index = start; index < finish; index++) {
      const item = this.renderItem(index);
      item.template.appendTo(this.elements.elements);
      this.displayItems.push(item);
    }

    this.options.includeFooter && this.renderFooter();
  }

  renderItem(id) {
    const item = this.data[id];
    if (item.render instanceof Function) {
      item.template = item.render(item.data);
      return item
    }

    if (this.options.rowRender instanceof Function) {
      item.template = this.options.rowRender(item.data);
      return item;
    }

    const template = $(this.options.rowTemplate).clone();

    for (const column of this.columns) {
      if (typeof column === 'string') {
        template.find(`.${column}`).text(item.data[column]);
        continue;
      }

      const { id, name, field, cellFormatter } = column;
      const columnName = field || id || name;
      if (cellFormatter instanceof Function) {
        cellFormatter(template, item.data, columnName);
      } else {
        template.find(`.${columnName}`).text(item.data[columnName]);
      }
    }

    item.template = template;
    return item;
  }

  renderFooter() {
    if (this.options.footerFormatter instanceof Function) {
      this.options.footerFormatter(this.elements.footer, this);
    }
  }

  destruct() {
    this.data = [];
    this.displayItems = [];
    this.selected = [];
    this.filtered = [];
    this.elements = {};
    this.options = Object.assign({}, DEFAULT_OPTIONS);
    this.elements.grid.empty().remove();
  }

  removeItem(id) {

  }

  addItem(item) {
    this.data.push(item);
    this.calcList();
    this.elements.list.scrollTop(this.startListPosition - this.maxPosition);
  }
}