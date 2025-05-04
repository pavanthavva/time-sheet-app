import { supabase } from '../app.js';

class Profile extends HTMLElement {
  async connectedCallback() {
    const session = await supabase.auth.getSession();
    const userId = session.data.session.user.id;

    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error) {
      alert(error.message);
      return;
    }

    this.innerHTML = `
      <div class="card mx-auto" style="max-width: 600px;">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Profile</h2>
          <div class="mb-3">
            <label for="first_name" class="form-label">First Name</label>
            <input id="first_name" type="text" class="form-control" value="${data.first_name}">
          </div>
          <div class="mb-3">
            <label for="last_name" class="form-label">Last Name</label>
            <input id="last_name" type="text" class="form-control" value="${data.last_name}">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input id="email" type="email" class="form-control" value="${data.email}" disabled>
          </div>
          <div class="mb-3">
            <label for="project" class="form-label">Project</label>
            <input id="project" type="text" class="form-control" value="${data.project}">
          </div>
          <button id="updateBtn" class="btn btn-primary w-100">Update Profile</button>
        </div>
      </div>
    `;
    this.querySelector('#updateBtn').addEventListener('click', () => this.updateProfile(userId));
  }

  async updateProfile(userId) {
    const first_name = this.querySelector('#first_name').value;
    const last_name = this.querySelector('#last_name').value;
    const project = this.querySelector('#project').value;

    const { error } = await supabase.from('users').update({ first_name, last_name, project }).eq('id', userId);
    if (error) {
      alert(error.message);
      return;
    }

    alert('Profile updated successfully!');
  }
}

customElements.define('profile-component', Profile);
