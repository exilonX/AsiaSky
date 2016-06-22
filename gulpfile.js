var gulp = require('gulp');
var babel = require('gulp-babel');
var print = require('gulp-print');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function() {
	return gulp.src('app/**/*.js')
	.pipe(print())
	// .pipe(sourcemaps.init())
	.pipe(babel({presets : ['es2015']}))
	// .pipe(sourcemaps.write('build/maps'))
	.pipe(gulp.dest('build'))
	.on("error", err => {
		console.log("Error ", error.message);
	})
})
