import { select, csv, json } from 'd3';
import { feature } from 'topojson';

const geojson = json;
const FETCH = { csv, json, geojson };

export const validateFn = (fn) => {
  if(!fn || typeof fn !== 'function') {
    return null;
  }
  return fn;
};

export const fetchData = async (url = '',signal) => {
  let data;
  const urlMembers = url.split('.');
  const extension = urlMembers[urlMembers.length - 1];

  if(!FETCH[extension]) {
    const message = `Invalid Extension. Expected ${Object.keys(FETCH).join(', ')}`;
    return new Error(message);
  }

  try {
    const res = await FETCH[extension](url,signal);
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

export const getDimensions = (element) => {
  const selection = select(element);
  return {
    width: parseInt(selection.style('width')),
    height: parseInt(selection.style('height'))
  }
};