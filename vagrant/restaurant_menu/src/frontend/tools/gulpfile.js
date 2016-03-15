var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');

gulp.task('transpile',function() {
        return gulp.src('../components/*.jsx')
            .pipe(babel({
                presets: ['es2015','react'],
                plugins: ['transform-object-rest-spread']
            }))
            .pipe(gulp.dest('../../backend/static/javascript/'));
    }
);

gulp.task('default',['transpile'], function() {
    return gulp.src('../../backend/static/javascript/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('../../backend/static/javascript/'));
});

gulp.watch('../components/*.jsx',['transpile','default']);