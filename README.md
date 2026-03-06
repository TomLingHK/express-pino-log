# express-pino-log
Use pino in an express server to log frontend activities.

## Frontend utils
/hooks, /logger

## Express server setup
```
npm i
npm start
```

## React usage example
```js
function LoginPage() {
    // Logging
    const [pageName, setpageName] = useState('LoginPage');
    useRenderLog(pageName);
    const logClick = useButtonLog(pageName);
    
    function tryLogin(async () => {
        logClick('loginButton', { username: username });
        //... login logic
    })
}
```