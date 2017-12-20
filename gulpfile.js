'use strict';

const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const del = require('del');
const oss = require('gulp-oss-2');

const tmpDir = (pathPart) => path.join('tmp', pathPart);

const sourceDir = (pathPart) =>  path.join('assets', pathPart);

const destDir = (pathPart) => path.join('public', pathPart);

gulp.task('clean', (cb) => del(
  [
    destDir('assets')
  ], cb)
);

/**** SASS ****/
gulp.task('sass', () =>
  gulp.src(sourceDir('sass/**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(sourceDir('css')))
);

gulp.task('sass:watch', () => {
  gulp.watch(sourceDir('sass/**/*.scss'), ['sass']);
});

/**** OSS ****/
gulp.task('publish-oss', () => {
  let returnVal;
  if (process.env.NODE_ENV === 'stage') {
    returnVal = gulp.src('public/**/*.*')
      .pipe(oss({
        key: process.env.STAGE_OSS_KEY,
        secret: process.env.STAGE_OSS_SECRET,
        endpoint: process.env.STAGE_OSS_ENDPOINT
      }, {
        headers: {
          Bucket: process.env.STAGE_OSS_BUCKET,
          CacheControl: 'max-age=315360000, no-transform, public'         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
        },
        uploadPath: 'mkt/campaign/'
      }));
  } else if (process.env.NODE_ENV === 'production') {
    returnVal = gulp.src('public/**/*.*')
      .pipe(oss({
        key: process.env.OSS_KEY,
        secret: process.env.OSS_SECRET,
        endpoint: process.env.OSS_ENDPOINT
      }, {
        headers: {
          Bucket: process.env.OSS_BUCKET,
          CacheControl: 'max-age=315360000, no-transform, public'         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
        },
        uploadPath: 'mkt/campaign/'
      }));
  }

  return returnVal;
});
