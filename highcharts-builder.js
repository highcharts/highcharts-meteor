var command,
    path        = Npm.require('path'),
    fs          = Npm.require('fs'),
    mkdirp      = Npm.require('mkdirp'),
    echo        = Npm.require('node-echo'),
    packageDir  = path.resolve('./packages/highcharts-container'),
    prefixPath  = path.resolve('./packages/highcharts-container/meteor-prefix.js'),
    postFixPath = path.resolve('./packages/highcharts-container/meteor-postfix.js'),
    packageJs   = path.resolve('./packages/highcharts-container/package.js'),
    configFile  = path.resolve('./client/config.highcharts.json'),
    clientDir   = path.resolve('./client');

// Don't run on tests and publish:
if (process.argv.length > 2) {
  command = process.argv[2];
  if (command == 'publish' || command == 'test-packages') {
    return; // do nothing
  }
}

// Generate files and paths:
if (!fs.existsSync(clientDir)) {
  mkdirp.sync(clientDir);
}
if (!fs.existsSync(configFile)) {
  fs.writeFileSync(configFile, '{\n  \n}');
}
if (!fs.existsSync(packageDir)) {
  mkdirp.sync(packageDir);
}
if (!fs.existsSync(packageJs)) {
  fs.writeFileSync(packageJs, getFunctionBody(packageJS));
  fs.writeFileSync(prefixPath, getFunctionBody(prefix));
  fs.writeFileSync(postFixPath, getFunctionBody(postfix)); 

  // Add Highcharts package:
  echo.sync("\nhighcharts-container", ">>", ".meteor/packages");

  console.log("Highcharts initialized, please restart Meteor.");
  process.exit(0);
}



// getContent inside a function
function getFunctionBody (func) {
  var lines = func.toString().split('\n'),
      body = lines.slice(1, lines.length - 1); // remove declaration and closing bracket
  
  return body.join('\n');
}

function postfix () {
  var undefined;
  Highcharts = module.exports;
  module = undefined;
}

function prefix () {
  module = {};
  module.exports = {};
}

function packageJS () {
  var minVersion = '4.2.1',
      fs = Npm.require('fs'),
      path = Npm.require('path'),
      npmPath = ['.npm', 'package', 'node_modules', 'highcharts'],
      configFile = path.resolve('./client/config.highcharts.json'),
      where = 'client',
      config = false;

  // Get user options:
  try {
    config = JSON.parse(fs.readFileSync(configFile));
  } catch (err) {
    console.log('Config file: config.highcharts.json doesn\'t exist or is not a proper JSON. Proceeding with the default options.\n', err);
  }

  // Build up options:
  var adapter = config && config.adapter ? config.adapter : 'default',
      base = config && config.base ? config.base : 'highcharts.js',
      modules = config && config.modules ? config.modules : [],
      releaseVersion = config && config.version ? config.version : minVersion,
      modulesLength = modules.length,
      dependency = {},
      files = [],
      i;

  // Hook to highcharts NPM package:
  Npm.depends({
    highcharts: releaseVersion
  });

  // Add modules:
  for (i = 0; i < modulesLength; i++) {
    files.push(npmPath.concat([modules[i]]).join(path.sep));
  }

  Package.describe({
    name: 'highcharts-container',
    version: '1.0.0',
    summary: 'Container for Highcharts build.'
  });

  Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.export('Highcharts');

    // Add config file to force Meteor watch for changes:
    api.addFiles(configFile, where, {isAsset: true});

    // jQuery dependency or Standalone Adapter:
    if (adapter === 'jquery') {
      api.use(adapter);
    } else if (adapter !== 'default') {
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
}