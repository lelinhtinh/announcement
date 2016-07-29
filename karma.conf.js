module.exports = function(config) {
  config.set({
    frameworks: ['qunit'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/*.js',
      'test/setup.js',
      'test/spec/*.js',
      'demo/*.js'
    ],
    preprocessors: {
      'src/*.js': ['jshint', 'eslint'],
      'test/setup.js': ['jshint', 'eslint'],
      'test/spec/*.js': ['jshint', 'eslint'],
      'demo/*.js': ['jshint', 'eslint']
    },
    jshintPreprocessor: {
      jshintrc: '.jshintrc'
    },
    eslint: {
      showWarnings: true,
      engine: {
        configFile: '.eslintrc.json'
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS', 'Firefox'],
    singleRun: false,
    concurrency: Infinity
  });
};
