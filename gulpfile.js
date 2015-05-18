// Include gulp
var gulp = require('gulp');

// Include our plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Default task
gulp.task('default', ['lint', 'minify', 'watch']);

// Lint our code
gulp.task('lint', function() {
	return gulp.src('src/*js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
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
    gulp.watch('src/*.js', ['lint', 'minify']);
});