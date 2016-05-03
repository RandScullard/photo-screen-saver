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
					{ expand: true, cwd: 'src', src: ['index.html', 'index.css', 'package.json'], dest: 'bin/' },
					{ expand: true, src: ['node_modules/concat-stream/**', 'node_modules/jquery/**'], dest: 'bin/', dot: true }
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

		clean: ['bin', 'package']
	});

	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-electron');

	grunt.registerTask('build', ['ts', 'copy:toBin']);
	grunt.registerTask('package', ['electron', 'copy:toScr']);
	grunt.registerTask('default', ['build', 'package']);
};
