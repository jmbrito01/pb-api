var gulp            = require('gulp');
var run             = require('gulp-run');

gulp.task('docs', function () {
    return run('jsdoc ./pointblank -d ./docs').exec();
});