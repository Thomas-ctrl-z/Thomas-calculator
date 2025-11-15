const deniedInput = document.getElementById("input-output");
const keyStrokes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 
    "+", "-", "Backspace", "%", "x", "=", ")", "(", ".", " "
]

deniedInput.addEventListener("keydown", function(event) {
    const keyName = event.key
    console.log(keyName);
    
    if (!keyStrokes.includes(keyName)) {
        event.preventDefault();
        return;
    }
});

//If key press is not equal to the item in the area then invalidate

