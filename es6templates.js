var tpl;
var newData;

async function load(url, middleware) {
    let data = await (await (fetch(url)
        .then(res => {
            return res.text();
        })
        .then(raw => {
            if (middleware) {
                var mid = middleware(raw)
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

async function include(link, input, middleware = false) {
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
    include
}
