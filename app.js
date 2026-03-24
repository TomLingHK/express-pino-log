const express = require('express');
const cors = require('cors');
const pino = require('pino');
const bodyParser = express.json();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const logger = pino({
    transport: {
        targets: [
            {
                target: 'pino-pretty'
            },
            {
                target: 'pino/file',
                options: { destination: './errors.log' },
                level: 'error', mkdir: true
            },
            {
                target: 'pino/file',
                options: { destination: './combined.log' },
                level: 'info', mkdir: true
            },
            {
                target: 'pino/file',
                options: { destination: './debug.log' },
                level: 'debug', mkdir: true
            }
        ],
        options: {
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname"
        }
    }
})

app.post('/api/logs', bodyParser, (req, res) => {
    const { level = 'info', message = '', meta } = req.body || {};

    // 先檢查 level 是否為有效方法，否則 fallback 到 info
    const activeLevel = typeof logger[level] === 'function' ? level : 'info';

    // 直接透過傳入一個物件，先設定 `msg` 再放 `meta`，讓輸出時 `msg` 在前
    logger[activeLevel]({ msg: message, meta: meta || {} });
    res.sendStatus(204);
});

app.listen(3001, () => console.log('Log receiver running on :3001'));