document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    
    var storedEmail = localStorage.getItem("email");
    var storedPassword = localStorage.getItem("password");
    
    if (email === storedEmail && password === storedPassword) {
      // alert("Login successful!");
      window.open("mainpage.html")
    } else {
      alert("Invalid email or password");
    }
    
  });
  
  document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var name = document.getElementById("signupName").value;
    var email = document.getElementById("signupEmail").value;
    var password = document.getElementById("signupPassword").value;
    
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    if (email === ''&& password === '') {
        alert("plz fill the detils");
        
      } else {
        alert("Signup successful!");
      }
   
   
  });