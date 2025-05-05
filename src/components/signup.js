import { supabase } from '../app.js';

class Signup extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card mx-auto" style="max-width: 500px;">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Sign Up</h2>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input id="email" type="email" class="form-control" placeholder="Enter email">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input id="password" type="password" class="form-control" placeholder="Password">
          </div>
          <div class="mb-3">
            <label for="first_name" class="form-label">First Name</label>
            <input id="first_name" type="text" class="form-control" placeholder="First Name">
          </div>
          <div class="mb-3">
            <label for="last_name" class="form-label">Last Name</label>
            <input id="last_name" type="text" class="form-control" placeholder="Last Name">
          </div>
          <div class="mb-3">
            <label for="project" class="form-label">Project</label>
            <input id="project" type="text" class="form-control" placeholder="Project">
          </div>
          <button id="signupBtn" class="btn btn-success w-100">Sign Up</button>
        </div>
      </div>
    `;
    this.querySelector('#signupBtn').addEventListener('click', this.signup.bind(this));
  }

  async signup() {
    const email = this.querySelector('#email').value;
    const password = this.querySelector('#password').value;
    const first_name = this.querySelector('#first_name').value;
    const last_name = this.querySelector('#last_name').value;
    const project = this.querySelector('#project').value;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user.id;
    const { error: insertError } = await supabase.from('profiles').insert([
      { id: userId, email, first_name, last_name, project, role: 'user' }
    ]);

    if (insertError) {
      alert(insertError.message);
      return;
    }

    alert('Signup successful! Please log in.');
    location.reload();
  }
}

customElements.define('signup-component', Signup);
