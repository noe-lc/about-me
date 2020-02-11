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
    window.testAnimation = this.testAnimation.bind(this);
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

  draw() { // amends/overrides the base class method
    super.draw();
    this.getFeatureOpeningHours();
    const features = this.findFeatures();
    this.initStyles(features);
    this.featuresWithOpHours = features.wOpenHours;
    this.dataBins = this.getDataBins(this.featuresWithOpHours);
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

  runTransition(day) {
    const { openingColor, colorPalette, dayTimeScale, 
      featuresWithOpHours, colorInterpolator } = this;
    featuresWithOpHours.filter(d => d.properties[day].open == '0')
        .style('fill',openingColor);
    featuresWithOpHours.filter(d => d.properties[day].open != '0')
      .style('fill',colorPalette[colorPalette.length - 1]);

    featuresWithOpHours.transition()
      .style('fill','black')
      .delay(d => dayTimeScale(d.properties[day].open))
      .duration(d => dayTimeScale(d.properties[day].close - d.properties[day].open))
      .styleTween('fill',() => colorInterpolator)
      .style('stroke','white');
  }

  drawMenu() {
    if(!this.menuContainer) return;
    const { featuresWithOpHours, dayNameMap, dataBins } = this;
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
      .call(this.buildDayGraph,featuresWithOpHours.data(),dataBins,days);
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

    infoDiv.append('h4')
      .text(d => d.name);
    infoDiv.selectAll('.info-row').data(info).enter()
      .append('div')
      .attr('class','info-row')
      .call((selection) => {
        selection.append('h5')
          .text(d => d.text);
        selection.append('span')
          .text(d => d.class);
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
    gm.append('text')
      .attr('class','number')
      .attr('x','3px')
      .attr('y','8px');
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
      let dayData = data.map(({ properties: p }) => 
        p[alias] ? [p[alias].open,p[alias].close] : null
      );
      return getRangeDistribution(dayData,bins);
    });

    infoDivs.datum((d,i) => ({ day: d, data: svgs.data()[i] }));
    
    xScale
      .domain([bins[0][0],bins[bins.length - 1][1]])
      .range([0,width]);
    yScale
      .domain([0,Math.max(...svgs.data().flat().map(d => d[2]))])
      .range([0,height]);
    svgs.select('g').append('path')
      .attr('class','day-path')
      .attr('d',lineGen);
    g.select('line.time-marker')
      .attr('x1',0).attr('y1',height)
      .attr('x2',0).attr('y2',height);

    infoDivs.selectAll('span.number-lbl')
      .text(d => d3.sum(d.data,d => d[2]));
    infoDivs.selectAll('span.max-lbl')
      .text(d => Math.max(...d.data.map(d => d[2])));
  }

  testAnimation() {
    let transform, x, yOffset,  index, yValue;
    const container = d3.select(this.menuContainer),
      svg = container.select('svg.graphics-svg'),
      marker = container
        .select('svg.graphics-svg')
        .select('g.g-marker');
    const line = marker.select('line'),
      { height, width } = svg.select('path.day-path').node().getBoundingClientRect(),
      interpolator = d3.interpolateTransformSvg('translate(0,0)',`translate(${width},0)`),
      bisector = d3.bisector(d => d[0]);

    marker.transition()
      .duration(10000)
      .attrTween('transform',(d) => (t) => {
        transform = interpolator(t);
        x = parseFloat(transform.slice(10));
        index = bisector.right(d,this.xScale.invert(x)) - 1;
        yValue = d[index][2];
        yOffset = height - this.yScale(yValue);
        line.attr('y1',yOffset)
        //numberLbl .text(yValue);
        return transform;
      });
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