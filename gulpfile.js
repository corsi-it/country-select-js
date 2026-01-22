var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var prefix = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');

gulp.task('scss', function () {
	return gulp.src('./src/scss/countrySelect.scss')
		.pipe(sass({ errLogToConsole: true  }))
		.pipe(prefix())
		.pipe(cleanCSS({compatibility: 'ie8', format: {
			breaks: {
				afterAtRule: true,
				afterBlockBegins: true,
				afterBlockEnds: true,
				afterComment: true,
				afterProperty: true,
				afterRuleBegins: true,
				afterRuleEnds: true,
				beforeBlockEnds: true,
				betweenSelectors: true
			},
			indentBy: 1,
			indentWith: 'tab' }, level: 0}))
		.pipe(gulp.dest('./build/css'))
		.pipe(notify("styles compiled"));
});

gulp.task('js', function () {
	return gulp.src('./src/js/countrySelect.js')
		.pipe(gulp.dest('./build/js'))
		.pipe(notify("javascript updated"));
});

gulp.task('handle-sources', gulp.parallel('scss', 'js'));

gulp.task('minify-scss', function () {
	return gulp.src('./build/css/countrySelect.css')
		.pipe(cleanCSS({level: 2, inline: ['all']}))
		.pipe(rename({extname: '.min.css'}))
		.pipe(gulp.dest('./build/css'))
		.pipe(notify("styles minified"));
});

gulp.task('minify-js', function () {
	return gulp.src('./build/js/countrySelect.js')
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest('./build/js'))
		.pipe(notify("javascript minified"));
});

gulp.task('minify-sources', gulp.parallel('minify-scss', 'minify-js'));

gulp.task('webserver', function() {
	gulp.src('.')
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: './demo.html'
		}));
	gulp.watch('./src/scss/**/*.scss', gulp.series('scss'));
	gulp.watch('./src/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series('handle-sources', 'webserver'));
gulp.task('build', gulp.series('handle-sources', 'minify-sources'));
