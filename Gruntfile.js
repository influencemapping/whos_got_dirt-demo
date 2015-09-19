module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.initConfig({
    shell: {
      componentbuild: {
        command: 'component build',
      },
    },
    watch: {
      scripts: {
        files: ['index.js'],
        tasks: ['shell'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.registerTask('default', ['shell', 'watch']);
};
