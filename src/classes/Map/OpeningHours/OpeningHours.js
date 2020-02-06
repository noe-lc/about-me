import * as d3 from 'd3';
import { fetchData } from '../../../utils/utils';
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

  openingColor = d3.color('rgb(249, 249, 134)');
  colorPalette = [this.openingColor, 'orange', 'purple'];
  interpolator = d3.piecewise(d3.interpolateRgb.gamma(1),this.colorPalette);
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

  draw() { // amends/overrides the base class method
    super.draw();
    this.getFeatureOpeningHours();
    const features = this.findFeatures();
    this.initStyles(features);
    this.featuresWithOpHours = features.wOpenHours;
    this.drawMenu();
  }

  getFeatureOpeningHours() {
    this.data.features.forEach(f => {
      const { open_hours } = f.properties;
      if(!open_hours) return;
      for (let key in open_hours) {
        let value = open_hours[key][0] || [];
        let [open,close] = value;
        f.properties.open_hours[key] = value || [];
        f.properties[key] = value.length == 0 ? 
          { open: 0, close: 0 } : OpeningHoursMap.getOpenHoursInSeconds(open,close);
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
    wOpenHours.filter(d => d.properties['Mon'].open != '0')
      .style('fill','purple');
  }

  runTransition(day) {
    const { openingColor, colorPalette, dayTimeScale, 
      featuresWithOpHours, interpolator } = this;
    featuresWithOpHours.filter(d => d.properties[day].open == '0')
        .style('fill',openingColor);
    featuresWithOpHours.filter(d => d.properties[day].open != '0')
      .style('fill',colorPalette[colorPalette.length - 1]);

    featuresWithOpHours.transition()
      .style('fill','black')
      .delay(d => dayTimeScale(d.properties[day].open))
      .duration(d => dayTimeScale(d.properties[day].close - d.properties[day].open))
      .styleTween('fill',() => interpolator)
      .style('stroke','white');
  }

  drawMenu() {
    if(!this.menuContainer) return;
    const menu = d3.select(this.menuContainer);
    const dimensions = {
      width: parseInt(menu.style('width')),
      height: parseInt(menu.style('height'))
    };
    // TODO: handle size problems?
    const days = Object.entries(this.dayNameMap)
      .sort(([k1,a],[k2,b]) => a - b)
      .map(([k,v]) => ({ alias: k, name: v.name }));
    const heightPct = Math.floor((dimensions.height / days.length) / dimensions.height * 100);
    const graphs = menu.selectAll('.day-graph-container').data(days).enter()
      .append('div')
        .attr('class','day-graph-container')
        .style('height',`${heightPct}%`)
        .call(OpeningHoursMap.appendDayGraphElements);
    graphs.selectAll('.day-name')
      .text(d => d.alias);
    graphs.selectAll('.day-graph')
      .call(OpeningHoursMap.buildDayGraph,this.featuresWithOpHours,days);
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

  static appendDayGraphElements(selection) {
    selection.append('div')
      .attr('class','day-name');
    const graph = selection.append('div')
      .attr('class','day-graph');
    graph.append('div')
        .classed('graphics-svg-container',true);
    const dimensions = {
      width: parseInt(graph.style('width')),
      height: parseInt(graph.style('height'))
    };
    graph.append('svg')
      .attr('class','graphics-svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
      .classed('svg-content-responsive', true); // Class to make it responsive.
  }

  static buildDayGraph(selection,dataSelection,days) {
    let breaks = [];
    const data = dataSelection.data(),
      halfHourSeconds = 30 * 60,
      initial = 0, final = 86400;
    for (let i=initial;i <= (final / halfHourSeconds) - 1;i++) {
      breaks.push((i * halfHourSeconds) - 1);
    }
    breaks[0] = initial;
    breaks[breaks.length - 1] = final;
    
    const bins = breaks.reduce((o,e,i) => {
      o[`${e + 1}-${breaks[i + 1]}`] = 0;
      return o;
    },{});
    console.log('bins :', bins);

    //for (let { alias } of days) {
    //  data.map(({properties: p}) => p[alias].close - p[alias].open); 
    //  dayData = [...dayRanges[alias],...bins];
    //}

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
          .styleTween('fill',() => interpolator)
        .transition()
          .delay(d => totalTime - scale(d[prop].end ))
          .on('start',repeat);
      });
      
  };
 */