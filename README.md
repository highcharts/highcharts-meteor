Official Meteor wrapper for Highcharts, Highstock and Highmaps libraries.

## Installation
To install wrapper, simply run:

    meteor add highcharts:highcharts-meteor

## Configuration
By default only Highcharts library, without any extra modules, is loaded. In `client` folder, open `config.highcharts.json` file and setup options. For example:

```js
{
	"version": "4.2.0",		 	// Choose version of Highcharts/Highstock/Highmaps.
	"base": "highcharts.js",	// Choose base, can be "highcharts.js", "highstock.js" or "highmaps.js"
	"adapter": "default",		// Choose adapter, e.g. "jquery" or "standalone-framework.js".
	"modules": [				// Choose modules to be installed altogether with main library.
		"highcharts-3d.src.js",
		"modules/exporting.js",
		"modules/heatmap.js",
		"modules/drilldown.js",
		"themes/gray.js"
	]
}
```

Since wrapper is based on NPM package from [Highcharts](https://www.npmjs.com/package/highcharts), you can find structure of modules on the [github page](https://github.com/highcharts/highcharts). **Note: NPM package is supported since 4.1.10**. 

Since Highcharts version **4.2.0**, Highcharts will come with built-in adapter. That means `adapter` is not necessary to be set anymore.

## Usage

That's all, you have access on the `client` side to Highcharts namespace. You can create charts in a standard way, as always.

## Debugging

You can load source files, instead of minified for debugging. Simply change `.js` to `.src.js` in the config file, for example:

```json
{
	"version": "4.1.10",
	"base": "highstock.src.js",
	"adapter": "jquery",
	"modules": [
		"highcharts-3d.src.js"
	]
}
```