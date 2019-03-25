var usernameBox = document.getElementById('username'),
	passwordBox = document.getElementById('password'),
	loginButton = document.getElementById('login'),
	registerButton = document.getElementById('register'),
	msgBox = document.getElementById('msgbox');
	
loginButton.onclick = function() {
	var data = {
		username = usernameBox.value,
		password = passwordBox.value
	}
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			msgBox.value = 'LOGIN SUCCEED';
		}
		else {
			msgBox.value = xmlhttp.readyState + '-' + xmlhttp.status;
		}
	}
	xmlhttp.open('POST', 'http://localhost:3000/logincheck', true);
	xmlhttp.setRequestHeader('Content-type', 'application/json');
	xmlhttp.send(JSON.stringify(data));
}

registerButton.onclick = function() {
	var data = {
		username = usernameBox.value,
		password = passwordBox.value
	}
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			msgBox.value = 'LOGIN SUCCEED';
		}
		else {
			msgBox.value = xmlhttp.readyState + '-' + xmlhttp.status;
		}
	}
	xmlhttp.open('POST', 'http://localhost:3000/logincheck', true);
	xmlhttp.setRequestHeader('Content-type', 'application/json');
	xmlhttp.send(JSON.stringify(data));
}
