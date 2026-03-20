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

// internal recording state
let recordingBuffer = [];
let isRecording = false;

function pushRecord(level, args) {
    try {
        if (!isRecording) return;
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message: typeof args?.[0] === 'string' ? args[0] : JSON.stringify(args?.[0]),
            meta: args.slice(1)
        };
        recordingBuffer.push(entry);
    } catch (e) {
        // swallow
    }
}

const logger = {
    info: (...args) => { console.info(...args); sendBrowserLog('info', args); pushRecord('info', args); },
    error: (...args) => { console.error(...args); sendBrowserLog('error', args); pushRecord('error', args); },
    warn: (...args) => { console.warn(...args); sendBrowserLog('warn', args); pushRecord('warn', args); },
    debug: (...args) => { console.debug(...args); sendBrowserLog('debug', args); pushRecord('debug', args); },
    // recording controls (in-memory buffer)
    startRecording: () => {
        recordingBuffer.length = 0;
        isRecording = true;
    },
    stopRecording: () => {
        isRecording = false;
        const copy = recordingBuffer.slice();
        recordingBuffer.length = 0;
        return copy;
    },
    getRecordedLogs: () => recordingBuffer.slice(),
    clearRecordedLogs: () => { recordingBuffer.length = 0; }
};

module.exports = {
    logger
}