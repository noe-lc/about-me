import * as d3 from 'd3';
import './Map.css';

export default class Map {
  constructor(container,data,settings) {
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
const pathGenerator = d3.geoPath()
  .projection(d3.geoMercator()/*.angle(29));

function initializeMap() {
  d3.json('./data/manhattan.json').then(async data => {
    let index = 0;
    let fitHeight, polygons;
    let alwaysOpen, allOthers, noOpenHours;
    const coastlines = await d3.json('./data/manhattan_polygon.geojson');
    const collection = topojson.feature(data,data.objects.manhattan),
      svg = d3.select('svg#map'),
      g = svg.append('g'),
      pathProjection = pathGenerator.projection(),
      openingColor = d3.color('rgb(249, 249, 134)'),
      interpolator = d3.piecewise(d3.interpolateRgb.gamma(1), [openingColor, 'orange', 'purple']),
      dayNameMap = {
        Mon: 'Monday',
        Tue: 'Tuesday',
        Wed: 'Wednesday',
        Thu: 'Thursday',
        Fri: 'Friday',
        Sat: 'Saturday',
        Sun: 'Sunday'
      };

    const dayScale = d3.scaleLinear()
      .domain([0,86400]) // seconds in 24hrs
      .rangeRound([0,10000]) //ms
    
    const getOpenHoursInSeconds = (open,close) => {
      [close,open] = [close,open].map(t => {
        let index = t.indexOf(':'),
          hours = +t.slice(0,index),
          mins = +t.slice(index + 1);
        return (hours * 60 * 60) + (mins * 60);
      });
      return { open, close };
    };

    collection.features.forEach(f => {
      const { open_hours } = f.properties;
      if(!open_hours) return;
      for (let key in open_hours) {
        let value = open_hours[key][0] || [];
        let [open,close] = value;
        f.properties.open_hours[key] = value || [];
        f.properties[key] = value.length == 0 ? 
          { open: 0, close: 0 } : getOpenHoursInSeconds(open,close);
      }
    });
    
    pathGenerator.projection(pathProjection.fitWidth(document.body.clientWidth,collection));

    svg.style('background-color','#c0cdd7');

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
      
    g.selectAll('path').data(collection.features)
      .enter().append('path')
        .attr('class','polygon')
        .attr('d',pathGenerator);
    
    g.selectAll('path.coastline').data(coastlines.features)
      .enter()
      .append('path')
        .attr('class','coastline')
        .attr('d',pathGenerator)
        .lower()
      .clone()
        .attr('class','bold-coastline')
        .lower();

    fitHeight = g.node().getBBox().height;
    svg.style('height',Math.ceil(fitHeight));

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