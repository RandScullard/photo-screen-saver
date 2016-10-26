module.exports = function (grunt) {
	grunt.initConfig({
		ts: {
			default: {
				src: ['src/*.ts'],
				outDir: 'bin'
			}
		},

		copy: {
			toBin: {
				files: [
					{ expand: true, cwd: 'src', src: ['index.html', 'index.css', 'package.json'], dest: 'bin/' }
				]
			},
			toScr: {
				files: [{ 
					expand: true, 
					src: 'package/photo-screen-saver-win32-x64/photo-screen-saver.exe', 
					rename: function () { return 'package/photo-screen-saver-win32-x64/photo-screen-saver.scr' }
				}]
			}
		},

		'npm-command': {
			default: {
				options: {
					cmd: 'install',
					cwd: 'bin/'
				}
			}
		},

		electron: {
			default: {
				options: {
					name: 'photo-screen-saver',
					dir: 'bin',
					out: 'package',
					version: '0.36.12',
					platform: 'win32',
					arch: 'x64',
					overwrite: true
				}
			}
		},

		clean: ['.tscache', 'bin', 'obj', 'package']
	});

	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-electron');
	grunt.loadNpmTasks('grunt-npm-command');

	grunt.registerTask('build', ['ts', 'copy:toBin']);
	grunt.registerTask('package', ['npm-command', 'electron', 'copy:toScr']);
	grunt.registerTask('default', ['build', 'package']);
};
