import * as d3 from 'd3';
import { fetchData, getRangeDistribution, getDimensions } from '../../../scripts/utils';
import Map from '../Map/Map';
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
    this.appendAdditionalElements(features.alwaysOpen.length);
    this.drawMenu();

    // DELETE LATER
    //let a = this.selectionWithOpHours.data()
    //  .filter(d => d.properties.Mon)
    //  .map(d=> [d.properties.Mon.open,d.properties.Mon.close])
    //  .sort((a,b) => a[0] - b[0]);
    //
    //console.log('a :', a);
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
    const container = d3.select(this.container);
    container.append('div')
      .attr('class','number')
      .text('WAAAAGHHH');
  }

  appendDayGraphElements = (selection) => {
    const infoDiv = selection.append('div')
      .attr('class','day-info');
    const graph = selection.append('div')
      .attr('class','day-graph');
    const { width, height } = getDimensions(graph.node());
    const svg = graph.append('div')
      .classed('graphics-svg-container',true)
      .append('svg');
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
    
    svg.attr('class','graphics-svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .classed('svg-content-responsive', true) // Class to make it responsive.
    .append('g')
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
      { width, height } = getDimensions(selection.node()),
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

  runTransition = ({ alias },node) => {
    let transform, x, yOffset,  index, yValue;
    const { openingColor, colorPalette, dayTimeScale, selectionWithOpHours, 
      colorInterpolator, menuContainer, xScale, yScale } = this;
    // TODO: style those without opening hours for given day
    const filteredByDay = selectionWithOpHours.filter(d => d.properties[alias]);
    const svg = d3.select(menuContainer)
      .selectAll('svg.graphics-svg')
      .filter(d => d.alias == alias);
    const marker = svg.select('g.g-marker'),
      line = marker.select('line'),
      { width } = svg.select('path.day-path').node().getBoundingClientRect(),
      { height } = svg.node().getBoundingClientRect(),
      interpolator = d3.interpolateTransformSvg('translate(0,0)',`translate(${width},0)`),
      bisector = d3.bisector(d => d[0]);

    // assign starting styles according to day
    filteredByDay.filter(d => d.properties[alias].open == '0') 
      .style('fill',openingColor);
    filteredByDay.filter(d => d.properties[alias].open != '0')
      .style('fill',colorPalette[colorPalette.length - 1]);

    marker.transition('marker')
      .duration(10000)
      .attrTween('transform',(d) => (t) => {
        transform = interpolator(t); 
        x = parseFloat(transform.slice(10));
        index = bisector.right(d.distribution,xScale.invert(x)) - 1;
        yValue = d.distribution[index][2];
        yOffset = height - yScale(yValue);
        line.attr('y1',yOffset);
        //numberLbl .text(yValue);
        return transform;
      });
    
    filteredByDay.transition('day')
      .style('stroke','black')
      .delay(d => dayTimeScale(d.properties[alias].open))
      .duration((d,i) => dayTimeScale(d.properties[alias].close - d.properties[alias].open))
      .styleTween('fill',() => colorInterpolator)
      .style('stroke','white');

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