import { supabase } from '../app.js';

class AdminTimes extends HTMLElement {
  async connectedCallback() {
    const session = await supabase.auth.getSession();
    const userId = session.data.session.user.id;

    const { data: userProfile, error: errorProfile } = await supabase.from('profiles').select('*').eq("id", userId).single();
    var data, error;

    if (userProfile.role === "user") {
      var { data, error } = await supabase.from('time_entries').select('*, profiles(*)').eq("userid", userId);
    } else {
      var { data, error } = await supabase.from('time_entries').select('*, profiles(*)');
    }

    if (error) {
      alert(error.message);
      return;
    }

    this.innerHTML = `
      <h2>Time Entries</h2>
      <table class="table" border="1">
        <tr><th>User</th><th>Date</th><th>Logged Hours</th><th>Project</th></tr>
        ${data.map(entry => `
          <tr>
            <td>${entry.profiles.email}</td>
            <td>${entry.date}</td>
            <td>${entry.hours}</td>
            <td>${entry.project}</td>
          </tr>
        `).join('')}
      </table>
    `;
  }
}
customElements.define('admin-times', AdminTimes);
