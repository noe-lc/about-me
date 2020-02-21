import React from 'react';
import { sum } from '../scripts/utils';

const months = [1,2,3,4,5,6,7,8,9,10,11,12];
const monthRowConversion = r => ({ 
  ...r, 
  ...Object.fromEntries(months.map(m => [m,+r[m]]))
});

export const urls = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/noe-landaverde-28245aa2/' },
  { name: 'Resume', url:'https://github.com/noe-lc/about-me/raw/gh-pages/files/Resume.pdf' }
];

export const educationData = [
  { 
    term: ['2009-01-01','2014-01-01'],
    icon: 'uaslp',
    level: "Bachelor's Degree",
    programme: 'BE Geomatics Engineering',
    institutionName: 'Autonomous University of San Luis Potosi',
    city: 'San Luis Potosí, SLP, Mexico',
    thesisTopic: 'Web Application for Public Transportation Inquiring'
  },
  { 
    term: ['2009-01-01','2014-01-01'],
    icon: 'itc',
    level: "Master of Science",
    programme: 'MSc Geoinformation Science and Earth Observation',
    institutionName: 'Faculty of Geoinformation Science and Earth Observation (ITC), University of Twente',
    city: 'Enschede, The Netherlands',
    thesisTopic: 'A Conceptual Framework for Interactive Cartographic Storytelling'
  },
];

export const experienceData = [
  { 
    term: ['2019-01-07','2020-01-07'],
    title: 'Geoinformatics Developer',
    icon: 'datalabmx',
    companyName: 'DataLab MX',
    city: 'Mexico City, Mexico',
    description: 'Developer of web applications for interactive data and cartographic visualization', 
    details: [
      `Platforms for visualizing service issues and user reports for major transportation service providers`,
      `Interactive web maps which located and provided details about public reports on issues 
       related to safety, utilities, and other services provided by the government`,
      `Use of HERE and ArcGIS APIs for geocoding and reverse geocoding large datasets. Obtained results
      were matched and paired up to official datasets via a Natural Language Processing method`,
      `Automation and preprocessing of GIS data prior to its insertion into database tables`
    ]
  },
  { 
    term: ['2018-06-04','2020-11-16'],
    title: 'Intern', 
    companyName: 'Environmental Systems Research Institute (ESRI)', 
    icon: 'esri',
    city: 'Redlands, California',
    description: 'Supported the now GIS Industry Solutions division on tasks related to Marketing and Statistics',
    details: [
      `Creation and testing of GIS workflows, in order to migrate them into the latest software
      version available (ArcMap/ArcGIS Pro and Drone2Map)`,
      `Searching and updating content used in internal and external publications through web scraping`,
      `Updating & analyzing a database of global indicators to create thematic cartography for marketing planning purposes`
    ]
  },
  { 
    term: ['2015-09-02','2016-09-05'],
    title: 'Part-time Teacher', 
    companyName: 'Autonomous University of San Luis Potosi (UASLP)',
    icon: 'uaslp',
    city: 'San Luis Potosi, SLP, MX', 
    description: `Part-time teacher & member of the Geoinformatics Academic Board. During that
      year I taught four subjects and gave courses and seminars on new trends and technologies
      related to the programme/profession`,
    details: [
      'Introduction to Geoinformatics','Fundamentals of Geographic Information Systems',
      'Fundamentals of Remote Sensing','Applications of Geographic Information Systems'
    ]
  },
  { 
    term: ['2014-05-02','2014-08-02'],
    title: 'Cartography Technician',
    icon: 'implan',
    companyName: 'Municipal Institute of Planning (IMPLAN)', 
    city: 'San Luis Potosi, SLP, MX',
    description: `Three-month project, during which our team was able to update and rectify cadastral
    and thematic cartography & databases of the metropolitan area of the San Luis Potosí city`,
    details: []
  },
];

export const skillsLangData = {
  languages: [
    { name: 'Spanish (Native speaker)', level: '' },
    { name: 'English', level: 6 },
  ],
  programming: [
    { name: 'HTML', level: 5, color: '#00aeef' },
    { name: 'CSS', level: 5, color: '#fa568f' },
    { name: 'JavaScript', level: 5, color: '#e6c301',  sublist: ['React','Redux','D3','Google Maps API','Turf','ArcGIS API'] },
    { name: 'Python', level: 5, color: '#606060', sublist: ['GDAL','Pandas','Numpy','Scikit Learn','ArcPy'] },
    { name: 'SQL', level: 4, sublist: ['MySQL','PostgreSQL'] },
    { name:'Git', level: 3 }
  ],
  software: [
    { name: 'Microsoft Office', sublist: ['Excel','Word','PowerPoint','Visio','Access'] },
    { name: 'ArcGIS', sublist: ['ArcMap','ArcGIS Pro','ArcGIS Online','Portal','Insights','Story Maps'] },
    { name: 'QGIS', sublist: [] },
    { name: 'Tableau', sublist: [] },
    { name: 'AutoCAD', sublist: [] },
  ]
};

export const portfolioData = [ // these paths are preceded by portfolio/
  { 
    name: 'Maps', 
    path: 'maps', 
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
              <p>
              This is a map I originally had built for a map contest organized by 
              <a target='_blank' href='https://mapscaping.com/'> MapScaping </a> last December. It shows polygons of each physical retail location in the lower Manhattan
              area of New York City, and transitions through a normal 24hr-day in a span on 10 seconds. 
              Each polygon takes on the opening hours of the location which:
              </p>
              <ul>
                <li>Is within the polygon's bounds, and</li>
                <li>Is open the most time per week compared to others sharing the same polygon</li>
              </ul>
              <p>
                The delay and duration of transitions for each polygon depend on their opening and closing hours.
                Furthermore, the line charts describe the number of locations open at any given time, with a total
                and a maximum of open locations per day.
              </p>
              <dl className='data-source'>
                <dt>Data source: </dt>
                <dd>Geometry & Patterns by <a target='_blank' href='https://safegraph.com/'>Safegraph</a></dd>
              </dl>
            </React.Fragment>
          )
        }
      },
    ] 
  },
  { 
    name: 'Graphs & Charts',
    path:'graphs-and-charts', 
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
  },
  { 
    name: 'Web Apps', 
    path:'web-apps', 
    list: [
      {
        type: 'fixed',
        name:'Public Reports',
        content: () => {
          return <iframe className='app-video' src="https://player.vimeo.com/video/392540452" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>

        },
        description: () => {
          return (
            <div className='flex-divider'>
              <div className='flex-3'>
                <h3>Description</h3>
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
                  <li>Managing layer visibility at different zoom levels <sup>*</sup></li>
                  <li>Spatial filtering at street and block level on drag events <sup>*</sup></li>
                  <li>Leveraging the marker clustering library to add color codes, and cluster features not only by proximity, but by attributes as well.</li>
                  <li>Creating custom overlays and make them act as proportional symbols</li>
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
                  <li><a target='_blank' href='https://github.com/gmaps-marker-clusterer/gmaps-marker-clusterer'>Google Maps Marker Clustering</a></li>
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
          return <iframe className='app-video' src="https://player.vimeo.com/video/392540761" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
        },
        description: () => {
          return (
            <div className='flex-divider'>
              <div className='flex-3'>
                <h3>Description</h3>
                <p className='content-margin'>
                  As a way of keeping track and following service issues (reported on Social Media by users), our organization
                  devised a framework for classifying and organizing them so that the data could be visualized in different ways, namely:
                  Summary Tables, Rankings, Bar Charts (constructed on nominal and time dimensions), a Treemap, and a Map.
                </p>
                <p className='content-margin'>
                  In addition, custom and highly interactive filters were built for the data itself was content-rich and
                  required detailed exploration. To further support this, components were contained to maintain consistent updates
                  such as those found in dashboards.
                </p>
              </div>
              <div className='flex-3'>
                <h3>Challenges</h3>
                <ol className='app-video-listing'>
                  <li>Finding a data structure that could be reused by as many components as possible</li>
                  <li>Using these data structures to reflect updates and data availability on the filters (e.g. graying out or disabling controls)</li>                
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
              <iframe className='app-video'  src="https://player.vimeo.com/video/393004335"  frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
              <iframe className='app-video'  src="https://player.vimeo.com/video/392995897"  frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
            </React.Fragment>    
          )
        },
        description: () => {
          return (
            <div className='flex-divider'>
              <div className='flex-3'>
                <h3>Description</h3>
                <p className='content-margin'>
                  We created a couple of applications for geolocating and "tracking" incidences in Mexico City. It was decided
                  that we would have the qualitative and spatial concerns separate, these are contained respectively in the videos above.
                </p>
                <p>
                  The first application consists of a summary table, a treemap and a segmented bar chart. The user can click the elements to
                  filter and explore the entries belonging to it. More details of the data are provided in a modal and other sections where each
                  event is presented separately, and clicking on a link will take the user to the second app via <code><a target='_blank' href='https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage'>postMessage</a></code>. 
                  This window method allowed us to send the current state of the filters as well as the selected incidence, in order to apply these changes on component mounting.
                </p>
                <p>
                  Each incidence was linked to official data sources, media content, and more importantly, related 
                  events that followed the first one registered. We included polygon data layers and a heatmap to help
                  authorities find hotspots and identify sectors which required attention.
                </p>
              </div>
              <div className='flex-3'>
                <h3>Challenges</h3>
                <ol className='app-video-listing'>
                  <li>Fine-tuning the order of execution to accomodate the changes sent from the other application, regardless the window was open or not</li>
                  <li>Sharing state and component methods with the map, sidebar, and filters</li>
                  <li>Finding features with the same coordinates and symbolizing them differently including the number of features</li>
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
    messages: [
      {
        type: 'warning',
        text: `Unfortunately I cannot provide a very detailed description, nor the links to the web applications
        showcased below. A lot of text and media content are either blurred out, pixelated, or even censored. This
        is due to the data behind them which was deemed to be sensitive to external users. However, they do a good job in
        showing their overall functionality, design, and interactive capabilities; more information regarding
        the tools used and the challenges faced while building them is in the description below the videos.`
      }
    ] 
  }
];

// subway
// Georef
//<iframe  width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
