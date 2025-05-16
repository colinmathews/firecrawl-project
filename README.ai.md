To implement this, I would use a middleware function if it's a web-based service like Node.js application. If Firecrawl is a function call within your program, you can directly use console logs and the Date object to track the time before and after execution.

Approach for Web-based service (Express in Node.js):
Middleware functions in Express.js can log to the console the start time of the request, then pass control to the next middleware function in the sequence (including your Firecrawl execution), and be triggered again after response is sent to client, logging the end time.

Here is a simple Node.js middleware using express that logs the timing information:

```javascript
var express = require('express');
var app = express();

app.use((req, res, next) => {
    let startTime = new Date().getTime(); // start time
    console.log(`Firecrawl service called at ${new Date(startTime)}`);
    
    res.on('finish', () => {
        let endTime = new Date().getTime(); // end time
        console.log(`Response sent at ${new Date(endTime)}, Total time ${endTime-startTime} ms`);
    });

    next();
});

app.get('/firecrawl_service', (req, res) => {
    // Firecrawl service execution code
});
```

Approach for Function call:

```javascript
function firecrawlServices() {
    // Firecrawl service execution code
}

console.log('Firecrawl service is going to be called...');
let startTime = new Date().getTime(); // Execution start time
firecrawlServices();
let endTime = new Date().getTime(); // Execution end time
console.log(`Firecrawl service was executed. Total execution time: ${endTime-startTime} ms`);
```

In both these cases, you can see a log message in the console before and after calling the Firecrawl service, and it will include the timing information.