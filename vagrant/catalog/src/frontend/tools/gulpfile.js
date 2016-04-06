var gulp = require('gulp');
var build_semtic = require('../semantic/tasks/build');
var watch_semtic = require('../semantic/tasks/watch');
var babel = require('gulp-babel');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var esdoc = require('gulp-esdoc');
var gutil = require('gulp-util');
var error = "No error";

//This one
gulp.task('transpile',function() {
        return gulp.src('../components/*.js')
            .pipe(babel({
                presets: ['es2016','react'],
                plugins: ['transform-object-rest-spread']
            }))
            .on('error', function(err) {
                error = err;
                this.emit('end');
            })
            .pipe(gulp.dest('../compiled-components/'));
    }
);

gulp.task('doc',function(cb){
    return gulp.src('../components/')
        .pipe(esdoc({
                "destination":"../docs",
                "plugins":[
                    {"name": "esdoc-es7-plugin"}
                ],
            })
        );
});

gulp.task('webpack',['transpile'],function(callback){
    var conf = Object.create(webpackConfig);
    conf.plugins = [
        new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin()
    ];

    webpack(conf,function(err,stats){
        if (err) throw new gutil.PluginError('webpack',err);
        gutil.log('[webpack]',stats.toString({
            colors: true,
            progress: true
        }));
        console.log(error);
        error = "No error";
        callback();
    });
});

gulp.task('default',['webpack','doc']);

gulp.task('build_semantic', build_semtic);

gulp.task('watch_semantic', watch_semtic);

gulp.task('watch',function(){
    gulp.watch('../components/*.js',['webpack']);
});

gulp.task('watch_docs',function(){
    gulp.watch('../components/*.js',['doc']);
});
