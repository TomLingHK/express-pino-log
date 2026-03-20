import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '../../logger';
import { useRenderLog } from '../../hooks/useLog';
import './RecordButton.css';

export default function RecordButton() {
    const location = useLocation();
    const [recording, setRecording] = useState(false);
    const [visible, setVisible] = useState(true);
    const prevPath = useRef(location.pathname);

    // log route render info when recording is active
    useRenderLog('Route', location.pathname, { pathname: location.pathname, recording });

    useEffect(() => {
        if (prevPath.current !== location.pathname) {
            // hide while route is changing
            setVisible(false);
            const t = setTimeout(() => setVisible(true), 400);
            prevPath.current = location.pathname;
            return () => clearTimeout(t);
        }
    }, [location.pathname]);

    const handleClick = () => {
        if (!recording) {
            logger.startRecording && logger.startRecording();
            setRecording(true);
        } else {
            const logs = (logger.stopRecording && logger.stopRecording()) || (logger.getRecordedLogs && logger.getRecordedLogs()) || [];
            setRecording(false);

            const lines = logs.map(l => {
                // try { return `${l.timestamp} [${l.level}] ${l.message} ${JSON.stringify(l.meta || [])}`; } catch(e) { return JSON.stringify(l); }
                try { return `${l.timestamp} [${l.level}] ${l.message}`; } catch (e) { return JSON.stringify(l); }
            }).join('\n');

            const blob = new Blob([lines || ''], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `logs_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
    };

    if (!visible) return null;

    return (
        <div className="rc-record-btn-wrapper">
            <button
                className={`rc-record-btn ${recording ? 'rc-recording' : ''}`}
                onClick={handleClick}
                aria-pressed={recording}
                title={recording ? 'Stop recording and download logs' : 'Start recording logs'}
            >
                {recording ? 'Stop & Download' : 'Start Recording'}
            </button>
        </div>
    );
}
