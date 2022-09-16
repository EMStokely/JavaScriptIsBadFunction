
// ------------------------------------------------------------

// UNIVERSAL ERROR CHECKER : "IsBad()" and "IfBad()" w/ default value
// There was too many ways bad coercion, calculations, casts, and corrupt data in JavaScript create problems. This script below was designed to check for presence of valid values and return a true-false response.

// "IsBad" FUNCTION
// Detect empty, missing, or bad values and returns a default value when used with extra function below. Detects as Empty or "Bad" the following:

// 1. empty strings: "" '' ``
// 2. tabs/carriagereturns/newlines: \t\n\r
// 3. NaN, including from calculations, assigned, or returned result values
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

// "IfBad()" is an overload for "IsBad()" and returns a default "d" value of the developers choice if a bad or empty value is detected.
function IfBad(x, d) {
    if (IsBad(x)) return d;
}

// ------------------------------------------------------------

// "IsBad()" returns true-false boolean
// Optional: You canm also assign this function to the prototype, if needed as a property of all prototypes using the following: "Object.prototype.IsBad = function (x){}"

var isBadMessage = '';
function IsBad(x) {

    isBadMessage = 'IsBad() : no message';

    try {

        // Undefined Check. This catches two types.
        if (typeof x === 'undefined' || x === undefined) {
            isBadMessage = 'IsBad() : true : undefined';
            return true;
        }

        // Null Check
        if (x === null) {
            isBadMessage = 'IsBad() : true : null';
            return true;
        }

        // Stop All Symbol Checks! Always false! Symbols can not be empty and dont have constructors so cannot be created using "new Symbol()".
        if (typeof x === 'symbol') {
            isBadMessage = 'IsBad() : false : symbol';
            return false;
        }

        // SPECIAL CASE : NaN in JavaScript
        // 'NaN' is a member of the 'Number' type but is not a legal number. Bad calculations or conversions return NaN. Beware that Numbers can also be assigned or return null, return undefined as a property like when a variable doesnt exist, or be assigned directly the undefined primitive. Examples are 0/0 returns NaN but 1/0 returns Infinity, -1/0 -Infinity.
        //  ALWAYS CHECK FOR NaN! Why? (see below)
        // In most programs, NaN either cannot be translated correctly from javaScript into many types, is read as an error, or creates a new error in 3rd party applications when read! It also is created when math functions fail like 0/0.
        // Do NOT use legacy "isNaN" as in (isNaN && isNaN(x)), use Number.IsNull(x) instead, as "isNaN" tries to convert/coerce the value and some values would fail or have surprising behavior! Using Number.isNaN() allows a check of the actual value without conversion.
        // Writing NaN to a database or in an HTTP request usually ends up either causing an error or ending up as a null value. So better to CONVERT NaN or use a default replacement than count on NaN values.
        // NaN is not representable in JSON, and gets converted to 'null'. So good to avoid with this check here and force the developer to explicitly assign "null", 0, "", or some value instead of an unexpecxted NaN turned to null.
        // "x !== x" is a good NaN check for older/newer browser script engines, as only true for NaN since it can never equal itself. This check in a conditional will always flag a NaN value.
        // Note that Number.isNan works better for all numerical checks, including Integer and BigInt where isNan will blow up on BigInts! x != x is a good fallback as only NaN never equals itself.Only use isNaN for bad date checks in the logic only far below.
        if ((Number && Number.isNaN(x)) || (x !== x)) {
            isBadMessage = 'IsBad() : true : NaN';
            return true;
        }

        // Infinity Check : Force empty response.
        if (x === Infinity
            || x === +Infinity
            || x === -Infinity
            || (Number.POSITIVE_INFINITY && x === Number.POSITIVE_INFINITY)
            || (Number.NEGATIVE_INFINITY && x === Number.NEGATIVE_INFINITY)) {
            isBadMessage = 'IsBad() : true : infinity : ' + x;
            return true;
        }


        // Array and Array Constructor Check : Since all array are objects, we check array before object test below. Arrays, unlike Number, String, etc. does NOT have a Array "typeof" primitive type, as it is an object.
        if (Array &&
            (x instanceof Array
                || (Object.prototype.toString.call(x) === '[object Array]')
                || Array.isArray(x))
            && (typeof x.length === 'number')
        ) {
            if (x.length === 0) {
                isBadMessage = 'IsBad() : true : empty array : ' + x;
                return true;
            } else {
                isBadMessage = 'IsBad() : false : array : ' + x;
                return false;
            }
        }


        // String Primitive and String Object Constructor Check
        if ((typeof x === 'string')
            || (String && (x instanceof String || (Object.prototype.toString.call(x) === '[object String]')))
        ) {
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
                isBadMessage = 'IsBad() : true : empty string : ' + x;
                return true;
            } else {
                isBadMessage = 'IsBad() : false : string : ' + x;
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
        if (typeof x === 'boolean') {

            // If a bad or missing value comes in for a Boolean primitive, whether explicit or coerced, we flag the value as bad.
            if (x === true || x === false) {
                isBadMessage = 'IsBad() : false : boolean : ' + x;
                return false;
            } else {
                isBadMessage = 'IsBad() : true : bad boolean : ' + x;
                return true;
            }

        } else if (Boolean && (x instanceof Boolean || (Object.prototype.toString.call(x) === '[object Boolean]'))) {
            // If a new Boolean() object is created with any properties assigned, do not flag it as "bad" or check for values below.
            for (const property1 in x) {
                isBadMessage = 'IsBad() : false : boolean with properties : ' + x;
                return false;
            }

            // We type cast the Boolean, which in most cases when created using "new Boolean()" will return at least a false. Note: We cannot check if it stores a value but in most cases, like Number creating 0 or String creating "", Boolean will create false.
            if (Boolean(x) === true || Boolean(x) === false) {
                isBadMessage = 'IsBad() : false : boolean : ' + x;
                return false;
            } else {
                isBadMessage = 'IsBad() : true : bad boolean : ' + x;
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

        if (typeof x === 'number') {

            // NaN MATH CALCULATION TEST : Will this number value generate a NaN or error when doing basic math? If so, that could be a clue that this is NOT a safe number to use! Number Found but test a few scenarios to make sure it generates no errors.
            // NaN could get created in certain calculations below. So we run a math test that might return a NaN using various values below.
            if (Number.isNaN && Number.isNaN(x * 1)) {
                // Adding something to an 'undefined' value would result in NaN
                isBadMessage = 'IsBad() : true : number calc returns NaN : ' + x.valueOf();
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

            if (x) {
                var tempFloat = x % 1;
                if (tempFloat) {
                    // Float Test...
                    if (tempFloat != 0) {
                        // Settings below support 100% accuracy floats to 9 digits. Change this range as needed! Use MIN and MAX values if you want unlimited float number ranges but with decreesing accuracy in decimals as your number gets larger and smaller.
                        //if (x >= Number.MIN_VALUE && x <= Number.MAX_VALUE) {
                        if (Number && x >= 1e-10 && x <= 8388608) {
                            isBadMessage = 'IsBad() : false : positive float : ' + x.valueOf();
                            return false;
                            // Settings below support 100% accuracy floats to 9 digits. Change this range as needed! Use MIN and MAX values if you want unlimited float number ranges but with decreesing accuracy in decimals as your number gets larger and smaller.
                        //} else if (x <= -(Number.MIN_VALUE) && x >= -(Number.MAX_VALUE)) {
                        } else if (Number && x <= -(1e-10) && x >= -(8388608)) {
                            isBadMessage = 'IsBad() : false : negative float : ' + x.valueOf();
                            return false;
                        } else {
                            isBadMessage = 'IsBad() : true : float out of range : ' + x.valueOf();
                            return true;
                        }
                    }
                }
            }


            // Check if an Integer, then run caclulation. If returns NaN the flag is bad.
            if (Number.isNaN && Number.isNaN(Number.parseInt(x))) {
                isBadMessage = 'IsBad() : true : number integer conversion returns NaN : ' + x.valueOf();
                return true;
            }

            // Min and Max Safe Integer selects the positive and negative max ranges for integers only. These translate to +9007199254740991 to -9007199254740991.

            if (Number && x >= Number.MIN_SAFE_INTEGER && x <= Number.MAX_SAFE_INTEGER) {
                isBadMessage = 'IsBad() : false : number : ' + x.valueOf();
                return false;
            } else {
                isBadMessage = 'IsBad() : true : number out of range : ' + x.valueOf();
                return true;
            }
        }


        // Number Object Constructor Check
        if (Number && (x instanceof Number || (Object.prototype.toString.call(x) === '[object Number]'))) {

            // First check if the new Number Object has any assigned properties. If so, its a valid value and should not be flagged as bad.
            for (const property1 in x) {
                isBadMessage = 'IsBad() : false : number with properties : ' + x.valueOf();
                return false;
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
                var tempFloat = xCastToNumber % 1;
                if (tempFloat) {
                    // Float Test...
                    if (tempFloat != 0) {
                        // Settings below support 100% accuracy floats to 9 digits. Change this range as needed! Use MIN and MAX values if you want unlimited float number ranges but with decreesing accuracy in decimals as your number gets larger and smaller.
                        //if (x >= Number.MIN_VALUE && x <= Number.MAX_VALUE) {
                        if (x >= 1e-10 && x <= 8388608) {
                            isBadMessage = 'IsBad() : false : positive float : ' + x.valueOf();
                            return false;
                        // Settings below support 100% accuracy floats to 9 digits. Change this range as needed! Use MIN and MAX values if you want unlimited float number ranges but with decreesing accuracy in decimals as your number gets larger and smaller.
                        //} else if (x <= -(Number.MIN_VALUE) && x >= -(Number.MAX_VALUE)) {
                        } else if (x <= -(1e-10) && x >= -(8388608)) {
                            isBadMessage = 'IsBad() : false : negative float : ' + x.valueOf();
                            return false;
                        } else {
                            isBadMessage = 'IsBad() : true : float out of range : ' + x.valueOf();
                            return true;
                        }
                    }
                }
            }

            // EXPLICIT NUMBER TYPE CAST TEST
            // Try a Number Coercion to remove Number Objects, etc. Is integer when coerced the same value or object? Use for Integer and BigInt Number types only! If it does NOT equal its self as a value, that implies the Number Object has additional value and not a bad value as its a complex numeric object. Flag as false.

            // ALERT: Do NOT use equality test below for comparing equality of any floating point values with decimals that are coereced or calculated as they are notoriously inaccurate and would likely fail this equality check. If NaN is checked here, test below here would always fail for them!
  
            if (Number(x) != x) {
                // "==" type coercion would occur here. If parsing fails here likely would result in NaN which is never equal to anything. Coercion of the type would work in most cases except for NaN. This fails on floats so avoid unless after float check logic.
                isBadMessage = 'IsBad() : true : number coercion failed : ' + Number(x);
                return true;
            }

            //if (Number(x) !== x) {
                // "===" no type coercion would occur here but if both values are wrapped Number objects, though equal, would fail here. This will reject Number Objects, so do not test!
                //isNumMessage = 'IsNum : false : Number() : wrapped number object';
                //return false;
            //}

            // The logic below is the same in the Number Primitive check. If the caste value is a number that implies the Number Object was created to only hold a primitive. We now just check to see if that number is in range as a working integer only that c an be used reliably in calculations. Anything out of range is dangerous and risky so bad.

            // Check if an Integer
            // Min and Max Safe Integer selects the positive and negative max ranges for integers only. These translate to +9007199254740991 to -9007199254740991.

            if (Number(x) >= Number.MIN_SAFE_INTEGER && Number(x) <= Number.MAX_SAFE_INTEGER) {
                isBadMessage = 'IsBad() : false : integer : ' + Number(x).valueOf();
                return false;
            } else {
                // Note: This number is too big for a Numeric Integer but could still be valid as the new BigInt type. But because the caller did not type cast the value as such we cannot assume that expect a larger BigInt numeric range, so for now return value as bad. If you would like Numeric Object tests to still accept values in the +- MAX_VALUE known JavaScript memory range that includes BigInts, you can check that before called "true" using the BigInt logic shown elsewhere in this logic.
                isBadMessage = 'IsBad() : true : integer out of range : ' + Number(x).valueOf();
                return true;
            }

        }


        // BigInt Primitive Check
        // Note that BigInt has no object constructor nor can be a decimal. So we use the primitive check only. ES2020 introduced BigInt so not widely supported yet. Number Primitive and Number Object Constructor Check. Note: Any use of "BigInt()" conversion without checking if value is within +-Number.MAX_VALUE will blow up and say failed due to number be Infinity and not an integer! So ALWAYS use "IsBad()" to make sure number is in range before doing "BigInt(x)"!
        if (typeof x === 'bigint') {

            // TOO BIG FOR BIGINT NUMBERS
            // We know that BigInt numbers are not accurate but also that JavaScrpt has a number ceiling when they could flip to Infinity or fail. So below we flag large values approaching the max ceiling as bad numbers. For now we do not accept max storable bigints beyond safe max storage ranges, as they would fail and become infinity. To allow full JavaScript storage ranges for bigint checks, use Number.MAX_VALUE and Number.MIN_VALUE below. Note: BigInts cannot be decimal values so whole numbers are the floor. The BigInt empty function "BigInt()" without a number defaults to 0 like "Number()" so is valid.
            if (BigInt(x) >= BigInt(-(Number.MAX_VALUE)) && BigInt(x) <= BigInt(Number.MAX_VALUE)) {
                isBadMessage = 'IsBad() : false : bigint : ' + x.valueOf();
                return false;
            } else {
                isBadMessage = 'IsBad() : true : bigint out of range : ' + x.valueOf();
                return true;
            }
        }


        // RegExp Primitive and RegExp Object Constructor Check
        if (typeof x === 'regexp') {

            // If a bad or missing value comes in for a RegExp primitive, whether explicit or coerced, we flag the value as bad. Note: Empty "RegExp()" functions default to "/(?:)/" so valid like empty Number and Booleans. "(?:)" means non-capture group or do not capture anything, so safe. Note: We ONLY reject RegEx at this time if it returns a truly empty regex as "/(?:)/". Only empty RegEx or with undefined return the emopty regex query, which is bad.
            if (x.toString() === '/(?:)/') {
                isBadMessage = 'IsBad() : true : bad regexp : ' + x;
                return true;
            } else {
                isBadMessage = 'IsBad() : false : regexp : ' + x;
                return false;
            }

        } else if (RegExp && (x instanceof RegExp || (Object.prototype.toString.call(x) === '[object RegExp]'))) {
            // If a new RegExp() object is created with any properties assigned, do not flag it as "bad" or check for values below.
            for (const property1 in x) {
                isBadMessage = 'IsBad() : false : regexp with properties : ' + x;
                return false;
            }

            // Note: Empty "new RegExp()" objects default to "/(?:)/" so valid like empty Number and Booleans.
            if (RegExp(x).toString() === '/(?:)/') {
                isBadMessage = 'IsBad() : true : bad regexp : ' + x;
                return true;
            } else {
                isBadMessage = 'IsBad() : false : regexp : ' + x;
                return false;
            }
        }

        // DATE FILTER: This catches Date objects which might include wrapped dates (new Date()), empty dates, or corrupt dates. Because Dates are flagged as not having properties in #3 filter below, they would have been flagged as Empty. This catches those cases. Note: I am using a fallback catch for date in case one fails.
        if (
            (typeof x === 'date')
            || (x.getMonth && (typeof x.getMonth === 'function'))
            || (x instanceof Date)
            || (Date && (x instanceof Date || (Object.prototype.toString.call(x) === '[object Date]')))
        ) {

            // Check for "bad dates" which returm "NaN" when new Date() is used. We want to reject these as "bad" values.
            if ((isNaN && isNaN(x))
                || x.toString() === 'Invalid Date'
                || x.toString() == (new Date(null)).toString()
                || x === NaN
                || x === undefined
                || x === null
                || x === Date(NaN)
                || x === Date(undefined)
                || x === Date(null)
            ) {
                isBadMessage = 'IsBad() : true : bad date : ' + x;
                return true;
            } else {
                // We assume all dates that fail the above check as NOT empty of bad for now.
                // No true date "format checking" has been added here, for now. But may be in the future.
                isBadMessage = 'IsBad() : false : date : ' + x;
                return false;
            }
        }



        // FUNCTION FILTER
        if (
            Function &&
            ((typeof x === 'function')
                || (x instanceof Function)
                || (Function && (x instanceof Function || (Object.prototype.toString.call(x) === '[object Function]'))))
        ) {

            if (String(x) === 'function () { }'
            ) {
                isBadMessage = 'IsBad() : true : empty function : ' + x;
                return true;
            }

            // For now all functions but empty ones are not flagged as bad.
            if (x instanceof Function) {
                isBadMessage = 'IsBad() : false : function : ' + x;
                return false;
            }

            isBadMessage = 'IsBad() : false : function : ' + x;
            return false;

        }


        // OBJECT FILTER : Object Catchall
        // This catches any true "Object" created using either "new" keyword (new Number) or New Object, or "{}". These all have object properties (not just prototype object properties). If these Object properties are missing or empty, the logic below should catch it. Keep in mind most wrapped or boxed primitives like "new Number()" create a boxed object around a default value like 0, new DateTime, etc. But see rules below of what I consider "bad" values. "new Date()" creates an object but with valid DateTime equal to Now. Symbol always creates a valid unique identifier. So Date and Symbol always pass test below and would NOT be empty or bad by default unless reassigned bad values.

        if (
            Object &&
            ((typeof x === 'object')
                || (x instanceof Object)
                || (Object && (x instanceof Object || (Object.prototype.toString.call(x) === '[object Object]'))))
        ) {

            // Next two logic checks flag any custom created objects as having any keys or properties as valid and not bad or empty. Note: Both logic checks below will NOT catch the following:
            // - new Date() - because this generates a fully qualified date equal to Now, not considered a bad value or empty. So ignored.
            // - Symbol() - because these are always unique with a value they can never be bad for now.

            // Empty Object Detector #1 - This will catch most empty objects and "new" boxed ones. The second check below is a fallback.
            // Note: For now we allow EMPTY OBJECT to come in that have a key or property assigned to undefined, NaN, or null as there may be an explicit reason for a developer to create such an object versus an empty one. If we want to enforce, say {undefined} as empty, we would need to check for such a property or key in new logic below.
            if ((Object.keys && (typeof Object.keys(x)) && (typeof Object.keys(x).length === 'number') && Object.keys(x).length === 0)
            ) {
                isBadMessage = 'IsBad() : true : empty object without keys : ' + x;
                return true;
            }

            // Empty Object Detector #2
            // Warning: This matches Date Objects too so gives false empty object, but above logic filters date types out. "getOwnPropertyNames" - detection works on non-prototype properties of the object versus "for (const property1 in x){...}" which does not and would give false positives on some objects.
            if (Object.getOwnPropertyNames && (typeof Object.getOwnPropertyNames(x)) && (typeof Object.getOwnPropertyNames(x).length === 'number') && (Object.getOwnPropertyNames(x).length === 0)
            ) {
                isBadMessage = 'IsBad() : true : empty object without properties : ' + x;
                return true;
            }

            isBadMessage = 'IsBad() : false : object : ' + x;
            return false;

        }


        // GENERIC OBJECTS WITH ANY PROPERTIES FILTER: Objects with one or more properties are caught here and flagged as NOT empty. This logic checks prototype as well as object properties, so could give false positives. This logic below only catches Non-Objects assigned primitive values, true Objects with one or more valid properties, and non-empty strings. Flags them as NOT empty early before object tests below.
        // WARNING: Empty new Objects ("{}" or "new Object()"), or wrapped-boxed objects around primitive using "new" for Numbers, Dates, Booleans, and Symbols are skipped over by this logic below so not caught as being NOT empty! Logic below REMOVES any object that has has one or more properties (object or prototype).
        for (const property1 in x) {
            isBadMessage = 'IsBad() : false : valid property : ' + x;
            return false;
        }

        // Catchall returns NOT empty or bad, by default. Never return undefined either!
        isBadMessage = 'IsBad() : false : valid value : ' + x;
        return false;

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
        isBadMessage = 'IsBad() : error : ' + x + ' : ' + e;
        return false;

    }
}

// ------------------------------------------------------------

// IsBadTester()
// Use the "bad data" tests below to see what the "IsBad()" method finds and determines is bad data. Loop through all tests and return list of valid values.

var IsBadTester = {
    start: function () {

        // Print result in Developer Tools (F12) console section in the web browser.
        console.log('IsBadTester() : Start');
        var a = this.Test(this.testdata);
        return null;

    },
    Test: function (data) {
        for (var i = 0; i < data.length; i++) {
            try {

                // Print result in Developer Tools (F12) console section in the web browser.
                // Optional: Can also print out IsBad() message "isBadMessage" at the end for more details of what value went bad in what section of the function and why.
                console.log('IsBadTester() : ' + IsBad(data[i].test) + ' : ' + data[i].name + ' : ' + isBadMessage);
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
        };
        return null;
    },
    // TEST VALUES
    testdata: [
        { test: false, name: "false" },
        { test: 0, name: "0" },
        { test: 0.0, name: "0.0" },
        { test: 0x0, name: "0x0" },
        { test: -0, name: "-0" },
        { test: -0.0, name: "-0.0" },
        { test: -0x0, name: "-0x0" },
        { test: 0n, name: "0n" },
        { test: 0x0n, name: "0x0n" },
        { test: 8, name: "8" },
        { test: '8', name: "'8'" },
        { test: '-10', name: "'-10'" },
        { test: '0', name: "'0'" },
        { test: '5', name: "'5'" },
        { test: '+10', name: "'+10'" },
        { test: -16, name: "-16" },
        { test: 0, name: "0" },
        { test: -0, name: "-0" },
        { test: 32, name: "32" },
        { test: '040', name: "'040'" },
        { test: 0144, name: "0144" },// octal
        { test: 0o0144, name: "0o0144" },// octal
        { test: '0xFF', name: "'0xFF'" },
        { test: '-0x42', name: "'-0x42'" },
        { test: 0xFF, name: "0xFF" },
        { test: 1101, name: "1101" },// does JavaScript translate to an integer or bindary?
        { test: 0b11111111, name: "0b11111111" },// binary
        { test: 0b1111, name: "0b1111" },
        { test: 9007199254740991, name: "9007199254740991" },// max value acceptable in JavaScript
        { test: 9007199254740991n, name: "9007199254740991n" },// max value acceptable in JavaScript
        { test: 9007199254740992, name: "9007199254740992" },// fail as integer
        { test: 9007199254740992n, name: "9007199254740992n" },// acceptable when a BigInt
        { test: '9007199254740992', name: "'9007199254740992'" },
        { test: '9007199254740992n', name: "'9007199254740992n'" },// why to use strings to hold giant numbers
        { test: 0xffffffffffffff, name: "0xffffffffffffff" },
        { test: 0o377777777777777777, name: "0o377777777777777777" },
        { test: 0b11111111111111111111111111111111111111111111111111111, name: "0b11111111111111111111111111111111111111111111111111111" },// max binary
        { test: 0b111111111111111111111111111111111111111111111111111111, name: "0b111111111111111111111111111111111111111111111111111111" },
        { test: '-1.6', name: "'-1.6'" },
        { test: '4.536', name: "'4.536'" },
        { test: -2.6, name: "-2.6" },
        { test: -0.0, name: "-0.0" },
        { test: 0.0, name: "0.0" },
        { test: 3.1415, name: "3.1415" },
        { test: 5.0000000000000000000000000000000001, name: "5.0000000000000000000000000000000001" },
        { test: 4500000000000000.1, name: "4500000000000000.1" },
        { test: 4500000000000000.5, name: "4500000000000000.5" },
        { test: 999999999999999999999999999999999999999999999999999999999999999999999.0000000000000000000000000000, name: "999999999999999999999999999999999999999999999999999999999999999999999.0000000000000000000000000000" },
        { test: 000001, name: "000001" },
        { test: 8e5, name: "8e5" },
        { test: 234e+7, name: "234e+7" },
        { test: -123e12, name: "-123e12" },
        { test: '123e-2', name: "'123e-2'" },
        { test: BigInt(55), name: "BigInt(55)" },
        { test: BigInt('55'), name: "BigInt('55')" },
        { test: 1.0e+15, name: "1.0e+15" },// within safe integer range of ~ 9 quadrillion
        { test: 1.0e+16, name: "1.0e+16" },// beyond max safe JavaScript integer value of ~ 9 quadrillion
        { test: BigInt(1.0e+16), name: "BigInt(1.0e+16)" },// converted to bigint the number is in range
        { test: 1.79E+308, name: "1.79E308" },// max value JavaScript says it can hold in memory
        { test: BigInt(1.79E+308), name: "BigInt(1.79E308)" },
        { test: 1.7976931348623157e+308, name: "1.7976931348623157e+308" },
        { test: BigInt(1.7976931348623157e+308), name: "BigInt(1.7976931348623157e+308)" },
        //{test:BigInt(1.7976931348623157e+309),name:"BigInt(1.7976931348623157e+309)"},// fails as BigInt() says number acts as Infinity and not an integer
        //{test:BigInt(1.79E500),name:"BigInt(1.79E500)"},// fails as BigInt() says number acts as Infinity and not an integer
        //{test:BigInt(-1.79E500),name:"BigInt(-1.79E500)"},// fails as BigInt() says number acts as Infinity and not an integer
        { test: -9007199254740991, name: "-9007199254740991" },
        { test: -9007199254740992, name: "-9007199254740992" },
        { test: -9007199254740992n, name: "-9007199254740992n" },
        { test: BigInt(-9007199254740992), name: "BigInt(-9007199254740992)" },
        { test: 1.0E-10, name: "1.0E-10" },// in range using my 9 decimal max precision logic
        { test: -1.0E-10, name: "-1.0E-10" },
        { test: 0.9E-10, name: "0.9E-10" },// out of range using my 9 decimal max precision logic
        { test: -0.9E-10, name: "-0.9E-10" },
        { test: 5.5555555E-20, name: "5.5555555E-20" },
        { test: -5.5555555E-20, name: "-5.5555555E-20" },
        { test: 5E-324, name: "5E-324" },// max positive decimal number
        { test: -5E-324, name: "-5E-324" },// max minimum decimal number
        { test: 5E-325, name: "5E-325" },// reverts to 0 after max so ok
        { test: -5E-325, name: "-5E-325" },// reverts to 0 after max so ok
        { test: 1.7976931348623157e-500, name: "1.7976931348623157e-500" },// Returns 0 and false! JavaScript converts any decimal number smaller than 5E-324 (the smallest number) to 0 by default. So no way to stop or fix this script flaw! Be careful as division by this value would then return 0/0 as NaN and all others +-Infinity.
        { test: -1.7976931348623157e-500, name: "-1.7976931348623157e-500" },// Returns 0 and false! JavaScript converts any decimal number smaller than 5E-324 (the smallest number) to 0 by default. So no way to stop or fix this script flaw! Be careful as division by this value would then return 0/0 as NaN and all others +-Infinity.
        { test: null, name: "null" },
        { test: undefined, name: "undefined" },
        { test: NaN, name: "NaN" },
        { test: Number(), name: "Number()" },
        { test: Number(22), name: "Number(22)" },
        { test: Number(123.123), name: "Number(123.123)" },
        { test: Number('xyz'), name: "Number('xyz')" },
        { test: Number(Infinity), name: "Number(Infinity)" },
        { test: Number(NaN), name: "Number(NaN)" },
        { test: new Number(), name: "new Number()" },
        { test: new Number(22), name: "new Number(22)" },
        { test: new Number(123.123), name: "new Number(123.123)" },
        { test: new Number('xyz'), name: "new Number('xyz')" },
        { test: new Number(Infinity), name: "new Number(Infinity)" },
        { test: new Number(NaN), name: "new Number(NaN)" },
        { test: Infinity, name: "Infinity" },
        { test: +Infinity, name: "+Infinity" },
        { test: -Infinity, name: "-Infinity" },
        { test: new Number(Infinity), name: "new Number(Infinity)" },
        { test: new Number(+Infinity), name: "new Number(+Infinity)" },
        { test: new Number(-Infinity), name: "new Number(-Infinity)" },
        { test: new Number(Number.MAX_SAFE_INTEGER), name: "new Number(Number.MAX_SAFE_INTEGER)" },
        { test: new Number(Number.MIN_SAFE_INTEGER), name: "new Number(Number.MIN_SAFE_INTEGER)" },// this is a negative number version of the max version above!
        { test: new Number(Number.MAX_SAFE_INTEGER + 1), name: "new Number(Number.MAX_SAFE_INTEGER+1)" },// this puts number out of integer acceptable ranges
        { test: new Number(Number.MIN_SAFE_INTEGER - 1), name: "new Number(Number.MIN_SAFE_INTEGER-1)" },
        { test: Number.POSITIVE_INFINITY, name: "Number.POSITIVE_INFINITY" },
        { test: Number.NEGATIVE_INFINITY, name: "Number.NEGATIVE_INFINITY" },
        { test: Number.MAX_VALUE, name: "Number.MAX_VALUE" },// max positive number allowed in JavaScript
        { test: -Number.MAX_VALUE, name: "-Number.MAX_VALUE" },// max negative number allowed in JavaScript
        { test: Number.MIN_VALUE, name: "Number.MIN_VALUE" },// smallest positive decimal number approaching zero. Any decimal smaller than this value is cast as 0 in JavaScript, so never a valid bad value test!
        { test: -(Number.MIN_VALUE), name: "-(Number.MIN_VALUE)" },// smallest negative decimal number approaching zero.
        { test: BigInt(Number.MAX_VALUE), name: "BigInt(Number.MAX_VALUE)" },
        { test: BigInt(Number.MAX_VALUE + 1), name: "BigInt(Number.MAX_VALUE+1)" },// This may pass due to variations in precision past max values. Once it fails the BigInt cast itself will generate an error here, not in the function check, and convert value to "Infinity" which blows up the BigInt conversion method.
        { test: BigInt(-(Number.MAX_VALUE)), name: "BigInt(-(Number.MAX_VALUE))" },
        { test: BigInt(-(Number.MAX_VALUE + 1)), name: "BigInt(-(Number.MAX_VALUE+1))" },
        //{test:BigInt(Number.MAX_VALUE+Number.MAX_VALUE),name:"BigInt(Number.MAX_VALUE+Number.MAX_VALUE)"},// fails because addition creates "Infinity"
        //{test:BigInt(.00001),name:"BigInt(.00001)"},// not allowed
        //{test:BigInt(Infinity),name:"BigInt(Infinity)"},// not allowed
        { test: Number.EPSILON, name: "Number.EPSILON" },
        { test: {}, name: "{}" },
        { test: { x: 3 }, name: "{x:3}" },
        { test: { undefined }, name: "{undefined}" },
        //{test:{null},name:"{null}"},// not allowed
        { test: { NaN }, name: "{NaN}" },
        { test: new Object(), name: "new Object()" },
        { test: new Object({ x: 3 }), name: "new Object({x:3})" },
        { test: new Object({ undefined }), name: "new Object({undefined})" },
        //{test:new Object({null}),name:"new Object({null})"},// not allowed
        { test: new Object({ NaN }), name: "new Object({NaN})" },
        { test: function () { }, name: "function(){}" },
        { test: function () { x: 3 }, name: "function(){x:3}" },
        { test: function () { undefined }, name: "function(){undefined}" },
        { test: function () { null }, name: "function(){null}" },
        { test: function () { NaN }, name: "function(){NaN}" },
        { test: window, name: "window" },
        { test: [], name: "[]" },
        { test: [3], name: "[3]" },
        { test: Array(), name: "Array()" },
        { test: Array(null), name: "Array(null)" },
        { test: Array(undefined), name: "Array(undefined)" },
        { test: new Array(), name: "new Array()" },
        { test: new Array(null), name: "new Array(null)" },
        { test: new Array(undefined), name: "new Array(undefined)" },
        { test: "", name: "\"\"" },
        { test: '', name: "''" },
        { test: ``, name: "``" },
        { test: '        ', name: "'        '" },
        { test: '\t', name: "'\\t'" },
        { test: '\r\n', name: "'\\r\\n'" },
        { test: 'bcfed5.2', name: "'bcfed5.2'" },
        { test: '3.1000000n', name: "'3.1000000n'" },
        { test: '7.2acdgs', name: "'7.2acdgs'" },
        { test: new String('\t'), name: "new String('\\t')" },
        { test: new String('\r\n'), name: "new String('\\r\\n')" },
        { test: 'xabcdefx', name: "'xabcdefx'" },
        { test: 'abcdefghijklm1234567890', name: "abcdefghijklm1234567890" },
        { test: String(), name: "String()" },
        { test: String('hello'), name: "String('hello')" },
        { test: String(-0.0), name: "String(-0.0)" },
        { test: new String(), name: "new String()" },
        { test: new String('hello'), name: "new String('hello')" },
        { test: new String(-0.0), name: "new String(-0.0)" },
        { test: '1/1/2020', name: "'1/1/2020'" },
        { test: Date(), name: "Date()" },
        { test: Date('1/1/2022'), name: "Date('1/1/2022')" },
        { test: Date('0/50/10'), name: "Date('0/50/10')" },
        { test: Date(1 / 1 / 2022), name: "Date(1/1/2022)" },
        { test: Date(2009, 1, 1), name: "Date(2009, 1, 1)" },
        { test: Date('xyz'), name: "Date('xyz')" },
        { test: Date(-0.00001), name: "Date(-0.00001)" },
        { test: Date(undefined), name: "Date(undefined)" },
        { test: Date(null), name: "Date(null)" },
        { test: Date(NaN), name: "Date(NaN)" },
        { test: new Date(), name: "new Date()" },
        { test: new Date('1/1/2022'), name: "new Date('1/1/2022')" },
        { test: new Date('0/50/10'), name: "new Date('0/50/10')" },
        { test: new Date(1 / 1 / 2022), name: "new Date(1/1/2022)" },
        { test: new Date(2009, 1, 1), name: "new Date(2009, 1, 1)" },
        { test: new Date('xyz'), name: "new Date('xyz')" },
        { test: new Date(-0.00001), name: "new Date(-0.00001)" },
        { test: new Date(undefined), name: "new Date(undefined)" },
        { test: new Date(null), name: "new Date(null)" },
        { test: new Date(NaN), name: "new Date(NaN)" },
        { test: true, name: "true" },
        { test: false, name: "false" },
        { test: Boolean(), name: "Boolean()" },
        { test: Boolean('xyz'), name: "Boolean('xyz')" },
        { test: Boolean(true), name: "Boolean(true)" },
        { test: new Boolean(), name: "new Boolean()" },
        { test: new Boolean('xyz'), name: "new Boolean('xyz')" },
        { test: new Boolean(Infinity), name: "new Boolean(Infinity)" },
        { test: new Boolean(true), name: "new Boolean(true)" },
        { test: new RegExp(), name: "new RegExp()" },
        { test: new RegExp(33), name: "new RegExp(33)" },
        { test: new RegExp('33'), name: "new RegExp('33')" },
        { test: new RegExp(Infinity), name: "new RegExp(Infinity)" },
        { test: new RegExp(null), name: "new RegExp(null)" },
        { test: new RegExp(NaN), name: "new RegExp(NaN)" },
        { test: new RegExp(undefined), name: "new RegExp(undefined)" },
        { test: new RegExp('/^\s*$/'), name: "new RegExp('/^\s*$/')" },
        { test: RegExp(), name: "RegExp()" },
        { test: RegExp(33), name: "RegExp(33)" },
        { test: RegExp(Infinity), name: "RegExp(Infinity)" },
        { test: RegExp(null), name: "RegExp(null)" },
        { test: RegExp(NaN), name: "RegExp(NaN)" },
        { test: RegExp(undefined), name: "RegExp(undefined)" },
        { test: RegExp('/^\s*$/'), name: "RegExp('/^\s*$/')" },
        { test: Symbol(), name: "Symbol()" },
        { test: Symbol('test'), name: "Symbol('test')" }
    ]
};


// RUN JAVASCRIPT "BAD" DATASET TEST
//IsBadTester.start();

// HOW TO CALL THE PLAIN ISBAD(x) TEST
//console.log('Test: ' + IsBad(1.0e+16) + ' : ' + isBadMessage);

// RUN JAVASCRIPT "BAD" DATA TEST with DEFAULTS
// Test "IfBad(x,d)" with defaults to see if it returns default values when argument is a "bad" value:
//console.log('New IfBad with Default: ' + IfBad(1.0e+15, 0));
//console.log('New IfBad with Default: ' + IfBad(1.0e+16, 0));
//console.log('New IfBad with Default: ' + IfBad(new Number('xyz'), 1));
//console.log('New IfBad with Default: ' + IfBad(new Date('xyz'), new Date('6/1/2022')));
//console.log('New IfBad with Default: ' + IfBad(Infinity, 100));


// ------------------------------------------------------------
