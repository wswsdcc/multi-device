var fs = require('fs');
var join = require('path').join;

var fileManager = {
    getJsonFile: function (path) {
        let jsonFiles = [];
        let files = fs.readdirSync(path);
        files.forEach(function (item, index) {
            let fPath = join(path, item);
            let stat = fs.statSync(fPath);
            if (stat.isDirectory() === true) {
                findJsonFile(fPath);
            }
            if (stat.isFile() === true) {
                var index1 = fPath.lastIndexOf(".");
                var index2 = fPath.length;
                var suffix = fPath.substring(index1 + 1, index2);//后缀名
                if (suffix === 'pdf'){
                    jsonFiles.push(fPath);
                }
            }
        });
        return jsonFiles
    }
}

module.exports = fileManager