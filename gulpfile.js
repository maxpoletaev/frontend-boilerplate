var gulp       = require('gulp');
var beml       = require('gulp-beml');
var ejs        = require('gulp-ejs');
var rename     = require('gulp-rename');
var concat     = require('gulp-concat');
var stylus     = require('gulp-stylus');
var uglify     = require('gulp-uglify');
var livereload = require('gulp-livereload');

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
    libs:   ['src/vendor/**/*.js']
  }
}

/**
 * Tasks
 */

gulp.task('pages', function() {
  gulp.src(paths.pages.common)
    .pipe(ejs())
    .pipe(beml())
    .pipe(rename(function(dir, base, ext) {
      return '../' + base + ext;
    }))
    .pipe(gulp.dest('build/pages'));
});

gulp.task('styles.common', function() {
  gulp.src(paths.styles.common)
    .pipe(stylus({ use: ['nib'] }))
    .pipe(concat('common.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('styles.blocks', function() {
  gulp.src(paths.styles.blocks)
    .pipe(stylus({ use: ['nib'] }))
    .pipe(concat('blocks.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('styles.libs', function() {
  gulp.src(paths.styles.libs)
    .pipe(stylus({ use: ['nib'] }))
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('scripts.libs', function() {
  gulp.src(paths.scripts.libs)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('scripts.blocks', function() {
  gulp.src(paths.scripts.blocks)
    .pipe(concat('blocks.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

/**
 * Shortcuts
 */

gulp.task('default', [
  'pages', 'styles.common', 'styles.blocks', 'styles.libs', 'scripts.libs', 'scripts.blocks'
]);

gulp.task('blocks', [
  'pages', 'styles.blocks', 'scripts.blocks'
]);

gulp.task('libs', [
  'styles.libs', 'scripts.libs'
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
    gulp.run('styles.common');
  });

  gulp.watch('src/blocks/**/*.styl', function() {
    gulp.run('styles.blocks');
  });

  gulp.watch('src/blocks/**/*.js', function() {
    gulp.run('scripts.blocks');
  });

});
