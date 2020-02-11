import * as d3 from 'd3';
import './Map.css';

export default class Map {
  constructor({main: container},data,settings) {
    this.container = container;
    this.data = data;
    this.applySettings(settings,data);
  }

  defaultWidth = '600px';
  defaultHeight = '400px';
  resizable = false;

  applySettings(settings,data) {
    const container = d3.select(this.container);
    const { projection, useParent, resizeBy, dimensions } = settings;
    this.dimensions = {
      width: dimensions.width || (useParent ? parseInt(container.style('width')) : this.defaultWidth),
      height: dimensions.height || (useParent ? parseInt(container.style('height')) : this.defaultHeight)
    };
    console.log('this.dimensions :', this.dimensions);
    this.projection = d3[projection] ? d3[projection]() : null || d3.geoMercator();
    this.pathGenerator = d3.geoPath()
      .projection(this.projection.fitSize([this.dimensions.width,this.dimensions.height],data));
    
    this.setResizeMethod(container,resizeBy);
  }

  draw() {
    d3.select(this.container)
      .select('svg.graphics-svg')
      .append('g')
        .attr('class','g-main');
    
    this.addElements(this.data);
  }

  setResizeMethod(containerSel,resizeBy) {
    const { dimensions, resizable } = this;
    if(!resizeBy || resizeBy === 'style') {
      containerSel.call(Map.setSubcontainers,resizable,dimensions);
    } else if(resizeBy === 'method') {
      this.resizable = true;
      containerSel.call(Map.setSubcontainers,this.resizable,dimensions);
    } else {
      containerSel.call(Map.setSubcontainers,resizable,dimensions);
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

  static setSubcontainers(selection,isStyleResizable,dimensions) {
    if(!isStyleResizable) {
      selection.append('div')
        .classed('graphics-svg-container',true)
      .append('svg')
        .attr('class','graphics-svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
        .classed('svg-content-responsive', true); // Class to make it responsive.
    } else {
       selection.append('svg')
        .attr('class','graphics-svg');
    }
    
  };
};

/*

function initializeMap() {

    const controller = d3.select('div#controller');
    controller.selectAll('p').data(Object.entries(dayNameMap)).enter()
      .append('p')
      .attr('class','day-selector')
      .text(d => d[1])
      .on('click',d => dayTransition(d[0]));

    const showLegend = controller.append('div')
      .attr('class','legend')
      .on('click',() => { 
        let display = d3.select('div#legend').style('display');
        display = display == 'none' ? 'block' : 'none';
        d3.select('div#legend').style('display',display);
      });
    showLegend.append('img')
      .attr('class','legend-icon')
      .attr('src','imgs/legend.png');
    showLegend.append('span')
      .text('Show legend');
    

    const legend = d3.select('div#controller').append('div')
      .attr('id','legend');
    const ramp = legend.append('div')
      .attr('class','ramp-container');
    ramp.append('img')
      .attr('src','imgs/color-ramp.png');
    ramp.append('h6')
      .attr('class','indicator')
      .style('top','-3px')
      .text('-Closed');
    ramp.append('h6')
      .attr('class','indicator')
      .style('top','245px')
      .text('-Just opened');
    
    const classes = legend.selectAll('.class').data(
      [{ color: '#61b864', text: 'Open 24/7' },{ color: '#cccccc', text: 'No Data' }]
    )
      .enter().append('div')
        .attr('class','class-row');
    classes.append('div')
      .attr('class','patch')
      .style('background-color',d => d.color);
    classes.append('h6')
      .attr('class','description')
      .text(d => d.text);
        
  });
};

*/