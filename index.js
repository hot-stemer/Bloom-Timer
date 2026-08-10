const choosingMode = document.getElementById('choosingMode');
const focueMode = document.getElementById('focueMode');
const breakMode = document.getElementById('breakMode');
const startBtn = document.getElementById('srartBtn');
const restartBtn = document.getElementById('restartSession')
const skipBtn = document.getElementById('skipBtn')
const longSessionBtn = document.getElementById('longSession')
const shortSessionBtn = document.getElementById('shortSession')
const meduimSessionBtn = document.getElementById('meduimSession')
const breakDuration = document.getElementById('breakLength')
const focusTitle = document.getElementById('focusTitle');
const breakTitle = document.getElementById('breakTitle');
const breakIdea = document.getElementById('breakIdea')
const garden = document.getElementById('garden');

let titles;
let randomFocusTitle;
let randomBreakTitle;
let randomBreakIdea;

let sessionLength = 0;

let counter = 0;

let interval = null;

let breakCounter = 0;

let breakLength = 0;

let breakInterval = null;

let breakPrecent; 

let selectedSessionMode = null;

let flowersNumber = JSON.parse(localStorage.getItem('flowersNumber')|| '[]');


startBtn.addEventListener('click', startSession);
restartBtn.addEventListener('click', restart);
skipBtn.addEventListener('click', skipBreak);
longSessionBtn.addEventListener('click', longSession);
shortSessionBtn.addEventListener('click', shortSession);
meduimSessionBtn.addEventListener('click', meduimSession);


drawFlowers();
askforPermission();


function randomLength(){
    const breakPrecent = Math.random()* (0.25 - 0.20) + 0.20
    if(selectedSessionMode === "short"){
        sessionLength = Math.floor(Math.random()* (3600 - 1500 + 1 )+ 1500);
    }
    else if(selectedSessionMode === "medium"){
        sessionLength = Math.floor(Math.random()* (5400 - 3600 + 1 )+ 3600)
    }
    else if(selectedSessionMode ==="long"){
        sessionLength = Math.floor(Math.random()* (7200 - 5400 + 1 )+ 5400);
    }
    breakLength = Math.floor(breakPrecent* sessionLength)
}

function shortSession(){
    selectedSessionMode = "short";
    shortSessionBtn.classList.add("buttonClicked");
    longSessionBtn.classList.remove("buttonClicked");
    meduimSessionBtn.classList.remove("buttonClicked");
}

function meduimSession(){
    selectedSessionMode = "medium";
    meduimSessionBtn.classList.add("buttonClicked");
    longSessionBtn.classList.remove("buttonClicked");
    shortSessionBtn.classList.remove("buttonClicked");
}

function longSession(){
    selectedSessionMode = "long";
    longSessionBtn.classList.add("buttonClicked");
    shortSessionBtn.classList.remove("buttonClicked");
    meduimSessionBtn.classList.remove("buttonClicked");
}


function startSession(){
     if(interval){
        clearInterval(interval);
    }
    if(selectedSessionMode === null){
        alert("please select the session type first!")
    }
    else{
        randomLength()
        addFocusTitle()
        focueMode.classList.add("active");
        breakMode.classList.remove("active")
        choosingMode.classList.remove("active");
        interval = setInterval(updateTime, 1000);
    }
    
}

function restart(){
    focueMode.classList.remove("active");
    choosingMode.classList.add("active");
    clearInterval(interval);
    clearInterval(breakInterval);
    breakCounter = 0;
    counter = 0;
    longSessionBtn.classList.remove('buttonClicked');
    shortSessionBtn.classList.remove('buttonClicked');
    meduimSessionBtn.classList.remove('buttonClicked');

}

function startBreak(){
    breakDuration.textContent = `${Math.floor(breakLength / 60)} minutes ` 
    clearInterval(interval);
    counter = 0;
    if(breakInterval){
        clearInterval(breakInterval);
    }
    addBreakIdeas();
    addBreakTitle();
    breakMode.classList.add("active");
    focueMode.classList.remove("active")
    breakInterval = setInterval(updateBreakTime, 1000)
}

function skipBreak(){
    focueMode.classList.add("active");
    breakMode.classList.remove("active");
    breakCounter = 0;  
    clearInterval(breakInterval);
    clearInterval(interval)
    interval = setInterval(updateTime, 1000);
}

 function updateTime(){
    counter ++;
    if (counter >= sessionLength){
       clearInterval(interval);
       counter = 0;
       startBreak();
       showBreakNotifiction()
 }
 }

  function updateBreakTime(){
    breakCounter ++;
    if (breakCounter >= breakLength){
       clearInterval(breakInterval);
       breakCounter = 0;
       plantBloom()
       flowersNumber.push('flower')
       startSession();
       showSessionNotifiction();
       updateFlowerStorage();
 }
  }
 function updateFlowerStorage(){
    localStorage.setItem('flowersNumber', JSON.stringify(flowersNumber));
 }

function plantBloom(){
    const flower = document.createElement('span');
    flower.textContent = '🌸';
    flower.style.position = 'fixed';

    const rect = document.querySelector('.active .mainBox').getBoundingClientRect();
    let x, y; 
    do {
        x = Math.random() * window.innerWidth;
        y = Math.random() * window.innerHeight;
    } while (x > rect.left - 20 && x < rect.right + 20 && y > rect.top - 20 && y < rect.bottom + 20);

    flower.style.left = x + 'px';
    flower.style.top = y + 'px';
    flower.classList.add('bloomIn')
    garden.appendChild(flower);
}
function drawFlowers(){
    flowersNumber.forEach(element => {
        plantBloom();
    });
}
async function getTetx(){
    const response = await fetch('text.json');
    titles = await response.json();
}
getTetx();
function addFocusTitle(){
    randomFocusTitle = Math.floor(Math.random() * titles.focusTitle.length);
    focusTitle.textContent = titles.focusTitle[randomFocusTitle];

};
function addBreakTitle(){
    randomBreakTitle = Math.floor(Math.random() * titles.break.length);
    breakTitle.textContent = titles.break[randomBreakTitle];
};
function addBreakIdeas(){
    randomBreakIdea = Math.floor(Math.random() * titles.breakIdeas.length);
    breakIdea.textContent = titles.breakIdeas[randomBreakIdea];
};
function askforPermission(){
    if(Notification.permission === "default"){
        Notification.requestPermission();
    }
    
}
function showBreakNotifiction(){
    if(Notification.permission === "granted"){
        const breakNote = new Notification("time for a small break", {
        body: "you did it, enjoy your break now"})
    };
}
function showSessionNotifiction(){
    if(Notification.permission == "granted"){
        const sessionNote = new Notification(
            "ohh let's get back to work!",
            {
                body: "lock back in, you got this!",
            }
        )
    }
}
updateFlowerStorage();
