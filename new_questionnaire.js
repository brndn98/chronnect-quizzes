window.addEventListener("load", function() {

    var questionnaire = {
        id: 0,
        title: "Proceso para llegar al diagnostico",
        description: "Tener un diagnostico de tu condicion es la base para poder empezar tu proceso de tratamiento. Por eso, realizamos un cuestionario que te ayude a identificar como es tu estado actual.",
        duration: "5 min",
        start: 0,
        captured: [],
        user: {
            name: "",
            email: ""
        }
    }

    var questions = [
        {
            id: 0,
            title: "first",
            question: "¿Cual es tu diagnostico?",
            description: "Si ya has recibido una validacion de parte de un medico o especialista, podemos empezar por ahi en nuestro proceso de auto conocimiento.",
            related: [1, 2, 3, 4]
        },
        {
            id: 1,
            title: "Enfermedad de Crohn",
            question: "¿Hace cuanto tiempo recibiste tu diagnostico?",
            description: "",
            related: [5, 6, 7, 8, 9, 10]
        },
        {
            id: 2,
            title: "Enfermedad de Colitis Ulcerosa",
            question: "¿Hace cuanto tiempo recibiste tu diagnostico?",
            description: "",
            related: [5, 6, 7, 8, 9, 10]
        },
        {
            id: 3,
            title: "Otra",
            question: "¿Hace cuanto tiempo recibiste tu diagnostico?",
            description: "",
            related: [5, 6, 7, 8, 9, 10]
        },
        {
            id: 4,
            title: "Aun no tengo diagnostico",
            question: "¿Estas en proceso de llegar a un diagnostico?",
            description: "",
            related: [11, 12],
        },
        {
            id: 5,
            title: "0 - 3 meses",
            question: "",
            description: "",
            related: false,
        },
        {
            id: 6,
            title: "4 - 6 meses",
            question: "",
            description: "",
            related: false,
        },
        {
            id: 7,
            title: "7 - 12 meses",
            question: "",
            description: "",
            related: false,
        },
        {
            id: 8,
            title: "1 - 3 años",
            question: "",
            description: "",
            related: false,
        },
        {
            id: 9,
            title: "4 - 7 años",
            question: "",
            description: "",
            related: false,
        },
        {
            id: 10,
            title: "+7 años",
            question: "",
            description: "",
            related: false,
        },
        {
            id: 11,
            title: "Si",
            question: "",
            description: "",
            related: false,
        },
        {
            id: 12,
            title: "No",
            question: "",
            description: "",
            related: false,
        }
    ]

    var buttons = document.querySelectorAll(".start-button");
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            initTest(button.getAttribute("data-type"), button.getAttribute("data-test"));
            button.disabled = true;
        });
    });

    function initTest(type, testId) {
        switch(type) {
            case "questionnaire":
                setQuestionnaire();
                break;
            case "quiz":
                initQuiz();
        }
    }

    function setQuestionnaire() {
        var container = refreshContainer();

        var questionnaireTitle = document.createElement("h2");
        var titleText = document.createTextNode(questionnaire.title);
        questionnaireTitle.appendChild(titleText);

        var duration = document.createElement("p");
        var durationText = document.createTextNode(questionnaire.duration);
        duration.appendChild(durationText);

        var description = document.createElement("p");
        var descriptionText = document.createTextNode(questionnaire.description);
        description.appendChild(descriptionText);

        var start = document.createElement("button");
        start.className = "start-button";
        start.textContent = "Comenzar";
        start.addEventListener("click", function() {
            //initQuestionnaire(questionnaire.start);
            captureUser(questionnaire.start);
        });

        container.contentQuestion.appendChild(questionnaireTitle);
        container.contentQuestion.appendChild(duration);
        container.contentQuestion.appendChild(description);
        container.contentQuestion.appendChild(start);
    }

    function captureUser(startId) {
        var container = refreshContainer();

        var nameLabel = document.createElement("p");
        nameLabel.textContent = "Empecemos, cual es tu nombre?";
        var nameInput = document.createElement("input");
        nameInput.setAttribute("type", "text");

        var emailLabel = document.createElement("p");
        emailLabel.textContent = "Cual es tu correo?";
        var emailInput = document.createElement("input");
        emailInput.setAttribute("type", "email");

        var confirm = document.createElement("button");
        confirm.className = "start-button";
        confirm.style.marginTop = "20px";
        confirm.textContent = "Siguiente";
        confirm.addEventListener("click", function() {
            if(nameInput.value && emailInput.value) {
                questionnaire.user.name = nameInput.value;
                questionnaire.user.email = emailInput.value;
                initQuestionnaire(startId);
            }
        });

        container.contentQuestion.appendChild(nameLabel);
        container.contentQuestion.appendChild(nameInput);
        container.contentQuestion.appendChild(emailLabel);
        container.contentQuestion.appendChild(emailInput);
        container.contentQuestion.appendChild(confirm);
    }

    function initQuestionnaire(questionnaireId) {
        var question = questions.filter(question => question.id == questionnaireId);
        var options = getQuestionOptions(question[0].related);
        showQuestion(question[0], options);
    }

    function getQuestionOptions(related) {
        var options = [];
        related.forEach(option => {
            questions.forEach(question => {
                if(question.id === option) {
                    options.push(question);
                }
            });
        });
        return options;
    }

    function showQuestion(question, options) {
        var container = refreshContainer();

        var h2 = document.createElement("h2");
        var h2Text = document.createTextNode(question.question);
        h2.appendChild(h2Text);
        container.contentQuestion.appendChild(h2);
        if(question.description) {
            var p = document.createElement("p");
            var pText = document.createTextNode(question.description);
            p.appendChild(pText);
            container.contentQuestion.appendChild(p);
        }

        var h3 = document.createElement("h3");
        var h3Text = document.createTextNode("Opciones:");
        h3.appendChild(h3Text);
        container.contentOptions.appendChild(h3);
        options.forEach(option => {
            var o = document.createElement("p");
            var oText = document.createTextNode(option.title);
            o.appendChild(oText);
            container.contentOptions.appendChild(o);
            
            o.addEventListener("click", function() {
                captureOption(question, option);
                if(option.related) {
                    var os = getQuestionOptions(option.related);
                    showQuestion(option, os);
                } else {
                    endQuestionnaire();
                }
            });
        });
    }

    function captureOption(question, option) {
        var capture = {
            askedId: question.id,
            askedQuestion: question.question,
            selectedId: option.id,
            selectedTitle: option.title
        }
        questionnaire.captured.push(capture);
    }

    function endQuestionnaire() {
        var container = refreshContainer();

        var h2F = document.createElement("h2");
        var h2FText = document.createTextNode("Gracias por tus respuestas!");
        h2F.appendChild(h2FText);
        container.contentQuestion.appendChild(h2F);

        var pF = document.createElement("p");
        var pFText = document.createTextNode("Pronto recibiras en tu correo los resultados del cuestionario");
        pF.appendChild(pFText);
        container.contentQuestion.appendChild(pF);

        console.log(questionnaire);
    }


    var quiz = {
        id: 0,
        title: "Enfermedades Inflamatorias Intestinales",
        description: "Las enfermedades inflamatorias intestinales (EII) son condiciones cronicas, autoinmunes e inflamatorias. Haz este quiz para saber mas sobre ellas.",
        duration: "5 min",
        score: 0,
        questions: [
            {
                question: "¿Las enfermedades inflamatorias intestinales (EII) son equivalentes al sindrome de instestino irritable (SII)?",
                options: [
                    {
                        title: "Si",
                        feedback: "<h2>Buen intento.</h2><p>Las enfermedades inflamatorias intestinales no son lo mismo que el síndrome del intestino irritable (SII), que puede tener algunos síntomas similares, pero no daña el tracto digestivo.</p>",
                        isCorrect: false
                    },
                    {
                        title: "No",
                        feedback: "<h2>¡Muy bien!</h2><p>A pesar de que no son lo mismo, si se puede llegar a presentar una comorbilidad. El SII es más común en personas con EII que en la población general.</p>",
                        isCorrect: true
                    }
                ]
            },
            {
                question: "¿Hay distintos tipos de Colitis Ulcerosa y Enfermedad de Crohn?",
                options: [
                    {
                        title: "Si",
                        feedback: "<h2>¡Muy bien!</h2><p>Tanto la Enfermedad de Crohn y la Colitis Ulcerosa a menudo se clasifican con base en la parte o las partes del intestino que son más afectadas. A veces puede impactar a más de una parte del intestino.</p>",
                        isCorrect: true
                    },
                    {
                        title: "No",
                        feedback: "<h2>Oh vaya,</h2><p>Tanto la Enfermedad de Crohn y la Colitis Ulcerosa a menudo se clasifican con base en la parte o las partes del intestino que son más afectadas. A veces puede impactar a más de una parte del intestino.</p>",
                        isCorrect: false
                    }
                ]
            },
            {
                question: "¿La Enfermedad de Crohn y la Colitis Ulcerosa pueden manifestarse en la boca?",
                options: [
                    {
                        title: "Si",
                        feedback: "<h2>¡Correcto!</h2><p>Aproximadamente 1 de cada 25 personas con colitis ulcerosa tiene llagas o úlceras en la boca, generalmente cuando la condición está activa.</p><p>Estas llagas pueden ser leves y desaparecer en unas pocas semanas, pero ocasionalmente pueden durar más semanas y necesitar tratamiento de esteroides.</p>",
                        isCorrect: true
                    },
                    {
                        title: "No",
                        feedback: "<h2>Sigue intentando</h2><p>Aproximadamente 1 de cada 25 personas con colitis ulcerosa tiene llagas o úlceras en la boca, generalmente cuando la condición está activa.</p><p>Estas llagas pueden ser leves y desaparecer en unas pocas semanas, pero ocasionalmente pueden durar más semanas y necesitar tratamiento de esteroides.</p>",
                        isCorrect: false
                    }
                ]
            }
        ]
    }

    function initQuiz() {
        var container = refreshContainer();
        var currentIndex = 0;

        var quizTitle = document.createElement("h2");
        var titleText = document.createTextNode(quiz.title);
        quizTitle.appendChild(titleText);

        var duration = document.createElement("p");
        var durationText = document.createTextNode(quiz.duration);
        duration.appendChild(durationText);

        var length = document.createElement("p");
        var lengthText = document.createTextNode(quiz.questions.length + " preguntas");
        length.appendChild(lengthText);

        var description = document.createElement("p");
        var descriptionText = document.createTextNode(quiz.description);
        description.appendChild(descriptionText);

        var start = document.createElement("button");
        start.className = "start-button";
        start.textContent = "Comenzar";
        start.addEventListener("click", function() {
            showQuizQuestion(quiz.questions[currentIndex], currentIndex);
        });

        container.contentQuestion.appendChild(quizTitle);
        container.contentQuestion.appendChild(length);
        container.contentQuestion.appendChild(duration);
        container.contentQuestion.appendChild(description);
        container.contentQuestion.appendChild(start);
    }

    function showQuizQuestion(question, index) {
        var container = refreshContainer();

        var h2 = document.createElement("h2");
        var h2Text = document.createTextNode(question.question);
        h2.appendChild(h2Text);
        container.contentQuestion.appendChild(h2);

        var h3 = document.createElement("h3");
        var h3Text = document.createTextNode("Opciones:");
        h3.appendChild(h3Text);
        container.contentOptions.appendChild(h3);
        question.options.forEach(option => {
            var o = document.createElement("p");
            var oText = document.createTextNode(option.title);
            o.appendChild(oText);
            container.contentOptions.appendChild(o);
            
            o.addEventListener("click", function() {
                quiz.score = option.isCorrect ? quiz.score + 1 : quiz.score;
                container.contentQuestion.innerHTML = option.feedback;

                var next = document.createElement("button");
                next.className = "start-button";
                next.textContent = "Siguiente";
                next.addEventListener("click", function() {
                    index++;
                    if(index < quiz.questions.length) {
                        showQuizQuestion(quiz.questions[index], index);
                    } else {
                        endQuiz();
                    }
                });
                container.contentOptions.appendChild(next);
            });
        });
    }

    function endQuiz() {
        var container = refreshContainer();

        var h2Q = document.createElement("h2");
        var h2QText = document.createTextNode("Gracias por realizar este quiz!");
        h2Q.appendChild(h2QText);
        container.contentQuestion.appendChild(h2Q);

        var pQ = document.createElement("p");
        var pQText = document.createTextNode("Puntuacion: " + quiz.score + "/" + quiz.questions.length);
        pQ.appendChild(pQText);
        container.contentQuestion.appendChild(pQ);

        console.log(questionnaire);
    }


    function refreshContainer() {
        var contentQuestion = document.querySelector("#content-question");
        var contentOptions = document.querySelector("#content-options");
        contentQuestion.innerHTML = "";
        contentOptions.innerHTML = "";

        return {contentQuestion, contentOptions};
    }

});