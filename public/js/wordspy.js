const gridbox = document.getElementById("gridbox")
const wordview = document.getElementById("wordview")
const scoreview = document.getElementById("scoreview")
const restartbtn = document.getElementById("restartbtn");
const wordpanel = document.getElementById("wordpanel")
const undobtn = document.getElementById("undobtn")
const popupbar = document.getElementById("popupbar")
const dialogtitle = document.getElementById("dialogtitle")
const dialogdescription = document.getElementById("dialogdescription")
const dialogbuttons = document.getElementById("dialogbuttons")
const timeview = document.getElementById("timeview")


popupbar.style.display="none"


// sound system
let bgsound = new Audio('audio/wordspybg.mp3')
let tabsound = new Audio("audio/tap.mp3")
let successsound = new Audio("audio/success.mp3")
let winsound = new Audio("audio/win.wav")

bgsound.muted = true;
tabsound.volume=1
bgsound.autoplay= true;
bgsound.loop = true
bgsound.volume=0.7



// timingFunction
let sec=0;
let min=0;
let hr =0;
setInterval(() => {
    sec++;
    if(sec>59){
        sec=0;
        min++;
    }
    if(min>59){
        min=0;
        hr++;
    }
}, 1000);
function getTimeCount(){
    return `${hr}:${min}:${sec}`
}





const words = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']



function dialogStartgame(){
    popupbar.style.display="flex";
    dialogtitle.innerHTML = "Let's Start Game"
    dialogdescription.innerHTML = "In this game we give you some words that find in the following letters box. I hope you complete this challenge.";
    let button = document.createElement("button");
    button.innerHTML = "Start";
    button.addEventListener("click",function(){
        popupbar.style.display = "none"
        bgsound.muted=false;
        bgsound.play()
    })
    dialogbuttons.innerHTML = ""
    dialogbuttons.appendChild(button)
}

function dialogAsking(title,des,yes,no){
    popupbar.style.display="flex";
    dialogtitle.innerHTML = title
    dialogdescription.innerHTML =des;
    let buttonyes = document.createElement("button");
    let buttonno = document.createElement("button");
    buttonyes.innerHTML = "Yes";
    buttonno.innerHTML = "No";
    buttonyes.addEventListener("click",function(){
        popupbar.style.display = "none"
        bgsound.muted=false;
        yes()
    })
    buttonno.addEventListener("click",function(){
        popupbar.style.display = "none"
        bgsound.muted=false;
        no()
    })
    dialogbuttons.innerHTML = ""
    dialogbuttons.appendChild(buttonyes)
    dialogbuttons.appendChild(buttonno)

}

function dialogstartLavel(level){
    popupbar.style.display="flex";
    dialogtitle.innerHTML = "Are You ready to Start Lavel "+lavel
    dialogdescription.innerHTML = "In this game we give you some words that find in the following letters box. I hope you complete this challenge.";
    let button = document.createElement("button");
    button.innerHTML = "Start";
    button.addEventListener("click",function(){
        popupbar.style.display = "none"
    })
    dialogbuttons.innerHTML = ""
    dialogbuttons.appendChild(button)
}

function dialogWinLavel(level,next,replay){
    popupbar.style.display="flex";
    dialogtitle.innerHTML = "Are You ready to Start Lavel "+lavel
    dialogdescription.innerHTML = "In this game we give you some words that find in the following letters box. I hope you complete this challenge.";
    let buttonnext = document.createElement("button");
    let buttonreplay = document.createElement("button");
    buttonnext.innerHTML = "Next";
    buttonreplay.innerHTML = "Replay";
    buttonnext.addEventListener("click",function(){
        popupbar.style.display = "none"
        next();
    })
    buttonreplay.addEventListener("click",function(){
        popupbar.style.display = "none"
        replay();
    })
    dialogbuttons.innerHTML = ""
    dialogbuttons.appendChild(buttonreplay)
    dialogbuttons.appendChild(buttonnext)
}

dialogStartgame()


// game variabls 
let targetwords = []
let score = 0;
let success = 0;
let lavel = 1;
let makingword = ""
let makinggrids =[]

function fetchWords(len,next){
    fetch(`https://random-word-api.herokuapp.com/word?number=${len}`)
    .then(response => response.json())
    .then(data => {
      next(data)
    })
    .catch(error => {
      console.error('Error fetching random words:', error);
    });
}

function pushTargetWords(){
    fetchWords(5,function(data){
        data.forEach(word => {
            targetwords.push(word.toUpperCase())
        });
        targetwords.forEach(word=>{
            let wordbx = document.createElement("h4")
            wordbx.innerHTML = word
            // makingword.toUpperCase
            wordpanel.appendChild(wordbx)
        })
        console.log("DATA PUSHED")
    })

    
}

pushTargetWords()

// seting undo Restart buttons -----------------------------------------
undobtn.addEventListener("click",function(){
    let index = makinggrids.length-1
    makinggrids[index].classList.remove("active")
    makinggrids.pop();
    let mk = makingword.substring(0,makingword.length-1)
    makingword = mk
    tabsound.play()

})
restartbtn.addEventListener("click",function(){
    dialogAsking("Are You Sure To Restart Game","if you having some problem in this game or facing some glitchs so you can restart game. are you want to restart game ?",function(){
        RestartGame();
        gridbox.innerHTML=""
        RearrangeGrid();
    })
})


function RestartGame(){
    makinggrids.forEach(grid => {
        grid.classList.remove("active")
    });
    makinggrids = []
    makingword= ""
    wordpanel.innerHTML=""
    targetwords = []
    success = 0;
    pushTargetWords()
}


function RearrangeGrid(){


for (let i = 0; i < 150; i++) {
    const randomword = words[Math.floor(Math.random() * words.length)];  
    let grid = document.createElement("div")
    grid.classList.add("grid")
    grid.innerHTML=randomword
    grid.addEventListener("click",function(){
        makingword+=grid.innerHTML
        grid.classList.add("active")  
        makinggrids.push(grid)
        tabsound.play()
        
    })
    gridbox.appendChild(grid)
}

}

RearrangeGrid()



setInterval(() => {
    wordview.innerHTML = `Making Word : ${makingword}`
    timeview.innerHTML = "Time : "+getTimeCount();
    // wordview.style.backgroundColor
    scoreview.innerHTML = `Level: ${lavel}`
    if(targetwords.includes(makingword)){
        successsound.play()
        let wordsboxes = wordpanel.querySelectorAll("h4")
        for (let index = 0; index < wordsboxes.length; index++) {
            const box = wordsboxes[index];
            if(box.innerHTML == makingword){
                box.style.backgroundColor = "green"
            }
        }
        for (let i = 0; i < targetwords.length; i++) {
            const word = targetwords[i];
            if(word == makingword){
                console.log("Word Removed")
                targetwords.splice(i,1);
            }            
        }
        makinggrids.forEach(el =>{
            el.classList.remove("active")
        })
        makinggrids = []
        makingword = "";
        success++;
    }

    if(success == 5){
        score ++;
        lavel++;
        success = 0;
        winsound.play()
        // restart Game
        dialogWinLavel(lavel,function(){
            RestartGame();
            // lavel++;
        },function(){
            RestartGame()
            
        });
    }
}, 200);