const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const registerBtn1 = document.getElementById('register1');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

registerBtn1.addEventListener('click', () => {
    container.classList.add("active");
});