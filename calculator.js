const deniedInput = document.getElementById("input-output");
const keyStrokes = ["1","2","3","4","5","6","7","8","9","0",
    "+","-","Backspace","%","x","=","(",")","."," ","sin","cos","tan","ln","log","√","x!","π","e","^","n+1"
];
const input = document.getElementById("input-output");
let button = document.getElementsByTagName("button");

deniedInput.addEventListener("keydown", function(event) {
    const keyName = event.key;
    if (!keyStrokes.includes(keyName)) {
        event.preventDefault();
    }
});

for (let i = 0; i < button.length; i++) {
    button[i].addEventListener('click', function() {
        const text = button[i].innerText;
        const numbers = ["1","2","3","4","5","6","7","8","9","0"];
        const existing = input.value;

        if (text === "clear") {
            input.value = "";
        } else if (text === "=") {
            calculate(existing);
        } else if (!numbers.includes(text)) {
            input.value += " " + text + " ";
        } else {
            input.value += text;
        }
    });
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

function factorial(n) {
    n = Math.floor(n);
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let f = 1;
    for (let i = 1; i <= n; i++) f *= i;
    return f;
}

function calculate(existing) {
    if (!existing) return;

    try {
        let tokens = existing.match(
            /\d+(\.\d+)?|sin|cos|tan|ln|log|√|x!|π|e|n\+1|\^|%|\+|\-|x|÷|\(|\)/g
        );

        if (!tokens) throw "Invalid Input";

        tokens = insertImplicitMultiplication(tokens);

        const postfix = toPostfix(tokens);
        const ans = evaluatePostfix(postfix);

        if (ans === undefined || ans === null || isNaN(ans) || !isFinite(ans)) {
            throw "Math Error";
        }

        input.value = ans;
    } catch (err) {
        input.value = err;
    }
}

function insertImplicitMultiplication(tokens) {
    const result = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const next = tokens[i + 1];

        result.push(token);

        if (
            ( !isNaN(token) || token === ")" || token === "π" || token === "e" ) &&
            (next === "(" || ["sin","cos","tan","ln","log","√","x!","n+1"].includes(next))
        ) {
            result.push("x");
        }
    }
    return result;
}

function toPostfix(tokens) {
    const output = [];
    const stack = [];
    const precedence = {
        "x": 3, "÷": 3, "+": 2, "-": 2, "^": 4, "%": 3, "n+1": 5
    };
    const rightAssociative = { "^": true, "n+1": true };
    const functions = ["sin","cos","tan","ln","log","√","x!","π","e","n+1"];

    for (let token of tokens) {
        if (!isNaN(token) || token === "π" || token === "e") {
            output.push(token);
        } else if (functions.includes(token)) {
            stack.push(token);
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }
            stack.pop();
            if (stack.length && functions.includes(stack[stack.length - 1])) {
                output.push(stack.pop());
            }
        } else {
            while (
                stack.length &&
                ((precedence[stack[stack.length - 1]] > precedence[token]) ||
                (precedence[stack[stack.length - 1]] === precedence[token] && !rightAssociative[token])) &&
                !functions.includes(stack[stack.length - 1]) &&
                stack[stack.length - 1] !== "("
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length) {
        output.push(stack.pop());
    }
    return output;
}

function evaluatePostfix(postfix) {
    const stack = [];
    for (let token of postfix) {
        if (!isNaN(token)) {
            stack.push(Number(token));
        } else if (token === "π") {
            stack.push(Math.PI);
        } else if (token === "e") {
            stack.push(Math.E);
        } else if (["sin","cos","tan","ln","log","√","x!","n+1"].includes(token)) {
            const num = stack.pop();
            switch(token) {
                case "sin": stack.push(Math.sin(degToRad(num))); break;
                case "cos": stack.push(Math.cos(degToRad(num))); break;
                case "tan": stack.push(Math.tan(degToRad(num))); break;
                case "ln": stack.push(Math.log(num)); break;
                case "log": stack.push(Math.log10(num)); break;
                case "√": stack.push(Math.sqrt(num)); break;
                case "x!": stack.push(factorial(num)); break;
                case "n+1": stack.push(num + 1); break;
            }
        } else {
            const b = stack.pop();
            const a = stack.pop();
            switch(token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "x": stack.push(a * b); break;
                case "÷": stack.push(a / b); break;
                case "^": stack.push(Math.pow(a, b)); break;
                case "%": stack.push(a % b); break;
            }
        }
    }
    return stack[0];
}
