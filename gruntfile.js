module.exports = function (grunt) {
   grunt.initConfig({
      eslint: {
         lint_electron: {
            src: ["src/main.ts", "src/preload.ts"],
            options: { maxWarnings: 0 },
         },
      },

      exec: {
         compile_react: {
            command: "\"node_modules/.bin/react-scripts\" build",
            options: {
               env: Object.assign({}, process.env, { CI: "true" }), // treat warnings as errors
            },
         },
         compile_electron: {
            command: "node ./node_modules/typescript/bin/tsc src/main.ts src/preload.ts --esModuleInterop --outDir build"
         },
      },

      copy: {
         toBuild: {
            files: [
               { expand: true, cwd: "src", src: ["package.json"], dest: "build/" }
            ]
         },
         toScr: {
            files: [{ 
               expand: true, 
               src: "package/photo-screen-saver-win32-x64/photo-screen-saver.exe", 
               rename: function () { return "package/photo-screen-saver-win32-x64/photo-screen-saver.scr" }
            }]
         }
      },

      electron: {
         default: {
            options: {
               name: "photo-screen-saver",
               dir: "build",
               out: "package",
               platform: "win32",
               arch: "x64",
               overwrite: true
            }
         }
      },

      clean: {
         options: { "no-write": false },
         folders: ["build/", "package/"],
      }
   })

   grunt.loadNpmTasks("grunt-contrib-clean")
   grunt.loadNpmTasks("grunt-contrib-copy")
   grunt.loadNpmTasks("grunt-electron")
   grunt.loadNpmTasks("grunt-eslint")
   grunt.loadNpmTasks("grunt-exec")

   grunt.registerTask("build", ["exec:compile_react", "exec:compile_electron", "eslint:lint_electron", "copy:toBuild"])
   grunt.registerTask("package", ["electron", "copy:toScr"])
   grunt.registerTask("default", ["build", "package"])
}
