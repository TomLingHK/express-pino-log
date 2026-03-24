# express-pino-log
Use pino in an express server to log frontend activities. You should set up the env variable `REACT_APP_DEV_LOG_URL` in your frontend application to send record log request to the express server.

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

## Table of Contents
- [useLog](#uselog)
- [useInputLogEffect](#useinputlogeffect)
- [Record log in frontend application](#record-log-in-frontend-application)
- [logToCypress.js](#logtocypressjs)


## useLog

### useActionLog
Usage:
To log user actions, for example: logging in, filtering items, adding to cart, etc. You can call the `logAction` function with a custom action name and optional data to log specific user interactions. This can help you track user behavior and identify areas for improvement in your application.

Example:
```js
    const pageName = useRef('LoginPage');
    // Set page name / component name
    const logAction = useActionLog(pageName.current);
    // (actionName, data (optional) )
    logAction('LOGIN_ATTEMPT', { username: username });
```

### useApiLog
Usage:
To log API calls, you can use the `logApi` function to record details about the API endpoint, HTTP method, response data, and any additional data you want to include. This can help you monitor API usage, identify performance issues, and track errors in your application.

Example:
```js
    const pageName = useRef('LoginPage');
    // Set page name / component name
    const logApi = useApiLog(pageName.current);
    await login(username, password).then(result => {
        // (endpoint, method, return data, data (optional) )
        logApi('/api/login', 'POST', result, { username: username });
    })
```

### useButtonLog
Usage:
To log button clicks, you can use the `logClick` function to record which buttons are being clicked by users. This can help you understand user interactions with your application and identify which features are most popular or may need improvement.

Example:
```js
    const pageName = useRef('LoginPage');
    // Set page name / component name
    const logClick = useButtonLog(pageName.current);

    const tryLogin = () => {
        // (buttonId of data-cy for cypress, data (optional) )
        logClick('loginButton', { username: username });
        //... login logic
    }
```

### useComponentLog
Usage:
To log component with detailed props, you can use the `logProps` function to record props whenever props change.

Example:
```js
function NewChatPopup(props) {
    const { newChatCount, pageLang } = props;

    const componentName = useRef('NewChatPopup');
    // Set component name
    const logProps = useComponentLog(componentName.current);
    
    useEffect(() => {
        // (props object of the component)
        logProps(props);
    }, [newChatCount, pageLang])
}
```

### useInputLog
Usage:
To log the text value of an input, you can use the `logInput` function to record change of input. Recommend to use within `useInputLogEffect`.

Example:
```js
    logInput('usernameInput', 'Michael');
```

### useErrorLog
Usage:
To log errors, you can use the `logError` function to record error details such as error name, error message, and any additional data you want to include. This can help you track and analyze errors in your application, allowing you to identify and fix issues more efficiently.

Example:
```js
    const pageName = useRef('LoginPage');
    // Set page name / component name
    const logError = useErrorLog(pageName.current);

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

## useInputLogEffect:
A custom hook to log a text input. It would log the input if the value doesn't change for a certain delay of time. A cleanup function ensures the value is logged before the unmount of the page.

Params:
- Page name
- data-cy of the element
- Binding state of the input value
- Delay time to mesaure change of input value (default 3000ms)

Usage:
```js
const [username, setUsername] = useState('');
// (page name, inputId of data-cy for cypress, value state of the input, delay (optional) )
useInputLogEffect("HomePage", "usernameInput", username, 3000);
```


## Record log in frontend application
When the record btn is clicked, it would start recording logs from `useLog`. When the recording ends, it would download a txt file which contains all logs being recorded during the duration. The recording continues even when user changes to different pages of the application. Api data retrieved before the recording starts would not be recorded, you might want to start recording before you change to a new page.

With the txt file, you may translate it to a Cypress test code using `logToCypress.js`. It can serve as a quick draft for Cypress test code and simulate the situation of user reported bug in Cypress.

Usage:

In your react application, only show the record button on development or testing environment. `RecordButton` contains all logic to record log. Ensure `logger` utils and `useLog` hook is available for this component to access.

```js
{process.env.REACT_APP_IS_PROD === 'FALSE' && <RecordButton />}
```


## logToCypress.js
This script reads logs from a txt file, translates them into Cypress test code, and writes the generated code to a specified output file. You can run this script using Node.js, providing the input and output file paths as command-line arguments. If no arguments are provided, it defaults to 'custom_log.txt' for input and 'generated_test.cy.js' for output.


### Usage
```
node logToCypress.js [inputFile] [outputFile]
// Example:
node logToCypress.js log.txt generated_test.cy.js
```

### Detail translation:

#### Render Log
Translate into assertion of route change by checking url pathname. 

Example:
```js
cy.location('pathname').should('eq', '/home');
```

#### Button Log
Translate into an action of button click of the provided data-cy id.

Example:
```js
cy.get('[data-cy="loginButton"]').click();
```

#### API Log
Translate into intercept code which stub network requests and responses.

Example:
```js
cy.intercept('POST', '/getUserDetails', {
    statusCode: 200,
    body: {
    "code": "Success",
    "message": "Success",
    "data": {
        "id": 345,
        "name": "Michael"
    }
}
```

#### Input Log
Translate into an action of typing into input of the provided daya-cy id.

Example:
```js
cy.get('[data-cy="usernameInput"]').type("tester1");
```

## logToComponentTest.js
This script reads logs from a txt file, translates them into Cypress test code, and writes the generated code to a specified output file. It targets component testing to focus on how different props of component affect the component. You can run this script using Node.js, providing the input and output file paths as command-line arguments. If no arguments are provided, it defaults to 'custom_log.txt' for input and 'generated_test.cy.js' for output.

### Usage
```
node logToComponentTest.js [inputFile] [outputFile]
// Example:
node logToComponentTest.js log.txt generated_test.cy.js
```