var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack_stream = require('webpack-stream');

gulp.task('transpile',function() {
        return gulp.src('../components/*.jsx')
            .pipe(babel({
                presets: ['es2016','react'],
                plugins: ['transform-object-rest-spread']
            }))
            .pipe(gulp.dest('../compiled-components/'));
    }
);

gulp.task('default',['transpile'], function() {
    return gulp.src('../compiled-components/index.js')
        .pipe(webpack_stream(require('./webpack.config.js')))
        .pipe(gulp.dest('../../backend/python/static/javascript/'));
});

//gulp.watch('../components/*.jsx',['transpile','default']);