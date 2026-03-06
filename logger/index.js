function sendBrowserLog(level, args) {
    const payload = {
        level,
        message: args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '),
        meta: args.slice(1)
    };
    const url = 'http://localhost:3001/api/logs'; // or full URL to your logging server
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
    } else {
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    }
}

const logger = {
    info: (...args) => { console.info(...args); sendBrowserLog('info', args); },
    error: (...args) => { console.error(...args); sendBrowserLog('error', args); },
    warn: (...args) => { console.warn(...args); sendBrowserLog('warn', args); },
    debug: (...args) => { console.debug(...args); sendBrowserLog('debug', args); },
};

module.exports = {
    logger
}