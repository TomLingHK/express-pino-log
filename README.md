# express-pino-log
Use pino in an express server to log frontend activities.

## Frontend utils
/hooks, /logger

## Express server setup
```
npm i
npm start
```

## Issue
If chinese character cannot be shown in the cli, try to:
1. Change the code page to UTF-8 by running `chcp 65001` in the command prompt.
```
chcp 65001
```
2. In PowerShell:
```
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
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

## logToCypress.js
This script reads logs from a specified input file, translates them into Cypress test code, and writes the generated code to a specified output file. You can run this script using Node.js, providing the input and output file paths as command-line arguments. If no arguments are provided, it defaults to 'custom_log.txt' for input and 'generated_test.cy.js' for output.

### Usage
```
node logToCypress.js [inputFile] [outputFile]
node logToCypress.js log.txt generated_test.cy.js
```