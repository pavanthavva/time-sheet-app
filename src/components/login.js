import { supabase } from '../app.js';

class Login extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h2>Login</h2>
      <input id="email" placeholder="Email" /><br/>
      <input id="password" type="password" placeholder="Password" /><br/>
      <button id="loginBtn">Login</button>
    `;
    this.querySelector('#loginBtn').onclick = this.login.bind(this);
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
