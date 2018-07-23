var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require("gulp-sass");
var reload = browserSync.reload;
var nodemon = require('nodemon');

/**
 * Gulp Tasks
 */

 gulp.task("styles", function(){
 	gulp.src("scss/app.scss")
 	.pipe(sass())
 	.pipe(gulp.dest("./public"))
 	.pipe(browserSync.reload({stream: true}));
 });

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch(['views/**/*.ejs'], reload);
	gulp.watch("./scss/*.scss", ["styles"], reload);
});
