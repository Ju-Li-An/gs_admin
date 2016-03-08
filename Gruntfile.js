module.exports = function(grunt) {
    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        browserify: {
            options: {
                debug: true,
                extensions: ['.jsx'],
				transform: [['babelify', {presets: ['es2015', 'react']}]],
				external: ['react']
            },
            gs_admin: {
                src: 'src/components/app.jsx',
                dest: 'public/javascripts/app.js'
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-browserify');
 
    grunt.registerTask('default', ['browserify']);
};