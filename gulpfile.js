var version = 'v1.0.2';
var copyright = '/** ' + version + ' **/ ';

var gulp = require('gulp');
var exec = require('child_process').exec;

/* Build Production Files */
gulp.task('build', ['build_lib', 'build_full']);

// Production file with dependencies in one
gulp.task('build_full', function() {
    var uglify = require('gulp-uglify');
    var concat = require('gulp-concat');
    var insert = require('gulp-insert');

    gulp.src([
        'bower_components/jquery.hotkeys/jquery.hotkeys.js',
        'bower_components/bootstrap-wysiwyg/js/bootstrap-wysiwyg.min.js'
    ])
        .pipe(concat('full.wysiwyg-core.min.js'))
        .pipe(uglify())
        .pipe(insert.prepend(copyright))
        .pipe(gulp.dest('dist'));
});

// The library alone
gulp.task('build_lib', function() {
    var uglify = require('gulp-uglify');
    var concat = require('gulp-concat');
    var insert = require('gulp-insert');

    gulp.src('bower_components/bootstrap-wysiwyg/js/bootstrap-wysiwyg.min.js')
        .pipe(concat('wysiwyg-core.min.js'))
        .pipe(insert.prepend(copyright))
        .pipe(gulp.dest('dist'));
});

/* Initialize Development Environment */
// Must have node, bower, and gulp installed
gulp.task('init', ['install']);

gulp.task('install', function() {
    exec('npm install');
    exec('bower install');
});

/* Default builds production files */
gulp.task('default', ['build']);