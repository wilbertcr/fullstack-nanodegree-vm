var gulp = require('gulp'),
    build_semtic = require('../semantic/tasks/build'),
    watch_semtic = require('../semantic/tasks/watch');
var babel = require('gulp-babel');
var webpack_stream = require('webpack-stream');
var esdoc = require('gulp-esdoc');

gulp.task('transpile',function() {
        return gulp.src('../components/*.js')
            .pipe(babel({
                presets: ['es2016','react'],
                plugins: ['transform-object-rest-spread']
            }))
            .pipe(gulp.dest('../compiled-components/'));
    }
);

gulp.task('doc',['transpile'],function(cb){
    return gulp.src('../components/')
        .pipe(esdoc({
                "destination":"../docs",
                "plugins":[
                    {"name": "esdoc-es7-plugin"}
                ],
            })
        );
});

gulp.task('default',['doc'], function() {
    return gulp.src('../components/index.js')
        .pipe(webpack_stream(require('./webpack.config.js')))
        .pipe(gulp.dest('../../backend/python/static/javascript/'));
});

gulp.task('build_semantic', build_semtic);

gulp.task('watch_semantic', watch_semtic);

gulp.task('watch_react',function(){
    gulp.watch('../components/*.js',['default']);
});

gulp.task('watch_docs',function(){
    gulp.watch('../components/*.js',['doc']);
});
