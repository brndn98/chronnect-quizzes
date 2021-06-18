var urlWP = "https://raidho.mx/wp-json/wp/v2/test/";
var urlACF = "https://raidho.mx/wp-json/acf/v3/test/";
var questionnaire;

const container = document.getElementById("container");
//const results = document.getElementById("results");
const startQuestionnaire = document.getElementById("questionnaire-1"); // HARDCODED
const stopQuestionnaireContainer = document.getElementById("stop-questionnaire-container"); // HARDCODED

function fetchQuery(id) {
	var url = urlWP + id;
	fetch(url)
  	.then(response => response.json())
  	.then(data => showQuery(data))
    .catch(error => console.log(error));
}

function showQuery(question) {
	var query = document.createElement("div");
  query.classList.add("asked");
  var answer = document.createElement("div");
  var selection = document.createElement("div");
  
  var h3 = document.createElement("h3");
  var texth3 = document.createTextNode(question.acf.answer);
  h3.appendChild(texth3);
  var h4 = document.createElement("h4");
  var texth4 = document.createTextNode(question.acf.context);
  h4.appendChild(texth4);
  answer.appendChild(h3);
  answer.appendChild(h4);
  query.appendChild(answer);
  
  var hr = document.createElement("hr");
  query.appendChild(hr);
  
  var options = question.acf.related;
  if(options && options.length > 0) {
    options.forEach(option => {
      var p = document.createElement("p");
      p.classList.add("option");
      var text = document.createTextNode(option.post_title);
      p.appendChild(text);
      p.addEventListener("click", function(e) {
      	e.target.classList.add("selected");
      	nextQuery(option);
      });
      selection.appendChild(p);
    });
  } else {
      showStopQuestionnaire();
  }
  query.appendChild(selection);
  
  var br = document.createElement("br");
  query.appendChild(br);
  
  container.appendChild(query);
  query.scrollIntoView();
  
  var capture = {
  	askedId: question.id,
  	asked: question.acf.answer,
  	selectedId: null,
    selected: null
  };
  questionnaire.captured.push(capture);
}

function nextQuery(option) {
	/*var capture = {
  	id: option.ID,
    question: option.post_title
  };
  questionnaire.push(capture);*/
  var last = questionnaire.captured[questionnaire.captured.length - 1];
  last.selectedId = option.ID;
  last.selected = option.post_title;
  
  //showCaptured();
  
    var asked = document.querySelector(".asked");
  asked.classList.replace("asked", "answered");
  
	fetchQuery(option.ID);
}

/* function showCaptured() {
  var last = questionnaire.captured[questionnaire.captured.length - 1];
  
  var div = document.createElement("div");
  var h6 = document.createElement("h6");
  var texth6 = document.createTextNode(questionnaire.captured.length + " - " + last.asked);
  h6.appendChild(texth6);
  var h5 = document.createElement("h5");
  h5.classList.add("selected");
  var texth5 = document.createTextNode(last.selected);
  h5.appendChild(texth5);
  var hr = document.createElement("hr");
  div.appendChild(h6);
  div.appendChild(h5);
  div.appendChild(hr);
  results.appendChild(div);
} */

startQuestionnaire.addEventListener("click", function() {    // HARDCODED
    fetchQuery("6524");
    initializeQuestionnaireCapture("6524");
    startQuestionnaire.parentNode.removeChild(startQuestionnaire);
});

/* window.addEventListener("load", function() {
	fetchQuery("6524");
}); */

function showStopQuestionnaire() {   // HARDCODED
    var stopButton = document.createElement("button");
    stopButton.innerHTML = "Terminar";
    stopButton.addEventListener("click", function() {
        alert("Los resultados han sido capturados.");
        console.log(questionnaire);
    });
    stopQuestionnaireContainer.appendChild(stopButton);
}

function initializeQuestionnaireCapture(queryId) {   //HARDCODED
    questionnaire = {
        user: userInfo,
        qId: queryId,   // HARDCODED
        captured: []
    };
}