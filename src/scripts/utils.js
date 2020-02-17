import { select, csv, json } from 'd3';
import { transition, easeCubicInOut, treemap } from 'd3';
import { feature } from 'topojson';

const geojson = json;
const FETCH = { csv, json, geojson };

/* STRING UTILS */

/* MISC */

export const validateFn = (fn) => {
  if(!fn || typeof fn !== 'function') {
    return null;
  }
  return fn;
};

export const fetchData = async (url = '',signal,rowConversion) => {
  let data;
  const urlMembers = url.split('.');
  const extension = urlMembers[urlMembers.length - 1];

  if(!FETCH[extension]) {
    const message = `Invalid Extension. Expected ${Object.keys(FETCH).join(', ')}`;
    return new Error(message);
  }

  try {
    const res = await FETCH[extension](url,signal,rowConversion);
    if(res.type === 'Topology') {
      const firstKey = Object.keys(res.objects)[0];
      data = feature(res,res.objects[firstKey]);
    } else {
      data = res;
    }
    return data;
  } catch (err) {
    return new Error(err.message);
  }
};

/* DATA UTILS */

export const getRangeDistribution = (data,bins) => { // bins should be already exclusive
  let count, first, last;
  let copy = [...data];
  let nextCopy = [];
  return bins.map(([lower,upper]) => {
    count = 0;
    nextCopy = [];
    copy.forEach((d) => {
      //if(!d) {
      //  return;
      //}
      [first,last] = d;
      if(first < lower) { // left
        if(last >= lower) {
          count += 1;
          nextCopy.push(d);
        }
      } else if(!(first > upper)) { // not right (between)
        count += 1;
        nextCopy.push(d);
      } else {
        nextCopy.push(d);
      }
    });
    copy = [...nextCopy];
    return [lower,upper,count];
  });
};

export const sum = (array) => array.reduce((sum,e) => sum += e,0);

export const areArrayValuesEqual = (array1,array2) => {
  return array1.every((e,i) => e === array2[i]);
};


/* D3 GRAPH UTILS */

export const getDimensions = (element) => {
  const selection = select(element);
  return {
    width: parseInt(selection.style('width')),
    height: parseInt(selection.style('height'))
  }
};

export const setSubcontainers = (selection,isStyleResizable,dimensions) => {
  if(isStyleResizable) {
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

export const  transitionFactory = (name,miliseconds,easing = easeCubicInOut) => {
  return transition(name)
    .duration(miliseconds)
    .ease(easing);
};

export const treemapLayout = (width,height) => { // default settings
  return treemap()
    .size([width,height])
    .paddingInner(1)
    .paddingOuter(2)
    .round(true);
};