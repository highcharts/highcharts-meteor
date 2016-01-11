var version = '0.2.0';

Package.describe({
  name: 'highcharts:highcharts-meteor',
  version: version,
  summary: 'Official wrapper for Highcharts, Highstock and Highmaps charting libraries.',
  git: 'https://github.com/highcharts/highcharts-meteor.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "generateHighcharts",
  sources: [
    "highcharts-builder.js"
  ],
  npmDependencies: {
    'node-echo': '0.1.1'
  }
});

// Tests:
Package.onTest(function(api) {
  api.use('tinytest');
  api.use('highcharts:highcharts-meteor');
  api.addFiles('highcharts-meteor-tests.js');
});