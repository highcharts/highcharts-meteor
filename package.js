var major = [4, 2, 1],
    minor = 1,
    fix = 10,
    highchartsVersion = [major[0], minor, fix].join('.'),
    highstockVersion = [major[1], minor, fix].join('.'),
    highmapsVersion = [major[2], minor, fix].join('.'),
    releases = {
      // Highcharts (minified) release version:
      'highcharts.js': ['highcharts-release', highchartsVersion],
      // Highstock (minified) release version: 
      'highstock.js': ['highstock-release', highstockVersion],
      // Highmaps (minified) release version:  
      'highmaps.js': ['highmaps-release', highmapsVersion],
      // Highcharts (source) release version: 
      'highcharts.src.js': ['highcharts-release', highchartsVersion],
      // Highstock (source) release version:  
      'highstock.src.js': ['highstock-release', highstockVersion],
      // Highmaps (source) release version: 
      'highmaps.src.js': ['highmaps-release', highmapsVersion] 
    },
    fs = Npm.require('fs'),
    path = Npm.require('path'),
    mkdirp = Npm.require('mkdirp'),
    version = '0.0.1',
    npmPath = ['.npm', 'package', 'node_modules'],
    configFile = path.resolve('client/config.highcharts.json'),
    clientDir = path.resolve('client'),
    where = 'client',
    config = false;

// Get user options:
try {
  config = JSON.parse(fs.readFileSync(configFile));
} catch (err) {
  console.log('Config file: config.highcharts.json doesn\'t exist or is not a proper JSON. Proceeding with the default options.\n', err);
  if (!fs.existsSync(clientDir)) {
    mkdirp.sync(clientDir);
  }
  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, '{\n  \n}');
  }
}

// Build up options:
var adapter = config && config.adapter ? config.adapter : 'jquery',
    base = config && config.base ? config.base : 'highcharts.js',
    modules = config && config.modules ? config.modules : [],
    release = releases[base],
    releaseVersion = config && config.version ? config.version : release[1],
    modulesLength = modules.length,
    dependency = {},
    files = [],
    i;

// Hook to highcharts/highstock/highmaps-release NPM package:
dependency[release[0]] = releaseVersion;
Npm.depends(dependency);

// Update path:
npmPath.push(release[0]);

// Add modules:
for (i = 0; i < modulesLength; i++) {
  files.push(npmPath.concat([modules[i]]).join(path.sep));
}

Package.describe({
  name: 'highcharts:highcharts-meteor',
  version: version,
  summary: 'Official wrapper for Highcharts, Highstock and Highmaps charting libraries.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');
  api.export('Highcharts');

  // Add config file to force Meteor watch for changes:
  api.addFiles(configFile, where, {isAsset: true});

  // jQuery dependency or Standalone Adapter:
  if (adapter === 'jquery') {
    api.use(adapter);
  } else {
    api.addFiles(npmPath.concat(['adapters', adapter]).join(path.sep), where);
  }

  // Add core:
  api.addFiles([
    'meteor-prefix.js',
    npmPath.concat([base]).join(path.sep),
    'meteor-postfix.js'
  ], where);

  // Add modules:
  api.addFiles(files, where);
});

// Tests:
Package.onTest(function(api) {
  api.use('tinytest');
  api.use('highcharts:highcharts-meteor');
  api.addFiles('highcharts-meteor-tests.js');
});