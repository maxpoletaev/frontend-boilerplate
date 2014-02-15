var fs = require('fs')
  , gulp = require('gulp')
  , ejs = require('gulp-ejs')
  , beml = require('gulp-beml')
  , rename = require('gulp-rename')
  , concat = require('gulp-concat')
  , stylus = require('gulp-stylus')
  , uglify = require('gulp-uglify')
  , livereload = require('gulp-livereload');

/**
 * Configuration
 */

var paths = {
  pages: {
    common: ['src/pages/**/*.html']
  },
  styles: {
    common: ['src/common/*.styl'],
    blocks: ['src/blocks/**/*.styl'],
    libs:   ['src/vendor/**/*.styl']
  },
  scripts: {
    blocks: ['src/blocks/**/*.js'],
    libs:   ['src/vendor/**/*.js'],
    app:    ['src/app/**/*.js']
  }
};

var data = fs.existsSync('src/data.json')
  ? JSON.parse(fs.readFileSync('src/data.json'))
  : {};

/**
 * Tasks
 */

gulp.task('pages', function() {
  gulp.src(paths.pages.common)
    .pipe(ejs(data))
    .pipe(beml())
    .pipe(rename(function(dir, base, ext) {
      return '../' + base + ext;
    }))
    .pipe(gulp.dest('build/pages'));
});

gulp.task('common.styles', function() {
  gulp.src(paths.styles.common)
    .pipe(stylus({ use: ['nib'] }))
    .pipe(concat('common.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('blocks.styles', function() {
  gulp.src(paths.styles.blocks)
    .pipe(stylus({ use: ['nib'] }))
    .pipe(concat('blocks.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('blocks.scripts', function() {
  gulp.src(paths.scripts.blocks)
    .pipe(concat('blocks.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('libs.styles', function() {
  gulp.src(paths.styles.libs)
    .pipe(stylus({ use: ['nib'] }))
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('libs.scripts', function() {
  gulp.src(paths.scripts.libs)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('app.scripts', function() {
  gulp.src(paths.scripts.app)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

/**
 * Shortcuts
 */

gulp.task('default', [
  'pages',
  'common.styles',
  'blocks.styles',
  'blocks.scripts',
  'libs.styles',
  'libs.scripts',
  'app.scripts'
]);

gulp.task('blocks', [
  'pages',
  'blocks.styles',
  'blocks.scripts'
]);

gulp.task('libs', [
  'libs.styles',
  'libs.scripts'
]);

gulp.task('app', [
  'app.scripts'
]);

/**
 * Watchers
 */

gulp.task('watch', function() {
  var server = livereload();
  gulp.run('default');

  gulp.watch('src/pages/**/*.html', function() {
    gulp.run('pages');
  });

  gulp.watch('src/common/*.styl', function() {
    gulp.run('common.styles');
  });

  gulp.watch('src/blocks/**/*.styl', function() {
    gulp.run('blocks.styles');
  });

  gulp.watch('src/blocks/**/*.js', function() {
    gulp.run('blocks.scripts');
  });

  gulp.watch('src/app/**/*.js', function() {
    gulp.run('app.scripts');
  });
});
