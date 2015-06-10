// Include gulp
var gulp = require('gulp');

// Include our plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bootlint = require('gulp-bootlint');
var html5lint = require('gulp-html5-lint');
var validator = require('gulp-html');
var checkPages = require('check-pages');

// Default task
gulp.task('default', ['js', 'html', 'bootstrap', 'links', 'minify']);

// Lint our code
gulp.task('js', function() {
	return gulp.src('src/*js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('html', function() {
	return gulp.src(['index.html', 'examples/*.html'])
	.pipe(html5lint());
	//.pipe(validator())
	//.pipe(gulp.dest('validation/'));
});

gulp.task('bootstrap', function() {
	gulp.src(['index.html', 'examples/*.html'])
	.pipe(bootlint());
});

// Minify our JS
gulp.task('minify', function() {
    return gulp.src('src/*.js')
    	.pipe(uglify())
        .pipe(rename('bootstrap-wysiwyg.min.js'))
        .pipe(gulp.dest('js'));
});

// Check for broken and invalid links in the web pages
gulp.task('links', function(callback) {
	var options = {
		pageUrls: [
			'index.html',
			'examples/**/*.html'
		],
		checkLinks: true,
		summary: true
	};

	checkPages(console, options, callback);
});


// Watch files for changes
gulp.task('watch', function() {
    gulp.watch(['src/*.js', 'index.html', 'examples/*.html'], ['js', 'html', 'bootstrap', 'links', 'minify']);
});