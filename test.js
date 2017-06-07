/**
 *
 * @param input string
 * @param remove string||number||null
 * @param sort function
 * @return string
 */

https://www.somehost.com/test/index.html?param1=4&param2=3&param3=2&param4=1&param5=3

function convert(input, remove, sort) {
    if (typeof sort !== 'function') {
        sort = function (a, b) {
            return ((a || '').split('=')[1] || 0) - ((b || '').split('=')[1] || 0);
        }
    }
    var baseReg = /\w*:\/\/[A-Za-z0-9\-_.]*/;
    var tmp = input.split('?');
    var base = baseReg.exec(tmp[0])[0];
    var url = encodeURIComponent(tmp[0].replace(base, ''));
    var query = tmp[1].split('&').sort(sort);
    if (remove !== undefined) {
        query = query.filter(function (item) {
            return (item || '').split('=')[1] != remove;
        });
    }

    return base + '/?' + query.join('&') + '&url=' + url;
}
