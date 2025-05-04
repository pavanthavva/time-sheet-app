import { supabase } from '../app.js';

class TimeEntry extends HTMLElement {
  connectedCallback() {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to Sunday
    const weekStartStr = weekStart.toISOString().split('T')[0];

    this.innerHTML = `
      <div class="card mx-auto" style="max-width: 700px;">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Weekly Time Entry</h2>
          <p class="text-center">Week Starting: ${weekStartStr}</p>
          <form id="timeEntryForm">
            ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => `
              <div class="mb-3 row">
                <label for="${day}" class="col-sm-4 col-form-label">${day}</label>
                <div class="col-sm-8">
                  <input type="number" class="form-control" id="${day}" min="0" max="24" placeholder="Hours">
                </div>
              </div>
            `).join('')}
            <button type="submit" class="btn btn-success w-100">Submit</button>
          </form>
        </div>
      </div>
    `;
    this.querySelector('#timeEntryForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitEntry(weekStartStr);
    });
  }

  async submitEntry(weekStartStr) {
    const session = await supabase.auth.getSession();
    const userId = session.data.session.user.id;

    const entries = {};
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
      entries[day.toLowerCase()] = parseFloat(this.querySelector(`#${day}`).value) || 0;
    });

    const { error } = await supabase.from('time_entries').insert([
      { user_id: userId, week_start: weekStartStr, entries }
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Time entry submitted successfully!');
  }
}

customElements.define('time-entry', TimeEntry);
