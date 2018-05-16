// basic loop
//
// ${(() => {
//     var lol = '';
//     for (let [key, value] of Object.entries(newData)) {
//         lol += `<div><label for="${key}">${key}</label><input type="text" name="${key}" value="${value}"></div>`
//     }
//     return lol
// })()}

var tpl;
var newData;
var middlewares = {};

async function load(url, middleware) {
    let data = await (await (fetch(url)
        .then(res => {
            return res.text();
        })
        .then(raw => {
            if (middleware && middlewares[middleware]) {
                var mid = middlewares[middleware](raw)
                raw = mid;
            }
            return raw
        })
        .catch(err => {
            console.log('Error: ', err);
        })
    ))
    return data
};

async function include(link, input, middleware) {
    let data = await (await (load(`${link}`, middleware)
        .then(data => {
            newData = input;
            tpl = '`' + data + '`';
            try {
                return eval(tpl);
            } catch (error) {
                console.log('%c' + error, 'color: red');
                return false
            };
        })
    ));
    return data
};

export {
    load,
    include,
    middlewares
}