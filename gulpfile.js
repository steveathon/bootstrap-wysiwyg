// Include gulp
var gulp = require('gulp');

// Include our plugins
var jshint = require('gulp-jshint');
var bootlint = require('gulp-bootlint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Default task
gulp.task('default', ['lintJS', 'lintBS', 'minify', 'watch']);

// Lint our JavaScript files
gulp.task('lintJS', function() {
	return gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Lint our Bootstrap files
gulp.task('lintBS', function() {
	return gulp.src(['*.html', 'examples/*.html'])
	.pipe(bootlint());
});

// Minify our JS
gulp.task('minify', function() {
    return gulp.src('src/*.js')
    	.pipe(uglify())
        .pipe(rename('bootstrap-wysiwyg.min.js'))
        .pipe(gulp.dest('js'));
});

// Watch files for changes
gulp.task('watch', function() {
    gulp.watch(['src/*.js', '*.html', 'examples/*.html'], ['lintJS', 'lintBS', 'minify']);
});