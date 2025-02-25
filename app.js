// الحصول على عناصر HTML
const body = document.querySelector("body");
const textContainer = document.querySelector(".textContainer");
const startBtn = document.querySelector(".startBtn");
const time = document.querySelector(".time");
const tbody = document.querySelector("tbody");

// تعريف المتغيرات
const quoteUrl = "https://baconipsum.com/api/?type=all-meat&paras=1&format=text";
let quote = "";
let testStart = false;
let userInput = [];
let charArr = [];
let userResult = [];
let curResult = [{ correctChar: "0", curTime: "60" }];
let Wrongs = 0;

// تبديل الوضع المظلم والفاتح
const DarkLightToggle = () => {
    body.classList.toggle("darkmode");
};

// بدء المؤقت عند الضغط على زر معين
body.addEventListener("keypress", (e) => {
    if (e.key === " " || e.key === "Enter") {
        startTimer();
    }
});

const startTimer = () => {
    if (!testStart) {
        testStart = true;
        let timer = setInterval(() => {
            if (time.innerHTML > 0) {
                time.innerHTML -= 1;
            } else {
                testStop();
                clearInterval(timer);
            }
        }, 1000);
    }
};

startBtn.addEventListener("click", () => {
    startTimer();
});

// إيقاف الاختبار
const testStop = () => {
    if (testStart) {
        testStart = false;
        time.innerHTML = 60;
        setFinalResult();
        getTestTxt();
        userInput = [];
        curResult = [{ correctChar: "0", curTime: "60" }];
        Wrongs = 0;
    }
};

// جلب النص من API
const getTestTxt = async () => {
    try {
        const response = await fetch(quoteUrl);
        const data = await response.text();
        quote = data;
        
        charArr = quote.split("").map((char) => `<span class='textChar'>${char}</span>`);
        textContainer.innerHTML = charArr.join("");
    } catch (error) {
        console.error("خطأ في جلب البيانات", error);
    }
};

document.addEventListener("DOMContentLoaded", getTestTxt);

// استقبال إدخال المستخدم
body.addEventListener("keydown", (e) => {
    if (userInput.length + 1 === quote.length) {
        addResult();
        time.innerHTML = 0;
    }
    if (testStart) {
        if (e.key === "Backspace" && userInput.length > 0) {
            userInput.pop();
            charArr[userInput.length] = clearEffect(quote[userInput.length]);
        } else if (e.key !== "Shift") {
            userInput.push(e.key);
        }
        checkCorrect();
        textContainer.innerHTML = charArr.join("");
        styleCurrentLetter();
    }
});

const checkCorrect = () => {
    let charIndex = userInput.length - 1;
    if (userInput.length > 0) {
        if (userInput[charIndex] === quote[charIndex]) {
            charArr[charIndex] = setCorrect(quote[charIndex]);
            addResult();
        } else {
            charArr[charIndex] = setWrong(quote[charIndex]);
        }
    }
};

const clearEffect = (txt) => `<span class='textChar'>${txt}</span>`;
const setCorrect = (txt) => `<span class='textChar correctChar'>${txt}</span>`;
const setWrong = (txt) => {
    Wrongs += 1;
    return `<span class='textChar wrongChar'>${txt}</span>`;
};

const addResult = () => {
    curResult.push({
        correctChar: Number(curResult[curResult.length - 1].correctChar) + 1,
        curTime: time.innerHTML
    });
};

const setFinalResult = () => {
    tbody.innerHTML = "";
    let lastResult = curResult[curResult.length - 2] || { curTime: "60" };
    userResult.push({
        id: userResult.length + 1,
        correct: curResult[curResult.length - 1].correctChar,
        finTime: 60 - Number(lastResult.curTime)
    });

    userResult.forEach((res) => {
        let typingSpeed = Math.floor((res.correct / 5) / (res.finTime / 60));
        let accuracy = Math.max(0, Math.floor(100 - (Wrongs * 100 / quote.length)));
        
        tbody.innerHTML += `<tr>
                    <td>${res.id}</td>
                    <td>${typingSpeed} WPM</td>
                    <td>${accuracy}%</td>
                </tr>`;
    });
};

const styleCurrentLetter = () => {
    if (userInput.length < textContainer.children.length) {
        textContainer.children[userInput.length].classList.add("currentLetter");
    }
};
