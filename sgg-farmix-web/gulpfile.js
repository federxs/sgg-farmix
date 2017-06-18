//////////////
//REQUERIDOS
//////////////
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;
	
	
// ///////////////
// Log Errors
// // ////////////

function errorlog(err){
	console.error(err.message);
	this.emit('end');
}
	
//////////////
//Tareas Script
//////////////
gulp.task('scripts', function(){
	gulp.src('./wwwroot/**/*.js')
	.pipe(uglify())
	.pipe(reload({stream:true}));
});

//////////////
//Tareas CSS
//////////////
gulp.task('css', function(){
	gulp.src('./wwwroot/**/*.css')
	.pipe(reload({stream:true}));
});

//////////////
//Tareas HTML
//////////////
gulp.task('html', function(){
	gulp.src('./wwwroot/**/*.html')
	.pipe(reload({stream:true}));
});


//////////////
//Tareas Browser-Sync
//////////////
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./wwwroot/"
        }
    });
});

//////////////
//Tareas Watch
//////////////
gulp.task ('watch', function(){
	gulp.watch('./wwwroot/**/*.js', ['scripts']);
	gulp.watch('./wwwroot/**/*.css', ['css']);
  	gulp.watch('./wwwroot/**/*.html', ['html']);
});

//////////////
//Tareas Default
//////////////
gulp.task('default', ['scripts', 'css' 
, 'html', 'browser-sync', 'watch']);
