var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('babel', function() {
	gulp.src('src/touch.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('build')
	);
});

gulp.task('watch', function() {
	gulp.watch('./src/touch.js', ['babel']);
});
gulp.task('default', ['babel']);
