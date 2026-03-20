# express-pino-log
Use pino in an express server to log frontend activities.

## Frontend utils
/hooks, /logger, /RecordBtn

## Express server setup
```
npm i
npm start
```

## Issue
If chinese character cannot be shown in the cli after starting the logging server, try to:
1. Change the code page to UTF-8 by running `chcp 65001` in the command prompt.
```
chcp 65001
```
2. In PowerShell:
```
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
```

## Utils usage example

### useActionLog
Usage:
To log user actions, for example: logging in, filtering items, adding to cart, etc. You can call the logAction function with a custom action name and optional data to log specific user interactions. This can help you track user behavior and identify areas for improvement in your application.

Example:
```js
    const [pageName, setpageName] = useState('LoginPage');
    // Set page name / component name
    const logAction = useActionLog(pageName);
    // (actionName, data (optional) )
    logAction('LOGIN_ATTEMPT', { username: username });
```

### useApiLog
Usage:
To log API calls, you can use the logApi function to record details about the API endpoint, HTTP method, response data, and any additional data you want to include. This can help you monitor API usage, identify performance issues, and track errors in your application.

Example:
```js
    const [pageName, setpageName] = useState('LoginPage');
    // Set page name / component name
    const logApi = useApiLog(pageName);
    await login(username, password).then(result => {
        // (endpoint, method, return data, data (optional) )
        logApi('/api/login', 'POST', result, { username: username });
    })
```

### useButtonLog
Usage:
To log button clicks, you can use the logClick function to record which buttons are being clicked by users. This can help you understand user interactions with your application and identify which features are most popular or may need improvement.

Example:
```js
    const [pageName, setpageName] = useState('LoginPage');
    // Set page name / component name
    const logClick = useButtonLog(pageName);

    const tryLogin = () => {
        // (buttonId of data-cy for cypress, data (optional) )
        logClick('loginButton', { username: username });
        //... login logic
    }
```

### useErrorLog
Usage:
To log errors, you can use the logError function to record error details such as error name, error message, and any additional data you want to include. This can help you track and analyze errors in your application, allowing you to identify and fix issues more efficiently.

Example:
```js
    const [pageName, setpageName] = useState('LoginPage');
    // Set page name / component name
    const logError = useErrorLog(pageName);

    try {
        //... login logic
    } catch (error) {
        // (error name, error msg, data (optional) )
        logError('LOGIN_FAIL', error.message, { username: username });
    }
```

### useRenderLog
Usage:
RecordButton calls useRenderLog with current pathname and recording flag, and it will log the page render with pathname and timestamp when recording is on. This can be used to track page visits and render times. Normally you would not need to call useRenderLog directly, but you can use the log data for performance analysis or user behavior tracking.


## logToCypress.js
This script reads logs from a specified input file, translates them into Cypress test code, and writes the generated code to a specified output file. You can run this script using Node.js, providing the input and output file paths as command-line arguments. If no arguments are provided, it defaults to 'custom_log.txt' for input and 'generated_test.cy.js' for output.

### Usage
```
node logToCypress.js [inputFile] [outputFile]
node logToCypress.js log.txt generated_test.cy.js
```