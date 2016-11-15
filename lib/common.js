var common = {
    parse_str: function(str) {
        var strArr = String(str)
            .replace(/^&/, '')
            .replace(/&$/, '')
            .split('&'),
            array = {},
            sal = strArr.length,
            i, j, ct, p, lastObj, obj, lastIter, undef, chr, tmp, key, value,
            postLeftBracketPos, keys, keysLen,
            fixStr = function(str) {
                return decodeURIComponent(str.replace(/\+/g, '%20'));
            };

        for (i = 0; i < sal; i++) {
            tmp = strArr[i].split('=');
            key = fixStr(tmp[0]);
            value = (tmp.length < 2) ? '' : fixStr(tmp[1]);

            while (key.charAt(0) === ' ') {
                key = key.slice(1);
            }
            if (key.indexOf('\x00') > -1) {
                key = key.slice(0, key.indexOf('\x00'));
            }
            if (key && key.charAt(0) !== '[') {
                keys = [];
                postLeftBracketPos = 0;
                for (j = 0; j < key.length; j++) {
                    if (key.charAt(j) === '[' && !postLeftBracketPos) {
                        postLeftBracketPos = j + 1;
                    } else if (key.charAt(j) === ']') {
                        if (postLeftBracketPos) {
                            if (!keys.length) {
                                keys.push(key.slice(0, postLeftBracketPos - 1));
                            }
                            keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
                            postLeftBracketPos = 0;
                            if (key.charAt(j + 1) !== '[') {
                                break;
                            }
                        }
                    }
                }
                if (!keys.length) {
                    keys = [key];
                }
                for (j = 0; j < keys[0].length; j++) {
                    chr = keys[0].charAt(j);
                    if (chr === ' ' || chr === '.' || chr === '[') {
                        keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
                    }
                    if (chr === '[') {
                        break;
                    }
                }

                obj = array;
                for (j = 0, keysLen = keys.length; j < keysLen; j++) {
                    key = keys[j].replace(/^['"]/, '')
                        .replace(/['"]$/, '');
                    lastIter = j !== keys.length - 1;
                    lastObj = obj;
                    if ((key !== '' && key !== ' ') || j === 0) {
                        if (obj[key] === undef) {
                            obj[key] = {};
                        }
                        obj = obj[key];
                    } else {
                        // To insert new dimension
                        ct = -1;
                        for (p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                if (+p > ct && p.match(/^\d+$/g)) {
                                    ct = +p;
                                }
                            }
                        }
                        key = ct + 1;
                    }
                }
                lastObj[key] = value;
            }
        }
        return array;
    },
    parse_url: function(str, component) {
        var php_js = {},
            query,
            ini = (php_js && php_js.ini) || {},
            mode = (ini['phpjs.parse_url.mode'] && ini['phpjs.parse_url.mode'].local_value) || 'php',
            key = [
                'source',
                'scheme',
                'authority',
                'userInfo',
                'user',
                'pass',
                'host',
                'port',
                'relative',
                'path',
                'directory',
                'file',
                'query',
                'fragment'
            ],
            parser = {
                php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
            },
            m = parser[mode].exec(str),
            uri = {},
            i = 14;

        while (i--) {
            if (m[i]) {
                uri[key[i]] = m[i];
            }
        }

        if (component) {
            return uri[component.replace('PHP_URL_', '').toLowerCase()];
        }

        if (mode !== 'php') {
            var name = (ini['phpjs.parse_url.queryKey'] && ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
            parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
            uri[name] = {};
            query = uri[key[12]] || '';
            query.replace(parser, function($0, $1, $2) {
                if ($1) {
                    uri[name][$1] = $2;
                }
            });
        }

        delete uri.source;
        return uri;
    },
    getLinkReg: function(str) {
        return str.replace(/user\./g, '').replace(/page\./g, '').replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\?/g, '\\?');
    },
    trim: function(str) {
        // return str.replace(/^\s*|\s*$/g, '');
        return str.trim();
    },
    getHost: function(str) {
        return str.replace(/https?:\/\/([^\/]*)\/.*/i, '$1');
    },
    capitalize: function(str) {
        return str.replace(/^[a-z]{1}/,function($1){return $1.toLocaleUpperCase()});
    },
    stripTags: function(str) {
        return str.replace(/(<([^>]+)>)/ig, '');
    },
    registerDestruction: function(host, type, value) {
        var destruction, args;
        if (arguments.length != 3) return;
        if (typeof browser.params.destruction == 'undefined') browser.params.destruction = {};
        destruction = browser.params.destruction;

        args = [host, type];
        args.forEach(
            function(e, idx) {
                if (!destruction[e]) destruction[e] = (!idx) ? {} : [];
                destruction = destruction[e];
            }
        );
        if (destruction.indexOf(value) == -1) destruction.push(value);
        // console.log(browser.params.destruction)
    },
    isEmptyObject: function(obj) {
        // for (var i in obj) return false;
        // return true;
        for(var prop in obj) {
            if (obj.hasOwnProperty(prop)) return false;
        }//end for
        return true && JSON.stringify(obj) === JSON.stringify({});
    },
    getTestData: function(type, layer) {
    	var data;

        switch (type) {
            case 'item':
                //shadow
                data = browser.params.shadow;
                for (var i=-1,l=layer.length;++i<l;) if (data[layer[i]]) data = data[layer[i]];

                // if (typeof data == 'undefined') {
                if (this.isEmptyObject(data)) {
                    // data = testData;
                    data = browser.params.face;
                    for (var i=-1,l=layer.length;++i<l;) if (data[layer[i]]) data = data[layer[i]];
                }//end for
                break;
            default:
                data = (typeof browser.params[type] != 'undefined') ? browser.params[type] : {};
                break;
        }//end switch

    	// return data;
        return JSON.parse(JSON.stringify(data));
    }
};

module.exports = common;
