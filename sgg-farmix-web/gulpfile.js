var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var angularOrder = require('gulp-angular-order');


gulp.task('default', ['watch']);

gulp.task('watch', function() {
  gulp.watch('./wwwroot/app/**/*.js', ['scripts']);
});

gulp.task('scripts', function() {
    return gulp.src(['./wwwroot/app/**/*.js'])
        .pipe(angularOrder())
        .pipe(concat('todo.js'))
		.pipe(gulp.dest('./wwwroot'))
		.pipe(rename('todo.min.js'))
		.pipe(uglify())
        .pipe(gulp.dest('./wwwroot'));
});
