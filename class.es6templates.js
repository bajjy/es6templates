import { default as path } from 'path';
import { default as fs } from 'fs';

const consolecolors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    fg: {
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m",
        Crimson: "\x1b[38m"
    },
    bg: {
        Black: "\x1b[40m",
        Red: "\x1b[41m",
        Green: "\x1b[42m",
        Yellow: "\x1b[43m",
        Blue: "\x1b[44m",
        Magenta: "\x1b[45m",
        Cyan: "\x1b[46m",
        White: "\x1b[47m",
        Crimson: "\x1b[48m"
    }
};

var tpl;
var raw;
var data;
var privateRoot;
var privateOutput;
var privateIncludes;

function ensureDirectoryExistence(dirPath) {
    var dirname = path.dirname(dirPath);
    if (fs.existsSync(dirname)) {
        return true;
    };
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

function include(name, newData, filePath, middleware, fileWithExt) {
    var ext = fileWithExt ? '' : '.html';
    filePath = path.join(filePath || privateIncludes, name + ext);
    raw = fs.readFileSync(filePath, 'utf8');
    if (middleware && middlewares[middleware]) {
        var mid = new middlewares[middleware](raw)
        raw = mid.run(newData);
    }
    tpl = '`' + raw + '`';
    try {
        return eval(tpl);
    } catch (error) {
        console.log(consolecolors.fg.Red, error, consolecolors.Reset);
        return false
    };
};

class Templates {
    constructor(root, output, includes) {
        this.root = root;
        this.output = output;
        this.includes = includes;
        privateRoot = this.root;
        privateOutput = this.output;
        privateIncludes = this.includes;
    };

    writeFile(name, tplFile) {
        var filePath = path.join(this.output, `${name}.html`);
        if (!fs.existsSync(filePath)) {
            ensureDirectoryExistence(filePath);
        };
        fs.writeFileSync(filePath, tplFile, function (err) {
            if (error) {
                return console.log(consolecolors.fg.Red, error, consolecolors.Reset);
            }
        });
    };

    render(name, filePath, data = {}) {
        var template;
        if (path.relative(filePath, this.includes).length == 0) return this.first()
        name = path.basename(name, path.extname(name));
        template = include(name, data, filePath);
        this.writeFile(name, template);
    };

    first() {
        fs.readdirSync(this.root).forEach(file => {
            var filePath = path.join(this.root, file);
            var stat = fs.statSync(filePath);
            console.log(consolecolors.fg.Yellow, 'render: ' + filePath, consolecolors.Reset);
            if (stat.isFile()) {
                this.render(file, this.root);
            };
        });
    };

    regenerator(filePath) {
        var stat = fs.statSync(filePath);
        var json;
        if (stat.isFile()) {
            json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        };
        json.map(item => {
            var data = item;
            var tplPath = path.join(this.includes, data.tpl + '.html');
            var template = fs.readFileSync(tplPath, 'utf8');
            var filePath = path.join(this.root, `${data.url}.html`);
            var outPath = path.join(this.output, `${data.url}.html`);

            if (data.remove && fs.existsSync(outPath)) {
                console.log(outPath)
                return fs.unlinkSync(outPath)
            };

            if (!fs.existsSync(filePath)) {
                ensureDirectoryExistence(filePath);
            };
            template = template.replace(/\$\{regenerateMeta\}/gi, JSON.stringify(data));
            template = template.replace(/\$\{regenerateContent\}/gi, JSON.stringify(data.content));

            

            fs.writeFileSync(filePath, template, function (err) {
                if (error) {
                    return console.log(consolecolors.fg.Red, error, consolecolors.Reset);
                }
            });
        })
        
    };
};

export {
    Templates
}
