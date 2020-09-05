import React from 'react';
import { sum } from '../scripts/utils';

const months = [1,2,3,4,5,6,7,8,9,10,11,12];
const monthRowConversion = r => ({ 
  ...r, 
  ...Object.fromEntries(months.map(m => [m,+r[m]]))
});

/*****  WEB APPS *******/
export const webApps = { 
  name: 'Web Apps', 
  path:'web-apps',
  appearanceOrder: 1,
  list: [
    {
      type: 'fixed',
      name:'Public Reports',
      content: () => {
        return <iframe title='Public Reports App Sample' className='app-video' src="https://player.vimeo.com/video/392540452" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>

      },
      description: () => {
        return (
          <div className='flex-divider'>
            <div className='flex-3'>
              <p className='content-margin'>
                Based on data mined from social media, geographical references were used to digitize features on a map
                and link them to public posts. Such features were uploaded to a database using internal tools and then consumed
                by the app in order to find clusters and frequencies of issues related to government services.
              </p>
              <p className='content-margin'>
                The app provided ways of filtering spatially, by date, or category.
              </p>
            </div>
            <div className='flex-3'>
              <h3>Challenges</h3>
              <ol className='app-video-listing'>
                <li>Managing layer visibility at different zoom levels<sup>*</sup></li>
                <li>Spatial filtering at street and block levels on drag events<sup>*</sup></li>
                <li>Leveraging the marker clustering library to add color codes, and cluster features not only by proximity, but by attributes as well.</li>
                <li>Creating a custom overlay and make it act as proportional symbols</li>
              </ol>
              <div className='note'>
                <mark><sup>*</sup> Required behaviour to improve performance</mark>
              </div> 
            </div>
            <div>
              <h3>Tools/Technologies</h3>
              <ol className='app-video-listing'>
                <li>React</li>
                <li>Redux</li>
                <li>Google Maps API</li>
                <li>D3.js</li>
                <li>
                  <a target='_blank' rel='noopener noreferrer' href='https://github.com/gmaps-marker-clusterer/gmaps-marker-clusterer'>Google Maps Marker Clustering</a>
                </li>
                <li>Turf.js</li>
              </ol>
            </div>
          </div>
        )
      }
    },
    {
      type: 'fixed',
      name:'Subway Reports',
      content: () => {
        return <iframe title='Subway Reports App Sample' className='app-video' src="https://player.vimeo.com/video/392540761" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
      },
      description: () => {
        return (
          <div className='flex-divider'>
            <div className='flex-3'>
              <p className='content-margin'>
                As a way of keeping track and following service issues (reported on social media by users), our organization
                devised a framework for classifying and organizing them so that the data could be visualized in different ways, namely:
                Summary Tables, Rankings, Bar Charts (constructed on nominal and time dimensions), a Treemap, and a Map.
              </p>
              <p className='content-margin'>
                In addition, custom and highly interactive filters were built since the data itself were content-rich and
                required detailed exploration. To further support this, components were contained to ensure consistent updates
                such as those found in dashboards.
              </p>
            </div>
            <div className='flex-3'>
              <h3>Challenges</h3>
              <ol className='app-video-listing'>
                <li>Finding a data structure that could be reused by as many components as possible</li>
                <li>Reflecting updates and data availability on the filters (i.e. graying out or disabling controls)</li>                
                <li>Generating filter options dynamically</li>
                <li>Error handling for DOM transitions which could be interrupted by fast user interaction</li>                 
              </ol>
            </div>
            <div>
              <h3>Tools/Technologies</h3>
              <ol className='app-video-listing'>
                <li>React</li>
                <li>Redux</li>
                <li>Google Maps API</li>
                <li>D3.js</li>
              </ol>
            </div>
          </div>
        )
      }
    },
    {
      type: 'fixed',
      name: 'Incidences',
      content: () => {
        return (
          <React.Fragment>
            <iframe title='Incidences summary App sample' className='app-video'  src="https://player.vimeo.com/video/393004335"  frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
            <iframe title='Geolocated Incidences App sample' className='app-video'  src="https://player.vimeo.com/video/392995897"  frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
          </React.Fragment>    
        )
      },
      description: () => {
        return (
          <div className='flex-divider'>
            <div className='flex-3'>
              <p className='content-margin'>
                We created a couple of applications for geolocating and "tracking" incidences in Mexico City. It was decided
                that we should have the qualitative and spatial concerns separate (found respectively in the videos above).
              </p>
              <p>
                The first application consists of a summary table, a treemap and a segmented bar chart. The user can click the elements to
                filter and explore the entries belonging to them. More details of the data are provided in a modal and other sections, where each
                incidence is presented separately, and clicking on a link will take the user to the second app via <code><a target='_blank' rel='noopener noreferrer' href='https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage'>postMessage</a></code>. 
                This window method allowed us to send the current state of the filters as well as the selected feature on the map, in order to apply these changes on first render.
              </p>
              <p>
                Each incidence was linked to official data sources, media content, and more importantly, related 
                events that followed the first one registered. We also included polygon data layers and a heatmap to help
                authorities find hotspots and identify sectors which required attention.
              </p>
            </div>
            <div className='flex-3'>
              <h3>Challenges</h3>
              <ol className='app-video-listing'>
                <li>Fine-tuning the order of execution to accomodate the changes sent from the other application, regardless of whether window was open or not</li>
                <li>Sharing state and component methods with the map, sidebar, and filters</li>
                <li>Finding features with the same coordinates and symbolizing them differently, while showing the number of grouped features</li>
                <li>Linking features by their attributes, and changing their style</li>
                <li>Creating a data layer style that highlighted the current feature for a short period of time</li>               
              </ol>
            </div>
            <div>
              <h3>Tools/Technologies</h3>
              <ol className='app-video-listing'>
                <li>React</li>
                <li>Redux</li>
                <li>Google Maps API</li>
                <li>D3.js</li>
                <li>Turf.js</li>
              </ol>
            </div>
          </div>
        )
      }
    }
  ],
  message: {
    type: 'warning',
    text: `Text and media content in the videos are either blurred out, pixelated, or even censored because the data
    behind them is considered to be sensitive to external users. However, the videos do a good job in
    showing the overall functionality, design, and interactive capabilities of the apps. More information regarding
    the tools used and the challenges faced while building them is available on their description sections.`
  }
};

/*****  MAPS *******/
export const maps = { 
  name: 'Maps', 
  path: 'maps',
  appearanceOrder: 2,
  list: [
    {
      type: 'graphics',
      name:'Opening Hours',
      class: 'OpeningHoursMap',
      path:'opening-hours',
      url:'https://raw.githubusercontent.com/noe-lc/noe-lc.github.io/master/data/manhattan_reduced_tjson.json',
      settings: {
        resizeBy: 'style', // style || method 
        dimensions: { height: undefined, width: undefined },
        projection: 'geoMercator'
      },
      additionalData: [
        { 
          url: 'https://raw.githubusercontent.com/noe-lc/noe-lc.github.io/master/data/manhattan_polygon.geojson',
          className: 'land'
        }
      ],
      description: () => {
        return (
          <React.Fragment>
            <p className='content-margin'>
            This is a map I originally had built for a map contest organized by 
            <a target='_blank' rel='noopener noreferrer' href='https://mapscaping.com/'> MapScaping </a> last December. <b>Click on any of the 
            play buttons next to the line charts to start the animation. </b>This map shows polygons of each physical retail 
            location in the lower Manhattan area of New York City, and transitions through a normal 24hr-day in a span on 10 seconds. 
            Each polygon takes on the opening hours of the location which:
            </p>
            <ul>
              <li>Is within the polygon's bounds, and</li>
              <li>Is open the most time per week compared to others sharing the same polygon</li>
            </ul>
            <p className='content-margin'>
              The delay and duration of transitions for each polygon depend on their opening and closing hours.
              In addition, the line charts describe the number of locations open at any given time, with a total
              and a maximum of open locations per day.
            </p>
            <dl className='data-source'>
              <dt>Data source: </dt>
              <dd>Geometry & Patterns by <a target='_blank' rel='noopener noreferrer' href='https://safegraph.com/'>Safegraph</a></dd>
            </dl>
          </React.Fragment>
        )
      }
    },
    /*{
      type: 'graphics',
      name:'Corruption and Fragile States Indexes',
      class: 'Map',
      path:'cpi-fsi',
      url:'https://raw.githubusercontent.com/noe-lc/about-me/master/src/data/110m_countries.geojson',
      settings: {
        resizeBy: 'style',
        dimensions: { height: undefined, width: undefined },
        projection: 'geoVanDerGrinten'
      },
      description: () => {
        return (
          <React.Fragment>
            <p className='content-margin'>
            This is a map I originally had built for a map contest organized by 
            <a target='_blank' rel='noopener noreferrer' href='https://mapscaping.com/'> MapScaping </a> last December. <b>Click on any of the 
            play buttons next to the line charts to start the animation. </b>This map shows polygons of each physical retail 
            location in the lower Manhattan area of New York City, and transitions through a normal 24hr-day in a span on 10 seconds. 
            Each polygon takes on the opening hours of the location which:
            </p>
            <ul>
              <li>Is within the polygon's bounds, and</li>
              <li>Is open the most time per week compared to others sharing the same polygon</li>
            </ul>
            <p className='content-margin'>
              The delay and duration of transitions for each polygon depend on their opening and closing hours.
              In addition, the line charts describe the number of locations open at any given time, with a total
              and a maximum of open locations per day.
            </p>
            <dl className='data-source'>
              <dt>Data source: </dt>
              <dd>Geometry & Patterns by <a target='_blank' rel='noopener noreferrer' href='https://safegraph.com/'>Safegraph</a></dd>
            </dl>
          </React.Fragment>
        )
      }
    },*/
  ] 
};

/******** GRAPHS AND CHARTS *******/
export const graphsAndCharts =   
{ 
  name: 'Graphs & Charts',
  path:'graphs-and-charts',
  appearanceOrder: 3,
  list: [
    {
      type: 'graphics',
      name:'Reorganizable Treemap ',
      path:'reorganizable-treemap',
      url:'https://raw.githubusercontent.com/noe-lc/about-me/master/src/data/product_data.csv',
      rowConversion: monthRowConversion,
      class: 'ReorgTreemap',
      settings: {
        resizeBy: 'method',
        dimensions: { height: undefined, width: undefined },
        nestingOrder: ['YEAR','DESCRIPTION','WEIGHT'],
        symbolKey: null,
        rollupFn: g => sum( g.map(e => sum(months.map(m => e[m]) )))
      },
      additionalData: [],
      description: ({ descProps }) => { // expects a 2D array to render a legend
        const renderLegend = () => {
          return descProps ? (
            <dl className='desc-legend'>
              <dt>Key:</dt>
              <div className='desc-legend-cont'>
                {descProps.map(([name,backgroundColor]) => 
                  <dd key={name}>
                    <span className='desc-legend-patch' style={{ backgroundColor }}></span>
                    <span className='desc-legend-label'>{name}</span>
                  </dd>
                )}
              </div>               
            </dl>
          ): null;   
        };
        return (
          <React.Fragment>
            {renderLegend()}
            <p className='content-margin'>
              At one of my previous jobs we constantly used treemaps for displaying hierarchical data, and
              I always wanted to build one on which the user could control the order in which the data were nested. <br/>
            </p>
            <p className='content-margin'>
              On this example, <b>you can drag and drop the property name containers above the treemap to change the nesting order. </b> 
              After each update, the key will be modified to reflect the new unique values in the tree's leaves.
            </p>           
          </React.Fragment>
        )
      }
    },
  ] 
};