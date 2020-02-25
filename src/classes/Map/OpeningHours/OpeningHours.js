import * as d3 from 'd3';
import { fetchData, getRangeDistribution, 
  getDimensions, setSubcontainers } from '../../../scripts/utils';
import { Map } from '../Map/Map';
import './OpeningHours.css'

export class OpeningHoursMap extends Map {
  constructor(containers,data,settings,additionalData) {
    super(containers,data,settings);
    const callback = () => { // particular to this class
      d3.select(this.container)
        .call(OpeningHoursMap.setAsLower,'path.land')
        .call(OpeningHoursMap.clone,'path.land','land-outline')
        .call(OpeningHoursMap.setAsLower,'path.land-outline');
    };
    this.menuContainer = containers.menu;
    this.addData(additionalData,callback);
  }

  width = undefined;
  height = undefined;
  minGraphHeight = 100;
  openingColor = d3.color('rgb(249, 249, 134)');
  colorPalette = [this.openingColor, 'orange', 'purple'];
  colorInterpolator = d3.piecewise(d3.interpolateRgb.gamma(1),this.colorPalette);
  xInterpolator = d3.interpolate(0)
  dayNameMap = {
    Mon: { name: 'Monday', order: 1 },
    Tue: { name: 'Tuesday', order: 2 },
    Wed: { name: 'Wednesday', order: 3 },
    Thu: { name: 'Thursday', order: 4 },
    Fri: { name: 'Friday', order: 5 },
    Sat: { name: 'Saturday', order: 6 },
    Sun: { name: 'Sunday', order: 7 }
  };
  dayTimeScale = d3.scaleLinear()
    .domain([0,86400]) // seconds in 24hrs
    .rangeRound([0,10000]) //ms
  xScale = d3.scaleLinear();
  yScale = d3.scaleLinear();

  draw() { 
    super.draw(); // amends/overrides the base class method
    d3.select(this.container).select('svg')
      .classed('scaled',true);
    this.getFeatureOpeningHours();
    const features = this.findFeatures();
    this.selectionWithOpHours = features.wOpenHours;
    this.dataBins = this.getDataBins(this.selectionWithOpHours);
    this.initStyles(features);
    this.appendAdditionalElements(features.alwaysOpen.size());
    this.drawMenu();
  }

  getFeatureOpeningHours() {
    let value, open, close;
    this.data.features.forEach(f => {
      const { open_hours } = f.properties;
      if(!open_hours) return;
      for (let key in open_hours) {
        [value] = open_hours[key];
        if(value) {
          [open,close] = value;
          f.properties.open_hours[key] = value;
          f.properties[key] = OpeningHoursMap.getOpenHoursInSeconds(open,close);
        } else {
          f.properties.open_hours[key] = null;
        }
      }
    });
  }

  findFeatures() {
    const polygons = d3.select(this.container).select('svg')
      .select('g.g-main')
      .selectAll('path.polygon');
    const alwaysOpen = polygons.filter(d => d.properties.seconds_per_week == 604800),
      noOpenHours = polygons.filter(d => !d.properties.open_hours),
      idsToDiscard = [
        ...alwaysOpen.data().map(f => f.properties.fid),
        ...noOpenHours.data().map(f => f.properties.fid)
      ];
    const wOpenHours = polygons.filter(d => !idsToDiscard.includes(d.properties.fid));
    return { alwaysOpen, noOpenHours, wOpenHours };
  }

  initStyles({alwaysOpen,noOpenHours,wOpenHours}) {
    alwaysOpen
      .style('fill','#61b864');
    noOpenHours
      .style('fill','#cccccc');
    wOpenHours.filter(d => d.properties['Mon'])
      .style('fill','purple');
  }

  drawMenu() {
    if(!this.menuContainer) return;
    const { selectionWithOpHours, dayNameMap, dataBins } = this;
    const menu = d3.select(this.menuContainer);
    const { width, height } = getDimensions(this.menuContainer);
    // TODO: handle size problems?
    const days = Object.entries(dayNameMap)
      .sort(([k1,a],[k2,b]) => a - b)
      .map(([k,v]) => ({ alias: k, name: v.name }));
    const heightPct = Math.floor((height / days.length) / height * 100);
    //let height = Math.floor((height / days.length));
    //height = height <
    const graphs = menu.selectAll('.day-graph-container').data(days).enter()
      .append('div')
        .attr('class','day-graph-container')
        .style('height',`${heightPct}%`)
        .call(this.appendDayGraphElements);
    graphs.selectAll('.day-graph')
      .call(this.buildDayGraph,selectionWithOpHours.data(),dataBins,days);
  }
  
  async addData(additionalData,callback = () => {}) {
    if(!additionalData) {
      return;
    }
    let res;
    for (let e of additionalData) {
      res = await fetchData(e.url);
      if(res) {
        this.addElements(res,e.className);
      }
    }
    callback();
    return res;
  }

  getDataBins() {
    let breaks = [];
    const halfHourSeconds = 30 * 60,
      initial = 0, final = 86400;
    for (let i=initial;i <= (final / halfHourSeconds) - 1;i++) {
      breaks.push((i * halfHourSeconds) - 1);
    }
    breaks[0] = initial;
    breaks[breaks.length - 1] = final;

    const bins = breaks.map((e,i) => { // intervals' length is breaks.length - 1
      return [e + 1,breaks[i + 1]]; // lower, upper
    });
    bins.pop(); // last bin is not an interval
    bins[0][0] = initial;
    bins[bins.length - 1][1] = final;
    return bins;
  }

  appendAdditionalElements(alwaysOpen) {
    const detail = d3.select(this.container).append('div') // counter
      .attr('class','transition-detail');
    detail.append('span')
      .attr('class','desc')
      .text('Currently open:');
    detail.append('span')
      .datum(alwaysOpen)
      .attr('class','number')
      .text(d => d);
    
    const legend = d3.select(this.container).append('div') // legend
      .attr('class','op-legend');
    legend.append('img')
      .attr('src','https://noe-lc.github.io/about-me/imgs/op-color-ramp.png')
    legend.selectAll('span').data(['Just Opened','Closed']).enter()
      .append('span')
      .attr('class','ramp-label')
      .style('left',(_,i) => i == 0 ? '0%' : 'initial')
      .style('right',(_,i) => i == 1 ? '0%' : 'initial')
      .text(d => d);
  }

  appendDayGraphElements = (selection) => {
    const infoDiv = selection.append('div')
      .attr('class','day-info');
    const graph = selection.append('div')
      .attr('class','day-graph');
    const { width, height } = getDimensions(graph.node());
    const info = [{ text: 'Total', class: 'total-lbl' },{ text: 'Max', class: 'max-lbl' }]

    selection.append('button')
      .attr('class','play')
      .attr('title','Play animation')
      .on('click',this.runTransition);
    
    infoDiv.append('h4')
      .text(d => d.name);
    infoDiv.selectAll('.info-row').data(info).enter()
      .append('div')
      .attr('class','info-row')
      .call((sel) => {
        sel.append('h5')
          .text(d => d.text + ':');
        sel.append('span')
          .attr('class',d => d.class);
      });
    
    const svg = graph
      .call(setSubcontainers,true,{ width, height })
      .select('svg');
    svg.append('g')
      .attr('class','g-main');  
    const gm = svg.append('g')
      .attr('class','g-marker');
    gm.append('line')
      .attr('class','time-marker');    
    this.width = width;
    this.height = height;
  }

  buildDayGraph = (selection,data,bins) => {
    const { xScale, yScale } = this,
      svgs = selection.selectAll('svg'),
      g = svgs.select('g.g-marker'),
      infoDivs = d3.select(this.menuContainer).selectAll('div.day-info'),
      { width, height } = getDimensions(svgs.nodes()[0]),
      lineGen = d3.line()
        .x(d => xScale(d[0]))
        .y(d => height - yScale(d[2]));

    svgs.datum(({alias}) => {
      let dayData = data.reduce((filtered,{ properties: p }) => {
        if(p[alias]) filtered.push([p[alias].open,p[alias].close]);
        return filtered;
      },[]);
      return { alias: alias, count: dayData.length, distribution: getRangeDistribution(dayData,bins) };
    });

    infoDivs.datum((d,i) => ({ day: d, data: svgs.data()[i] }));
    
    const yDomain = svgs.data()
      .map(d => d.distribution).flat()
      .map(d => d[2]);
    xScale
      .domain([bins[0][0],bins[bins.length - 1][1]])
      .range([0,width]);
    yScale
      .domain([0,Math.max(...yDomain)])
      .range([0,height]);
    svgs.select('g').append('path')
      .attr('class','day-path')
      .attr('d',d => lineGen(d.distribution));
    g.select('line.time-marker')
      .attr('x1',0).attr('y1',height)
      .attr('x2',0).attr('y2',height);

    infoDivs.select('span.total-lbl')
      .text(d => d.data.count);
    infoDivs.select('span.max-lbl')
      .text(d => Math.max(...d.data.distribution.map(d => d[2])));
     
  }

  runTransition = ({ alias }) => {
    let transform, x, yOffset,  index, yValue;
    const { colorPalette, dayTimeScale, selectionWithOpHours, 
      colorInterpolator, container, menuContainer, xScale, yScale } = this;

    selectionWithOpHours.transition();
    // TODO: style those without opening hours for given day
    const filteredByDay = selectionWithOpHours.filter(d => d.properties[alias]);
    const svgs = d3.select(menuContainer).selectAll('svg.graphics-svg');
    const svg = svgs.filter(d => d.alias == alias);
    const marker = svg.select('g.g-marker'),
      line = marker.select('line'),
      number = d3.select(container.parentElement).select('span.number'),
      [vWidth,vHeight] = svg.attr('viewBox').split(' ').slice(2),  // viewbox
      { width: sWidth } = svg.node().getBoundingClientRect(),
      { width } = svg.select('path.day-path').node().getBoundingClientRect(),
      tWidth = (vWidth / sWidth) * width, // calculate final width in terms of "viewport units"
      tHeight = vHeight, // vertical viewport units are maintained
      interpolator = d3.interpolateTransformSvg('translate(0,0)',`translate(${tWidth},0)`),
      bisector = d3.bisector(d => d[0]);
    
    yScale.range([0,tHeight]); // adjust the scales to the current dimensions
    xScale.range([0,tWidth]);
    
    this.initDay(filteredByDay,alias,number); // assign init styles according to day
    filteredByDay.filter(d => d.properties[alias].open != '0')
      .style('fill',colorPalette[colorPalette.length - 1]);

    filteredByDay.transition('day')
      .style('stroke','black')
      .delay(d => dayTimeScale(d.properties[alias].open))
      .duration((d,i) => dayTimeScale(d.properties[alias].close - d.properties[alias].open))
      .styleTween('fill',() => colorInterpolator)
      .style('stroke','white');

    marker.transition('marker')
      .duration(10000)
      .attrTween('transform',({ distribution }) => (t) => {
        transform = interpolator(t); 
        x = parseFloat(transform.slice(10));
        index = bisector.right(distribution,xScale.invert(x)) - 1;
        yValue = distribution[index][2];
        yOffset = tHeight - yScale(yValue);
        line.attr('y1',yOffset);
        number.text(d => d + yValue);
        return transform;
      }).on('start',d => { // cancel ongoing transitions in other markers
        line.style('display','block');
        const markers = svgs.selectAll('g.g-marker').filter(dd => dd !== d);
        markers.transition('marker');
      }).on('end',() => {
        this.initDay(filteredByDay,alias,number);
        marker.call(OpeningHoursMap.resetMarker);
      }).on('interrupt',() => marker.call(OpeningHoursMap.resetMarker));
  }

  initDay(selection,alias,numberSel) {
    const open = selection.filter(d => d.properties[alias].open == '0') 
      .style('fill',this.openingColor);
    numberSel.text(d => d + open.size());
  }

  static getOpenHoursInSeconds = (open,close) => {
    [close,open] = [close,open].map(t => {
      let index = t.indexOf(':'),
        hours = +t.slice(0,index),
        mins = +t.slice(index + 1);
      return (hours * 60 * 60) + (mins * 60);
    });
    return { open, close };
  };

  static clone(selection,selector,className) {
    return selection.select(selector).clone()
      .attr('class',className);  
  }

  static setAsLower(selection,selector) {
    return selection
      .select('g.g-main')
      .select(selector).lower();
  }

  static resetMarker(selection){
    selection
      .attr('transform','translate(0,0)')
      .select('line')
        .attr('y1',0)
        .style('display','none');
  }
};

/** loops through the dates
  function runTransition() {
    circles.transition()
      .on('start',function repeat(d) {
        d.index = !isNaN(d.index) ? d.index += 1 : 0;
        let prop = props[d.index];
      
        if(d.index > props.length - 1) {
          d.index = 0;
          return;
        }
      
        d3.active(this).transition()
          .delay(d => scale(d[prop].start))
          .duration(d => scale(d[prop].end) - scale(d[prop].start))
          .styleTween('fill',() => colorInterpolator)
        .transition()
          .delay(d => totalTime - scale(d[prop].end ))
          .on('start',repeat);
      });
      
  };
 */