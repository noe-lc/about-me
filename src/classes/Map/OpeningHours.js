import * as d3 from 'd3';
import { fetchData } from '../../utils/utils';
import Map from './Map';

export class OpeningHoursMap extends Map {
  constructor(container,data,settings,additionalData) {
    super(container,data,settings);
    const callback = () => { // particular to this class
      d3.select(this.container)
        .call(OpeningHoursMap.setAsLower,'path.land')
        .call(OpeningHoursMap.clone,'path.land','land-outline')
        .call(OpeningHoursMap.setAsLower,'path.land-outline');
    };
    
    this.addData(additionalData,callback);
  }

  openingColor = d3.color('rgb(249, 249, 134)');
  colorPalette = [this.openingColor, 'orange', 'purple'];
  interpolator = d3.piecewise(d3.interpolateRgb.gamma(1),this.colorPalette);
  dayNameMap = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  };
  dayTimeScale = d3.scaleLinear()
    .domain([0,86400]) // seconds in 24hrs
    .rangeRound([0,10000]) //ms

  draw() { // amends/overrides the base class method
    super.draw();
    const features = this.findFeatures();
    this.initStyles(features);
    this.featuresWithOpHours = features.featuresWithOpHours;
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