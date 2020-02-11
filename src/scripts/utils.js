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

export const fetchData = async (url = '') => {
  let data;
  const urlMembers = url.split('.');
  const extension = urlMembers[urlMembers.length - 1];

  if(!FETCH[extension]) {
    console.warn('Invalid Extension');
    return null;
  }

  try {
    const res = await FETCH[extension](url);
    if(res.type === 'Topology') {
      const firstKey = Object.keys(res.objects)[0];
      data = feature(res,res.objects[firstKey]);
    } else {
      data = res;
    }
    
  } catch (err) {
    console.warn(err);
    data = null;
  }

  return data;  
};

export const getRangeDistribution = (data,bins) => { // bins should be already exclusive
  let count, first, last;
  let copy = [...data];
  let nextCopy = [...copy];
  return bins.map(([lower,upper]) => {
    count = 0;
    copy.forEach((d,i) => {
      //if(!d) {
      //  return;
      //}
      [first,last] = d;
      if(first < lower) { // left
        if(last >= lower) {
          count += 1;
        } else {
          nextCopy.splice(i,1);
        }
      } else if(!(first > upper)) { // not right (between)
        count += 1;
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