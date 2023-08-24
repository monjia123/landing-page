const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render'); // Updated package name
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');
const browserSync = require('browser-sync').create();

// Paths
const paths = {
    src: {
        templates: 'src/templates/**/*.njk',
        styles: 'src/styles/**/*.scss',
        fonts: 'src/fonts/**/*',
    },
    dest: {
        html: 'dist',
        css: 'dist/styles',
        fonts: 'dist/fonts',
    },
};

// Compile Nunjucks templates
gulp.task('templates', () => {
    return gulp
        .src(paths.src.templates)
        .pipe(nunjucksRender())
        .pipe(gulp.dest(paths.dest.html))
        .pipe(browserSync.stream());
});

// Copy fonts
gulp.task('fonts', () => {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dest.fonts))
        .pipe(browserSync.stream());
});

// Compile SCSS to CSS and minify
gulp.task('styles', () => {
    return gulp
        .src(paths.src.styles)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest.css))
        .pipe(minify())
        .pipe(gulp.dest(paths.dest.css))
        .pipe(browserSync.stream());
});

// Serve using BrowserSync with LiveReload
gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
        // Enable LiveReload
        plugins: ['bs-livereload-injector'],
    });

    gulp.watch(paths.src.templates, gulp.series('templates'));
    gulp.watch(paths.src.styles, gulp.series('styles'));
    gulp.watch('dist/*.html').on('change', browserSync.reload);
});

// Default task
gulp.task('default', gulp.series('templates', 'styles', 'fonts', 'serve'));
