const { src, dest, watch, parallel } = require('gulp'); //gulp tiene multiples funciones
//funcion series: Permite ejecutar una funcion y luego otra. Permite ejecutar tareas una por una
//funcion parallel: Permite ejecutar varias tareas al mismo tiempo
//funcion src: permite mirar donde va encontrar los archivos de sass
//funcion dest: Es una ruta donde se va guardar la funcion compilada
//funcion watch: Sirve para ejecutar tareas cuando hay algun cambio en un archivo para no estar compilando siempre
const sass = require('gulp-sass'); //para compilar sass a css
const autoprefixer = require('autoprefixer'); //agrega prefijos en nuestro css
const postcss = require('gulp-postcss'); //procesamientos para nuestro css.para transforma
const sourcemaps = require('gulp-sourcemaps'); //mantiene la referencia del codigo.
const cssnano = require('cssnano'); //optimiza nuestro codigo en css
const concat = require('gulp-concat'); //para compilar funciones js
const terser = require('gulp-terser-js'); //para optimizar js
const rename = require('gulp-rename'); //renombrer archivo
const imagemin = require('gulp-imagemin'); //dependencia para minimizar el tamaño de las imagenes
const notify = require('gulp-notify'); //para notificar
const cache = require('gulp-cache'); //Una tarea de proxy de almacenamiento en caché basada en archivos temporales para gulp . 
const webp = require('gulp-webp'); //para que las imagenes se formatean a formato webp



//variables generales
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}

//Funcion que compila SASS. css es una función que se puede llamar automaticamente

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass()) //ejecuta funcion para compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css')) //ejectuta la funcion donde se va guardar todos los archivos de css. Crea la carpeta de build.exporta el archivo

}

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js')) // final output file name
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe(webp())
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}


function watchArchivos() {
    watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.imagenes, imagenes);
    watch(paths.imagenes, versionWebp);
}




exports.css = css;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascript, imagenes, versionWebp, watchArchivos);