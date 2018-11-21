/**
 * Created by admin on 2017/1/23.
 */


var gulp = require('gulp');

var uglify = require("gulp-uglify")

// var clean = require('gulp-clean');

var concat = require('gulp-concat');


gulp.task('minJs',function () {
    gulp.src(['./src/**']).pipe(uglify({
        mangle: true,//类型：Boolean 默认：true 是否修改变量名
        compress: true,//类型：Boolean 默认：true 是否完全压缩
        preserveComments: 'all' //保留所有注释
    })).pipe(gulp.dest('dest'));
});


gulp.task('concatJs',function () {
    gulp.src('dest/*.js')
        .pipe(concat('index.min.js'))//合并后的文件名
        .pipe(gulp.dest('dist/'));
});

gulp.task('clear',function () {
    return gulp.src('./dest', {read: false})
        .pipe(clean());
});

gulp.task('default', function() {
    gulp.watch('./src/**',['minJs']);
});
