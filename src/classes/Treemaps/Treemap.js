import * as d3 from 'd3';
import { transitionFactory, getDimensions } from '../../scripts/utils';
import './Treemap.css';

export class Treemap {
  constructor({ main: container },data,settings) {
    this.container = container;
    this.data = data;
    this.init(settings);
  }

  defaultWidth = '600px';
  defaultHeight = '400px';
  layout = null;
  categoricalScale = d3.scaleOrdinal().unknown('gray');

  init(settings) {
    const { rollupFn, symbolKey } = settings;
    this.rollupFn = rollupFn;
    this.applySettings(settings);
    this.createScale(symbolKey);
    this.createLayout();
  }

  createScale(symbolKey) {
    const { data, nestingOrder: nOrder } = this;
    symbolKey = symbolKey || nOrder[nOrder.length - 1]; // symbolize by leaves' keys
    const set = d3.set(data,d => d[symbolKey]);
    this.categoricalScale
      .domain(set.values())
      .range(d3.schemeCategory10);
  }

  applySettings(settings) {
    const container = d3.select(this.container);
    const { useParent, dimensions, nestingOrder } = settings;
    const useP = typeof useParent !== 'boolean' ? true : useParent;
    this.dimensions = {
      width: dimensions.width || (useP ? parseInt(container.style('width')) : this.defaultWidth),
      height: dimensions.height || (useP ? parseInt(container.style('height')) : this.defaultHeight)
    };
    this.nestingOrder = nestingOrder || [];
  }

  nestData() {
    return this.nestingOrder
      .reduce((nest,e) => nest.key(d => d[e]),d3.nest())
      .rollup(this.rollupFn)
      .entries(this.data);
  }
  
  createLayout() {
    const { width, height } = this.dimensions;
    const nest = this.nestData();
    const rootNode = { root: 'root', values: nest };
    const hierarchy = d3.hierarchy(rootNode, d => d.values)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
    const layout = d3.treemap()
      .size([width,height])
      .paddingInner(1)
      .paddingOuter(2)
      .round(true)(hierarchy);
    this.layout = layout; // width and height must be defined
  }

  draw() {
    const { container, layout, renderNewLeaves } = this;
    const tContainer = d3.select(container).append('div')
      .attr('class','treemap-wrapper')
    .append('div')
      .attr('class','treemap-container');
    
    tContainer.selectAll('.leaf')
      .data(layout.leaves(), d => d.data.key)
      .enter()
      .call(renderNewLeaves)
  }

  renderNewLeaves = (selection) => {
    const self = this;
    const t = transitionFactory('newLeaf', 750);
    const leaves = selection.append('div')
      .attr('class', 'leaf')
      .style('background-color',d => this.categoricalScale(d.data.key));
    leaves.transition(t)
      .call(this.relocateLeaves)
      .call(this.resizeLeaves)
      .call(this.createLabel)
      .on('end',function() { // resize label on transition end
        self.resizeLabel.call(this);
      });
    leaves.attr('title',this.setLeafTitle);
    //newLeafTransition // interrupt i
    //  .on('start', this.interruptIfDataIsNull(leaves, 'newLeaf'));
  }

  relocateLeaves = (selection) => {
    selection
      .style('left', d => d.x0 + 'px')
      .style('top', d => d.y0 + 'px');
  }

  resizeLeaves = (selection) => {
    selection
      .style('width', d => d.x1 - d.x0 + 'px')
      .style('height', d => d.y1 - d.y0 + 'px');
  }

  setLeafTitle = ({ data,value}) => {
    return `${value}, (${(value / this.layout.value * 100).toFixed(1)}%) - ${data.key}`;
  }

  createLabel = (transition) => {
    //console.log('transition :', transition instanceof d3.transition);
    transition.selection().append('div')
      .attr('class', 'leaf-label')
      .call(this.setLabelContent);
  }

  setLabelContent = (selection) => {
    selection.append('h1')
      .attr('class','leaf-total')
      .text(d => d.value.toLocaleString());
    selection.append('span')
      .attr('class','leaf-pct')
      .text(d => `${(d.value / this.layout.value * 100).toFixed(1)}%`);
    selection.append('span')
      .attr('class','leaf-name')
      .text(d => d.data.key);
    //try {
    //} catch (err) {
    //  if (this.data === null) {
    //    this.clear();
    //  }
    //}
  }

  resizeLabel() { // meant to be called with a different 'this' value
    const label = d3.select(this).select('.leaf-label');
    const { width: lWidth, height: lHeight } = getDimensions(this);
    const { width, height } = getDimensions(label.node());
    if(lWidth >= width && lHeight >= height) {
      return;
    }
    const hFactor = lWidth / width;
    const vFactor = lHeight / height;
    const factor = hFactor * vFactor;
    if(hFactor < 1 && vFactor >= 1) {
      label.style('font-size',`${hFactor * 16}px`);
    } else if(vFactor < 1 && hFactor >= 1) {
      label.style('font-size',`${vFactor * 16}px`);
    } else if(factor >= 1){
      return;
    } else {
      label.style('font-size',`${factor * 16}px`)
    }
  }

}