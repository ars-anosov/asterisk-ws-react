'use strict';
/* --------------------
gulp -v
  CLI version 2.0.1
  Local version 4.0.0
---------------------- */

// tools --------------------------------------------------
const gulp            = require('gulp')
const rimraf          = require('rimraf')
const gulpif          = require('gulp-if')
const args            = require('yargs').argv

// web-front ----------------------------------------------
const prefixer        = require('gulp-autoprefixer')
const terser          = require('gulp-terser') // Warn: Please use gulp-terser instead of gulp-uglifyes
const sass            = require('gulp-sass')
const sourcemaps      = require('gulp-sourcemaps')
const rigger          = require('gulp-rigger')
const cssmin          = require('gulp-clean-css')
const browserify      = require('browserify')
const babelify        = require('babelify')
const source          = require('vinyl-source-stream')
const buffer          = require('vinyl-buffer')

// built flags --------------------------------------------
var buildFlag = {
  production: args.production ? true : false,
  sourcemap:  args.sourcemap ? true : false
}
console.log('args:')
console.log(buildFlag)

if (buildFlag.production) { process.env.NODE_ENV = 'production' }

var path = {
    // html -----------------------------------------------
    src: {
      html:       'src/*.*',
      js:         'src/js/',
      jsx:        ['root_app.jsx'],
      scss:       'src/style/*.*css',
      img:        'src/img/**/*.*',
      fonts:      'src/fonts/**/*.*',
      blockly:    'src/blockly12/**/*.*',
    },
    build: {
      html:       'build/',
      js:         'build/js/',
      css:        'build/css/',
      img:        'build/img/',
      fonts:      'build/fonts/',
      blockly:    'build/blockly12/',
    },
    watch: {
      html:       ['src/*.html', 'src/templates/*.html'],
      jsx:        ['src/js/*.js*', 'src/js/components/*.js*', 'src/js/containers/*.js*', 'src/js/reducers/*.js*', 'src/js/store/*.js*', 'src/js/actions/*.js*', 'src/js/constants/*.js*', 'src/js/enhancers/*.js*'],
      scss:       ['src/style/**/*.*css'],
      img:        ['src/img/**/*.*'],
      fonts:      ['src/fonts/**/*.*'],
      blockly:    ['src/blockly12/**/*.*'],
    },
    clean:          'build/*',
}









//                                                          |
//                         tasks                            |
//                                                          |

// -------------------------------------------------------- | clean
gulp.task('clean', (cb) => {
  rimraf( path.clean, cb )
});

// -------------------------------------------------------- | build
gulp.task('html:build', (cb) => {
  gulp.src(path.src.html) 
    .pipe( rigger() )
    .pipe( gulp.dest(path.build.html) )
  cb()
});

gulp.task('jsx:build', (cb) => {
  // .js files (vanila js) if exists
  /*
  gulp.src(path.src.js+'*.js') 
    .pipe( rigger() ) 
    .pipe( gulpif( buildFlag.sourcemap, sourcemaps.init({loadMaps: true}) ) ) 
    .pipe( terser() ) 
    .pipe( gulpif( buildFlag.sourcemap, sourcemaps.write('./maps') ) ) 
    .pipe( gulp.dest(path.build.js) )
  */

  // .jsx (ES6 and JSX)
  path.src.jsx.map ( (row, i) => {
    browserify({
      entries: path.src.js+row,
      extensions: ['.js', '.jsx'],                                            // какие файлы будет обрабатывать browserify
      //noParse: [require.resolve('template for future use')],
      debug: false                                                            // debug заставляет browserify строить sourcemaps. На входе файл "path.src.jsx"
    })
      .transform('babelify', {
        'presets': ["@babel/preset-env", "@babel/preset-react"],
        //'plugins': ["babel-plugin-transform-undefined-to-void"]
        }
      )                     // babel + presets
      .bundle()                                                               // эта херня выдает "text stream"
      .pipe( source( row.replace(/\.jsx/i, '\.js') ) )                        // конвертируем в "vinyl stream". Теперь большинство gulp-плагинов подцепятся к stream.
      
      .pipe( gulpif( buildFlag.production, buffer() ) )                       // Плагину uglify (теперь использую плагин terser) нужен "buffered vinyl file object". Конвертируем.
      .pipe( gulpif( buildFlag.sourcemap, sourcemaps.init({loadMaps: true}) ) )
      .pipe( gulpif( buildFlag.production, terser() ) )
      .pipe( gulpif( buildFlag.sourcemap, sourcemaps.write('./maps') ) )

      .pipe( gulp.dest(path.build.js) )
  })
  cb()
})

gulp.task('scss:build', (cb) => {
  gulp.src(path.src.scss)
    .pipe( gulpif( buildFlag.sourcemap, sourcemaps.init({loadMaps: true}) ) )
    .pipe( sass({sourceMap: true, errLogToConsole: true}) )
    .pipe( rigger() )
    .pipe( prefixer() )
    .pipe( cssmin() )
    .pipe( gulpif( buildFlag.sourcemap, sourcemaps.write('./maps') ) )
    .pipe( gulp.dest(path.build.css) )
  cb()
})

gulp.task('image:build', (cb) => {
  gulp.src(path.src.img) 
    .pipe( gulp.dest(path.build.img) )
  cb()
})

gulp.task('fonts:build', (cb) => {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
  cb()
})

gulp.task('blockly:build', (cb) => {
  gulp.src(path.src.blockly)
    .pipe(gulp.dest(path.build.blockly))
  cb()
})








// -------------------------------------------------------- | default
gulp.task('build', gulp.parallel(
  'html:build',
  'jsx:build',
  'scss:build',
  'fonts:build',
  'image:build',
  'blockly:build'
))

gulp.task('default', gulp.series(
  'build'
))









// -------------------------------------------------------- | watch
gulp.watch(path.watch.html,  gulp.series('html:build'))
gulp.watch(path.watch.scss,  gulp.series('scss:build'))
gulp.watch(path.watch.jsx,   gulp.series('jsx:build'))
gulp.watch(path.watch.img,   gulp.series('image:build'))
gulp.watch(path.watch.fonts, gulp.series('fonts:build'))
gulp.watch(path.watch.html,  gulp.series('html:build'))
gulp.watch(path.watch.blockly, gulp.series('blockly:build'))