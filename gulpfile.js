'use strict';
/* --------------------
gulp -v
  CLI version 2.0.1
  Local version 4.0.0
---------------------- */

// !!! написан для gulp v.3
// !!! переделать на gulp v.4 !!!

// tools --------------------------------------------------
var gulp            = require('gulp'),
    rimraf          = require('rimraf'),
    rsync           = require('gulp-rsync'),
    gulpif          = require('gulp-if'),
    gutil           = require('gulp-util');

var path = {
    // build ----------------------------------------------
    build: {
        root:       'web_front/build/',
        dest_user:  'ars',
        dest_host:  '192.168.28.18',
        dest_dev:   '/docker_vol/asterisk-ws-build/',
        dest_prod:  '/docker_vol/asterisk-ws-build/',
    },
};

// built flags --------------------------------------------
var buildFlag = {
  production: gutil.env.production ? true : false,
};

var rsyncConfGlob = {
    progress:       	true,
    incremental:    	true,
    relative:       	true,
    emptyDirectories:   true,
    recursive:      	true,
    clean:          	false,
    exclude:        	['.DS_Store', 'README.md', 'node_modules']
};




//                                                          |
//                         tasks                            |
//                                                          |

gulp.task('build:deploy', function() {
    var rsyncConf = {};
    for (var key in rsyncConfGlob) { rsyncConf[key] = rsyncConfGlob[key]; }
    rsyncConf.hostname      = path.build.dest_host;
    rsyncConf.username      = path.build.dest_user;
    rsyncConf.root          = path.build.root;
    rsyncConf.destination   = path.build.dest_dev;

    console.log(path.build.root)
    gulp.src([ path.build.root ])
        .pipe(rsync(rsyncConf));
});


gulp.task('deploy', [
    //'node:deploy:dev',
    'build:deploy'
]);



// -------------------------------------------------------- | default
gulp.task('default', [
    'deploy'
]);
