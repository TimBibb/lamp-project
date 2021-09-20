var urlBase = 'http://monkeyoclock.com/API';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var contacts = {};

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

					if (userId < 1) {
						var loginResult = document.getElementById("loginResult");
                    	loginResult.innerHTML = "Login Failed!";
                    	loginResult.classList.remove("hide"); 
						setTimeout(function(){hideAlertBannerL();}, 3000);
						return;
					}

                    firstName = jsonObject.FirstName;
				    lastName = jsonObject.LastName;
					console.log(firstName);
					console.log(lastName);
				    saveCookie();
					readCookie();
				    window.location.href = "contact.html";
					searchContact();
                }
                else
                {
                    var loginResult = document.getElementById("loginResult");
                    loginResult.innerHTML = "Login Failed!";
                    loginResult.classList.remove("hide"); 
					setTimeout(function(){hideAlertBannerL();}, 3000);
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
					setTimeout(function(){hideAlertBannerR();}, 3000);
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
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName=" + firstName + ";expires=" + date.toGMTString();
	document.cookie = "lastName=" + lastName + ";expires=" + date.toGMTString();
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString();
	window.location.href = "index.html";
}

function addContact()
{
	var searchResult = document.getElementById("contactSearchResult")
	searchResult.innerHTML = "-";
    searchResult.classList.add("hide");

	var firstName = document.getElementById("fname").value;
	var lastName = document.getElementById("lname").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;

	document.getElementById("contactSearchResult").innerHTML = "";

	readCookie();

	var tmp = {FirstName:firstName,LastName:lastName,Phone:phone,Email:email,UserID:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var searchResults = document.getElementById("searchResults");
				searchResults.innerHTML = ""
				document.getElementById("contactSearchResult").innerHTML = "Contact Added";
				searchResult.classList.remove("hide");
				closeModal();
				searchContact();
				setTimeout(function(){hideAlertBanner();}, 3000);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function setValue(htmlID, value) {
    document.getElementById(htmlID).value = value;
}

function clearAddContactForm() {
    setValue("fname", "");
    setValue("lname", "");
    setValue("email", "");
    setValue("phone", "");
}

function hideAlertBannerL() {
	var loginResult = document.getElementById("loginResult")
	loginResult.innerHTML = "-";
    loginResult.classList.add("hide");
  }

function hideAlertBannerR() {
	var registerResult = document.getElementById("registerResult")
	registerResult.innerHTML = "-";
	registerResult.classList.add("hide");
}

function hideAlertBanner() {
	var searchResult = document.getElementById("contactSearchResult")
	searchResult.innerHTML = "-";
    searchResult.classList.add("hide");
  }

function editContact(contact)
{
	var searchResult = document.getElementById("contactSearchResult")
	searchResult.innerHTML = "-";
    searchResult.classList.add("hide");

	var firstName = document.getElementById("fname").value;
	var lastName = document.getElementById("lname").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;

	document.getElementById("contactSearchResult").innerHTML = "";

	readCookie();

	var tmp = {ContactID:contact.ContactID, FirstName:firstName,LastName:lastName,Phone:phone,Email:email,UserID:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/UpdateContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var searchResults = document.getElementById("searchResults");
				searchResults.innerHTML = ""
				document.getElementById("contactSearchResult").innerHTML = "Contact Updated";
				searchResult.classList.remove("hide");
				clearAddContactForm();
				closeModal();
				setTimeout(function(){hideAlertBanner();}, 3000);
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function removeContact(contactId)
{
	var searchResult = document.getElementById("contactSearchResult")
	searchResult.innerHTML = "-";
    searchResult.classList.add("hide");

	readCookie();

	var tmp = {contactID:contactId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/DeleteContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var searchResults = document.getElementById("searchResults");
				searchResults.innerHTML = ""
				document.getElementById("contactSearchResult").innerHTML = "Contact Deleted";
				searchResult.classList.remove("hide");
				searchContact();
				setTimeout(function(){hideAlertBanner();}, 3000);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	var fName = document.getElementById("searchFirstName").value;
	var lName = document.getElementById("searchLastName").value;

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
				var searchResults = document.getElementById("searchResults");
				searchResults.innerHTML = ""
				var jsonObject = JSON.parse( xhr.responseText );
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					// TODO: add contact id to the search contacts api endpoint
					console.log(jsonObject.results[i]);
					var card = createContactCard(jsonObject.results[i]);
					searchResults.appendChild(card);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
		searchResults.classList.remove("hide");
	}
}

function contactModal() {
	var modalButton = document.getElementById('modalButton');
	modalButton.addEventListener('click', openAddModal);

}

function openAddModal() {
	var modal = document.getElementById('modalForm');
	modal.style.display = 'block';

	var trigger = document.getElementById('trigger');
	trigger.addEventListener('click', addContact);
	trigger.removeEventListener('click', function(){editContact(contact)});
	clearAddContactForm();
}

function openUpdateModal(contact) {
	var modal = document.getElementById('modalForm');
	modal.style.display = 'block';
	clearAddContactForm();
	
	setValue("fname",contact.FirstName);
	setValue("lname",contact.LastName);
	setValue("phone",contact.Phone);
	setValue("email",contact.Email);

	var trigger = document.getElementById('trigger');
	trigger.addEventListener('click', function(){editContact(contact)});
	trigger.removeEventListener('click', addContact);
}

function closeModal() {
	var modal = document.getElementById('modalForm');
	modal.style.display = 'none';
}

function createContactCard(contact) {

	var cardContainer = document.createElement("div");
	var nameElement = document.createElement("p");
	var phoneElement = document.createElement("p");
	var emailElement = document.createElement("p");
	var editElement = document.createElement("button");
	var removeElement = document.createElement("button");

	cardContainer.classList.add("card");
	nameElement.classList.add("card-name");
	phoneElement.classList.add("card-phone-line");
	editElement.classList.add("card-button");
	removeElement.classList.add("card-button")

	nameElement.innerHTML = contact.FirstName + " " + contact.LastName;
	editElement.innerHTML = '<span class="material-icons-outlined">edit</span>';
	removeElement.innerHTML = '<span class="material-icons-outlined">delete</span>';
	phoneElement.innerHTML = '<span class="card-phone">Phone:</span>' + " " + contact.Phone;
	emailElement.innerHTML = '<span class="card-email">Email:</span>' + " " + contact.Email;

	

	editElement.addEventListener('click', function(){openUpdateModal(contact)});
	removeElement.addEventListener('click', function(){removeContact(contact.ContactID)});

	cardContainer.appendChild(removeElement);
	cardContainer.appendChild(editElement);
	cardContainer.appendChild(nameElement);
	cardContainer.appendChild(phoneElement);
	cardContainer.appendChild(emailElement);

	console.log(contact.FirstName);

	return cardContainer;
}