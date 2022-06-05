
const question           = document.getElementById('question');
const choices            = document.getElementsByClassName('choice-text');
const progressText       = document.getElementById('progressText');
const scoreText          = document.getElementById('score');
const progressBarFull    = document.getElementById('progressBarFull');

let currentQuestion ={};
let acceptingAnswers = false;
let score = 0;
let questionCounter =0;
let availableQuestions =[];
let questions = [];

fetch("questions.json")
    .then(res => {
       return  res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions;
        startGame();
    })
    .catch(err => {
        console.error(err);
    })

// constants

const Correct_Bonus = 10;
const Max_Question  = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    // console.log(availableQuestions);
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= Max_Question){

        localStorage.setItem('mostRecentScore',score);

        return window.location.assign("end.html");
    }
    questionCounter++;

    progressText.innerText = ` Question ${questionCounter}/${Max_Question}`;

    //Update The Progress Bar

    progressBarFull.style.width = `${(questionCounter/Max_Question) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    // console.log(choices[0].dataset);

    // choices.forEach(choice => {
    //     const number = choice.dataset["number"];
    //     choice.innerText = currentQuestion["choice" + number];
    // });

    for (let i = 0; i <choices.length ; i++) {
        const number = choices[i].dataset['number'];
        choices[i].innerText = currentQuestion['choice' + number];

        acceptingAnswers = true;
    }
    availableQuestions.splice(questionIndex,1);

};

     // choices.forEach(choice => {
     //     choice.addEventListener('click',e => {
     //         console.log(e.target);
     //     })
     // })

    for (let i = 0; i < choices.length; i++) {
        choices[i].addEventListener('click',(e) => {
        // console.log(e.target);
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = 'incorrect';
        if(selectedAnswer == currentQuestion.answer) {

            classToApply = 'correct';
        }

        if(classToApply === "correct"){
            incrementScore(Correct_Bonus);
        }

        // const  classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect' ;

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();

        },1000);


        // console.log(classToApply);

    });
}

incrementScore = (num) => {
        score += num;
        scoreText.innerText =score;
}
