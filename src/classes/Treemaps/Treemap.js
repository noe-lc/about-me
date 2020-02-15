import * as d3 from 'd3';
import './Treemap.css';

export class Treemap {
  constructor({ main: container },data,settings) {
    this.container = container;
    this.data = data;
    this.applySettings(data,settings);
    this.createLayout(data,settings);
    console.log('data :', data);
  }

  defaultWidth = '600px';
  defaultHeight = '400px';
  treemapLayout = null;

  applySettings(data,settings) {
    const container = d3.select(this.container);
    const { useParent, dimensions, nestingOrder } = settings;
    this.dimensions = {
      width: dimensions.width || (useParent ? parseInt(container.style('width')) : this.defaultWidth),
      height: dimensions.height || (useParent ? parseInt(container.style('height')) : this.defaultHeight)
    };

    this.nestingOrder = nestingOrder || [];
  }
  
  createLayout(data,settings) {
    const { width, height } = this.dimensions;
    const nest = this.nestingOrder
      .reduce((nest,e) => nest.key(d => d[e]),d3.nest())
      .rollup(settings.rollupFn)
      .entries(data);
    console.log('nest :', nest);
    const rootNode = { root: this.data.name, values: nest };
    const hierarchy = d3.hierarchy(rootNode, d => d.values)
      .sum(d => (d.value ? d.value.value : 0))
      .sort((a, b) => b.value - a.value);
    const treemapLayout = d3.treemap()
      .size([width,height])
      .paddingInner(this.paddingInner)
      .paddingOuter(this.paddingOuter)
      .round(this.round)(hierarchy);
    console.log('treemapLayout :', treemapLayout);
    this.treemapLayout = treemapLayout; // width and height must be defined
  }

  draw() {
    d3.select(this.container).append('div')
      .attr('class','treemap-wrapper')
    .append('div')
      .attr('class','treemap-container');
  }

}