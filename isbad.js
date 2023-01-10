/*
JavaScript IsBad Function
------------------------------------------------------------
Author: Mitchell Stokely
Version: 1.0, 2022
License: GNU GENERAL PUBLIC LICENSE VERSION 3
 Summary: JavaScript IsBad Function is a method to detect bad values.
------------------------------------------------------------
*/

// UNIVERSAL ERROR CHECKER : "IsBad()" and "IfBad()" w/ default value
// There was too many ways bad coercion, calculations, casts, and corrupt data in JavaScript create problems. This script below was designed to check for presence of valid values and return a true-false response.

// "IsBad" FUNCTION
// Detect empty, missing, or bad values and returns a default value when used with extra function below. Detects as Empty or "Bad" the following:

// 1. empty strings: "" '' ``
// 2. empty strings with tabs/carriagereturns/newlines: \t\n\r
// 3. NaN, including those originating from isNaN, Number.isNaN, calculations, assigned, or returned from result values. Note: 0 and -1 are not included.
// 4. undeclared or uninitialized variables (see undefined)
// 5. undefined primitive values and unassigned variables which return the undefined property
// 6. null
// 7. Infinity: Infinity, +Infinity, -Infinity
// 8. empty arrays: []
// 9. empty objects: {} including those without properties or keys
// 10. empty functions: function(){}
// 11. empty boxed primitives or values for new Number(), new Object(), new Boolean(), and new String()
// 12. Bad or Invalid Dates
// 13. Empty RegEx which occurs when you return "/(?:)/" indicating an undefined or empty regex value
// 14. Bad Numbers, Number constructors, or calculations returned as NaN values
// 15. Numbers outside the safe integer ranges (beyond +-9007199254740991)
// 16. BigInts outside the JavaScript MAX_VALUE range (beyond 1.79e+308)
// 17. Floats within 9 decimal precision ranges or the +-Number.MAX_VALUE to +-Number.MIN_VALUE range

// Note: 0 (zero) will NOT be flagged as a bad value, though in the case of floats smaller than +-5E-324 will coerce them to 0. This could cause issues! Also 0/0 returns NaN, so we would catch bad calculations but not the numbers in the equation. +-1/0 is -+Infinity and the same problem if trying to avoid bad division. So use IsBad() for calculation but keep in mind 0 is not shown as a bad value beforehand.
// "IsBad" is a useful tool to indicate a variable has a bad, empty, or non-value, or is an object in a state where nothing can be done with it. It helps you avoid weird issues where false truthy statements occur, and allows developer to avoid the variable value or reset it since it has no assigned value or zero use cases in program logic. Also avoid math errors like dividing by zero, NaN, etc.
// Note: Empty Objects are NOT always empty, as they are still objects with a point to other shared variables They can contain no properties or keys so truly useless and flagged as bad.
// Note: Empty Arrays (new Array()) or empty created arrays ([]) actually have no object assigned and are "undefined" so empty. So these variables will be flagged as bad for the test. These empty arrays are basically the same as unassigned or uninitialized so are NOT arrays or objects and return "undefined".
// Note: Because of the issues with +-Infinity, NaN, undefined, etc in math equations, those are also flagged as a "bad" values.
// * Sister function "IfBad()x,d)" returns a "default value" of the developer's choice. Because the definition of "bad" values is subjective, remove or add number ranges, acceptible dates, +-Infinity, etc as needed.

// ------------------------------------------------------------

// "IfBad()" is an overload for "IsBad()" and returns either the original "x" parameter entered, or a default "d" value of the developers choice if a bad or empty value is detected. This powerful version allows you to embed this function into expressions in JavaScript and keep processing values rather than stop and do conditional checks!

// x = value to test
// t = type of value expected ("number", "string", etc)
// d = default value returned if value is bad


function IfBad(x,t,d) {
    'use strict';
    if (IsBad(x,t)) {
        return d;// return a default value if bad
    } else {
        return x;// return original value if good
    }
}

// ------------------------------------------------------------

// "IsBad()" returns true-false boolean
// Optional: You canm also assign this function to the prototype, if needed as a property of all prototypes using the following: "Object.prototype.IsBad = function (x){}"

// x = value to test
// t = type of value expected ("number", "string", etc) <<< THIS IS OPTIONAL!

var IsBadMessage = '';
function IsBad(x,t) {

    'use strict';

    IsBadMessage = 'IsBad() : no message';

    try {

        // Check "type" if caller has entered a type argument.
        let type = 0;
        let types = ["none", "number", "bigint", "string", "boolean", "date", "array", "regex", "function", "symbol", "object"];
        if (t) {
            type = types.indexOf(t.toString().toLowerCase());
        }

        // Undefined Check
        // This catches two undefined scenarios, if a variable has been defined/declared or declared but not initialized or assigned a value:
        // 1. The first check catches a variable that does NOT exist (undefined/undeclared) that has a type of 'undefined', or a declared variable that is not initialized/assigned to a value yet (assigned to the undefined primitive).
        // 2. The second check catches the latter part of the logic above, a declared variable that is not initialized/assigned to a value yet (assigned to the undefined primitive).
        if (typeof x === 'undefined' || x === undefined) {
            IsBadMessage = 'IsBad() : result=true : type=undefined : undefined';
            return true;
        }

        // Null Check
        // Note: This does not coerce a null from a variable like '==' would do, just checks for the explicit value.
        if (x === null) {
            IsBadMessage = 'IsBad() : result=true : type=Object (null) : null';
            return true;
        }

        // ALERT: Catch All Symbol Checks here as they are always unique and never bad data! Symbols can not be empty and dont have constructors so cannot be created using "new Symbol()".
        if ((type === 0 || type === 9) && typeof x === 'symbol') {
            IsBadMessage = 'IsBad() : result=false : type=Symbol : Symbol';
            return false;
        }

        // SPECIAL CASE : NaN in JavaScript
        // 'NaN' is a member of the 'Number' type but is not a legal number. Bad calculations or conversions return NaN. Beware that Numbers can also be assigned or return null, return undefined as a property like when a variable doesnt exist, or be assigned directly the undefined primitive. Examples are 0/0 returns NaN, but 1/0 returns Infinity, -1/0 -Infinity.
        //  ALWAYS CHECK FOR NaN! Why? (see below)
        // In most programs, NaN either cannot be translated correctly from javaScript into many types, is read as an error, or creates a new error in 3rd party applications when read! It also is created when math functions fail like 0/0.
        // Do NOT use legacy "isNaN" as in (isNaN && isNaN(x)), use Number.IsEmpty(x) instead, as "isNaN" tries to convert/coerce the value and some values would fail or have surprising behavior! Using Number.isNaN() allows a check of the actual value without conversion.
        // Writing NaN to a database or in an HTTP request usually ends up either causing an error or ending up as a null value. So better to CONVERT NaN or use a default replacement than count on NaN values.
        // NaN is not representable in JSON, and gets converted to 'null'. So good to avoid with this check here and force the developer to explicitly assign "null", 0, "", or some value instead of an unexpecxted NaN turned to null.
        // "x !== x" is a good NaN check for older/newer browser script engines, as only true for NaN since it can never equal itself. This check in a conditional will always flag a NaN value.
        // Note that Number.isNan works better for all numerical checks, including Integer and BigInt where isNan will blow up on BigInts! x != x is a good fallback as only NaN never equals itself.Only use isNaN for bad date checks in the logic only far below.
        // Note that some calculations using valid numbers can create NaN like Math.sqrt(-1). We do not test those as we cannot assume what the caller intends.

        // These ways return NaN:
        //alert(4 + 'hello');// '4hello' - again concat "+" string rules prevent errors
        //alert(4 - 'hello');// NaN
        //alert("foo" / 3);// NaN
        //alert(parseInt("blabla"));// NaN
        //alert(parseFloat("blabla"));// NaN
        //alert(Number(undefined));// NaN
        //alert(Number(NaN));// NaN
        //alert(0/0);// NaN
        //alert(Math.sqrt(-1));// NaN
        //alert(0 * Infinity);// NaN
        //alert(7 ** NaN);// NaN
        //alert(7 ** undefined);// NaN


        // NaN : Other Not A Number examples to be careful of using "isNan" which coerces values (not Number.isNaN)

        // (x !== x)        // ONLY true if x the variable is NaN
        //isNaN(NaN);       // true
        //isNaN(undefined); // true - shows that "NaN" explicitly was not returned but still value NaN
        //isNaN({});        // true

        //isNaN(true);      // false - confusing but because "true" can be coerced into "1"
        //isNaN(null);      // false - confusing because rules for "null" shift. In most cases become "0"
        //isNaN(37);        // false
        //isNaN(0/Infinity));// false as returns 0

        // STRINGS
        //isNaN('37');      // false: "37" is converted to the number 37 which is not NaN
        //isNaN('37.37');   // false: "37.37" is converted to the number 37.37 which is not NaN

        // DIFFERENCE BETWEEN isNaN and Number.isNaN
        //isNaN("37,5");    // true - this value is coerced to a number and fails!
        //alert(Number.isNaN("37,5")); // false - this value is NOT coerced and accepted as string

        //isNaN('123ABC');  // true:  parseInt("123ABC") is 123 but coerced Number("123ABC") is NaN
        //isNaN('');        // false: the empty string is converted to "0" which is not NaN
        //isNaN(' ');       // false: a string with spaces is converted to "0" which is not NaN

        // DATES
        //isNaN(new Date());                // false
        //isNaN(new Date().toString());     // true -  dangerous as this numeric value is a large time conversion in but could be misisng, bad time, out of range time, wrong time, etc.

        // NaN will always be unequal to itself in comparisons but not using Number.isNaN or isNaN:
        //NaN === NaN;        // false
        //Number.NaN === NaN; // false
        //isNaN(NaN);         // true
        //isNaN(Number.NaN);  // true
        //Number.isNaN(NaN);  // true

        //function valueIsNaN(v) { return v !== v; }
        //valueIsNaN(1);          // false
        //valueIsNaN(NaN);        // true
        //valueIsNaN(Number.NaN); // true

        // isNaN vs Number.isNaN
        // isNaN will always coerce first then check that value if NaN
        // Number.isNan will never coerce and just see if the value is NaN explicitly
        // However, do note the difference between isNaN() and Number.isNaN(): the former will return true if the value is currently NaN, or if it is going to be NaN after it is coerced to a Number type, while the latter will return true only if the value is currently and explicitly NaN.
        // isNaN('hello world');        // true
        // Number.isNaN('hello world'); // false

        // Avoid BigInt accept with Number.isNaN as plain isNaN will try and coerce to Number and fail:
        // isNaN(1n);        // TypeError: Conversion from 'BigInt' to 'number' is not allowed.
        // Number.isNaN(1n); // false

        // This is a false positive and the reason why isNaN is not entirely reliable
        // isNaN('blabla');// true - confusing as "blabla" is converted to a series of encoded numbers

        // YOU CANNOT FULLY TRUST Number.isNaN, as shown above so better to write your own function that tests all types of characters for any non-numbers, does NOT try to coerce values to numbers like JavaScript does, and allows you to return a "default" value when it fails: Globals.IsNumber(x,0);<<< defaults to 0

        // You can always return NaN though it is not recommended
        //function sanitise(x) {
        //  if (isNaN(x)) {
        //    return NaN;
        //  }
        //  return x;
        //}

        // RECOMMENDED isNumeric() Check like in jQuery:
        //function isNumeric(n) {
        //    return !isNaN(parseFloat(n)) && isFinite(n);
        //}


        // BETTER WAY TO CHECK FOR ANY TYPE IN JAVASCRIPT WAS ADDED BELOW!
        // All Types in JavaScript can be checked using 'constructor' as follows:
        // let x = 12345;
        // (typeof x !== 'undefined' && (x).constructor === Number);// true
        // ALERT: 'constructor' type checks are confirmed on both the primitice and "new" object versions!


        // Array and Array Constructor Check : Since all array are objects, we check array before object test below. Arrays, unlike Number, String, etc. does NOT have a Array "typeof" primitive type, as it is an object.

        if ((type === 0 || type === 6) &&
            Array &&
            (x instanceof Array
                || (Object.prototype.toString.call(x) === '[object Array]')
                || Array.isArray(x)
                || (x).constructor === Array)
            && (typeof x.length === 'number')
        ) {
            if (x.length === 0) {
                IsBadMessage = 'IsBad() : result=true : type=Array (empty) : ' + x;
                return true;
            } else {
                // Check array for bad values. If one appears, report the array as problematic.
                if (x.indexOf(null) >= 0 || x.indexOf(undefined) >= 0 || x.indexOf(NaN) >= 0) {
                    IsBadMessage = 'IsBad() : result=true : type=Array (has bad values) : ' + x;
                    return true;
                } else {
                    IsBadMessage = 'IsBad() : result=false : type=Array : ' + x;
                    return false;
                }
            }
        }


        // String Primitive and String Object Constructor Check
        if ((type === 0 || type === 3) &&
            ((typeof x === 'string')
                || (String && (x instanceof String || (Object.prototype.toString.call(x) === '[object String]') || (x).constructor === String)))) {
            // Note: "new String()" creates an empty string "" so is a bad value in this function, unlike new Number and new Boolean values.

            // We can convert both string primitive and string objects to a string to test if empty.
            var testString = String(x);
            if (String.prototype.trim) {
                testString = testString.trim();
            }
            if (String.prototype.replace) {
                // Matches multi-spaces, global, all matches, unlimited lines. alternative (/^\s*$/).
                testString = testString.replace(/^\s+|\s+$/gm, '');
                // Matches tabs, carriage returns, and new lines.
                testString = testString.replace(/[\t\n\r]/gm, '');
            }
            if (testString === '') {
                IsBadMessage = 'IsBad() : result=true : type=String (empty) : ' + x;
                return true;
            } else {
                IsBadMessage = 'IsBad() : result=false : type=String : ' + x;
                return false;
            }

            // OPTIONAL : If later you want to test a string as having valid values, use below.
            // var intRegex = /^\d+$/;
            // var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
            // var str = $('#myTextBox').val();
            // if(intRegex.test(x) || floatRegex.test(x)) {
            //    alert('I am a number');
            // }
            // var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
            // if (numberRegex.test(x)) {
            //    alert('I am a number');
            //}

        }


        // Boolean Primitive and Boolean Object Constructor Check
        // ALERT: For now all booleans are flagged as non-bad as even bad values get coerced to true-false!
        if ((type === 0 || type === 4) && (typeof x === 'boolean')) {

            // If a bad or missing value comes in for a Boolean primitive, whether explicit or coerced, we flag the value as bad.
            if (x === true || x === false) {
                IsBadMessage = 'IsBad() : result=false : type=Boolean : ' + x;
                return false;
            } else {
                IsBadMessage = 'IsBad() : result=true : type=Boolean (bad) : ' + x;
                return true;
            }

        } else if ((type === 0 || type === 4) &&
            (Boolean && (x instanceof Boolean || (Object.prototype.toString.call(x) === '[object Boolean]') || (x).constructor === Boolean))) {
            // If a new Boolean() object is created with any properties assigned, do not flag it as "bad" or check for values below.
            for (const prop in x) {
                IsBadMessage = 'IsBad() : result=false : type=Boolean (with properties) : ' + x;
                return false;
            }

            // We type cast the Boolean, which in most cases when created using "new Boolean()" will return at least a false. Note: We cannot check if it stores a value but in most cases, like Number creating 0 or String creating "", Boolean will create false.
            if (Boolean(x) === true || Boolean(x) === false) {
                IsBadMessage = 'IsBad() : result=false : type=Boolean : ' + x;
                return false;
            } else {
                IsBadMessage = 'IsBad() : result=true : type=Boolean (bad) : ' + x;
                return true;
            }
        }



        // Number Primitive Check

        // Numbers inslude both integers, floats or decimals, and all ina nd out of range values, including NaN, null, undefined, and +-Infinity. BigInt is a NEW ES2020 type that supports numbers past the 9 billion or 1E15 integer range and includes all numbers up to the MAX or 5E308 (JavaScripts memory/storage limit). BigInt cannot process floats or decimals only whole numbers.
        // ALERT: Bad calculations or conversions return NaN. Beware that Numbers can also be assigned or return null, return undefined as a property like when a variable doesnt exist, or be assigned directly the undefined primitive. Examples are 0/0 returns NaN but 1/0 returns Infinity, -1/0 -Infinity.
        // Number()	Returns a number, converted from its argument or NaN if no conversion. Null returns 0 a number, but NaN and undefined return NaN value which is NOT a Number type! Infinity is also a Number!
        // parseFloat()	Parses its argument and returns a floating point number or NaN if no conversion. Only the first number is returned. Overflow of very large numbers have weird results, sometimes returning tiny numbers for big ones, but the string version something different. Null, NaN, and undefined all return NaN value which is NOT a Number type! Infinity is also a Number!
        // parseInt()	Parses its argument and returns an integer or NaN if no conversion. Parses a string and returns a whole number. Spaces are allowed. Only the first number is returned. If a true Number is inserted its turned into a string then reparsed back to a number. Overflow of very large numbers have weird results, sometimes returning tiny numbers for big ones, but the string version something different. Null, NaN, and undefined all return NaN value which is NOT a Number type! Infinity is NOT a Number!
        // If you exceed +-9 billion (Number.MAX_SAFE_INTEGER/Number.MIN_SAFE_INTEGER) as an integer better to save the value as a text string to conserve memory and avoid precision errors. Anything between that max/min integer type and the BigInt max which is 5E+-308 benefits from turnimng number into strings.
        // New ES2020 intriduces BigInt() which can only be BigInt() (not new BigInt() objects unlike Number). BigInt allows you to safely and with precision store non-floating or non-decimal +- numbers beyond the integer same max and min of +-9 billion. They still lost accuuracy beyond memory JavaScript max of +-5E308. You cannot use, convert, or store floating point decimal numbers in bigint, only whole numbers.
        // ALERT: Weird results can occur trying to convert dates and strings using the above to and from numbers, which might pass the test but return "Invalid Date", 0 in some cases, or other weird results!
        // Avoid all use of "==" or "===" when comparing floating point numbers as when coerced you can lose precision in floats or decimals so comparisons fail.
        // Boolean-to-Number conversion is always predictable, as Boolean conversions ALWAYS coerce all 0 types of numbers to FALSE, as well as undefined, null, "", NaN, etc. All others are always TRUE!
        // Floating point arithmetic is not always 100% accurate:
        //let x = 0.2 + 0.1;// not equal to .3! and is inaccurate unless you divide as below
        //To solve the problem above, it helps to multiply and divide:
        //let x = (0.2 * 10 + 0.1 * 10) / 10;
        // REGEX Numbers from Strings: use in a function that tries to parse strings of numbers to number
        //value.match(/^\d+$/)// use for saying match any number of numbers in a value string that only has numbers
        // Strings to Numbers useing Basx. When you use "somenumber.toString(10)" you are saying convert the number to a new base, in this case Base10 decimal. Example:
        //var num = 255;
        //num.toString(16); // Outputs: "ff"
        //num.toString(10); // Outputs: "255" <<< use this to see if you can convert the value to decimal number
        //num.toString(2); // Outputs: "11111111"

        // ISNAN() FUNCTIONS (how used below)
        // isNaN('hello world');// true - CONVERTS VALUE TO NUMBER AND IF "NaN" IS RETURNED
        // Number.isNaN('hello world');// false - CHECKS ONLY FOR "NaN" VALUE NOT IF VALUE IS NUMERIC!
        // let x = + 'hello' does a Number() implict conversion, returns number of NaN




        // This logic below checks for the raw "window.NaN" explicit value assigned to the variable without number coercion!
        // Note: We avoid using "isNaN" vs "Number.IsNaN" as the former would coerce all values to Number types and valid values like strings or objects would fail conversion. The check below ONLY looks for the value of NaN (window.NaN) explicitly set to the variable!

        if ((type === 0 || type === 1) && ((x !== x) || (Number.isNaN(x)))) {
            IsBadMessage = 'IsBad() : result=true : type=Number.NaN : NaN';
            return true;
        }

        // Infinity Check : Force empty response.
        if ((type === 0 || type === 1) &&
            (x === Infinity
                || x === +Infinity
                || x === -Infinity
                || (Number.POSITIVE_INFINITY && x === Number.POSITIVE_INFINITY)
                || (Number.NEGATIVE_INFINITY && x === Number.NEGATIVE_INFINITY))) {
            IsBadMessage = 'IsBad() : result=true : type=Number.Infinity : ' + x;
            return true;
        }

        // STRING CONVERSION TO NUMBER?
        // This Number checker below does NOT convert strings or other values to numbers. They are always flagged as bad. Why? There are too many crazy scenarios where numbers as strings still fail. However in the future if you want string conversion to number checking you could change the logic to include this below. Note: The "+" unary check below tries quick implicit Number() conversion to a number or NaN by returning one of the two. This would also catch all new Number Object logic, so only do this change below if you want IsBad() to ignore number - friendly convertable string or other values:

        // This says, if you expect only a number, but the value can be converted into a non-NaN numerical value, then proceed. A value that would pass would be: "56", null, "", 0/Infinity, etc. BUT NOT "5  5", 0/0, undefined, etc. This is why doing this is not recommended. Better to tell user all values are bad here and avoid problems.

        //if ((type === 1) && (!Number.isNaN(+ x))) {
        //    // ....do some logic on string
        //}




        // This only checks number primitives. "new Number()" using typeof is an 'object' when checked below, so that is checked later.
        if ((type === 0 || type === 1) && (typeof x === 'number')) {

            // NaN MATH CALCULATION TEST : Will this number value generate a NaN or error when doing basic math? If so, that could be a clue that this is NOT a safe number to use! Number Found but test a few scenarios to make sure it generates no errors.
            // NaN could get created in certain calculations below. So we run a math test that might return a NaN using various values below.
            // "isNan" coerces value to a number to calculate NaN. It runs a quick math calc. to see if that returns NaN.
            // "Number.isNaN" just checks if its already assigned to the variable NaN.

            // ALERT: Do NOT do an equality test below (x !== x) for comparing equality of any floating point values with decimals that are coereced or calculated as they are notoriously inaccurate and would likely fail this equality check. If NaN is checked here, test below here would always fail for them!

            // Logic below should RARELY catch anything since typeof 'number' here would stop all primitive literals other than numbers. That is different for its use below for new Number() object constructor values.
            if (Number.isNaN(x * 1) || isNaN(+ x) || isNaN(x)) {
                IsBadMessage = 'IsBad() : result=true : type=Number.NaN (conversion check) : ' + x.valueOf();
                return true;
            }


            if (!isFinite(x)) {
                IsBadMessage = 'IsBad() : result=true : type=Number.Infinite (finite check) : ' + x.valueOf();
                return true;
            }


            // ISNUMERIC type Checker
            // Use this to filter out any last minute non-numeric values, which should be rare based on the "typeof" Number check above!
            // Note that parseInt() is not a good way to check numeric values as parseFloat which catch some bugs.
            if (isNaN(parseFloat(x))) {
                IsBadMessage = 'IsBad() : result=true : type=Number.NaN (parseFloat(x) check) : ' + x.valueOf();
                return true;
            }

            // For now we do not accept max storable numbers beyond Integer safe ranges or for floats within the max and min ranges storable, as they would fail in calculations. If you do want to allow full JavaScript storage ranges for Number checks, use Number.MAX_VALUE and Number.MIN_VALUE below instead of safe ranges.

            // FLOAT CHECK
            // ALERT: Any Float smaller than -+(5e-324) gets translated into zero (0) in JavaScript! There appears to be no way to STOP this coercion of tiny floats to 0 I can find, so we cannot flag very small out-of-range Floats as bad values at this time. They always get moved to 0 in JavaScript. JavaScript converts any decimal number smaller than 5E-324 (the smallest number) to 0 by default. So no way to stop or fix this script flaw! Be careful as division by this value would then return 0/0 as NaN and all others +-Infinity. Developers will have to check for zero in their decimal math or division.
            // ALERT: NEVER use '==' or '===' to compare two floating point numbers due to precision errors!



            // DECIMALS and FLOATS : ALWAYS multiple by 10 with Floats to avoid errors as JavaScript calculations have terrible precision. See test below.
            // GOOD TEST to show the problems calculating floats! ALWAYS multiple and divide by "10" to make sure the number is right!

            //console.log('Number(0.2 + 0.1): ' + Number(0.2 + 0.1));// 0.30000000000000004
            //console.log('Number.parseInt(0.2 + 0.1): ' + Number.parseInt(0.2 + 0.1));// 0
            //console.log('Number.parseFloat(0.2 + 0.1): ' + Number.parseFloat(0.2 + 0.1));// 0.30000000000000004
            //console.log('Number("0.2 + 0.1"): ' + Number("0.2 + 0.1"));// NaN
            //console.log('Number.parseInt("0.2 + 0.1"): ' + Number.parseInt("0.2 + 0.1"));// 0
            //console.log('Number.parseFloat("0.2 + 0.1"): ' + Number.parseFloat("0.2 + 0.1"));// 0.2
            //console.log('Number.parseInt((0.2 * 10 + 0.1 * 10) / 10): ' + Number.parseInt((0.2 * 10 + 0.1 * 10) / 10));// 0

            //// CORRECT VALUES are returned when using 10 in calculations!
            //console.log('Number((0.2 * 10 + 0.1 * 10) / 10): ' + Number((0.2 * 10 + 0.1 * 10) / 10));// 0.3 CORRECT!
            //console.log('Number.parseFloat((0.2 * 10 + 0.1 * 10) / 10): ' + Number.parseFloat((0.2 * 10 + 0.1 * 10) / 10));// 0.3 CORRECT!



            // ALERT: Precision of decimal floats decreases as the value increases, so you might need to change MIN-VALUE and MAX_VALUE ranges to much smaller values using the chart below if you want guaranteed precision. As you can see, if you want to support up to 9-decimal place accuracy in floats, you will need to limit MAX_VALUE to these values:
            //| Precision | First Unsafe |
            //| 1         | 5,629,499,534,21,312
            //| 2         | 703,687,441,770,664
            //| 3         | 87,960,930,220,208
            //| 4         | 5,497,558,130,888
            //| 5         | 68,719,476,736
            //| 6         | 8,589,934,592
            //| 7         | 536,870,912
            //| 8         | 67,108,864
            //| 9         | 8,388,608

            // FOR MAXIMUM FLOAT RANGES use max and min values below. But precision drops.
            // MAX_VALUE = 1.7976931348623157e+308 or max value JavaScript can hold. Way past the max safe integer value and precision goes down after this.
            // MIN_VALUE = 5e-324 or min decimal value approaching 0 JavaScript can hold. Past this it defaults to 0. Precision in decimals however is not guaranteed much earlier so I recommend the values from the list above.

            // FOR MAXIMUM PRECISION to 9 decimal places in your floats, use the following range:
            // 1e-10 (minimum)
            // 8388608 (maximum)

            var tempFloat;
            if (x) {
                tempFloat = x % 1;
                if (tempFloat) {
                    // Float Test...
                    if (tempFloat != 0) {
                        // Settings below support 100% accuracy floats to 9 digits. Change this range as needed! Use MIN and MAX values if you want unlimited float number ranges but with decreesing accuracy in decimals as your number gets larger and smaller. "8388608" is the max integer range to allow guaranteed 9-decimal accurate float values!
                        //if (x >= Number.MIN_VALUE && x <= Number.MAX_VALUE) {
                        if (Number && x >= 1e-10 && x <= 8388608) {
                            IsBadMessage = 'IsBad() : result=false : type=Number (positive float) : ' + x.valueOf();
                            return false;
                            // Settings below support 100% accuracy floats to 9 digits. Change this range as needed! Use MIN and MAX values if you want unlimited float number ranges but with decreesing accuracy in decimals as your number gets larger and smaller.
                        //} else if (x <= -(Number.MIN_VALUE) && x >= -(Number.MAX_VALUE)) {
                        } else if (Number && x <= -(1e-10) && x >= -(8388608)) {
                            IsBadMessage = 'IsBad() : result=false : type=Number (negative float) : ' + x.valueOf();
                            return false;
                        } else {
                            IsBadMessage = 'IsBad() : result=true : type=Number (float out of accuracy range) : ' + x.valueOf();
                            return true;
                        }
                    }
                }
            }


            // Check if an Integer, then run calculation. If returns NaN the flag is bad.
            if (isNaN(parseInt(x))) {
                IsBadMessage = 'IsBad() : result=true : type=Number.NaN (parseInt(x) check) : ' + x.valueOf();
                return true;
            }

            // Check if an Integer in range
            // Min and Max Safe Integer selects the positive and negative max ranges for integers only. These translate to +9007199254740991 to -9007199254740991.

            if (Number && x >= Number.MIN_SAFE_INTEGER && x <= Number.MAX_SAFE_INTEGER) {
                IsBadMessage = 'IsBad() : result=false : type=Number (safe integer in range) : ' + x.valueOf();
                return false;
            } else {
                IsBadMessage = 'IsBad() : result=true : type=Number (integer out of safe range) : ' + x.valueOf();
                return true;
            }
        }




        // Number Object Constructor Check
        if ((type === 0 || type === 1) &&
            (Number && (x instanceof Number || (Object.prototype.toString.call(x) === '[object Number]') || (x).constructor === Number))) {

            // First check if the new Number Object has any assigned properties. If so, its a valid value and should not be flagged as bad.
            for (const prop in x) {
                IsBadMessage = 'IsBad() : result=false : type=Number (with properties) : ' + x.valueOf();
                return false;
            }

            // EXPLICIT NUMBER TYPE CAST TEST
            // Try a Number Coercion to remove Number Objects, etc. Is integer when coerced the same value or object? If it does NOT equal its self as a value, that implies the Number Object is NaN. Flag as false.

            // ALERT: Do NOT do an equality test below (x !== x) for comparing equality of any floating point values with decimals that are coereced or calculated as they are notoriously inaccurate and would likely fail this equality check. If NaN is checked here, test below here would always fail for them!

            if (Number.isNaN(Number(x) * 1) || isNaN(Number(x))) {
                IsBadMessage = 'IsBad() : result=true : type=Number.NaN (Number(x) * 1 check) : ' + x.valueOf();
                return true;
            }

            if (!isFinite(Number(x))) {
                IsBadMessage = 'IsBad() : result=true : type=Number.Infinite (finite check) : ' + x.valueOf();
                return true;
            }

            if (isNaN(parseFloat(Number(x)))) {
                IsBadMessage = 'IsBad() : result=true : type=Number.NaN (parseFloat(x) check) : ' + x.valueOf();
                return true;
            }

            // Type Cast Number Object to a value. We try and case the Number Object back to a Number primitive first.
            var xCastToNumber = Number(x);

            // FLOAT CHECK
            // ALERT: Any Float smaller than -+(5e-324) gets translated into zero (0) in JavaScript! There appears to be no way to STOP this coercion of tiny floats to 0 I can find, so we cannot flag very small out-of-range Floats as bad values at this time. They always get moved to 0 in JavaScript. JavaScript converts any decimal number smaller than 5E-324 (the smallest number) to 0 by default. So no way to stop or fix this script flaw! Be careful as division by this value would then return 0/0 as NaN and all others +-Infinity. Developers will have to check for zero in their decimal math or division.
            // ALERT: NEVER use '==' or '===' to compare two floating point numbers due to precision errors!
            // ALERT: Precision of decimal floats decreases as the value increases, so you might need to change MIN-VALUE and MAX_VALUE ranges to much smaller values using the chart below if you want guaranteed precision. As you can see, if you want to support up to 9-decimal place accuracy in floats, you will need to limit MAX_VALUE to these values:
            //| Precision | First Unsafe |
            //| 1         | 5,629,499,534,21,312
            //| 2         | 703,687,441,770,664
            //| 3         | 87,960,930,220,208
            //| 4         | 5,497,558,130,888
            //| 5         | 68,719,476,736
            //| 6         | 8,589,934,592
            //| 7         | 536,870,912
            //| 8         | 67,108,864
            //| 9         | 8,388,608

            // FOR MAXIMUM FLOAT RANGES use max and min values below. But precision drops.
            // MAX_VALUE = 1.7976931348623157e+308 or max value JavaScript can hold. Way past the max safe integer value and precision goes down after this.
            // MIN_VALUE = 5e-324 or min decimal value approaching 0 JavaScript can hold. Past this it defaults to 0. Precision in decimals however is not guaranteed much earlier so I recommend the values from the list above.

            // FOR MAXIMUM PRECISION to 9 decimal places in your floats, use the following range:
            // 1e-10 (minimum)
            // 8388608 (maximum)

            if (xCastToNumber) {
                tempFloat = xCastToNumber % 1;
                if (tempFloat) {
                    // Float Test...
                    if (tempFloat != 0) {
                        // Settings below support 100% accuracy floats to 9 digits. Change this range as needed! Use MIN and MAX values if you want unlimited float number ranges but with decreesing accuracy in decimals as your number gets larger and smaller.
                        //if (x >= Number.MIN_VALUE && x <= Number.MAX_VALUE) {
                        if (x >= 1e-10 && x <= 8388608) {
                            IsBadMessage = 'IsBad() : result=false : type=Number (positive float) : ' + x.valueOf();
                            return false;
                        // Settings below support 100% accuracy floats to 9 digits. Change this range as needed! Use MIN and MAX values if you want unlimited float number ranges but with decreesing accuracy in decimals as your number gets larger and smaller.
                        //} else if (x <= -(Number.MIN_VALUE) && x >= -(Number.MAX_VALUE)) {
                        } else if (x <= -(1e-10) && x >= -(8388608)) {
                            IsBadMessage = 'IsBad() : result=false : type=Number (negative float) : ' + x.valueOf();
                            return false;
                        } else {
                            IsBadMessage = 'IsBad() : result=true : type=Number (float out of range) : ' + x.valueOf();
                            return true;
                        }
                    }
                }
            }


            // EXTRA NUMBER OBJECT NaN CHECKER - when the Number object value is extracted, does it not equal itself when coerced, and therefore is NaN?
            if (Number(x) != Number(x)) {
                // "==" type coercion would occur here. If parsing fails here likely would result in NaN which is never equal to anything. This fails on floats so avoid unless after float check logic. The Number Object might have other properties or values that trigger this, but unlikely. More of a fall back test.
                IsBadMessage = 'IsBad() : result=true : type=Number (number coercion failed) : ' + Number(x);
                return true;
            }

            // Check if an Integer, then run calculation. If returns NaN the flag is bad.
            if (isNaN(parseInt(Number(x)))) {
                IsBadMessage = 'IsBad() : result=true : type=Number.NaN (parseInt(Number(x)) check) : ' + x.valueOf();
                return true;
            }

            // The logic below is the same in the Number Primitive check. If the caste value is a number that implies the Number Object was created to only hold a primitive. We now just check to see if that number is in range as a working integer only that can be used reliably in calculations. Anything out of range is dangerous and risky so bad.

            // Check if an Integer in range
            // Min and Max Safe Integer selects the positive and negative max ranges for integers only. These translate to +9007199254740991 to -9007199254740991.

            if (Number(x) >= Number.MIN_SAFE_INTEGER && Number(x) <= Number.MAX_SAFE_INTEGER) {
                IsBadMessage = 'IsBad() : result=false : type=Number (safe integer in range) : ' + Number(x).valueOf();
                return false;
            } else {
                // Note: This number is too big for a Numeric Integer but could still be valid as the new BigInt type. But because the caller did not type cast the value as such we cannot assume that expect a larger BigInt numeric range, so for now return value as bad. If you would like Numeric Object tests to still accept values in the +- MAX_VALUE known JavaScript memory range that includes BigInts, you can check that before called "true" using the BigInt logic shown elsewhere in this logic.
                IsBadMessage = 'IsBad() : result=true : type=Number (integer out of safe range) : ' + Number(x).valueOf();
                return true;
            }
        }


        // BigInt Primitive Check
        // Note that BigInt has no object constructor nor can be a decimal. So we use the primitive check only. ES2020 introduced BigInt so not widely supported yet. Number Primitive and Number Object Constructor Check. Note: Any use of "BigInt()" conversion without checking if value is within +-Number.MAX_VALUE will blow up and say failed due to number be Infinity and not an integer! So ALWAYS use "IsBad()" to make sure number is in range before doing "BigInt(x)".

        if ((type === 0 || type === 2) && (typeof x === 'bigint' || (BigInt && (x).constructor === BigInt))) {

            // BIGINT WILL NEVER RETURN "NaN"
            // AVOID NaN checkes with BigInt, as BigInt is NOT a Number type!
            // isNaN(1n);// "TypeError: Conversion from 'BigInt' to 'number' is not allowed."
            // Number.isNaN(1n);// false

            // TOO BIG FOR BIGINT NUMBERS
            // BigInts are a NEW type from ES2020
            // We know that BigInt numbers are not accurate but also that JavaScrpt has a number ceiling when they could flip to Infinity or fail. So below we flag large values approaching the max ceiling as bad numbers. For now we do not accept max storable bigints beyond safe max storage ranges, as they would fail and become infinity. To allow full JavaScript storage ranges for bigint checks, use Number.MAX_VALUE and Number.MIN_VALUE below. Note: BigInts cannot be decimal values so whole numbers are the floor. The BigInt empty function "BigInt()" without a number defaults to 0 like "Number()" so is valid. You cannot instantiate BigInt as a Constructor Function like new BigInt().
            if (BigInt(x) >= BigInt(-(Number.MAX_VALUE)) && BigInt(x) <= BigInt(Number.MAX_VALUE)) {
                IsBadMessage = 'IsBad() : result=false : type=Bigint : ' + x.valueOf();
                return false;
            } else {
                IsBadMessage = 'IsBad() : result=true : type=Bigint (out of range) : ' + x.valueOf();
                return true;
            }
        }


        // RegExp Primitive and RegExp Object Constructor Check
        if ((type === 0 || type === 7) && (x instanceof RegExp)) {

            // If a bad or missing value comes in for a RegExp primitive, whether explicit or coerced, we flag the value as bad. Note: Empty "RegExp()" functions default to "/(?:)/" so valid like empty Number and Booleans. "(?:)" means non-capture group or do not capture anything, so safe. Note: We ONLY reject RegEx at this time if it returns a truly empty regex as "/(?:)/". Only empty RegEx or with undefined return the emopty regex query, which is bad.
            if (x.toString() === '/(?:)/') {
                IsBadMessage = 'IsBad() : result=true : type=RegExp (bad) : ' + x;
                return true;
            } else {
                IsBadMessage = 'IsBad() : result=false : type=RegExp : ' + x;
                return false;
            }

        } else if ((type === 0 || type === 7) &&
            (RegExp && (x instanceof RegExp || (Object.prototype.toString.call(x) === '[object RegExp]') || (x).constructor === RegExp))) {
            // If a new RegExp() object is created with any properties assigned, do not flag it as "bad" or check for values below.
            for (const prop in x) {
                IsBadMessage = 'IsBad() : result=false : type=RegExp (with properties) : ' + x;
                return false;
            }

            // Note: Empty "new RegExp()" objects default to "/(?:)/" so valid like empty Number and Booleans.
            if (RegExp(x).toString() === '/(?:)/') {
                IsBadMessage = 'IsBad() : result=true : type=RegExp (bad) : ' + x;
                return true;
            } else {
                IsBadMessage = 'IsBad() : result=false : type=RegExp : ' + x;
                return false;
            }
        }

        // DATE FILTER: This catches Date objects which might include wrapped dates (new Date()), empty dates, or corrupt dates. Because Dates are flagged as not having properties in #3 filter below, they would have been flagged as Empty. This catches those cases. Note: I am using a fallback catch for date in case one fails.
        // WARNING: The Date checker below will generally accept most values if the object coming in is a treu Date Object using "new Date(x)". This means it will allow bad values for "x" to create unpredictable dates. So it would fail to generate the expected date for say "new Date(1/1/2000)", which defaults to Midnight on Dec 31, 1969. Also, when a non-date object is submitted, like without "new" as "Date(x)", almost all those would be rejected as that function defaults almost all dates to the current date-time, which is wrong.
        // So use the date checked carefully and plan to always use "new Date(x)" and a standard date-friendly value for "x" as a number, or "2000,2,1" etc which readily convert to accurate historical dates.
        if (type === 0 || type === 5) {
            if (((x instanceof Date)
                || (x.getMonth && (typeof x.getMonth === 'function') && x.getMonth >= 0)
                || (Date && (x instanceof Date || (Object.prototype.toString.call(x) === '[object Date]') || (x).constructor === Date)))) {

                if (x.toString() === 'Invalid Date'
                    || Number.isNaN(x)
                    || x === undefined
                    || x === null
                    || x === new Date(NaN)
                    || x === new Date(undefined)
                    || (x.toISOString() && x.toISOString() === new Date(0).toISOString())// This compares date-time to the millisecond. If the value date-time is the same as the default start date in JavaScript, or 12/31/1969 at midnight, distrust it. We have to reject these dates for now, as any bad numbers or strings default "new Date()" to that default date when they fail. If you app explicitly uses 12/31/1969 then modify this code and use other means to catch bad values that default Date() Objects to this hard date-time.
                ) {
                    IsBadMessage = 'IsBad() : result=true : type=Date (unreliable date conversion 1) : ' + (new Date(x)).toString();
                    return true;
                } else {
                    // We assume all dates that fail the above check as NOT empty of bad for now.
                    // No true date "format checking" has been added here, for now. But may be in the future.
                    IsBadMessage = 'IsBad() : result=false : type=Date : ' + (new Date(x)).toString();
                    return false;
                }
            } else {
                if (Number.isNaN(x)
                    || x === undefined
                    || x === null
                    || x.toString().replace(/\s/g,'') === ''
                    || (new Date(x)).toString() === 'Invalid Date'
                    // Reject any random string or number that creates the current date-time as its likely that is not what the caller expects! Unless the user creates a real "new" Date() object above, distrust and reject "Date()", "Date(x)", and all other forms to avoid the risk of returning just the current default date-time returned from a random value.
                    || x.toString() === (new Date()).toString()
                    || ((Date(x)).toString() === (new Date()).toString() && (new Date(x)).toString() === (new Date()).toString())
                ) {
                    IsBadMessage = 'IsBad() : result=true : type=Date (unreliable date conversion 2) : ' + (new Date(x)).toString();
                    return true;
                } else {
                    IsBadMessage = 'IsBad() : result=false : type=Date (conversion ok) : ' + (new Date(x)).toString();
                    return false;
                }
            }
        }



        // FUNCTION FILTER
        if ((type === 0 || type === 8) && 
            (Function &&
            ((typeof x === 'function')
                || (x instanceof Function)
                || (Function && (x instanceof Function || (Object.prototype.toString.call(x) === '[object Function]') || (x).constructor === Function))))) {

            // Test if the function is empty or has bad values.
            let func = String(x).toLowerCase().replace(/\s/g, '');
            if (func === 'function(){}') {
                IsBadMessage = 'IsBad() : result=true : type=Function (empty) : ' + x;
                return true;
            }

            // For now all functions but empty ones are not flagged as bad.
            if (x instanceof Function) {
                IsBadMessage = 'IsBad() : result=false : type=Function : ' + x;
                return false;
            }

            IsBadMessage = 'IsBad() : result=false : type=Function : ' + x;
            return false;

        }


        // OBJECT FILTER : Object Catchall
        // This catches any true "Object" created using either "new" keyword (new Number) or New Object, or "{}". These all have object properties (not just prototype object properties). If these Object properties are missing or empty, the logic below should catch it. Keep in mind most wrapped or boxed primitives like "new Number()" create a boxed object around a default value like 0, new DateTime, etc. But see rules below of what I consider "bad" values. "new Date()" creates an object but with valid DateTime equal to Now. Symbol always creates a valid unique identifier. So Date and Symbol always pass test below and would NOT be empty or bad by default unless reassigned bad values.

        // BETTER WAY TO CHECK FOR ANY TYPE IN JAVASCRIPT
        // All Types in JavaScript can be checked using constructors as follows:
        // let x = {};
        // (typeof x !== 'undefined' && (x).constructor === Object);// true

        if ((type === 0 || type === 10) && 
            (Object &&
            ((typeof x === 'object')
                || (x instanceof Object)
                || (Object &&
                (x instanceof Object || (Object.prototype.toString.call(x) === '[object Object]') || (x).constructor === Object)
            )))) {

            // Next two logic checks flag any custom created objects as having any keys or properties as valid and not bad or empty. Note: Both logic checks below will NOT catch the following:
            // - new Date() - because this generates a fully qualified date equal to Now, not considered a bad value or empty. So ignored.
            // - Symbol() - because these are always unique with a value they can never be bad for now.

            // Empty Object Detector #1 - This will catch most empty objects and "new" boxed ones. The second check below is a fallback.
            // Note: For now we allow EMPTY OBJECT to come in that have a key or property assigned to undefined, NaN, or null as there may be an explicit reason for a developer to create such an object versus an empty one. If we want to enforce, say {undefined} as empty, we would need to check for such a property or key in new logic below.
            if ((Object.keys && (typeof Object.keys(x)) && (typeof Object.keys(x).length === 'number') && Object.keys(x).length === 0)
            ) {
                IsBadMessage = 'IsBad() : result=true : type=Object (empty without properties) : ' + x;
                return true;
            } else {
                // Catches {NaN}, {undefined}, and {null}
                if (Object.keys(x).length == 1 && 
                    (Object.keys(x)[0] === 'NaN' || Object.keys(x)[0] === 'undefined' || Object.keys(x)[0] === 'null')
                ) {
                    IsBadMessage = 'IsBad() : result=true : type=Object (empty with bad property) : ' + x;
                    return true;
                }
            }

            // Empty Object Detector #2
            // Warning: This matches Date Objects too so gives false empty object, but above logic filters date types out. "getOwnPropertyNames" - detection works on non-prototype properties of the object versus "for (const property1 in x){...}" which does not and would give false positives on some objects.
            if (Object.getOwnPropertyNames && (typeof Object.getOwnPropertyNames(x)) && (typeof Object.getOwnPropertyNames(x).length === 'number') && (Object.getOwnPropertyNames(x).length === 0)
            ) {
                IsBadMessage = 'IsBad() : result=true : type=Object (empty without properties) : ' + x;
                return true;
            }

            IsBadMessage = 'IsBad() : result=false : type=Object : ' + x;
            return false;

        }


        // GENERIC OBJECTS WITH ANY PROPERTIES FILTER: Objects with one or more properties are caught here and flagged as NOT empty. This logic checks prototype as well as object properties, so could give false positives. This logic below only catches Non-Objects assigned primitive values, true Objects with one or more valid properties, and non-empty strings. Flags them as NOT empty early before object tests below.
        // WARNING: Empty new Objects ("{}" or "new Object()"), or wrapped-boxed objects around primitive using "new" for Numbers, Dates, Booleans, and Symbols are skipped over by this logic below so not caught as being NOT empty! Logic below REMOVES any object that has has one or more properties (object or prototype).
        if (type === 0) {
            for (const prop in x) {
                IsBadMessage = 'IsBad() : result=false : type=Unknown (with properties) : ' + x;
                return false;
            }
        }

        // Catchall returns bad by default on all non-typed values. Since we cannot test the item assume the value is bad for now. The last condition is a typed item whose value mismatches that type.
        if (type === 0) {
            IsBadMessage = 'IsBad() : result=true : type=Unknown : ' + x;
            return true;
        } else {
            // If a user passed in a type as an argument, and the value does not match the type, it is bad.
            IsBadMessage = 'IsBad() : result=true : type=Unknown (not type "' + types[type] + '") : ' + x;
            return true;
        }


    } catch (e) {

        if (typeof console !== 'undefined' && console.error) {
            // Note: When an exception is thrown, it will point below to the 'console.error' as the first source of the error in the developer's tool box error console section. This does NOT mean the consol.error code is bad and has an error itself! This confused me at first. Bad design!
            console.error('ERROR : Function IsBad() : ' + e);
        } else if (typeof console !== 'undefined' && console.warn) {
            console.warn('WARNING : Function IsBad() : ' + e);
        } else if (typeof console !== 'undefined' && console.log) {
            console.log('ERROR : Function IsBad() : ' + e);
        }

        // Catchall returns NOT empty or bad by default. Never return undefined!
        IsBadMessage = 'IsBad() : error : ' + x + ' : ' + e;
        return false;

    }
}

// ------------------------------------------------------------

// IsBadTester()
// Use the "bad data" tests below to see what the "IsBad()" method finds and determines is bad data. Loop through all tests and return list of valid values.

var IsBadTester = {
    start: function () {
        'use strict';
        // Print result in Developer Tools (F12) console section in the web browser.
        console.log('IsBadTester() : Start');
        this.Test(this.testdata);
        return null;
    },
    Test: function (data) {
        'use strict';
        for (var i = 0; i < data.length; i++) {
            try {

                // Print result in Developer Tools (F12) console section in the web browser.
                // Optional: Can also print out IsBad() message "IsBadMessage" at the end for more details of what value went bad in what section of the function and why.
                console.log('IsBadTester() : result=' + IsBad(data[i].test, data[i].type) + ' : tested type=' + data[i].type + ' : value=' + data[i].name + '\n\rMessage=' + IsBadMessage);
                //console.log('IsBadTester() : '+IsBad(data[i].test)+' : '+data[i].name);

            } catch (e) {

                if (typeof console !== 'undefined' && console.error) {
                    console.error('ERROR : Function IsBadTester() : ' + e);
                } else if (typeof console !== 'undefined' && console.warn) {
                    console.warn('WARNING : Function IsBadTester() : ' + e);
                } else if (typeof console !== 'undefined' && console.log) {
                    console.log('ERROR : Function IsBadTester() : ' + e);
                }

            }
        }
        return null;
    },
    // TEST VALUES
    testdata: [
        { test: false, type: "boolean", name: "false" },
        {test: 0, type: "number", name: "0" },
        {test: 0.0, type: "number",name: "0.0" },
        {test: 0x0, type: "number",name: "0x0" },
        {test: -0, type: "number",name: "-0" },
        {test: -0.0, type: "number",name: "-0.0" },
        {test: -0x0, type: "number",name: "-0x0" },
        { test: 0n, type: "bigint",name: "0n" },
        { test: 0x0n, type: "bigint",name: "0x0n" },
        {test: 8, type: "number",name: "8" },
        {test: '8', type: "number",name: "'8'" },
        {test: '-10', type: "number",name: "'-10'" },
        {test: '0', type: "number",name: "'0'" },
        {test: '5', type: "number",name: "'5'" },
        {test: '+10', type: "number",name: "'+10'" },
        {test: -16, type: "number",name: "-16" },
        {test: 0, type: "number",name: "0" },
        {test: -0, type: "number",name: "-0" },
        {test: 32, type: "number",name: "32" },
        {test: '040', type: "number",name: "'040'" },
        {test: 0144, type: "number",name: "0144" },// ESLint says avoid octals in this format
        {test: 0o0144, type: "number",name: "0o0144" },// octal
        {test: '0xFF', type: "number",name: "'0xFF'" },
        {test: '-0x42', type: "number",name: "'-0x42'" },
        {test: 0xFF, type: "number",name: "0xFF" },
        {test: 1101, type: "number",name: "1101" },// does JavaScript translate to an integer or bindary?
        {test: 0b11111111, type: "number",name: "0b11111111" },// binary
        {test: 0b1111, type: "number",name: "0b1111" },
        {test: 9007199254740991, type: "number",name: "9007199254740991" },// max value acceptable in JavaScript
        { test: 9007199254740991n, type: "bigint",name: "9007199254740991n" },// max value acceptable in JavaScript
        {test: 9007199254740992, type: "number",name: "9007199254740992" },// fail as integer
        { test: 9007199254740992n, type: "bigint",name: "9007199254740992n" },// acceptable when a BigInt
        {test: '9007199254740992', type: "number",name: "'9007199254740992'" },
        { test: '9007199254740992n', type: "bigint",name: "'9007199254740992n'" },// why to use strings to hold giant numbers
        {test: 0xffffffffffffff, type: "number",name: "0xffffffffffffff" },
        {test: 0o377777777777777777, type: "number",name: "0o377777777777777777" },
        {test: 0b11111111111111111111111111111111111111111111111111111, type: "number",name: "0b11111111111111111111111111111111111111111111111111111" },// max binary
        {test: 0b111111111111111111111111111111111111111111111111111111, type: "number",name: "0b111111111111111111111111111111111111111111111111111111" },
        {test: '-1.6', type: "number",name: "'-1.6'" },
        {test: '4.536', type: "number",name: "'4.536'" },
        {test: '4,536', type: "number",name: "'4,536'" },
        {test: '123abc', type: "number",name: "'123abc'" },
        {test: -2.6, type: "number",name: "-2.6" },
        {test: -0.0, type: "number",name: "-0.0" },
        {test: 0.0, type: "number",name: "0.0" },
        {test: 3.1415, type: "number",name: "3.1415" },
        {test: 5.0000000000000000000000000000000001, type: "number",name: "5.0000000000000000000000000000000001" },
        {test: 4500000000000000.1, type: "number",name: "4500000000000000.1" },
        {test: 4500000000000000.5, type: "number",name: "4500000000000000.5" },
        {test: 999999999999999999999999999999999999999999999999999999999999999999999.0000000000000000000000000000, type: "number",name: "999999999999999999999999999999999999999999999999999999999999999999999.0000000000000000000000000000" },
        {test: 000001, type: "number",name: "000001" },
        {test: 0o000001, type: "number",name: "0o000001" },
        {test: 8e5, type: "number",name: "8e5" },
        {test: 234e+7, type: "number",name: "234e+7" },
        {test: -123e12, type: "number",name: "-123e12" },
        {test: '123e-2', type: "number",name: "'123e-2'" },
        { test: BigInt(55), type: "bigint",name: "BigInt(55)" },
        { test: BigInt('55'), type: "",name: "BigInt('55')" },
        {test: 1.0e+15, type: "number",name: "1.0e+15" },// within safe integer range of ~ 9 quadrillion
        {test: 1.0e+16, type: "number",name: "1.0e+16" },// beyond max safe JavaScript integer value of ~ 9 quadrillion
        {test: BigInt(1.0e+16), type: "bigint", name: "BigInt(1.0e+16)"},// converted to bigint the number is in range
        {test: 1.79E+308, type: "number", name: "1.79E+308"},// max value JavaScript says it can hold in memory
        {test: 1.79E+308, type: "bigint", name: "1.79E+308"},// "E+" is a BAD FORMAT FOR BIGINT. Why? it sees "e" as Number type, not bigint! (I fixed this in code)
        {test: BigInt(1.79E+308), type: "number", name: "BigInt(1.79E+308)"},
        {test: BigInt(1.79E+308), type: "bigint",name: "BigInt(1.79E+308)" },
        {test: 1.7976931348623157e+308, type: "bigint",name: "1.7976931348623157e+308" },
        {test: BigInt(1.7976931348623157e+308), type: "bigint",name: "BigInt(1.7976931348623157e+308)" },
        //{test:BigInt(1.7976931348623157e+309), type: "bigint",name:"BigInt(1.7976931348623157e+309)"},// fails as BigInt() says number acts as Infinity and not an integer
        //{test:BigInt(1.79E500), type: "bigint",name:"BigInt(1.79E500)"},// fails as BigInt() says number acts as Infinity and not an integer
        //{test:BigInt(-1.79E500), type: "bigint",name:"BigInt(-1.79E500)"},// fails as BigInt() says number acts as Infinity and not an integer
        {test: -9007199254740991, type: "number",name: "-9007199254740991" },
        {test: -9007199254740992, type: "number",name: "-9007199254740992" },
        { test: -9007199254740992n, type: "bigint",name: "-9007199254740992n" },
        {test: BigInt(-9007199254740992), type: "bigint",name: "BigInt(-9007199254740992)" },
        {test: 1.0E-10, type: "number",name: "1.0E-10" },// in range using my 9 decimal max precision logic
        {test: -1.0E-10, type: "number",name: "-1.0E-10" },
        {test: 0.9E-10, type: "number",name: "0.9E-10" },// out of range using my 9 decimal max precision logic
        {test: -0.9E-10, type: "number",name: "-0.9E-10" },
        {test: 5.5555555E-20, type: "number",name: "5.5555555E-20" },
        {test: -5.5555555E-20, type: "number",name: "-5.5555555E-20" },
        {test: 5E-324, type: "bigint",name: "5E-324" },// max positive decimal number
        {test: -5E-324, type: "bigint",name: "-5E-324" },// max minimum decimal number
        {test: 5E-325, type: "bigint",name: "5E-325" },// reverts to 0 after max so ok
        {test: -5E-325, type: "bigint",name: "-5E-325" },// reverts to 0 after max so ok
        {test: 1.7976931348623157e-500, type: "number",name: "1.7976931348623157e-500" },// Returns 0 and false! JavaScript converts any decimal number smaller than 5E-324 (the smallest number) to 0 by default. So no way to stop or fix this script flaw! Be careful as division by this value would then return 0/0 as NaN and all others +-Infinity.
        {test: -1.7976931348623157e-500, type: "number",name: "-1.7976931348623157e-500" },// Returns 0 and false! JavaScript converts any decimal number smaller than 5E-324 (the smallest number) to 0 by default. So no way to stop or fix this script flaw! Be careful as division by this value would then return 0/0 as NaN and all others +-Infinity.
        {test: null, type: "number",name: "null" },
        {test: undefined, type: "number", name: "undefined"},
        {test: null, type: "string", name: "null"},
        {test: undefined, type: "string", name: "undefined"},
        {test: NaN, type: "", name: "NaN"},
        {test: NaN, type: "number", name: "NaN"},
        {test: NaN, type: "string", name: "NaN"},
        {test: 0 / 0, type: "number",name: "0/0" },
        {test: 0.1 / 0, type: "number",name: "0.1/0" },
        {test: -1 / 0, type: "number",name: "-1/0" },
        {test: 1 / Infinity, type: "number",name: "1/Infinity" },
        {test: Infinity / 0, type: "number",name: "Infinity / 0" },
        {test: "foo" / 3, type: "number",name: "'foo'/3" },
        {test: 0 / undefined, type: "number",name: "0 / undefined" },
        {test: 0 / NaN, type: "number",name: "0 / NaN" },
        {test: 0 / +Infinity, type: "number",name: "0 / +Infinity" },
        {test: 0 / -Infinity, type: "number",name: "0 / -Infinity" },
        {test: 1 / 0, type: "number",name: "1 / 0" },
        {test: 1 / undefined, type: "number",name: "1 / undefined" },
        {test: 1 / NaN, type: "number",name: "1 / NaN" },
        {test: 1 / +Infinity, type: "number",name: "1 / +Infinity" },
        {test: 1 / -Infinity, type: "number",name: "1 / -Infinity" },
        {test: 0 * Infinity, type: "number",name: "0 * Infinity" },
        {test: 1 * Infinity, type: "number",name: "1 * Infinity" },
        {test: 0 * null, type: "number",name: "0 * null" },
        {test: 0 * undefined, type: "number",name: "0 * undefined" },
        {test: 0 * NaN, type: "number",name: "0 * NaN" },
        {test: 1 * null, type: "number",name: "1 * null" },
        {test: 1 * undefined, type: "number",name: "1 * undefined" },
        {test: 1 * NaN, type: "number",name: "1 * NaN" },
        {test: null * null, type: "number",name: "null * null" },
        {test: 5 ** undefined, type: "number",name: "5 ** undefined" },
        {test: 5 ** NaN, type: "number",name: "5 ** NaN" },
        {test: 5 ** null, type: "number",name: "5 ** null" },
        {test: Infinity - Infinity, type: "number",name: "Infinity - Infinity" },
        {test: Infinity * 1, type: "number",name: "Infinity * 1" },
        {test: Infinity * undefined, type: "number",name: "Infinity * undefined" },
        {test: Number(null), type: "number",name: "Number(null)" },
        {test: 2 + null, type: "number",name: "2 + null" },
        {test: 2 + undefined, type: "number",name: "2 + undefined" },
        {test: 2 + Infinity, type: "number",name: "2 + Infinity" },
        {test: Number(' '), type: "number",name: "Number(' ')" },
        {test: Number(), type: "number",name: "Number()" },
        {test: Number(22), type: "number",name: "Number(22)" },
        {test: Number(123.123), type: "number",name: "Number(123.123)" },
        {test: Number('xyz'), type: "number",name: "Number('xyz')" },
        {test: Number(Infinity), type: "number",name: "Number(Infinity)" },
        {test: Number(NaN), type: "number", name: "Number(NaN)"},
        {test: Number({}), type: "number", name: "Number({})"},
        {test: new Number({}), type: "number",name: "new Number({})" },
        {test: new Number(22), type: "number",name: "new Number(22)" },
        {test: new Number(123.123), type: "number",name: "new Number(123.123)" },
        {test: new Number('xyz'), type: "number",name: "new Number('xyz')" },
        {test: new Number(Infinity), type: "number",name: "new Number(Infinity)" },
        {test: new Number(NaN), type: "number",name: "new Number(NaN)" },
        {test: Infinity, type: "number",name: "Infinity" },
        {test: +Infinity, type: "number",name: "+Infinity" },
        {test: -Infinity, type: "number",name: "-Infinity" },
        {test: new Number(Infinity), type: "number",name: "new Number(Infinity)" },
        {test: new Number(+Infinity), type: "number",name: "new Number(+Infinity)" },
        {test: new Number(-Infinity), type: "number",name: "new Number(-Infinity)" },
        {test: new Number(Number.MAX_SAFE_INTEGER), type: "number",name: "new Number(Number.MAX_SAFE_INTEGER)" },
        {test: new Number(Number.MIN_SAFE_INTEGER), type: "number",name: "new Number(Number.MIN_SAFE_INTEGER)" },// this is a negative number version of the max version above!
        {test: new Number(Number.MAX_SAFE_INTEGER + 1), type: "number",name: "new Number(Number.MAX_SAFE_INTEGER+1)" },// this puts number out of integer acceptable ranges
        {test: new Number(Number.MIN_SAFE_INTEGER - 1), type: "number",name: "new Number(Number.MIN_SAFE_INTEGER-1)" },
        {test: Number.POSITIVE_INFINITY, type: "number",name: "Number.POSITIVE_INFINITY" },
        {test: Number.NEGATIVE_INFINITY, type: "number",name: "Number.NEGATIVE_INFINITY" },
        {test: Number.MAX_VALUE, type: "number",name: "Number.MAX_VALUE" },// max positive number allowed in JavaScript
        {test: -Number.MAX_VALUE, type: "number",name: "-Number.MAX_VALUE" },// max negative number allowed in JavaScript
        {test: Number.MIN_VALUE, type: "number",name: "Number.MIN_VALUE" },// smallest positive decimal number approaching zero. Any decimal smaller than this value is cast as 0 in JavaScript, so never a valid bad value test!
        {test: -(Number.MIN_VALUE), type: "number",name: "-(Number.MIN_VALUE)" },// smallest negative decimal number approaching zero.
        { test: BigInt(Number.MAX_VALUE), type: "bigint",name: "BigInt(Number.MAX_VALUE)" },
        {test: (BigInt(Number.MAX_VALUE) + BigInt(1)), type: "bigint", name: "(BigInt(Number.MAX_VALUE)+BigInt(1))" },// This may pass due to variations in precision past max values. Once it fails the BigInt cast itself will generate an error here, type: "",not in the function check, and convert value to "Infinity" which blows up the BigInt conversion method.
        {test: BigInt(-(Number.MAX_VALUE)), type: "bigint",name: "BigInt(-(Number.MAX_VALUE))" },
        {test: (BigInt(-(Number.MAX_VALUE)) + BigInt(-1)), type: "bigint", name: "(BigInt(-(Number.MAX_VALUE)) + BigInt(-1))" },
        //{test:BigInt(Number.MAX_VALUE+Number.MAX_VALUE), type: "bigint",name:"BigInt(Number.MAX_VALUE+Number.MAX_VALUE)"},// fails because addition creates "Infinity"
        //{test:BigInt(.00001), type: "bigint",name:"BigInt(.00001)"},// not allowed - error
        //{test:BigInt(Infinity), type: "bigint",name:"BigInt(Infinity)"},// not allowed - error
        { test: Number.EPSILON, type: "number",name: "Number.EPSILON" },
        { test: {}, type: "object",name: "{}" },// empty object should be rejected
        {test: ({}), type: "object",name: "({})" },
        {test: {x: 3}, type: "object",name: "{x:3}" },
        {test: {undefined}, type: "object",name: "{undefined}" },
        //{test:{null}, type: "object",name:"{null}"},// not allowed - error
        {test: {NaN}, type: "object",name: "{NaN}" },
        {test: new Object(), type: "object",name: "new Object()" },
        {test: new Object({x: 3}), type: "object",name: "new Object({x:3})" },
        {test: new Object({undefined}), type: "object",name: "new Object({undefined})" },
        //{test:new Object({null}), type: "object",name:"new Object({null})"},// not allowed - error
        {test: new Object({NaN}), type: "object",name: "new Object({NaN})" },
        {test: function () {}, type: "function",name: "function(){}" },
        {test: function () {x: 3}, type: "function",name: "function(){x:3}" },
        { test: window, type: "",name: "window" },
        { test: [], type: "array",name: "[]" },
        {test: [3], type: "array",name: "[3]" },
        {test: Array(), type: "array",name: "Array()" },
        {test: Array(null), type: "array",name: "Array(null)" },
        {test: Array(undefined), type: "array", name: "Array(undefined)"},
        //{test: Array(NaN), type: "array", name: "Array(NaN)"},// creates array length error?
        {test: new Array(), type: "array",name: "new Array()" },
        {test: new Array(null), type: "array",name: "new Array(null)" },
        {test: new Array(undefined), type: "array", name: "new Array(undefined)"},
        //{test: new Array(NaN), type: "array", name: "new Array(NaN)"},// creates array length error?
        { test: "", type: "string",name: "\"\"" },
        {test: '', type: "string",name: "''" },
        {test: ``, type: "string",name: "``" },
        {test: '        ', type: "string",name: "'        '" },
        {test: '\t', type: "string",name: "'\\t'" },
        {test: '\r\n', type: "string",name: "'\\r\\n'" },
        {test: 'bcfed5.2', type: "string",name: "'bcfed5.2'" },
        {test: '3.1000000n', type: "string",name: "'3.1000000n'" },
        {test: '7.2acdgs', type: "string",name: "'7.2acdgs'" },
        {test: new String('\t'), type: "string",name: "new String('\\t')" },
        {test: new String('\r\n'), type: "string",name: "new String('\\r\\n')" },
        {test: 'xabcdefx', type: "string",name: "'xabcdefx'" },
        {test: 'abcdefghijklm1234567890', type: "string",name: "'abcdefghijklm1234567890'" },
        {test: String(), type: "string",name: "String()" },
        {test: String('hello'), type: "string",name: "String('hello')" },
        {test: String(-0.0), type: "string",name: "String(-0.0)" },
        {test: new String(), type: "string",name: "new String()" },
        {test: new String('hello'), type: "string",name: "new String('hello')" },
        {test: new String(-0.0), type: "string",name: "new String(-0.0)" },
        {test: '1/1/2020', type: "string", name: "'1/1/2020'"},
        {test: '1/1/2020', type: "date", name: "'1/1/2020'"},
        {test: '1/1/2022', type: "date", name: "'1/1/2022'"},
        {test: '0/50/10', type: "date", name: "'0/50/10'"},
        {test: '2009,1,1', type: "date", name: "'2009,1,1'"},
        {test: 'xyz', type: "date", name: "'xyz'"},
        {test: -0.00001, type: "date", name: "-0.00001"},
        {test: undefined, type: "date", name: "undefined"},
        {test: null, type: "date", name: "null"},
        {test: NaN, type: "date", name: "NaN"},
        {test: Date(), type: "date",name: "Date()" },
        {test: Date('1/1/2022'), type: "date",name: "Date('1/1/2022')" },
        {test: Date('0/50/10'), type: "date",name: "Date('0/50/10')" },
        {test: Date(1 / 1 / 2022), type: "date",name: "Date(1/1/2022)" },
        {test: Date(2009, 1, 1), type: "date",name: "Date(2009, 1, 1)" },
        {test: Date('xyz'), type: "date",name: "Date('xyz')" },
        {test: Date(-0.00001), type: "date",name: "Date(-0.00001)" },
        {test: Date(undefined), type: "date",name: "Date(undefined)" },
        {test: Date(null), type: "date",name: "Date(null)" },
        {test: Date(NaN), type: "date",name: "Date(NaN)" },
        {test: new Date(), type: "date",name: "new Date()" },
        {test: new Date('1/1/2022'), type: "date",name: "new Date('1/1/2022')" },
        {test: new Date('0/50/10'), type: "date",name: "new Date('0/50/10')" },
        {test: new Date(1 / 1 / 2022), type: "date",name: "new Date(1/1/2022)" },
        {test: new Date(2009, 1, 1), type: "date",name: "new Date(2009, 1, 1)" },
        {test: new Date('xyz'), type: "date",name: "new Date('xyz')" },
        {test: new Date(-0.00001), type: "date", name: "new Date(-0.00001)"},
        {test: new Date(1), type: "date", name: "new Date(1)"},
        {test: new Date(50000), type: "date", name: "new Date(50000)"},
        {test: new Date(undefined), type: "date",name: "new Date(undefined)" },
        {test: new Date(null), type: "date",name: "new Date(null)" },
        {test: new Date(NaN), type: "date",name: "new Date(NaN)" },
        { test: true, type: "boolean",name: "true" },
        {test: false, type: "boolean",name: "false" },
        {test: Boolean(), type: "boolean",name: "Boolean()" },
        {test: Boolean('xyz'), type: "boolean",name: "Boolean('xyz')" },
        {test: Boolean(true), type: "boolean",name: "Boolean(true)" },
        {test: new Boolean(), type: "boolean",name: "new Boolean()" },
        {test: new Boolean('xyz'), type: "boolean",name: "new Boolean('xyz')" },
        {test: new Boolean(Infinity), type: "boolean",name: "new Boolean(Infinity)" },
        {test: new Boolean(true), type: "boolean", name: "new Boolean(true)"},
        {test: RegExp(), type: "regex", name: "RegExp()"},
        {test: RegExp(33), type: "regex", name: "RegExp(33)"},
        {test: RegExp(Infinity), type: "regex", name: "RegExp(Infinity)"},
        {test: RegExp(null), type: "regex", name: "RegExp(null)"},
        {test: RegExp(NaN), type: "regex", name: "RegExp(NaN)"},
        {test: RegExp(undefined), type: "regex", name: "RegExp(undefined)"},
        {test: RegExp('/^\s*$/'), type: "regex", name: "RegExp('/^\s*$/')"},
        {test: new RegExp(), type: "regex",name: "new RegExp()" },
        {test: new RegExp(33), type: "regex",name: "new RegExp(33)" },
        {test: new RegExp('33'), type: "regex",name: "new RegExp('33')" },
        {test: new RegExp(Infinity), type: "regex",name: "new RegExp(Infinity)" },
        {test: new RegExp(null), type: "regex",name: "new RegExp(null)" },
        {test: new RegExp(NaN), type: "regex",name: "new RegExp(NaN)" },
        {test: new RegExp(undefined), type: "regex",name: "new RegExp(undefined)" },
        {test: new RegExp('/^\s*$/'), type: "regex",name: "new RegExp('/^\s*$/')" },
        { test: Symbol(), type: "symbol",name: "Symbol()" },
        {test: Symbol('test'), type: "symbol",name: "Symbol('test')" }
    ]
};


// RUN JAVASCRIPT "BAD" DATASET TEST
//IsBadTester.start();

// HOW TO CALL THE PLAIN ISBAD(x) TEST
//console.log('Test: ' + IsBad(1.0e+16,"number") + ' : ' + IsBadMessage);

// RUN JAVASCRIPT "BAD" DATA TEST with DEFAULTS
// Test "IfBad(x,d)" with defaults to see if it returns default values when argument is a "bad" value:
//console.log('New IfBad with Default: ' + IfBad(1.0e+15, "number", 0));
//console.log('New IfBad with Default: ' + IfBad(1.0e+16, "number", 0));
//console.log('New IfBad with Default: ' + IfBad(new Number('xyz'), "number", 1));
//console.log('New IfBad with Default: ' + IfBad(new Date('xyz'), "date", new Date('6/1/2022')));
//console.log('New IfBad with Default: ' + IfBad(Infinity, "number", 100));


// ------------------------------------------------------------


// "IfEmpty()" is an overload for "IsEmpty()" and returns either the original "x" parameter entered, or a default "d" value of the developers choice if a bad or empty value is detected. This powerful version allows you to embed this function into expressions in JavaScript and keep processing values rather than stop and do conditional checks!

function IfEmpty(x,d)
{
    'use strict';
    if (IsEmpty(x))
    {
        return d;// return a default value if bad
    } else {
        return x;// return original value if good
    }
}


// IsEmpty() : Improved Null Checker

// JavaScripts new "null coalescing" logic has holes and is broken. It misses a number of values and types, is vulnerable to a ReferenceError, and confuses developers with ternary truthy checks and the object property unary "?" operator which does detect undeclared object properties correctly. This new function "IsEmpty()" clarifies and fixes those bugs!


// TWO MAJOR FLAWS exist in current JavaScript error checking in all versions:

// 1. TRUTHY STATEMENTS (if(truthy){...} or "truthy ? true : false") - Truthy statements are not consistent, and FALSE with empty strings "" but not " ", 0 but not "0", and numeric floats that collapse to 0 which means some decimal values are false and others true! (thiose less than 1.0E-324). In addition, missing or undeclared variables create a ReferenceError in JavaScript!
// 2. NULL COALESCING STATEMENTS - Coalesce statements of various kinds are NOYT consistent and give different results. For starters, they fail to respond to NaN and undeclared/missing variables that create an Error. They also conflict with Truthy Statements in detecting empty strings, false, and 0, which you may or may not wants.

// Increasing "value"" of a variable, least defined to most define defined...
// * no variable            - type of 'undefined', value = * none (reference error!)
// var myvar;               - type of 'undefined', value = undefined (primitive)
// var myvar = undefined;   - type of 'undefined', value = undefined (primitive)
// var myvar = NaN;         - type of 'number', value = NaN (primitive)
// var myvar = null;        - type of 'object', value = null (primitive)
// var myvar = "";          - type of 'string', value = "test" (primitive)

// A Note on Object Properties : When checking for missing properties of objects using the conditional (ternary) operator (?), because it does not throw an error on undeclared properties like variables do, it safely returns undefined for ?? null coalescence tests rather that Truthy false coerced values. However, it too will not catch NaN. "?" does a form of truthy check to see if an object property even exists below. Returns "undefined" primitive values if not, which below triggers the null coalescent default value.

//const person={
//    name: "John"
//};

// REFERENCE ERROR when object doesnt exist! "No employer defined 1"
//alert(person??"No employer defined 1");

// Safe undefined primitive returned - "No employer defined 2"
//alert(person?.employer??"No employer defined 2");

// Safe undefined primitive returned - "No employer defined 3"
//alert(person?.employer?.toLowerCase()??"No employer defined 3");


// * The method below returns JUST those values below that would blow up any operation, calculation, coercion, or other exptression in JavaScript. The logic below also avoids the inconsistent nature of "if/then" truthy statements, or using the ternary operator "truthy ? true : false". And it also avoids null coalescence which is missing NaN and undeclared variables. It combines the two but throws out the inconsistent expectations of various bad data scenarios. IsEmpty() simply checks for null or empty values, which includes NaN, null, undefined, and missing variable references, but ignores the rest (false, 0, "0", "", float collapse to 0, etc.) which have no impact on most data.

// * My improved IsEmpty() function allows you to AVOID the four bad null type of values that cause errors or issues. It checks for the following:

// - undefined types - undeclared/missing variables
// - undefined primitives - declared but not initialized values, missing object properties, explicit or assigned undefined primitive values.
// - NaN
// - null
// - '' empty strings plus spaces, tabs, etc
// - 0 or "0", which can affect booleans, nulls translated to 0, small floats as 0, etc.


// Improved null check
function IsEmpty(x)
{
    'user strict';
    try
    {
        if (typeof x==='undefined'
            ||x===undefined
            ||x===null
            ||x!==x
            || ((typeof x === 'string') && (x.replace(/^\s+|\s+$/gm, '').replace(/[\t\n\r]/gm, '') === ''))
            || ((typeof x === 'number') && Number(x) === 0)
            || (Number(x) === 0)
        )
        {
            return true;
        } else {
            return false;
        }
    } catch (e)
    {
        if (typeof console!=='undefined'&&console.error)
        {
            console.error('ERROR : Function IsEmpty() : '+e);
        } else if (typeof console!=='undefined'&&console.warn)
        {
            console.warn('WARNING : Function IsEmpty() : '+e);
        } else if (typeof console!=='undefined'&&console.log)
        {
            console.log('ERROR : Function IsEmpty() : '+e);
        }
        return true;
    }
}

// ------------------------------------------------------------

// STRICT NUMBER CHECK (overload with default value)
// n - number value to check for NaN
// d - default fallback value to use if number fails
function IfStrictNum(n,d)
{
    'use strict';
    if (IsStrictNum(n))
    {
        return n;
    } else
    {
        return d;
    }
}

// Returns false for BigInt values, only Number types pass
// Note: Needs a float in-range check
// Note: Number Ranges below for IsStrictNum() are limited to safe precise ranges only!

// SPECIAL: Because decimals lose precision early, below are the hard-coded smaller decimal limits used for IsStrictNum(). Modify these below as needed. Precision of decimal floats decreases as the value increases, so you might need to change MIN-VALUE and MAX_VALUE ranges to much smaller values using the chart below if you want guaranteed precision. As you can see, if you want to support up to 9-decimal place accuracy in floats, you will need to limit MAX_VALUE to these values:

//| Precision | First Unsafe 
//| 1         | 5,629,499,534,21,312
//| 2         | 703,687,441,770,664
//| 3         | 87,960,930,220,208
//| 4         | 5,497,558,130,888
//| 5         | 68,719,476,736
//| 6         | 8,589,934,592
//| 7         | 536,870,912
//| 8         | 67,108,864
//| 9         | 8,388,608

// FOR MAXIMUM FLOAT RANGES use max and min values below. But precision drops.
// MAX_VALUE = 1.7976931348623157e+308 or max value JavaScript can hold. Way past the max safe integer value and precision goes down after this.
// MIN_VALUE = 5e-324 or min decimal value approaching 0 JavaScript can hold. Past this it defaults to 0. Precision in decimals however is not guaranteed much earlier so I recommend the values from the list above.

// FOR MAXIMUM PRECISION to 9 decimal places in your floats, use the following range:
// 1e-10 (minimum)
// 8388608 (maximum)

function IsStrictNum(n)
{
    'use strict';
    try
    {
        if (typeof n === 'symbol') {
            return false;
        } else if (typeof n === 'bigint') {
            return false;
        } else if ((n === n)// catches NaN early
            && typeof n === 'number'// no "new Number()" objects or other types allowed
            && !Number.isNaN(+ n)// filters out any value convertible to a NaN value
            && !isNaN(parseFloat(n))
            && isFinite(n)) {

            // To Strictly limit Decimal Numbers to 10 decimal places if has a decimal component...
            if ((n % 1) != 0) {
               if ((n >= 1e-10 && n <= 8388608) || (n <= -(1e-10) && n >= -(8388608)) || Number(n) === 0) {
                    return true;
               } else {
                    return false;
               }
            } else {
               if (Number(n) >= Number.MIN_SAFE_INTEGER && Number(n) <= Number.MAX_SAFE_INTEGER) {
                    return true;
               } else {
                    return false;
               }
            }

        } else {
            return false;
        }
    } catch (e)
    {
        if (typeof console!=='undefined'&&console.error)
        {
            console.error('ERROR : Function IsNumTester() : '+e);
        } else if (typeof console!=='undefined'&&console.warn)
        {
            console.warn('WARNING : Function IsNumTester() : '+e);
        } else if (typeof console!=='undefined'&&console.log)
        {
            console.log('ERROR : Function IsNumTester() : '+e);
        }
        return false;
    }
}

// NUMBER CHECK (overload with default value)
// n - number value to check for NaN
// d - default fallback value to use if number fails
function IfNum(n,d)
{
    'use strict';
    if (IsNum(n))
    {
        return n;
    } else
    {
        return d;
    }
}

// NUMBER CHECK
// Check for any valid numeric, float, or bigint value
// Infinity, undefined, NaN, objects, empty strings, non-numeric strings, out-of-range Integers not included.
// Booleans and nulls are NOT included even though they get coerced to 0 or 1. However, if you pass in an expression (like: null*1) with boolean or null values that successfully create a valid number they will pass.
// Any calculated value that returns Infinity, NaN, null, undefined, etc are excluded.
// Calculated expressions that return a numeric value are included. Example: 0/infinity=0 collapses to 0 so would be accepted. But Infinity/0=Infinity would not
// Successfully parsed strings that are numeric are included
// BigInt values are included so be careful when using them as Number types! (see alternative function that excludes bigint)
// Note: Needs a float in-range check or use the one in my IsBad() function

function IsNum(n)
{
    'use strict';
    try
    {
        if (typeof n==='symbol')
        {
            return false;
        } else if (typeof n==='bigint')
        {
            if ((n===n)
                && BigInt(n) >= BigInt(-(Number.MAX_VALUE))
                && BigInt(n) <= BigInt(Number.MAX_VALUE))
            {
                return true;
            } else
            {
                return false;
            }

        // IS VALUE DIRECTLY CONVERTIBLE TO A NUMBER?
        // The code below allows some strings or other values to pass through as numbers, assuming the end user
        // wants to convert those numbers in their code later. But you may not want this feature.
        // This is done using "Number.isNaN(+ n)", which tries to convert valid strings or values
        // to either a number or NaN.
        // This means "56" for example would pass, as would other strings or values that reduce to a number or 0.
        // "isNaN(parseFloat(n))" does a similar check but filters out more. Remove these and add strict type
        // checking if you want to avoid allowing string or other weird values into the function.
        // Example: A value that would pass would be: "56", null, "", 0/Infinity, etc. as convertable to integers.
        // Values that would NOT pass woruld be: "5  5", 0/0, undefined, etc. This is why its better to tell users all values are bad here and avoid problems. IsStrictNum() handles that.

        // Number Ranges below for IsNum(), unlike IsStrictNum(), support full unprecise ranges including BigInt ranges, up to -+Infinity and -+0.

        // Note that this "IsNum()" checker has wider support for the full number ranges than IsBad() or "IsStrictNum()", supporting the values below that include the SAFE ranges but go beyond. This allows this function to support both BigInt and Numeric Types.

        // -------------------------------------------------

        // IsNum() Supports these numeric ranges:

        // MAXIMUM TO MINIMUM POSITIVE VALUE RANGE
        // 1.79E308 to 4.94E-324 (+Infinity is out of range, but E-324 collapses to 0 in JavaScript so supported)

        // MAXIMUM TO MINIMUM NEGATIVE VALUE RANGE
        // -4.94E-324 to -1.79E308 (-Infinity is out of range, )

        // -------------------------------------------------


        } else if ((n === n)// catches NaN early
            && !Number.isNaN(+ n)// filters out any string or value convertible to a NaN value
            && !isNaN(parseFloat(n))
            && isFinite(Number(n))
            &&
            ((Number(n) >= Number.MIN_VALUE && Number(n) <= Number.MAX_VALUE)
            || (Number(n) <= -(Number.MIN_VALUE) && Number(n) >= -(Number.MAX_VALUE)) || Number(n) === 0)
        )
        {
            return true;
        } else {
            return false;
        }
    } catch (e)
    {
        if (typeof console!=='undefined'&&console.error){
            console.error('ERROR : Function IsNumTester() : '+e);
        } else if (typeof console!=='undefined'&&console.warn){
            console.warn('WARNING : Function IsNumTester() : '+e);
        } else if (typeof console!=='undefined'&&console.log){
            console.log('ERROR : Function IsNumTester() : '+e);
        }
        return false;
    }
};

// IsNumTester()
// Use the "bad data" tests below to see what the "IsNum()" method finds and determines is bad data. Loop through all tests and return list of valid values.

var IsNumTester={
    start: function()
    {
        'use strict';
        // Print result in Developer Tools (F12) console section in the web browser.
        console.log('IsNumTester() : Start');
        this.Test(this.testdata);
        return null;
    },
    Test: function(data)
    {
        'use strict';
        for (var i=0;i<data.length;i++)
        {
            try
            {

                // Print result in Developer Tools (F12) console section in the web browser.
                console.log('IsNumTester() : '+IsNum(data[i].test)+' : '+data[i].name);
                //console.log('IsNumTester() : '+IsNum(data[i].test)+' : '+data[i].name);

            } catch (e)
            {

                if (typeof console!=='undefined'&&console.error)
                {
                    console.error('ERROR : Function IsNumTester() : '+e);
                } else if (typeof console!=='undefined'&&console.warn)
                {
                    console.warn('WARNING : Function IsNumTester() : '+e);
                } else if (typeof console!=='undefined'&&console.log)
                {
                    console.log('ERROR : Function IsNumTester() : '+e);
                }

            }
        }
        return null;
    },
    // TEST VALUES
    testdata: [
        {test: false,name: "false"},
        {test: 0,name: "0"},
        {test: 0.0,name: "0.0"},
        {test: 0x0,name: "0x0"},
        {test: -0,name: "-0"},
        {test: -0.0,name: "-0.0"},
        {test: -0x0,name: "-0x0"},
        {test: 0n,name: "0n"},
        {test: 0x0n,name: "0x0n"},
        {test: 8,name: "8"},
        {test: '8',name: "'8'"},
        {test: '-10',name: "'-10'"},
        {test: '0',name: "'0'"},
        {test: '5',name: "'5'"},
        {test: '+10',name: "'+10'"},
        {test: -16,name: "-16"},
        {test: 0,name: "0"},
        {test: -0,name: "-0"},
        {test: 32,name: "32"},
        {test: '040',name: "'040'"},
        {test: 0144,name: "0144"},// octal
        {test: 0o0144,name: "0o0144"},// octal
        {test: '0xFF',name: "'0xFF'"},
        {test: '-0x42',name: "'-0x42'"},
        {test: 0xFF,name: "0xFF"},
        {test: 1101,name: "1101"},// does JavaScript translate to an integer or bindary?
        {test: 0b11111111,name: "0b11111111"},// binary
        {test: 0b1111,name: "0b1111"},
        {test: 9007199254740991,name: "9007199254740991"},// max value acceptable in JavaScript
        {test: 9007199254740991n,name: "9007199254740991n"},// max value acceptable in JavaScript
        {test: 9007199254740992,name: "9007199254740992"},// fail as integer
        {test: 9007199254740992n,name: "9007199254740992n"},// acceptable when a BigInt
        {test: '9007199254740992',name: "'9007199254740992'"},
        {test: '9007199254740992n',name: "'9007199254740992n'"},// why to use strings to hold giant numbers
        {test: 0xffffffffffffff,name: "0xffffffffffffff"},
        {test: 0o377777777777777777,name: "0o377777777777777777"},
        {test: 0b11111111111111111111111111111111111111111111111111111,name: "0b11111111111111111111111111111111111111111111111111111"},// max binary
        {test: 0b111111111111111111111111111111111111111111111111111111,name: "0b111111111111111111111111111111111111111111111111111111"},
        {test: '-1.6',name: "'-1.6'"},
        {test: '4.536',name: "'4.536'"},
        {test: '4,536',name: "'4,536'"},
        {test: '123abc',name: "'123abc'"},
        {test: -2.6,name: "-2.6"},
        {test: -0.0,name: "-0.0"},
        {test: 0.0,name: "0.0"},
        {test: 3.1415,name: "3.1415"},
        {test: 5.0000000000000000000000000000000001,name: "5.0000000000000000000000000000000001"},
        {test: 4500000000000000.1,name: "4500000000000000.1"},
        {test: 4500000000000000.5,name: "4500000000000000.5"},
        {test: 999999999999999999999999999999999999999999999999999999999999999999999.0000000000000000000000000000,name: "999999999999999999999999999999999999999999999999999999999999999999999.0000000000000000000000000000"},
        {test: 000001,name: "000001"},
        {test: 0o000001,name: "0o000001"},
        {test: 8e5,name: "8e5"},
        {test: 234e+7,name: "234e+7"},
        {test: -123e12,name: "-123e12"},
        {test: '123e-2',name: "'123e-2'"},
        {test: BigInt(55),name: "BigInt(55)"},
        {test: BigInt('55'),name: "BigInt('55')"},
        {test: 1.0e+15,name: "1.0e+15"},// within safe integer range of ~ 9 quadrillion
        {test: 1.0e+16,name: "1.0e+16"},// beyond max safe JavaScript integer value of ~ 9 quadrillion
        {test: BigInt(1.0e+16),name: "BigInt(1.0e+16)"},// converted to bigint the number is in range
        {test: 1.79E+308,name: "1.79E308"},// max value JavaScript says it can hold in memory
        {test: BigInt(1.79E+308),name: "BigInt(1.79E308)"},
        {test: 1.7976931348623157e+308,name: "1.7976931348623157e+308"},
        {test: BigInt(1.7976931348623157e+308),name: "BigInt(1.7976931348623157e+308)"},
        //{test:BigInt(1.7976931348623157e+309),name:"BigInt(1.7976931348623157e+309)"},// fails as BigInt() says number acts as Infinity and not an integer
        //{test:BigInt(1.79E500),name:"BigInt(1.79E500)"},// fails as BigInt() says number acts as Infinity and not an integer
        //{test:BigInt(-1.79E500),name:"BigInt(-1.79E500)"},// fails as BigInt() says number acts as Infinity and not an integer
        {test: -9007199254740991,name: "-9007199254740991"},
        {test: -9007199254740992,name: "-9007199254740992"},
        {test: -9007199254740992n,name: "-9007199254740992n"},
        {test: BigInt(-9007199254740992),name: "BigInt(-9007199254740992)"},
        {test: 1.0E-10,name: "1.0E-10"},// in range using my 9 decimal max precision logic
        {test: -1.0E-10,name: "-1.0E-10"},
        {test: 0.9E-10,name: "0.9E-10"},// out of range using my 9 decimal max precision logic
        {test: -0.9E-10,name: "-0.9E-10"},
        {test: 5.5555555E-20,name: "5.5555555E-20"},
        {test: -5.5555555E-20,name: "-5.5555555E-20"},
        {test: 5E-324,name: "5E-324"},// max positive decimal number
        {test: -5E-324,name: "-5E-324"},// max minimum decimal number
        {test: 5E-325,name: "5E-325"},// reverts to 0 after max so ok
        {test: -5E-325,name: "-5E-325"},// reverts to 0 after max so ok
        {test: 1.7976931348623157e-500,name: "1.7976931348623157e-500"},// Returns 0 and false! JavaScript converts any decimal number smaller than 5E-324 (the smallest number) to 0 by default. So no way to stop or fix this script flaw! Be careful as division by this value would then return 0/0 as NaN and all others +-Infinity.
        {test: -1.7976931348623157e-500,name: "-1.7976931348623157e-500"},// Returns 0 and false! JavaScript converts any decimal number smaller than 5E-324 (the smallest number) to 0 by default. So no way to stop or fix this script flaw! Be careful as division by this value would then return 0/0 as NaN and all others +-Infinity.
        {test: null,name: "null"},
        {test: undefined,name: "undefined"},
        {test: NaN,name: "NaN"},
        {test: 0/0,name: "0/0"},
        {test: 0.1/0,name: "0.1/0"},
        {test: -1/0,name: "-1/0"},
        {test: 1/Infinity,name: "1/Infinity"},
        {test: Infinity/0,name: "Infinity / 0"},
        {test: "foo"/3,name: "'foo'/3"},
        {test: 0/undefined,name: "0 / undefined"},
        {test: 0/NaN,name: "0 / NaN"},
        {test: 0/+Infinity,name: "0 / +Infinity"},
        {test: 0/-Infinity,name: "0 / -Infinity"},
        {test: 1/0,name: "1 / 0"},
        {test: 1/undefined,name: "1 / undefined"},
        {test: 1/NaN,name: "1 / NaN"},
        {test: 1/+Infinity,name: "1 / +Infinity"},
        {test: 1/-Infinity,name: "1 / -Infinity"},
        {test: 0*Infinity,name: "0 * Infinity"},
        {test: 1*Infinity,name: "1 * Infinity"},
        {test: 0*null,name: "0 * null"},
        {test: 0*undefined,name: "0 * undefined"},
        {test: 0*NaN,name: "0 * NaN"},
        {test: 1*null,name: "1 * null"},
        {test: 1*undefined,name: "1 * undefined"},
        {test: 1*NaN,name: "1 * NaN"},
        {test: null*null,name: "null * null"},
        {test: 5**undefined,name: "5 ** undefined"},
        {test: 5**NaN,name: "5 ** NaN"},
        {test: 5**null,name: "5 ** null"},
        {test: Infinity-Infinity,name: "Infinity - Infinity"},
        {test: Infinity*1,name: "Infinity * 1"},
        {test: Infinity*undefined,name: "Infinity * undefined"},
        {test: Number(null),name: "Number(null)"},
        {test: 2+null,name: "2 + null"},
        {test: 2+undefined,name: "2 + undefined"},
        {test: 2+Infinity,name: "2 + Infinity"},
        {test: Number(' '),name: "Number(' ')"},
        {test: Number(),name: "Number()"},
        {test: Number(22),name: "Number(22)"},
        {test: Number(123.123),name: "Number(123.123)"},
        {test: Number('xyz'),name: "Number('xyz')"},
        {test: Number(Infinity),name: "Number(Infinity)"},
        {test: Number(NaN),name: "Number(NaN)"},
        {test: new Number(),name: "new Number()"},
        {test: new Number(22),name: "new Number(22)"},
        {test: new Number(123.123),name: "new Number(123.123)"},
        {test: new Number('xyz'),name: "new Number('xyz')"},
        {test: new Number(Infinity),name: "new Number(Infinity)"},
        {test: new Number(NaN),name: "new Number(NaN)"},
        {test: Infinity,name: "Infinity"},
        {test: +Infinity,name: "+Infinity"},
        {test: -Infinity,name: "-Infinity"},
        {test: new Number(Infinity),name: "new Number(Infinity)"},
        {test: new Number(+Infinity),name: "new Number(+Infinity)"},
        {test: new Number(-Infinity),name: "new Number(-Infinity)"},
        {test: new Number(Number.MAX_SAFE_INTEGER),name: "new Number(Number.MAX_SAFE_INTEGER)"},
        {test: new Number(Number.MIN_SAFE_INTEGER),name: "new Number(Number.MIN_SAFE_INTEGER)"},// this is a negative number version of the max version above!
        {test: new Number(Number.MAX_SAFE_INTEGER+1),name: "new Number(Number.MAX_SAFE_INTEGER+1)"},// this puts number out of integer acceptable ranges
        {test: new Number(Number.MIN_SAFE_INTEGER-1),name: "new Number(Number.MIN_SAFE_INTEGER-1)"},
        {test: Number.POSITIVE_INFINITY,name: "Number.POSITIVE_INFINITY"},
        {test: Number.NEGATIVE_INFINITY,name: "Number.NEGATIVE_INFINITY"},
        {test: Number.MAX_VALUE,name: "Number.MAX_VALUE"},// max positive number allowed in JavaScript
        {test: -Number.MAX_VALUE,name: "-Number.MAX_VALUE"},// max negative number allowed in JavaScript
        {test: Number.MIN_VALUE,name: "Number.MIN_VALUE"},// smallest positive decimal number approaching zero. Any decimal smaller than this value is cast as 0 in JavaScript, so never a valid bad value test!
        {test: -(Number.MIN_VALUE),name: "-(Number.MIN_VALUE)"},// smallest negative decimal number approaching zero.
        {test: BigInt(Number.MAX_VALUE),name: "BigInt(Number.MAX_VALUE)"},
        {test: BigInt(Number.MAX_VALUE+1),name: "BigInt(Number.MAX_VALUE+1)"},// This may pass due to variations in precision past max values. Once it fails the BigInt cast itself will generate an error here, not in the function check, and convert value to "Infinity" which blows up the BigInt conversion method.
        {test: BigInt(-(Number.MAX_VALUE)),name: "BigInt(-(Number.MAX_VALUE))"},
        {test: BigInt(-(Number.MAX_VALUE+1)),name: "BigInt(-(Number.MAX_VALUE+1))"},
        //{test:BigInt(Number.MAX_VALUE+Number.MAX_VALUE),name:"BigInt(Number.MAX_VALUE+Number.MAX_VALUE)"},// fails because addition creates "Infinity"
        //{test:BigInt(.00001),name:"BigInt(.00001)"},// not allowed
        //{test:BigInt(Infinity),name:"BigInt(Infinity)"},// not allowed
        {test: Number.EPSILON,name: "Number.EPSILON"},
        {test: {},name: "{}"},
        {test: ({}),name: "({})"},
        {test: {x: 3},name: "{x:3}"},
        {test: {undefined},name: "{undefined}"},
        //{test:{null},name:"{null}"},// not allowed
        {test: {NaN},name: "{NaN}"},
        {test: new Object(),name: "new Object()"},
        {test: new Object({x: 3}),name: "new Object({x:3})"},
        {test: new Object({undefined}),name: "new Object({undefined})"},
        //{test:new Object({null}),name:"new Object({null})"},// not allowed
        {test: new Object({NaN}),name: "new Object({NaN})"},
        {test: function() {},name: "function(){}"},
        {test: function() {x: 3},name: "function(){x:3}"},
        {test: function() {undefined},name: "function(){undefined}"},
        {test: function() {null},name: "function(){null}"},
        {test: function() {NaN},name: "function(){NaN}"},
        {test: window,name: "window"},
        {test: [],name: "[]"},
        {test: [3],name: "[3]"},
        {test: Array(),name: "Array()"},
        {test: Array(null),name: "Array(null)"},
        {test: Array(undefined),name: "Array(undefined)"},
        {test: new Array(),name: "new Array()"},
        {test: new Array(null),name: "new Array(null)"},
        {test: new Array(undefined),name: "new Array(undefined)"},
        {test: "",name: "\"\""},
        {test: '',name: "''"},
        {test: ``,name: "``"},
        {test: '        ',name: "'        '"},
        {test: '\t',name: "'\\t'"},
        {test: '\r\n',name: "'\\r\\n'"},
        {test: 'bcfed5.2',name: "'bcfed5.2'"},
        {test: '3.1000000n',name: "'3.1000000n'"},
        {test: '7.2acdgs',name: "'7.2acdgs'"},
        {test: new String('\t'),name: "new String('\\t')"},
        {test: new String('\r\n'),name: "new String('\\r\\n')"},
        {test: 'xabcdefx',name: "'xabcdefx'"},
        {test: 'abcdefghijklm1234567890',name: "abcdefghijklm1234567890"},
        {test: String(),name: "String()"},
        {test: String('hello'),name: "String('hello')"},
        {test: String(-0.0),name: "String(-0.0)"},
        {test: new String(),name: "new String()"},
        {test: new String('hello'),name: "new String('hello')"},
        {test: new String(-0.0),name: "new String(-0.0)"},
        {test: '1/1/2020',name: "'1/1/2020'"},
        {test: Date(),name: "Date()"},
        {test: Date('1/1/2022'),name: "Date('1/1/2022')"},
        {test: Date('0/50/10'),name: "Date('0/50/10')"},
        {test: Date(1/1/2022),name: "Date(1/1/2022)"},
        {test: Date(2009,1,1),name: "Date(2009, 1, 1)"},
        {test: Date('xyz'),name: "Date('xyz')"},
        {test: Date(-0.00001),name: "Date(-0.00001)"},
        {test: Date(undefined),name: "Date(undefined)"},
        {test: Date(null),name: "Date(null)"},
        {test: Date(NaN),name: "Date(NaN)"},
        {test: new Date(),name: "new Date()"},
        {test: new Date('1/1/2022'),name: "new Date('1/1/2022')"},
        {test: new Date('0/50/10'),name: "new Date('0/50/10')"},
        {test: new Date(1/1/2022),name: "new Date(1/1/2022)"},
        {test: new Date(2009,1,1),name: "new Date(2009, 1, 1)"},
        {test: new Date('xyz'),name: "new Date('xyz')"},
        {test: new Date(-0.00001),name: "new Date(-0.00001)"},
        {test: new Date(undefined),name: "new Date(undefined)"},
        {test: new Date(null),name: "new Date(null)"},
        {test: new Date(NaN),name: "new Date(NaN)"},
        {test: true,name: "true"},
        {test: false,name: "false"},
        {test: Boolean(),name: "Boolean()"},
        {test: Boolean('xyz'),name: "Boolean('xyz')"},
        {test: Boolean(true), name: "Boolean(true)"},
        {test: RegExp(), name: "RegExp()"},
        {test: RegExp(33), name: "RegExp(33)"},
        {test: RegExp(Infinity), name: "RegExp(Infinity)"},
        {test: RegExp(null), name: "RegExp(null)"},
        {test: RegExp(NaN), name: "RegExp(NaN)"},
        {test: RegExp(undefined), name: "RegExp(undefined)"},
        {test: RegExp('/^\s*$/'), name: "RegExp('/^\s*$/')"},
        {test: new Boolean(),name: "new Boolean()"},
        {test: new Boolean('xyz'),name: "new Boolean('xyz')"},
        {test: new Boolean(Infinity),name: "new Boolean(Infinity)"},
        {test: new Boolean(true),name: "new Boolean(true)"},
        {test: new RegExp(),name: "new RegExp()"},
        {test: new RegExp(33),name: "new RegExp(33)"},
        {test: new RegExp('33'),name: "new RegExp('33')"},
        {test: new RegExp(Infinity),name: "new RegExp(Infinity)"},
        {test: new RegExp(null),name: "new RegExp(null)"},
        {test: new RegExp(NaN),name: "new RegExp(NaN)"},
        {test: new RegExp(undefined),name: "new RegExp(undefined)"},
        {test: new RegExp('/^\s*$/'),name: "new RegExp('/^\s*$/')"},
        {test: Symbol(),name: "Symbol()"},
        {test: Symbol('test'),name: "Symbol('test')"}
    ]
};

// IsNum() Function : Run a test of bad data below!
//IsNumTester.start();

// ------------------------------------------------------------


