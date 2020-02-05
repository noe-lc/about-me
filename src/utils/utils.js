import { csv, json } from 'd3';
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