import * as d3 from 'd3';
import { setSubcontainers } from './../../../scripts/utils';
import './Map.css';

export default class Map {
  constructor({ main: container },data,settings) {
    this.container = container;
    this.data = data;
    this.applySettings(settings,data);

    const { container: c, isStyleResizable, dimensions } = this;
    setSubcontainers(d3.select(c),isStyleResizable,dimensions);
  }

  defaultWidth = '600px';
  defaultHeight = '400px';
  isStyleResizable = true;

  applySettings(settings,data) {
    const container = d3.select(this.container);
    const { projection, useParent, resizeBy, dimensions } = settings;
    this.dimensions = {
      width: dimensions.width || (useParent ? parseInt(container.style('width')) : this.defaultWidth),
      height: dimensions.height || (useParent ? parseInt(container.style('height')) : this.defaultHeight)
    };
    this.projection = d3[projection] ? d3[projection]() : null || d3.geoMercator();
    this.pathGenerator = d3.geoPath()
      .projection(this.projection.fitSize([this.dimensions.width,this.dimensions.height],data));
    
    this.setResizeMethod(resizeBy);
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