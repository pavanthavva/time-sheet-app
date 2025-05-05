import { supabase } from '../app.js';

class Login extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card mx-auto" style="max-width: 400px;">
      <a href = "https://svestran.com/">
        <img src="./components/logo.jpg" alt="Error" width="200" height="200" style="display: block; margin: 0 auto;">
      </a>
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Login</h2>
          <div id="loginForm" submit="nosubmit">
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input id="email" type="email" class="form-control" placeholder="Enter email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input id="password" type="password" class="form-control" placeholder="Password" required>
            </div>
            <button type="button" id="loginBtn" class="btn btn-primary w-100">Login</button>
            <br>
            <button type="button" id="regBtn" class="btn btn-primary w-100 mt-2">Register</button>
          </div>
        </div>
      </div>
    `;
    this.querySelector('#loginBtn').addEventListener('click', this.login.bind(this));
    this.querySelector('#regBtn').addEventListener('click', this.signup.bind(this));
  }

  async login() {
    const email = this.querySelector('#email').value;
    const password = this.querySelector('#password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) location.reload();
    else alert(error.message);
  }
  async signup() {
    navigateTo('signup-component')
  }
}
customElements.define('login-component', Login);
