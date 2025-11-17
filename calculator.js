const deniedInput = document.getElementById("input-output");
const keyStrokes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 
    "+", "-", "Backspace", "%", "x", "=", ")", "(", ".", " "
]
const input = document.getElementById("input-output");

let button = document.getElementsByTagName("button")



deniedInput.addEventListener("keydown", function(event) {
    const keyName = event.key
    console.log(keyName);
    
    if (!keyStrokes.includes(keyName)) {
        event.preventDefault();
        return;
    }
});



for (let i = 0; i < button.length; i++) {

    button[i].addEventListener('click', function(e) {
        const text = button[i].innerText;
         let numbers = ["1","2","3","4","5","6","7","8","9","0"];
         const existing = input.value

         if (text === "clear") {
            input.value = "";

         } else if (text === "=") {
            Addition(existing);

         }  else if (!numbers.includes(text)) {
            input.value += " " + text + " ";

         } else
            input.value += text;
    });

}


function Addition(existing) {
    math = existing.split("+").map(s => s.trim());
    let ans = 0;

    for (let i = 0; i < math.length; i++) {
       ans += Number(math[i]);
    }

    input.value = ans;
}
