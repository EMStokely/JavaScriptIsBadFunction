JavaScript IsBad Function
===============================

Author: Mitchell Stokely

Version: 1.0

License: GNU GENERAL PUBLIC LICENSE VERSION 3

Summary: JavaScript IsBad Function is a method to detect bad values.

Description: JavaScript (ECMAScript) uses "dynamic variables", which means they can change type and value at any time. Bad design! As such, JavaScript runs the constant risk of blowing up whenever it accesses variables!

Many will say, that should rarely happen the way they manage block-level variables and use conditional checks. But the past 20+ years JavaScript has consistently generated billions of errors in websites all over the world, shutting down browsers, blocking data, and destroying page views in millions of browsers around the world. A single error can stop your scripts from running in a web page and disable a web page for millions of people instantly. There is also the open possibility with JavaScript variables that they could be reassigned a completely different data type, be missing/undeclared, or be miscast/coerced to some alien value that is totally unexpected. This then blows up a database, pollutes JSON values, or wrecks some other data storage or transfer format.

To avoid this problem I have built a simple "IsBad()" JavaScript function that allows you to quickly check if your variable, function, or object has created a value that might blow up your scripts, create bad objects, create out-of-range numeric values, generate a bad math calculation, return an empty value, is undefined, is NaN, is null, or would simply create an error or exception you are not prepared to handle. It will handle any type of number, string, date, object, or other data type coming in and quickly give you a general idea via a simple boolean value if anything "bad" has occurred in the value run through the function. I have found there are hundreds of crazy scenarios where unexpected things can occur in JavaScript that create terrible results. So, with my "IsBad()" function, you can quickly return a Boolean value (true/false) that will tell you if a variable value is going to cause an unexpected problem.

Because "badness" (in 2022 especially) is a semi-objective idea with many interpretations, you may want to review the logic in the function and "tweak it" to fit your own personal data requirements. Below is a simple summary of what is considered "bad" in the function. I find these checks are extremely helpful, and help you avoid a wide range of JavaScript's kooky "coercion" rules in how data is mis-translated, mis-typed, and mis-cast in your software application.

Values the JavaScript function flags as true or "bad" include:

1. empty strings: "" '' ``
2. empty strings with tabs/carriagereturns/newlines: \t\n\r
3. NaN, including those originating from calculations, assigned, or returned from result values
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

Once you get a "true" response to "IsBad()", you can then tell your script to do something to avoid the error. I have also added an additional function called "IfBad()" that allows you to return a default value from the function if the data value is bad. This is extremely helpful in allowing you to use a default that works with your math equation or logic, should the value come back corrupted or not what you expect. This is especially critical in math calculations. Example, if a very tiny float, empty string, or false boolean gets coerced into 0 and you are doing division with it, it could return NaN or +-Infinity and ruin your day!

Cross-browser Issues: Keep in mind this script is not designed to work in many older browsers (pre-2015) like Internet Explorer or any browser that does not support ES2020 which includes support for the new BigInt type. It has not been tested in older browsers, either. So until that is done, use this script with caution! However it will work in the majority of modern scripting engines, including Chrome's V8 engine.

The "IsBad()" function is in a SINGLE JAVASCRIPT FILE so very easy to copy-and-paste into your web project with zero hassles. Then link to it in your web page. It also includes rich comments to help you customize or understand the logic. Feel free to minimize and compress the file.

In addition, I have added a very comprehensive "IsBadTester()" function with a giant array of typical BAD JAVASCRIPT DATA VALUES you can run and then review as results in the browser console developer tools. This allows you to check what exactly the IsBad() function returns for various types of numeric and non-numeric data. Just run the "IsBadTester()" function and it will list in the console window of the browser's developer tools a large list of "bad" and "good" data test results returned from the "IsBad()" function you can review. Feel free to add to my my bad data list and run your own bad data tests!

HOW IT WORKS

IsBad(value,type) - IsBad takes two arguments: The Value you are testing and an optional Type. This allows you to either test your value against all types and let the function return a true/false if your value matches one of dozens of "bad" values or ranges. This might be helpful if you do not know the starting type. If you do expect a specific type (string, number, boolean, object. etc.), its very helpful to tell the function what JavaScript type (object or primitive type) you expect, so it can then focus on alerting you if its the wrong type, but also if its the right type but failed some other test.

Example:

let mynumber = "hello";
IsBad(mynumber,"number") - This would return true (its bad!) because you expected a number but your variable was assigned to a text string in your program. The type is optional. Without the "number" type argument, the text string would be ok (return false) because its a valid value without the type check. There are many more complicated type scenarios, but this gives you the basic idea.

BONUS!

In addition to the basic "IsBad()" data tester funtion, I have added an overload of the function called "IfBad(value,type,default)". You can now have the function return a "default value" if bad data is detected.

Example:

IfBad(x,"string","hello") would return "hello" if your value for "x" was a non-string value.

Even better, I have added a full suite of excellent function for true "null" and a fast IsNum() numerical values checker and a IsStrictNum() true integer checker. Included is an error-checking JavaScript function deal with holes and bugs in the new null coalesce, truthy, falsy, or conditional ternary operators in ECMAScript (that have failed or confused programmers in many scenarios). These new functions allow you to purely check for edge-case values that might blow up your JS applications, or which combine the checks of multiple other operators into one. The IsBad() mother function included most of these features alread. But these functions allow you a narrower target for detecting smaller bug-checking scenarios in your data. And like IfBad(), all have built in default value return parameters so you can easily call these inside expressions and keep your code logic moving forward. They include the following new functions in JavaScript:

- IsEmpty()/IfEmpty()
- IsNum()/IfNum()
- IsStrictNum/IfStrictNum()


Please keep in mind this is version 1.0 of these functions, and they will likely have many new goodies and improvements going forward.

- Mitchell Stokely, 2022

---
