var gulp        = require("gulp");
var sass        = require("gulp-sass");
var browserSync = require("browser-sync").create();
var nodemon     = require("nodemon");

gulp.task("styles", function(){
	gulp.src("sass/app.sass")
	.pipe(sass())
	.pipe(gulp.dest("./"))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task("serve", function(){

	browserSync.init({
		server:{
			baseDir: "./"
		}
	});

	gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: {
			host: "http://localhost",
			port: "3000"
		}
	});
});

	gulp.watch("./sass/*.sass", ["styles"]);
	gulp.watch("./**/*.ejs").on("change", browserSync.reload);
});

gulp.task('nodemon', function (cb) {
	var called = false;
	return nodemon({script: 'app.js'}).on('start', function () {
		if (!called) {
			called = true;
			cb();
		}
	});
});

gulp.task("default", ["styles", "serve"]);
