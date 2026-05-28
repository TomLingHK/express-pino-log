# Log Processing Workflow Guide

The `translate_log_and_comment.yaml` workflow automatically converts application logs into Cypress test files. It supports two methods for providing logs:

## Method 1: Inline Logs (Recommended for small logs)

Paste your logs directly in the issue description using a code block:

```logs
[Render Log] (/)
[Button Log] Button click: recordBtn
[Input Log] Input: recordingName Value: MyRecording
[API Log] API_name: upload Method: POST Data: {"id": "123", "data": "test"}
[Button Log] Button click: submitBtn
```

The workflow will automatically extract and process them.

---

## How It Works

When you create or edit an issue with logs:

1. **Extract** - The workflow detects which log source is provided (inline or URL)
2. **Download** - Logs are extracted or downloaded to `input_log.txt`
3. **Process** - The `logToCypress.js` script converts logs to Cypress test syntax
4. **Generate** - A `.cy.js` test file is created and uploaded as an artifact
5. **Notify** - The issue is commented with a download link to the artifact

---

## Log Format Reference

The workflow recognizes these log tags:

- `[Render Log] (path)` → Asserts navigation to a route
- `[Button Log] Button click: name` → Cypress click command
- `[Input Log] Input: fieldName Value: data` → Type command
- `[API Log] API_name: endpoint Method: GET/POST Data: {...}` → Intercept command

Example:
```logs
[Render Log] (/)
[Input Log] Input: username Value: testuser
[Input Log] Input: password Value: pass123
[Button Log] Button click: loginBtn
[Render Log] (/dashboard)
[API Log] API_name: getUserData Method: GET Data: {}
```

---

## Troubleshooting

- **No logs detected**: Ensure logs are in one of the three supported formats
- **404 errors on URL downloads**: This is why Methods 1 and 2 are recommended
- **Empty output file**: Check workflow logs in the Actions tab for details

