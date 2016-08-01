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
            'src/*.js': ['eslint'],
            'test/**/*.js': ['eslint'],
            'demo/*.js': ['eslint']
        },
        eslint: {
            engine: {
                configFile: '.eslintrc.json'
            },
            showWarnings: true,
            stopOnError: false
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS', 'Firefox'],
        singleRun: false,
        concurrency: Infinity
    });
};
