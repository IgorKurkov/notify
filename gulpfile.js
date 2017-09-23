/**
 * Created by kurkov on 19.09.2017.
 */
var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync'),
    notify         = require('gulp-notify'),
    plumber        = require('gulp-plumber'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify'),
    fileinclude    = require('gulp-file-include'),
    imagemin       = require('gulp-imagemin'),
    del            = require('del'),
    cache          = require('gulp-cache');

//start server
gulp.task('start-server', function(){
    browserSync({
        server: {baseDir: 'app'},
        notify: true
    });
});

//convert sass
gulp.task('sass', function(){
    return gulp.src('app/sass/**/*+(.sass|.scss)')
        .pipe(sass().on("error", notify.onError()))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

// common scripts
gulp.task('common-js', function() {
    return gulp.src([
        'app/js/common.js'
    ])
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('scripts', ['common-js'], function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/mmenu/js/jquery.mmenu.all.min.js',
        'app/libs/owl.carousel/owl.carousel.min.js',
        'app/js/common.min.js' // Всегда в конце
    ])
        .pipe(concat('scripts.min.js'))
        // .pipe(uglify()) // Минимизировать весь js (на выбор)
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('html', function(){
    return gulp.src('app/template/index.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app/template'
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('imagemin', () => {
    return gulp.src('app/assets/**/*')
    .pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/assets')); 
});
gulp.task('deldist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('build', ['deldist', 'imagemin', 'sass', 'html', 'common-js', 'scripts'], () => {
    var buildHtml = gulp.src([
        'app/*.html', 
        'app/.htaccess'
        ])
        .pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
        'app/css/*.css'
        ])
        .pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
        'app/js/*.js'
        ])
        .pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*'
        ])
        .pipe(gulp.dest('dist/fonts'));
});


//main watch command
gulp.task('default', ['html', 'sass', 'common-js', 'scripts', 'start-server'], function(){
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/js/**/*.js', ['common-js', 'scripts']);
    gulp.watch('app/**/*.html', ['html', browserSync.reload]);
});

