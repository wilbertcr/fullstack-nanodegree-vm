var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');

gulp.task('transpile',function() {
        return gulp.src('./*.jsx')
            .pipe(babel({
                presets: ['es2015','react'],
                plugins: ['transform-object-rest-spread']
            }))
            .pipe(gulp.dest('dist/'));
    }
);

gulp.task('default',['transpile'], function() {
    return gulp.src('./dist/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});

gulp.watch('./*.jsx',['transpile','default']);