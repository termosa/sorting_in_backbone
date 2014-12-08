var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('static', function () {
  gulp.src('./source/**/*')
    .pipe(gulp.dest('./dist'));
});

gulp.task('vendors', function () {
  gulp.src('./bower_components/**/*')
    .pipe(gulp.dest('./dist/vendors'));
});

gulp.task('watch', function () {
  gulp.watch('./bower_components/**/*', ['vendors']);
  gulp.watch('./source/**/*', ['static']);
});

gulp.task('build', ['vendors', 'static']);
gulp.task('default', ['build', 'watch']);

