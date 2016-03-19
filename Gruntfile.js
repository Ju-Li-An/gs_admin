module.exports = function(grunt) {
    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        browserify: {
            options: {
                debug: true,
                extensions: ['.jsx'],
				transform: [['babelify', {presets: ['es2015', 'react']}]],
				external: ['react','reflux','react-router','react-dom']
            },
            gs_admin: {
                src: 'src/render.js',
                dest: 'public/javascripts/app.js'
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-browserify');
 
    grunt.registerTask('default', ['browserify']);
};