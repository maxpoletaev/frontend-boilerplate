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
 * Configuration.
 */

var paths = {
  pages: {
    common: ['src/pages/**/*.html', '!src/pages/_**/*.html']
  },
  styles: {
    common: ['src/common/*.styl',    '!src/common/*.ie.styl'],
    blocks: ['src/blocks/**/*.styl', '!src/blocks/*.ie.styl'],
    ie:     ['src/common/*.ie.styl', 'src/blocks/**/*.ie.styl'],
    libs:   ['src/vendor/**/*.css']
  },
  scripts: {
    blocks: ['src/blocks/**/*.js'],
    libs:   ['src/vendor/**/*.js'],
    app:    ['src/app/**/*.js']
  },
  images: {
    blocks: ['src/blocks/**/img/*'],
    pages:  ['src/pages/**/img/*']
  }
};

var data = fs.existsSync('src/data.json')
  ? JSON.parse(fs.readFileSync('src/data.json'))
  : {};

/**
 * Common tasks.
 */

gulp.task('pages.html', function() {
  gulp.src(paths.pages.common)
    .pipe(ejs(data))
    .pipe(beml())
    .pipe(rename(function(dir, base, ext) {
      return '../' + base + ext;
    }))
    .pipe(gulp.dest('build/pages'));
});

gulp.task('pages.images', function() {
  gulp.src(paths.images.pages)
    .pipe(rename(function(dir, base, ext) {
      return '../' + base + ext;
    }))
    .pipe(gulp.dest('build/pages/img'));
});

gulp.task('common.styles', function() {
  gulp.src(paths.styles.common)
    .pipe(stylus({ use: ['nib'] }))
    .pipe(concat('common.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('ie.styles', function() {
  gulp.src(paths.styles.ie)
    .pipe(stylus({ use: ['nib'] }))
    .pipe(concat('ie.css'))
    .pipe(gulp.dest('build/css'));
});

/**
 * Blocks tasks.
 */

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

gulp.task('blocks.images', function() {
  gulp.src(paths.images.blocks)
    .pipe(rename(function(dir, base, ext) {
      return '../' + base + ext;
    }))
    .pipe(gulp.dest('build/img'));
});


/**
 * Libs tasks.
 */

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


/**
 * App tasks.
 */

gulp.task('app.scripts', function() {
  gulp.src(paths.scripts.app)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

/**
 * Shortcuts.
 */

gulp.task('default', [
  'pages.html',
  'pages.images',
  'common.styles',
  'blocks.styles',
  'blocks.scripts',
  'blocks.images',
  'libs.styles',
  'libs.scripts',
  'app.scripts'
]);

gulp.task('pages', [
  'pages.html',
  'pages.images'
]);

gulp.task('blocks', [
  'blocks.styles',
  'blocks.scripts',
  'blocks.images'
]);

gulp.task('libs', [
  'libs.styles',
  'libs.scripts'
]);

gulp.task('app', [
  'app.scripts'
]);

gulp.task('ie', [
  'ie.styles'
]);

/**
 * Watchers.
 */

gulp.task('watch', function() {
  var server = livereload();
  gulp.run('default');

  gulp.watch(paths.pages.common, function() {
    gulp.run('pages');
  });

  gulp.watch(paths.styles.common, function() {
    gulp.run('common.styles');
  });

  gulp.watch(paths.styles.blocks, function() {
    gulp.run('blocks.styles');
  });

  gulp.watch(paths.scripts.blocks, function() {
    gulp.run('blocks.scripts');
  });

  gulp.watch(paths.scripts.app, function() {
    gulp.run('app.scripts');
  });

  gulp.watch(paths.styles.ie, function() {
    gulp.run('ie.styles');
  });
});
