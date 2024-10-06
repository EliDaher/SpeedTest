//get html element
const body = document.querySelector("body")
const textContainer = document.querySelector(".textContainer")
const startBtn = document.querySelector(".startBtn")
const time = document.querySelector(".time")
const tbody = document.querySelector("tbody")



//define page variable
const quoteUrl = "https://api.quotable.io/quotes/random?minLength=100&maxLength=140"
var quote = ""
var testStart = false
var userInput = []
var charArr = []
var userResult = []
var curResult = [{correctChar: "0", curTime: "60"}]
var Wrongs = 0



//toggle dark and light mode

const DarkLightToggle = () => {
    body.classList.toggle("darkmode")
}



//start test timer

body.addEventListener("keypress", (e) => {
    if(e.key == " " || e.key == "Enter"){
        startTimer()
    }
})

const startTimer = () => {
    if(!testStart){
        testStart = true
        var timer = setInterval(() => {
                if(time.innerHTML != 0){
                time.innerHTML -= 1
            }else{
                testStop()
                clearInterval(timer)
            }
        }, 1000);

    }

}

startBtn.addEventListener("click", () => {
    startTimer()
})



//test stop

const testStop = () => {
    if(testStart){
        testStart = false
        time.innerHTML = 60
        setFinalResult()
        getTestTxt()
        userInput = []
        curResult = [{correctChar: "0", curTime: "60"}]
        Wrongs = 0
    }
}


//get the test text
const getTestTxt = async () => {
    const response = await fetch(quoteUrl)
    var data = await response.json();
    quote = data[0].content;
    
    //break the text to char
    charArr = quote.split("").map((char) => {
        return "<span class='textChar'>" + char + "</span>"
    })

    //add the chars to the text container
    textContainer.innerHTML = ""
    textContainer.innerHTML += charArr.join("")

}

body.addEventListener("load", getTestTxt())


//take the user input
body.addEventListener("keydown",(e) => {
    if(userInput.length + 1 == quote.length){addResult(); time.innerHTML = 0;}
    if(testStart){

        if(e.key == "Backspace" && userInput.length > 0){
            charArr[userInput.length - 1] = clearEffect(quote[userInput.length - 1])
            userInput.pop()
        }else if(e.key != "Shift"){
            if(userInput[userInput.length - 1] != quote[userInput.length - 1] && userInput[userInput.length -2] != quote[userInput.length - 2]){
                return

            }
            userInput.push(e.key)
        }
        checkCorrect()
        textContainer.innerHTML = charArr.join("")
        styleCurrentLetter()
    }

})

const checkCorrect = () => {
    var charIndex = userInput.length - 1
    if(userInput.length > 0){
        if(userInput[charIndex] == quote[charIndex]){
            charArr[charIndex] = setCorrect(quote[charIndex])
            addResult()
        }else{
            charArr[charIndex] = setWrong(quote[charIndex])
        }
    }
}

const clearEffect = (txt) => {
    return "<span class='textChar'>" + txt + "</span>"
}

const setCorrect = (txt) => {
    return "<span class='textChar correctChar'>" + txt + "</span>"
}

const setWrong = (txt) => {
    Wrongs += 1
    return "<span class='textChar wrongChar'>" + txt + "</span>"
}

// add result and calc the final result

const addResult = () => {
    //get result on every key press
    curResult.push({correctChar: Number(curResult[curResult.length - 1].correctChar + 1), curTime: time.innerHTML})
    
}


//add the final result to the board

const setFinalResult = () => {
    //get the final result

    tbody.innerHTML = ""

    userResult.push({id: userResult.length + 1,correct: curResult[curResult.length - 1].correctChar, finTime: Number(60 - curResult[curResult.length - 2].curTime)})
    userResult.map((res) => {

        //calc the typing speed
        typingSpeed = Math.floor(res.correct / 4.7 * 60 / res.finTime)
        accuracy = Math.floor(100 - (Wrongs * 100 / quote.length))

        tbody.innerHTML += `<tr>
                    <td>${res.id}</td>
                    <td>${typingSpeed} WPM</td>
                    <td>${accuracy}%</td>
                </tr>`
    })
}


//show the current letter the user step on
const styleCurrentLetter = () => {
    textContainer.children[userInput.length].classList.add("currentLetter")
    
}