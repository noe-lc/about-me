import * as d3 from 'd3';
import { transitionFactory, getDimensions, treemapLayout } from '../../scripts/utils';
import './Treemap.css';

export class Treemap {
  constructor({ main: container },data,settings,additionalData,setState) {
    this.container = container;
    this.data = data;
    this.setState = setState || (() => { }) // 
    this.init(settings);
  }

  defaultWidth = '600px';
  defaultHeight = '400px';
  dimensions = {};
  hierarchy = null;
  layout = null;
  categoricalScale = d3.scaleOrdinal().unknown('gray');

  init(settings) {
    const { rollupFn } = settings;
    this.rollupFn = rollupFn;
    this.applySettings(settings);
    this.setSubcontainers();
  }

  createScale(hierarchy) {
    const set = d3.set(hierarchy.leaves(),d => d.data.key);
    return this.categoricalScale
      .domain(set.values())
      .range(d3.schemeCategory10);
  }

  nestData(data) {
    return this.nestingOrder
      .reduce((nest,e) => nest.key(d => d[e]),d3.nest())
      .rollup(this.rollupFn)
      .entries(data);
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

  createHierarchyAndLayout(data) {
    const { width, height } = this.dimensions;
    const nest = this.nestData(data);
    const rootNode = { root: 'root', values: nest };
    const hierarchy = d3.hierarchy(rootNode,d => d.values)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
    const layout = treemapLayout(width,height)(hierarchy);
    return { hierarchy, layout };
  }

  setSubcontainers() {
    d3.select(this.container).append('div')
      .attr('class','treemap-wrapper')
    .append('div')
      .attr('class','treemap-container');
  }

  draw() {
    this.update();
  }

  resize(container = this.container) {
    const { width, height } = getDimensions(container);
    const layout =  treemapLayout(width,height)(this.hierarchy);
    d3.select(this.container)
      .selectAll('.leaf').data(layout.leaves())
      .call(this.updateLeaves);
    this.dimensions = { width, height };
    return layout;
  }

  update(data,nestingOrder) {
    this.data = data || this.data;
    this.nestingOrder = nestingOrder || this.nestingOrder;
    const { hierarchy, layout } = this.createHierarchyAndLayout(this.data);
    this.hierarchy = hierarchy;
    this.layout = layout;
    this.categoricalScale = this.createScale(hierarchy);
    
    const update = d3.select(this.container).select('.treemap-container')
      .selectAll('.leaf').data(layout.leaves())
      .call(this.updateLeaves);
    update.enter()
      .call(this.renderNewLeaves);
    update.exit()
      .remove();

    this.setState(this.categoricalScale.domain().map(e => [e,this.categoricalScale(e)]));
  }

  renderNewLeaves = (selection) => {
    const self = this;
    const t = transitionFactory('newLeaf', 1000);
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

  updateLeaves = (selection) => {
    const self = this;
    const resizeT = transitionFactory('updateLeaf', 500);
    const relocateT = transitionFactory('relocate',500);
    selection
      .attr('title', this.setLeafTitle)
      .style('background-color',d => this.categoricalScale(d.data.key))
    .transition(resizeT)
      .call(this.resizeLeaves)
    .transition(relocateT)
      .call(this.relocateLeaves)
      .call(this.updateLabel)
      .on('end',function() {
        self.resizeLabel.call(this);
      });
  }

  relocateLeaves = (sel) => {
    sel.style('left', d => d.x0 + 'px')
      .style('top', d => d.y0 + 'px');
  }

  resizeLeaves = (sel) => {
    sel.style('width', d => d.x1 - d.x0 + 'px')
      .style('height', d => d.y1 - d.y0 + 'px');
  }

  setLeafTitle = ({ data, value }) => {
    return `${value}, (${(value / this.layout.value * 100).toFixed(1)}%) - ${data.key}`;
  }

  createLabel = (transition) => {
    transition.selection().append('div')
      .attr('class', 'leaf-label')
      .call(this.setLabelContent);
  }

  setLabelContent = (sel) => {
    sel.append('h1')
      .attr('class','leaf-total')
      .text(d => d.value.toLocaleString());
    sel.append('span')
      .attr('class','leaf-pct')
      .text(d => `${(d.value / this.layout.value * 100).toFixed(1)}%`);
    sel.append('span')
      .attr('class','leaf-name')
      .text(d => d.data.key);
  }

  updateLabel = (sel) => {
    sel.select('.leaf-total')
      .text(d => d.value.toLocaleString());
    sel.select('.leaf-pct')
      .text(d => `${(d.value / this.layout.value * 100).toFixed(1)}%`);
    sel.select('.leaf-name')
      .text(d => d.data.key);
  }

  resizeLabel() { // meant to be called with a different 'this' value
    let fontSize = 16;
    const label = d3.select(this).select('.leaf-label'),
      { width: lWidth, height: lHeight } = getDimensions(this),
      { width, height } = getDimensions(label.node()),
      hFactor = lWidth / width,
      vFactor = lHeight / height,
      factor = hFactor * vFactor;

    if(hFactor < 1 && vFactor >= 1) {
      fontSize = fontSize * hFactor;
    } else if(hFactor >= 1 && vFactor < 1) {
      fontSize = fontSize * vFactor;
    } else if(factor >= 1) {
      fontSize = fontSize * factor;
      fontSize = fontSize > 16 ? 16 : fontSize;
    } 

    if(fontSize <= 16) label.style('font-size',fontSize + 'px');

  }

}