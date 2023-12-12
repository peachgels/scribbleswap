//All code in this file taken from 430 course shell, authors being Cody Van De Mark and Austin Willoughby

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint-new');
const webpackConfig = require('./webpack.config.js');


const jsTask = (done) => {
    webpack(webpackConfig)
        .pipe(gulp.dest('./hosted'));
    
    done();
}
  
const lintTask = (done) => {
    gulp.src('./server/**/*.js')
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
    
    done();
}

const build = gulp.parallel(jsTask, lintTask);

const watch = (done) => {
    gulp.watch(['./client/*.js', './client/*.jsx'], jsTask);
    nodemon({ 
        script: './server/app.js',
        tasks: ['lintTask'],
        watch: ['./server'],
        done: done
    });
}


module.exports = {
    build,
    jsTask,
    lintTask,
    watch
};