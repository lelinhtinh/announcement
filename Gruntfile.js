module.exports = function(grunt) {

    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON('package.json'),

        // Banner definitions
        meta: {
            banner: [
                '/*!',
                '*  <%= pkg.name %> - v<%= pkg.version %>',
                '*  <%= pkg.description %>',
                '*  <%= pkg.homepage %>',
                '*',
                '*  Made by <%= pkg.author.name %>',
                '*  Under <%= pkg.license %> License',
                '*/'
            ].join('\n')
        },

        // Concat definitions
        concat: {
            dist: {
                src: ['src/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            options: {
                banner: '<%= meta.banner %>'
            }
        },

        // Lint definitions
        jshint: {
            files: ['src/<%= pkg.name %>.js', 'test/**/*', 'demo/script.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        eslint: {
            target: ['src/<%= pkg.name %>.js', 'test/**/*', 'demo/script.js'],
            options: {
                configFile: '.eslintrc.json'
            }
        },

        // Minify definitions
        uglify: {
            dist: {
                src: ['dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.min.js'
            },
            options: {
                banner: '<%= meta.banner %>'
            }
        },

        // Less definitions
        less: {
            dist: {
                src: ['src/<%= pkg.name %>.less'],
                dest: 'dist/<%= pkg.name %>.css'
            },
            options: {
                plugins: [
                    new(require('less-plugin-autoprefix'))({ browsers: ['> 3%'] }),
                    new(require('less-plugin-clean-css'))({ advanced: true })
                ],
                compress: true,
                banner: '<%= meta.banner %>'
            }
        },

        // karma test runner
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                singleRun: false,
                browsers: ['PhantomJS', 'Firefox']
            },

            //continuous integration mode: run tests once in PhantomJS browser.
            travis: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        // watch for changes to source
        // Better than calling grunt a million times
        // (call 'grunt watch')
        watch: {
            files: ['src/*', 'test/**/*'],
            tasks: ['default']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('lint', ['jshint', 'eslint']);
    grunt.registerTask('build', ['concat', 'uglify', 'less']);
    grunt.registerTask('travis', ['lint', 'karma:travis']);
    grunt.registerTask('default', ['lint', 'build', 'karma:unit:run']);
};
