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
      `Creation and testing of GIS workflows, in order to migrate them into the latest
      version available (ArcMap/ArcGIS Pro and Drone2Map)`,
      `Searching and updating content used in internal and external publications through web scraping`,
      `Updating, analyzing a database of global indicators to create thematic cartography for marketing planning purposes`
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
    { name: 'Spanish', level: 'Native Speaker' },
    { name: 'English', level: 'Advanced' },
  ],
  software: [
    { name: 'Microsoft Office', subList: ['Excel','Word','PowerPoint','Visio','Access'] },
    { name: 'ArcGIS', subList: ['ArcMap','ArcGIS Pro','ArcGIS Online','Portal','Insights','Story Maps'] },
    { name: 'QGIS', sublist: [] },
    { name: 'AutoCAD', subList: [] },
    { name: 'Tableau', subList: [] },
  ],
  programming: [
    { name: 'HTML', level: 'Advanced' },
    { name: 'CSS', level: 'Advanced' },
    { name: 'JavaScript', level: 'Advanced', sublist: ['React','Redux','D3','Google Maps API','Turf','ArcGIS API'] },
    { name: 'Python', level: 'Intermediate', sublist: ['GDAL','Pandas','Numpy','Scikit Learn','ArcPy'] },
    { name: 'SQL', level: 'Intermediate', sublist: ['MySQL','PostgreSQL'] },
  ],
  other: ['Git']
};