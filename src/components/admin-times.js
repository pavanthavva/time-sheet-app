import { supabase } from '../app.js';

class AdminTimes extends HTMLElement {
  async connectedCallback() {
    const { data, error } = await supabase.from('time_entries').select('*, users(*)');
    if (error) {
      alert(error.message);
      return;
    }

    this.innerHTML = `
      <h2>Time Entries</h2>
      <table border="1">
        <tr><th>User</th><th>Week Starting</th><th>Entries</th></tr>
        ${data.map(entry => `
          <tr>
            <td>${entry.users.first_name} ${entry.users.last_name}</td>
            <td>${entry.week_start}</td>
            <td>${Object.entries(entry.entries).map(([day, hours]) => `${day}: ${hours}`).join(', ')}</td>
          </tr>
        `).join('')}
      </table>
    `;
  }
}
customElements.define('admin-times', AdminTimes);
