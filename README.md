JavaScript IsBad Function
===============================

Author: Mitchell Stokely

Version: 1.0

License: GNU GENERAL PUBLIC LICENSE VERSION 3

Summary: JavaScript IsBad Function is a method to detect bad values.

Description: JavaScript (ECMAScript) uses "dynamic variables", which means they can change type, object, and value at any time. Bad design! As such, JavaScript runs the constant risk of blowing up whnever it access variables. Many will say, that should enevr happen. And they try and build checks to avoid common errors. But the past 20+ years JavaScript has consistently generated billions of errors in websites all over the world by the fact that a single error can stop your scripts from running in a web page and web browser. There are also the open possibility with JavaScript variables that they could be reassigned a completely different data type, or be type cast or coerced to some alien value that is totally unexpected!

To avoid this problem, I have build a simple "IsBad()" JavaScript function that allows you to quickly check if your variable, function, or object has created a value that might blow up your scripts, create bad objects and numeric values, generate a bad math calculation, return a dangerous variable result or logic condition, or simply create an error/ exception you are not prepared to handle. I have found there are hundreds of crazy scenarios where unepected things can occur in JavaScript that create terrible results. So, with my function, you can quickly return a Boolean value (true/false) that will tell you if a variable value is "good" or "bad".

Because "badness" in 2022 especially is a semi-objective idea with many fors of interpretation, you may want to review the logic in the function and "tweak it" to fit your own personal data requirements. But below is a simple summary of what is considered "bad" in the function.

"bad" data the JavaScript function flags as true:

1. empty strings: "" '' ``
2. tabs/carriagereturns/newlines: \t\n\r
3. NaN, including from calculations, assigned, or returned result values
4. undeclared or uninitialized variables (see undefined)
5. undefined primitive values and unassigned variables which return the undefined property
6. null
7. Infinity: Infinity, +Infinity, -Infinity
8. empty arrays: []
9. empty objects: {} including those without properties or keys
10. empty functions: function(){}
11. empty boxed primitives or values for new Number(), new Object(), new Boolean(), and new String()
12. Bad or Invalid Dates
13. Empty RegEx which occurs when you return "/(?:)/" indicating an undefined or empty regex value
14. Bad Numbers, Number constructors, or calculations returned as NaN values
15. Numbers outside the safe integer ranges (beyond +-9007199254740991)
16. BigInts outside the JavaScript MAX_VALUE range (beyond 1.79e+308)
17. Floats within 9 decimal precision ranges or the +-Number.MAX_VALUE to +-Number.MIN_VALUE range 

* All these are customizable

Once you get a "true" response to "IsBad()", you can then tell your script to do something to avoid the error. I have also added an additional function called "IfBad()" that allows you to return a default value from the function if the data value is bad. This is extremely helpful in allowing you to use a default that works with your math equation or logic, should the value come back corrupted or not what you expect. This is especially critical in mathematical calculations.

Cross-browser Issues: Keep in mind this script is not designed to work in many older browsers (pre-2015) like Internet Explorer or any browser that does not support ES2020 which includes support for the BigInt type. It has not been tested in older browsers, either. So until that is done, use this script with caution! However it will work in the majority of modern scripting engines, like Chrome's' V8 engine.

The "IsBad()" function is in a SINGLE JAVASCRIPT FILE so very easy to copy-and-paste into your web project then link to in your web page. It also includes rich comments to help you customize or understand the logic. Feel free to minimize and compress the file.

In addition, I have added a very comprehgensive "IsBadTester()" function with a giant array of bad data values you can run in the browser console developer tools to check what exactly the IsBad() function returns for various types of numeric and non-numeric data. Just run the same tester in JavaScript and it will list in the console window of the browser's developer tools a large kist of "bad" and "good" data you can review. Feel free to add to my list and run your own tests!

Inside the Please keep in mind this is Version 1.0 of this function, and it will likely have many add-ons, including a complete string-to-numeric parser, better bad boolean detection so you avoid false values, and other goodies. But for now, it is ok as is.

- Mitchell Stokely, 2022
---
