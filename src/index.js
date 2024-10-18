const registration = document.getElementById("registration");
const login = document.getElementById("login");
const username = registration.elements["username"];
const email = registration.elements["email"];
const password = registration.elements["password"];
const passwordCheck = registration.elements["passwordCheck"];
const termsAndConditions = registration.elements["terms"];
const loginUsername = login.elements["username"];
const loginPassword = login.elements["password"];
const keepMeLoggedIn = login.elements["persist"];

const errorDisplay = document.getElementById("errorDisplay");

function validateRegistration(e) {
  e.preventDefault();
  //email
  const emailValue = validateRegistrationEmail();
  if (emailValue === false) {
    e.preventDefault();
    return false;
  }
  //username
  const usernameValue = validateUsername();
  if (usernameValue === false) {
    e.preventDefault();
    return false;
  }
  //password
  const passwordValue = validatePassword();
  if (passwordValue === false) {
    e.preventDefault();
    return false;
  }
  //check Password
  const checkPasswordValue = validateCheckPassword();
  if (checkPasswordValue === false) {
    e.preventDefault();
    return false;
  }

  const termsAndConditionsValue = validateTermsAndConditions();
  if (termsAndConditionsValue === false) {
    e.preventDefault();
    return false;
  }

  const uniqueUsername = validateUniqueUsernames();
  if (uniqueUsername === false) {
    e.preventDefault();
    return false;
  }
  //Storing at localStorage
  //email to password && username to password
  localStorage.setItem(emailValue, passwordValue);
  localStorage.setItem(usernameValue, passwordValue);

  errorDisplay.style.backgroundColor = "limegreen";
  errorDisplay.style.color = "green";
  errorDisplay.style.display = "block";
  errorDisplay.innerHTML = `your username: ${usernameValue} \n email: ${emailValue} and Password have been stored`;
  //clear form
  registration.reset();
  return true;
}

function validateUsername() {
  const usernameValue = username.value;
  // to check if username has a special character or whitespace I decide to use regex. Also i decided to move it to the top so it be the first thing I am checking
  const regex = /[^a-zA-Z0-9]/;
  if (regex.test(usernameValue)) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = `Username '${usernameValue}' contains a special character or whitespace`;

    // errorDisplay.innerHTML = `Username '${usernameValue}' contains a special character or whitespace`;
    username.focus();
    return false;
  }
  if (usernameValue === "") {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "username cannot be blank";
    username.focus();
    return false;
  }
  if (usernameValue.length < 4) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "username must be at least four characters long";
    username.focus();
    return false;
  }
  //in order to check if username username contain at least 2 unique characters, I decided to use a set
  // put the username in a set which can only hold unique values, if the set is empty that means no unique chars
  // if the set has at least 2 characters we are good !
  const uniqueChars = new Set(usernameValue.split(""));
  if (uniqueChars.size < 2) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = `username: ${usernameValue} must contain at least 2 unique characters`;
    username.focus();
    return false;
  }
  return usernameValue.toLowerCase();
}
//Using javascript to validate registration email. However for Login I can advoid this by addig type "email" on the html
function validateRegistrationEmail() {
  const emailValue = email.value;
  const atPosition = emailValue.indexOf("@");
  const dotPosition = emailValue.lastIndexOf(".");

  if (emailValue === "") {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "Email cannot be blank";
    email.focus();
    return false;
  }
  if (atPosition < 1) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML =
      "Your email must include an @ symbol which cannot be at the beginnig of the email";
    email.focus();
    return false;
  }
  if (dotPosition - atPosition < 2) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML =
      "Invalid email structure. \nYou must include a domain name after the @ symbol.";
    email.focus();
    return false;
  }

  return emailValue.toLowerCase();
}

function validatePassword() {
  const passwordValue = password.value;
  if (passwordValue === "") {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "password cannot be blank";
    password.focus();
    return false;
  }
  if (passwordValue.length < 12) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "password must be at least 12 characters long";
    password.focus();
    return false;
  }
  //at least one uppercase and lowercase letter:
  const regexLowercase = /[a-z]/;
  const regexUppercase = /[A-Z]/;
  if (
    !(regexLowercase.test(passwordValue) && regexUppercase.test(passwordValue))
  ) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML =
      "password requires at least 1 uppercase and 1 lowercase";
    password.focus();
    return false;
  }
  const regexForNumber = /[0-9]/;
  if (!regexForNumber.test(passwordValue)) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "password requires at least 1 number";
    password.focus();
    return false;
  }
  //passwords cannot contain the word "password" (uppercase, lowercase, or mixed)
  //there is about 258 combinations of the word password
  //I only added a few
  if (
    passwordValue.includes("PASSWORD") ||
    passwordValue.includes("Password") ||
    passwordValue.includes("password") ||
    passwordValue.includes("PaSsWoRd") ||
    passwordValue.includes("pAsSwOrD")
  ) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "password has the word password in it";
    password.focus();
    return false;
  }
  const usernameValue = validateUsername();
  if (
    passwordValue === usernameValue ||
    passwordValue.includes(usernameValue)
  ) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = `Password cannot contain username: ${usernameValue}`;
    password.focus();
    return false;
  }
  return passwordValue;
}

function validateCheckPassword() {
  const checkPasswordValue = passwordCheck.value;
  const passwordValue = validatePassword();
  if (checkPasswordValue === "") {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "check password cannot be blank";
    passwordCheck.focus();
    return false;
  }
  if (checkPasswordValue !== passwordValue) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "passwords must match";
    passwordCheck.focus();
    return false;
  }
  return checkPasswordValue;
}

function validateTermsAndConditions() {
  const termsValue = termsAndConditions;
  if (!termsValue.checked) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "The terms and conditions must be accepted";
    termsAndConditions.focus();
    return false;
  }
  return true;
}
//Registration Form - Username Validation (Part Two):
function validateUniqueUsernames() {
  const usernameValue = validateUsername();
  if (localStorage.getItem(usernameValue)) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML =
      "username is already taken, use a different username";
    username.focus();
    return false;
  }
  return true;
}

function validateLogin(e) {
  e.preventDefault();

  const usernameValue = validateLoginUsername();
  if (usernameValue === false) {
    e.preventDefault();
    return false;
  }
  const passwordValue = validateLoginPassword();
  if (passwordValue === false) {
    e.preventDefault();
    return false;
  }

  const keepMeValue = validateKeepMeLoggedIn();
  if (keepMeValue === false) {
    e.preventDefault();
    return false;
  }

  errorDisplay.style.backgroundColor = "limegreen";
  errorDisplay.style.color = "green";
  errorDisplay.style.display = "block";
  errorDisplay.innerHTML = "Success!";
  login.reset();
  return true;
}

function validateLoginUsername() {
  const usernameValue = loginUsername.value;
  if (usernameValue === "") {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "Username cannot be blank";
    loginUsername.focus();
    return false;
  }
  if (!localStorage.getItem(usernameValue)) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "This username does not exists";
    loginUsername.focus();
    return false;
  }
  return true;
}

function validateLoginPassword() {
  const passwordValue = loginPassword.value;
  const usernameValue = loginUsername.value;
  if (passwordValue === "") {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "Password cannot be blank";
    loginPassword.focus();
    return false;
  }
  if (!localStorage.getItem(usernameValue)) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "Wrong password";
    loginPassword.focus();
    return false;
  }
  return true;
}

function validateKeepMeLoggedIn() {
  const keepMe = keepMeLoggedIn;
  if (keepMe.checked) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = "Success! You selected 'Keep me logged in'";
    keepMeLoggedIn.focus();
    return false;
  }
  return true;
}
registration.addEventListener("submit", validateRegistration);
login.addEventListener("submit", validateLogin);
