var Plugin = require('broccoli-plugin');
var path = require('path');
var fs = require('fs');

module.exports = DefaultFile;
DefaultFile.prototype = Object.create(Plugin.prototype);
DefaultFile.prototype.constructor = DefaultFile;
function DefaultFile(inputNodes, options) {
  options = options || {};
  options.files = options.files || {};
  Plugin.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

DefaultFile.prototype.build = function() {
  var files = this.options.files;
  var output = this.outputPath;

  this.inputPaths.forEach(function(input) {
    console.log(input);

    var file;
    for (file in files) {
      var content;
      try {
        var filePath = path.join(input, file);
        var stats = fs.statSync(filePath);

        if (!stats.isFile()) {
          throw new Error('Not a file');
        }

        content = fs.readFileSync(filePath);
      } catch (e) {
        content = files[file];
      }

      fs.writeFileSync(path.join(output, file), content);
    }
  });
};
