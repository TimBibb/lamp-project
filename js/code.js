var urlBase = 'http://monkeyoclock.com/API';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {
    var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
    var hash = md5( password );

    var loginResult = document.getElementById("loginResult");
    loginResult.innerHTML = "-";
    loginResult.classList.add("hide");

    var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );

    var url = urlBase + '/Login.' + extension;

    var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
	{
		xhr.onreadystatechange = function() 
		{
            if (this.readyState == XMLHttpRequest.DONE) 
			{   
                if (this.status == 200)
                {
                    var jsonObject = JSON.parse( xhr.responseText );
				    userId = jsonObject.UserID;

                    if( userId < 1 && userId !== null)
				    {		
					    var loginResult = document.getElementById("loginResult");
                        loginResult.innerHTML = "Login Failed!";
                        loginResult.classList.remove("hide");
					    return;
				    }

                    firstName = jsonObject.FirstName;
				    lastName = jsonObject.LastName;

				    saveCookie();
	
				    window.location.href = "contact.html";
                }
                else
                {
                    var loginResult = document.getElementById("loginResult");
                    loginResult.innerHTML = "Login Failed!";
                    loginResult.classList.remove("hide"); 
                }
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		var loginResult = document.getElementById("loginResult");
        loginResult.innerHTML = err.message;
        loginResult.classList.remove("hide");
	}

}

function doRegister()
{
	userId = 0;
	firstName = "";
	lastName = "";
	var fName = document.getElementById("firstName").value;
	var lName = document.getElementById("lastName").value;
	var login = document.getElementById("login").value;
	var password = document.getElementById("password").value;
	
	var hash = md5( password );
	
	document.getElementById("registerResult").innerHTML = "";
    
    var registerResult = document.getElementById("registerResult");
    registerResult.innerHTML = "-";
    registerResult.classList.add("hide");

	var tmp = {firstName:fName,lastName:lName,login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );
	
	var url = urlBase + '/Register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == XMLHttpRequest.DONE) 
			{
				if (this.status == 200)
                {
                    window.location.href = "index.html";
                }
                else
                {
                    var registerResult = document.getElementById("registerResult");
                    registerResult.innerHTML = "Registration Failed!";
                    registerResult.classList.remove("hide");
                }
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		var registerResult = document.getElementById("registerResult");
        registerResult.innerHTML = err.message;
        registerResult.classList.remove("hide");
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ";expires=" + date.toGMTString();
	document.cookie = "lastName=" + lastName + ";expires=" + date.toGMTString();
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split("; ");
	
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}


	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		// document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	var newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	var tmp = {color:newColor,userId,userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/AddColor.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchColors.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	var fName = document.getElementById("searchFirstName").value;
	var lName = document.getElementById("searchLastName").value;

	var resultHTML = "";
	
	//TODO: change the id in the html
	document.getElementById("contactSearchResult").innerHTML = "";

	readCookie();

	var tmp = {FirstName: fName, LastName: lName, UserID: userId};
	var jsonPayload = JSON.stringify( tmp );                                         

	var url = urlBase + '/SearchContacts.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					contacts[jsonObject.results[i].ContactId] = jsonObject.results[i];
					// iterate on this with <tr> and <td>
					resultHTML += "<tr" 
					resultHTML += ' id="' + jsonObject.results[i].ContactId + '"';
					resultHTML += "> <td>"
					resultHTML += jsonObject.results[i].FirstName;
					resultHTML += "</td> <td>"
					resultHTML += jsonObject.results[i].LastName;
					resultHTML += "</td> <td>"
					resultHTML += jsonObject.results[i].Phone;
					resultHTML += "</td> <td>"
					resultHTML += jsonObject.results[i].Email;
					resultHTML += "</td> </tr>"
				}
				
				// Here is where we edit the html (pass in the contacts)
				document.getElementById("contactsTableBody").innerHTML = resultHTML;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}
