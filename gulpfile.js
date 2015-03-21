'use strict';
var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha'),
	fs = require('fs'),
	rename = require('gulp-rename'),
	jsdoc = require("gulp-jsdoc"),
  jsdoc2md = require("gulp-jsdoc-to-markdown");

		
gulp.task('lint', function() {
	return gulp.src(['*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  return gulp.src('test/*.js').pipe(mocha());
});


// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('<%= jshint.js.src %>', ['lint']);
  gulp.watch(['<%= jshint.js.src %>', '<%= jshint.test.src %>'], ['lint', 'test']);
});

gulp.task('docs:html', function() {
  gulp.src("./lib/*.js")
    .pipe(jsdoc('./doc/html'))
});
gulp.task("docs:md", function() {
  return gulp.src("lib/*.js")
    .pipe(jsdoc2md())
    .on("error", function(err) {
      gutil.log(gutil.colors.red("jsdoc2md failed"), err.message)
    })
    .pipe(rename(function(path) {
      path.extname = ".md";
    }))
    .pipe(gulp.dest("./doc/md"));
});

gulp.task('default', ['lint', 'test', 'watch']);
gulp.task('doc', ['docs:md', 'docs:html']);
