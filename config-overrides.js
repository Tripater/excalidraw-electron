const { override } = require('customize-cra');
const path = require('path');

module.exports = override((config) => {
  config.resolve = {
	...config.resolve,
	extensions: ['.js', '.json', '.jsx', '.css'],
	fullySpecified: false, // Disable fully specified ESM imports
	alias: {
	  'roughjs/bin/rough': path.resolve(__dirname, 'node_modules/roughjs/bin/rough.js'),
	  'roughjs/bin/math': path.resolve(__dirname, 'node_modules/roughjs/bin/math.js'),
	  'roughjs/bin/generator': path.resolve(__dirname, 'node_modules/roughjs/bin/generator.js')
	}
  };
  return config;
});
