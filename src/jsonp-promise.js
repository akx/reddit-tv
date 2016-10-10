import Promise from 'bluebird';

export default function jsonp(url) {
    const cbName = `jsonp${Math.random()}`.replace('.', '_');
    url += `${url.indexOf('?') ? '&' : '?'}jsonp=${cbName}`;
    return new Promise((resolve) => {
        const scriptEl = Object.assign(document.createElement('script'), {src: url});
        window[cbName] = (...args) => {
            delete window[cbName];
            //scriptEl.parentNode.removeChild(scriptEl);
            resolve(args);
        };
        document.head.appendChild(scriptEl);
    });
}
