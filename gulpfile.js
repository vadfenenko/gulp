
//Plugins
import gulp from 'gulp';
import browserSync from 'browser-sync';
import fileInclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import del from 'del';
import dartSass from 'sass'; //compiler to css
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css'; 
import rename from 'gulp-rename'; 
import gulpGroupCssMediaQueries from 'gulp-group-css-media-queries'; 
import babel from 'gulp-babel';
import webpackStream from 'webpack-stream';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';


//HTML
export const html = () => {
  return gulp.src('src/index.html')
  .pipe(fileInclude())
  .pipe(htmlmin({ 
	removeComments: true,
	collapseWhitespace: true,
 }))
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream())
}

//SCSS
export const scss = () => {
  return gulp.src('src/styles/style.scss', {sourcemaps: true})
	.pipe(sass())
	.pipe(autoprefixer())
	.pipe(gulpGroupCssMediaQueries())
	.pipe(gulp.dest('dist/styles', {sourcemaps: true}))
	.pipe(cleanCss())
	.pipe(rename({
		suffix: '.min'
	}))
    .pipe(gulp.dest('dist/styles', {sourcemaps: true}))
	.pipe(browserSync.stream())
}

//JavaScript
export const js = () => {
	return gulp.src('src/scripts/**/*.js',{sourcemaps: true})
	.pipe(babel())
	.pipe(webpackStream({
		mode:'development' // development / production
	}))
	.pipe(gulp.dest('dist/scripts',{sourcemaps: true}))
	.pipe(browserSync.stream())
}

//Images
export const images = () => {
	return gulp.src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
	.pipe(newer('dist/images'))
	.pipe(webp())
	.pipe(gulp.dest('dist/images'))
	.pipe(gulp.src('src/images/**/*.{jpg,jpeg,png,svg,gif}'))
	.pipe(newer('dist/images'))
	.pipe(imagemin({
		verbose:true
	}))
	.pipe(gulp.dest('dist/images'))
}

//Fonts
export const fonts = () => {
	return gulp.src('src/fonts/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}')
	.pipe(newer('dist/fonts'))
	.pipe(fonter({
		formats: ['woff']	
	}))
	.pipe(gulp.dest('dist/fonts'))
	.pipe(gulp.src('src/fonts/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}'))
	.pipe(ttf2woff2())
	.pipe(gulp.dest('dist/fonts'))
}

//Clear
export const clear = () => {
	return del('dist')
}

//Server
export const server = ()=> {
  browserSync.init({
    server:{
			baseDir: 'dist',
    }
  })
} 

//Watch
export const watcher = () => {
  gulp.watch('src/*.html', html).on('all', browserSync.reload)
  gulp.watch('src/styles/**/*.scss', scss).on('all', browserSync.reload)
  gulp.watch('src/scripts/**/*.js', js).on('all', browserSync.reload)
  gulp.watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', images).on('all', browserSync.reload)
  gulp.watch('src/fonts/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}', fonts).on('all', browserSync.reload)
}

//Default
export default gulp.series(
  clear,
  gulp.parallel(html, scss, js, images, fonts),
  gulp.parallel(watcher, server),
);
