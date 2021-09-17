let userID = -1;
let urlBase = "http://monkeyoclock.com/API";
let extension = "php";

function addContact(UserID) {
  function getValue(htmlID) {
    return document.getElementById(htmlID).value;
  }

  function setValue(htmlID, value) {
    document.getElementById(htmlID).value = value;
  }

  function createContactJSON() {
    return {
      FirstName: getValue("fname"),
      LastName: getValue("lname"),
      Email: getValue("email"),
      Phone: getValue("phone"),
      UserID: UserID,
    };
  }

  function clearAddContactForm() {
    setValue("fname", "");
    setValue("lname", "");
    setValue("email", "");
    setValue("phone", "");
  }

  function addContactJSON(newContact) {
    let jsonPayload = JSON.stringify(newContact);
    let url = urlBase + "/AddContact." + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //Success message maybe?
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      console.log(err.message);
    }
    clearAddContactForm();
  }

  addContactJSON(createContactJSON(UserID));
}

document.getElementById("addContactBttn").onclick = () => addContact(userID);
