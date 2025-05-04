import { supabase } from '../app.js';

class Login extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card mx-auto" style="max-width: 400px;">
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
          </div>
        </div>
      </div>
    `;
    this.querySelector('#loginBtn').addEventListener('click', this.login.bind(this));
  }

  async login() {
    const email = this.querySelector('#email').value;
    const password = this.querySelector('#password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) location.reload();
    else alert(error.message);
  }
}
customElements.define('login-component', Login);
