import * as d3 from 'd3';
import { setSubcontainers } from './../../../scripts/utils';
import { geoVanDerGrinten } from 'd3-geo-projection';
import './Map.css';

const projections = { geoVanDerGrinten };

export class Map {
  constructor({ main: container },data,settings) {
    this.container = container;
    this.data = data;
    this.init(data,settings);  
  }

  defaultWidth = '600px';
  defaultHeight = '400px';
  isStyleResizable = true;
  projection = undefined;

  init(data,settings) {
    this.applySettings(data,settings);
    const { container: c, isStyleResizable, dimensions } = this;
    setSubcontainers(d3.select(c),isStyleResizable,dimensions);
  }

  applySettings(data,settings) {
    const container = d3.select(this.container);
    const { projection, resizeBy, useParent, dimensions } = settings;
    const useP = typeof useParent !== 'boolean' ? true : useParent;
    this.dimensions = {
      width: dimensions.width || (useP ? parseInt(container.style('width')) : this.defaultWidth),
      height: dimensions.height || (useP ? parseInt(container.style('height')) : this.defaultHeight)
    };
    this.projection = this.setProjection(projection);
    this.pathGenerator = d3.geoPath()
      .projection(this.projection.fitSize([this.dimensions.width,this.dimensions.height],data));
    
    this.setResizeMethod(resizeBy);
  }

  setProjection(name) {
    const fn = d3[name] || projections[name];
    const prj = fn ? fn() : null;
    return prj || d3.geoMercator();
  }

  draw() {
    d3.select(this.container)
      .select('svg.graphics-svg')
      .append('g')
        .attr('class','g-main');
    
    this.addElements(this.data);
  }

  setResizeMethod(resizeBy) {
    if(!resizeBy || resizeBy === 'style' || resizeBy !== 'method') {
      this.isStyleResizable = true;
    } else {
      this.isStyleResizable = false;
    }
  }

  addElements(data,className = 'polygon') {
    const g = d3.select(this.container).select('g.g-main');
    const update = g.selectAll(`path.${className}`)
      .data(data.features,(d,i) => d.id || d.fid || i)
      .attr('class',className)
      .attr('d',this.pathGenerator); 

    update.enter()
      .append('path')
        .attr('class',className)
        .attr('d',this.pathGenerator); 

    update.exit()
      .remove();
  }
};