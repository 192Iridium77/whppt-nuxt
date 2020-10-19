const { resolve, join } = require('path');
const glob = require('glob');

export default function WhpptNuxtModule(moduleOptions) {
  moduleOptions.apiPrefix = moduleOptions.apiPrefix || 'api';

  const options = {
    ...moduleOptions,
    ...this.options.whppt,
  };

  const pluginsToSync = [
    'components/index.js',
    'plugins/index.js',
    'plugins/pluginDefaults.js',
    'store/index.js',
    'util/index.js',
  ];

  for (const pathString of pluginsToSync) {
    this.addPlugin({
      src: resolve(__dirname, pathString),
      fileName: join('whppt-nuxt', pathString),
      options,
    });
  }

  const self = this;

  const copyDirectory = function(dir) {
    const pattern = `${__dirname}/${dir}/**/*.{js,vue}`;
    const directoryOptions = {
      ignore: [],
    };

    const files = glob.sync(pattern, directoryOptions);

    for (const file of files) {
      self.addTemplate({
        src: file,
        fileName: join('whppt-nuxt', file.replace(`${__dirname}/`, '')),
        options,
      });
    }
  };

  copyDirectory('components');
  copyDirectory('store');
  copyDirectory('plugins');
  copyDirectory('util');
}

module.exports.meta = require('../package.json');