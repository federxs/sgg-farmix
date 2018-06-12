var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var angularOrder = require('gulp-angular-order');

//script paths
var jsFiles = ['wwwroot/app/*.service.js', 'wwwroot/app/*.controller.js'],
caca = ['.\wwwroot\app.js', '.\wwwroot\app\**\*.js'],
    jsDest = 'dist/scripts';

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('orden', function() {
    return gulp.src(['./wwwroot/app/**/*.js'])
        .pipe(angularOrder())
        .pipe(concat('todo.js'))
        .pipe(gulp.dest('./wwwroot'));
});