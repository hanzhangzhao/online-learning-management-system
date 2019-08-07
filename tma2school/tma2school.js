var user;
var count = 0;

document.onreadystatechange = function() {
	user = GetCookie('username');
	if(user == "")
		location.href="../part2.html";
	$('#user').text('Welcome ' + user + ' | ');
	DisableStartUnitBtn();

	$("#unitSelected").hide();
	$("#btnMark").hide();
    $("#btnBackToSelection").hide();
    $("#btnBackToSelection2").hide();
    console.log(count);
    if (count == 0) {
        DisplayCourses();
        count += 1;
    }

};

$('#btnUpload').click(function()
{
	var path = $('input[name$="coursePath"]').prop('value');
	VerifyValidFilePath(path);
});

$('#tbxCoursePath').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        $('#btnUpload').click();

        return false;
    }
});   

$('#logOut').click(function() {
    document.cookie = "username=; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
	location.href="../part2.html";
});

function VerifyValidFilePath(filePath)
{
	$.get('contentGenerator.php',
		{'verifyFilePath': filePath},
		function(data) 
		{
			if(data == false)
				DisplayErrMsg("Please input a valid file path to a .xml file");
			else
			{
				DisplayInfo("Loading your course file to the database...");
				UploadFile(filePath);
			}	
		}
	);
}

function UploadFile(filePath)
{
	$.post('contentGenerator.php',
		{'uploadFile': filePath},
		function(data) 
		{
            if (data == false)
                DisplayErrMsg("Error: Unable to upload file to the database.");
            else {
                DisplayInfo("Successfully uploaded " + filePath);
                location.reload();
            }
		}
	);
}

function DisplayCourses()
{
	$.get('contentGenerator.php',
		{'getUnits': user},
		function(data) {
			if(data.length == 0)
				DisplayErrMsg("Please drag and drop your EMLs here or input the filename of your EMLs.");

			for(var i = 0; i < data.length; i++)
				createMenu(data[i]);

		}, "json");
}


function createMenu(data)
{
	var id = data.ID;
	var title = data.Title;
    var row = "<div id='" + id + "' style='width:60vw; text-align:left; margin-left:20vw;'><div style='display:inline-block; width:10vw;'>" + id + "</div><div class='cClass' style='display:inline-block'>" + title + "</div></div>";
	$("#tblCourses").append(row);
}

var selection = "";
$(document).on('click', '#tblCourses div', function() 
{
	if(selection != "")
        $("#" + selection).children('div.cClass').css("border","none");

    selection = this.id;
    $(this).children('div.cClass').css('border', 'solid #007bff 3px');
	DisableStartUnitBtn();
});

function DisableStartUnitBtn()
{
	var id = "#btnStartUnit";
	if(selection == "")
	{
		$(id).attr('disabled','disabled');
		$(id).css('background-color', 'grey');
	}
	else
	{
		$(id).removeAttr('disabled');
        $(id).css('background-color', '#007bff');
	}
}

$("#btnStartUnit").click(function()
{
    $("#EMLupload").hide();
	ParseAndDisplayUnit(selection);
});

$("#btnBackToSelection,#btnBackToSelection2").click(function()
{
	$("#unitSelected").empty();
	$("#unitSelected").hide();
	$("#btnBackToSelection").hide();
	$("#btnBackToSelection2").hide();
	$("#btnMark").hide();
	DisableStartUnitBtn();
	ParseAndDisplayUnit("");
});
