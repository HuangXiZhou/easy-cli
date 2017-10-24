var   gulp         = require('gulp'),
      path         = require('path'),
      fse          = require('fs-extra'),
      sass         = require('gulp-sass'),
      babel        = require('gulp-babel'),
      uglify       = require('gulp-uglify'),
      rename       = require('gulp-rename'),
      cssnano      = require('gulp-cssnano'),
      concat       = require('gulp-concat'),
      autoprefixer = require('gulp-autoprefixer'),
      browserSync  = require('browser-sync').create()


var PWD = process.env.PWD || process.cwd()

// html模板
var template =
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="keywords" content="your keywords">
  <meta name="description" content="your description">
  <meta name="Trevor" content="Trevor, xizhouh@gmail.com">
  <meta name="robots" content="index,follow">
  <meta name="format-detection" content="telephone=no">
    <title>Document</title>
</head>
<body>

</body>
</html>`

// 项目初始化
gulp.task('init', function() {
  var dirs = ['dist', 'dist/assets', 'dist/assets/css', 'dist/assets/img', 'dist/assets/fonts', 'dist/assets/js', 'src', 'src/sass', 'src/js', 'src/img']

  dirs.forEach(function(item,index) {
      fse.mkdirSync(path.join(PWD + '/'+ item))
  })

  fse.writeFileSync(path.join(PWD + '/dist/index.html'), template)
  fse.writeFileSync(path.join(PWD + '/src/sass/style.scss'), '@charset "utf-8";')
})

// 编译并压缩css
gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    // 添加浏览器前缀
    .pipe(autoprefixer({
      browsers: ['ios 5','android 2.3'],
      cascade: false
    }))
    .pipe(concat('style.css'))
    .pipe(cssnano())
    .pipe(rename(function(path) {
      path.basename += '.min'
    }))
    .pipe(gulp.dest('dist/assets/css'))
})

// 编译并压缩js
gulp.task('es6', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.basename += '.min'
    }))
    .pipe(gulp.dest('dist/assets/js'))
})

// 监听
gulp.task('start', function() {
    // 监听重载文件
    var files = [
      'dist/**/*.html',
      'dist/assets/css/**/*.css',
      'src/js/**/*.js'
    ]
    browserSync.init(files, {
      server: {
            baseDir: './',
            directory: true,
      },
      port: 8080,
      open: 'external',
      startPath: 'dist/index.html'
    })
    // 监听编译文件
    gulp.watch('dist/**/*.html').on('change', browserSync.reload)
    gulp.watch('src/sass/**/*.scss', ['sass'])
    gulp.watch('src/js/**/*.js', ['es6']).on('change', browserSync.reload)
})
