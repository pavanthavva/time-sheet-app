import { supabase } from '../app.js';

class AdminUsers extends HTMLElement {
  async connectedCallback() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      alert(error.message);
      return;
    }

    this.innerHTML = `
      <h2>User Management</h2>
      <table class="table" border="1">
        <tr><th>Email</th><th>First Name</th><th>Last Name</th><th>Role</th><th>Actions</th></tr>
        ${data.map(user => `
          <tr>
            <td>${user.email}</td>
            <td><input class="form-control" value="${user.first_name}" id="fn-${user.id}" /></td>
            <td><input class="form-control" value="${user.last_name}" id="ln-${user.id}" /></td>
            <td>
              <select class="form-control" id="role-${user.id}">
                <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
              </select>
            </td>
            <td>
              <button class="btn btn-success" onclick="document.querySelector('admin-users').updateUser('${user.id}')">Update</button>
              <button class="btn btn-danger" onclick="document.querySelector('admin-users').deleteUser('${user.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </table>
    `;
  }

  async updateUser(userId) {
    const first_name = this.querySelector(`#fn-${userId}`).value;
    const last_name = this.querySelector(`#ln-${userId}`).value;
    const role = this.querySelector(`#role-${userId}`).value;

    const { error } = await supabase.from('profiles').update({ first_name, last_name, role }).eq('id', userId);
    if (error) {
      alert(error.message);
      return;
    }

    alert('User updated successfully!');
    this.connectedCallback();
  }

  async deleteUser(userId) {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
      alert(error.message);
      return;
    }

    alert('User deleted successfully!');
    this.connectedCallback();
  }
}
customElements.define('admin-users', AdminUsers);
