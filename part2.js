function GetCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


$('#loginBtn').click(function () {
    if (!CheckNonEmpty()) {
        console.log(!CheckNonEmpty());
        return false;
    }

    CheckLogin();
});

$('#loginPassword').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        $('#loginBtn').click();

        return false;
    }
});   

$('#signupBtn').click(function () {

    if (!CheckSignupNonEmpty()) {
        return false;
    }
    var user = $('input[name$="signUpUsername"]').prop('value');
    var pw = $('input[name$="signUpPassword"]').prop('value');
    CheckUsername(user, false);
    CheckSignUp(user, pw);

    return $('#error').text().length > 0;
});

$('#signupPassword').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        $('#signupBtn').click();

        return false;
    }
});   

function CheckNonEmpty() {
    if ($('input[name$="username"]').prop('value').length <= 0 ||
        $('input[name$="password"]').prop('value').length <= 0) {
        ShowError('Please fill out all fields');
        return false;
    }

    HideError();
    return true;
}

function CheckSignupNonEmpty() {
    if ($('input[name$="signUpUsername"]').prop('value').length <= 0 ||
        $('input[name$="signUpPassword"]').prop('value').length <= 0) {
        ShowError('Please fill out all fields');
        return false;
    }

    HideError();
    return true;
}

function ShowError(msg) {
    $('.error').text(msg);
    $('.error').show();
}

function HideError() {
    $('.error').text('');
    $('.error').hide();
}

function CheckUsername(user, wantExists) {
    //var user = $('input[name$="signUpUsername"]').prop('value');
    $.get('loginSignup.php',
        { 'userExists': user },
        function (data) {
            console.log(data);
            if (wantExists && data == false) {
                ShowError('The user name you have entered does not exist.');
            }
            else if (!wantExists && data == true)
                ShowError('The user name you have entered has been taken.');
            else if ((wantExists && data == true) || (!wantExists && data == false)) {
                console.log(1);
                HideError();

            }
        });

}

function CheckLogin() {
    var user = $('input[name$="username"]').prop('value');
    var pw = $('input[name$="password"]').prop('value');

    $.get('loginSignup.php',
        {
            'loginUser': user,
            'loginPw': pw
        },
        function (data) {
            if (data == false)
                ShowError('Invalid password');
            else {
                document.cookie = "username=" + user;
                location.href = "tma2school/tma2school.html";
            }
        });
}

function CheckSignUp(user, pw) {
    console.log("signup");


    $.post('loginSignup.php',
        {
            'signupUser': user,
            'signupPw': pw
        },
        function (data) {
            console.log(data);

            if (data == false)
                alert('Unable to add user, please try again.');
            else {
                document.cookie = "username=" + user;
                location.href = "tma2school/tma2school.html";

            }
        });
}