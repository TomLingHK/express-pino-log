async function sendBrowserLog(level, args) {
    const payload = {
        level,
        message: JSON.stringify(args?.[0]),
        meta: args.slice(1)
    };
    const url = process.env.REACT_APP_DEV_LOG_URL;
    const body = JSON.stringify(payload);
    
    if (!url) return;

    try {
        await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    } catch (error) {
        console.log("Log server is not connected.")
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