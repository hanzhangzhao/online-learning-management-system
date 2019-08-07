
function DisplayErrMsg(err)
{
	$('#error').text(err);
}

function DisplayInfo(msg)
{
	$('#error').css('color', 'green');
	$('#error').text(msg);
}

function ParseAndDisplayUnit(id)
{
	if(id == "")
        $("#EMLupload").show();
	else
    {
		$("#unitSelected").show();
		$("#btnBackToSelection").show();
		$("#btnBackToSelection2").show();
        $("#btnMark").show();
        DisplayUnit(id);
	}
}

function parseString(str)
{
    str = str.replace(/<content>/g, "<ul class='lessonContent'>");
    str = str.replace(/<\/content>/g, "</ul>");
	str = str.replace(/<list>/g, "<li>");
	str = str.replace(/<\/list>/g, "</li><br>");
	str = str.replace(/<def>/g, "<br><strong>");
    str = str.replace(/<\/def>/g, "</strong>");
    str = str.replace(/<block>/g, "<pre>");
	str = str.replace(/<\/block>/g, "</pre>");

	return str;
}

function AddDiv(id, idToAddTo)
{
	idToAddTo = "#" + idToAddTo;
	$(idToAddTo).append("<div id="+id+"></div>");
}

function AddHeader(id, content, headerNum)
{
	id = "#" + id;
	$(id).append("<h"+headerNum + ">" + content + "</h"+headerNum+">");
	if(headerNum == 1)
		$(id).append("<hr>");
}

function AddContent(id, content)
{
	id = "#" + id;
	var parseContent = parseString(content);
	$(id).append(parseContent);
}

function DisplayUnit(id)
{
    $.get('contentGenerator.php', {
        'getUnitById': id
    },
		function(unit) {


                AddHeader("unitSelected", unit.Title, 1);
                DisplayLessons(unit.ID);
                

            DisplayQuiz(unit.ID);
		}
	, "json");
}

function DisplayQuiz(unitId)
{
	$.get('contentGenerator.php',
		{'getQuizByUnitId': unitId},
		function(quiz) 
		{
			if(quiz == null)
				DisplayErrMsg("Error: Unable get quiz by unit id: " + unitId);
			else
			{
				var id = "quiz"+quiz.ID;
				AddDiv(id, "unitSelected");
				AddHeader(id, quiz.Title, 3);
				DisplayQuizQuestions(quiz.ID, id);
			}
		}
	, "json");
}

function DisplayQuizQuestions(quizId, divId)
{
	$.get('contentGenerator.php',
		{'getQuizQuesByQuizId': quizId},
		function(questions) {
			if(questions.length == 0)
				DisplayErrMsg("Error: Unable get questions by quiz id: " + quizId);
			else{
				for(var i = 0; i < questions.length; i++){
					var ques = questions[i];
					AddQuestion(ques, divId);
				}
			}
		}
	, "json");
}

function AddQuestion(ques, divId)
{
	var quesId = "question" + ques.ID;
    $("#" + divId).append("<form id='" + quesId + "' style='text-align: left;'><h4>"+ques.Question+"</h4></form><br/>");

	$.get('contentGenerator.php',
		{'getQuizAnsByQuesId': ques.ID},
		function(answers) {
			if(answers.length == 0)
				DisplayErrMsg("Error: Unable get answers by question id: " + ques.ID);
			else{
				for(var i = 0; i < answers.length; i++){
					var ans = answers[i];
					$("#"+quesId).append('<input type="radio" name="'+quesId+'" value="'+ans.Correct+'"><label>'+ans.Answer+'</label><br>');
				}
			}
		}
	, "json");
}


function DisplayLessons(unitId) {
    $.get('contentGenerator.php',
        { 'getLessonsByUnitId': unitId },
        function (lessons) {


            for (var i = 0; i < lessons.length; i++) {
                var les = lessons[i];
                AddLesson(les);
            }

        }
        , "json");
}

function AddLesson(les) {
    var id = "lesson" + les.ID
    AddDiv(id, "unitSelected");
    AddHeader(id, les.Title, 3);
    AddContent(id, les.Content);
}

$("#btnMark").click(function(){
    var questions = document.getElementsByTagName("form");
    var total = questions.length;
    var correct = 0;
    for (var i = 0; i < questions.length; i++) {
        var name = questions[i].id;
        var checkedVal = $('input:radio[name=' + name + ']:checked').val();
        $('input:radio[name=' + name + '][value=1]').next().css("background-color","rgba(0, 200, 0, 1)");

        if (checkedVal == 1)
            correct++;
    }
    var scoreDiv = "<div id='scoreDiv'><h3>Score:" + correct + '/' + total + "</h3>" + "<h3>Percentage:" + (correct / total * 100).toFixed(2) + "%</h3></div>";

    if ($("#scoreDiv").length == 0) {
        $("#unitSelected").append(scoreDiv);

    }
    else {
        $("#scoreDiv").remove();
        $("#unitSelected").append(scoreDiv);
    }
});
