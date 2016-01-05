//Karma configuration
//Generated on Mon Dec 02 2013 16:48:11 GMT-0500 (EST)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../..',

        // frameworks to use
        frameworks: ['jasmine'],

        plugins: [
                  'karma-jasmine',
                  'karma-phantomjs-launcher',
                  'phantomjs'
                  ],

                  // list of files / patterns to load in the browser
                  files: [
                          'lib/angular.js',
                          'lib/angular-mocks.js',
                          // Our code
                          'src/main/javascript/init.js',
                          'src/main/javascript/*.js',
                          // All the tests and test utilities
                          'src/test/javascript/*.js'
                          ],

                          // list of files to exclude
                          exclude: [
                                    ],

                                    // test results reporter to use
                                    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
                                    reporters: ['progress'],


                                    // web server port
                                    port: 9876,

                                    // enable / disable colors in the output (reporters and logs)
                                    colors: true,

                                    // level of logging
                                    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
                                    logLevel: config.LOG_INFO,

                                    // enable / disable watching file and executing tests whenever any file changes
                                    autoWatch: true,

                                    // Start these browsers, currently available:
                                    // - Chrome
                                    // - ChromeCanary
                                    // - Firefox
                                    // - Opera (has to be installed with `npm install karma-opera-launcher`)
                                    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
                                    // - PhantomJS
                                    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
                                    browsers: ['PhantomJS'],

                                    // If browser does not capture in given timeout [ms], kill it
                                    captureTimeout: 60000,

                                    // Continuous Integration mode
                                    // if true, it capture browsers, run tests and exit
                                    singleRun: true
    });
};
