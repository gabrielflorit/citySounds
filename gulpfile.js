var express        = require('express');
var gulp           = require('gulp');
var livereload     = require('gulp-livereload');
var rename         = require('gulp-rename');
var runSequence    = require('run-sequence');
var fileinclude    = require('gulp-file-include');
var sass           = require('gulp-ruby-sass');

var LIVERELOAD_PORT = 35728;
var EXPRESS_PORT = 5000;

// start server
function server(callback) {

	var app = express();
	app.use(express.static(__dirname));
	app.listen(EXPRESS_PORT);

	callback && callback();
}

// start livereload
function startLivereload() {
	var server = livereload(LIVERELOAD_PORT);

	// watch for changes to html and rebuild
	gulp.watch([
		'html/html.html',
	], ['build-html']);

	// watch for changes to scss and recompile
	gulp.watch(['css/*.scss'], function(e) {
		compileStylesheets(e.path);
	});

	// watch for changes and notify livereload
	gulp.watch(['index.html', '.tmp/**/*.css'], function(e) {
		server.changed(e.path);
	});
}

gulp.task('build-html', function() {
	return gulp.src('html/template.html')
		.pipe(fileinclude())
		.pipe(rename('index.html'))
		.pipe(gulp.dest('.'));
});

function compileStylesheets(e) {
	return gulp.src(e)
		.pipe(sass())
		.pipe(gulp.dest('.tmp'));
}

gulp.task('compile-all-stylesheets', function() {
	compileStylesheets('css/*.scss');
});

gulp.task('start-livereload', function(callback) {
	server(startLivereload);

	callback && callback();
});

gulp.task('default', function() {

	runSequence(
		'compile-all-stylesheets',
		'build-html',
		'start-livereload'
	);

});