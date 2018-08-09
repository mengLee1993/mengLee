
var gulp = require('gulp')
var sass = require('gulp-sass')//sass编译
var browserSync = require('browser-sync');//自动刷新
var config = require('./config.js');
var fileinclude  = require('gulp-file-include');
function cssSet(cfg) {
	console.log(cfg.sassSrc)
  return gulp.src(cfg.sassSrc)//return 防止异步
	  .pipe(sass({outputStyle: 'compact'}))
	  .pipe(gulp.dest(cfg.cssSrc))
}

function include(include){
    if(!include.htmlIncAfter){
        return;
    }
    console.log(include.htmlIncAfter)
    gulp.src([include.htmlIncAfter])//gulp前的文件路径
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(include.htmlIncBefore));//gulp后的路径

}

function watch(cfg){
	gulp.watch(cfg.sassSrc,function(event){
		cssSet(cfg);
	})
    gulp.watch(cfg.htmlIncAfter,function(event){
        include(cfg);
    })
}

//头部
gulp.task('fileinclude', function() {
    // 适配page中所有文件夹下的所有html，排除page下的include文件夹中html
    gulp.src(['static/project/limitManage/html-www/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('static/project/limitManage/html-gulp-www'));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'project'
    }
  })
})

//默认任务，循环遍历模块
gulp.task('dry',function() {
	for(var name in config){
		cssSet(config[name])
	    watch(config[name]);//监听
        include(config[name])
	 }
});





