import { supabase } from '../app.js';

const WeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
class TimeEntry extends HTMLElement {
  constructor() {
    super();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to Sunday
    this.weekStart = weekStart;
  }
  connectedCallback() {

    const weekStartStr = this.weekStart.toISOString().split('T')[0];

    this.innerHTML = `
      <div class="card mx-auto" style="max-width: 700px;">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Weekly Time Entry</h2>
          <p class="text-center">Week Starting: ${weekStartStr}</p>
          <div id="timeEntryForm" onsubmit="no-submit">
          <div class="mb-3 row">
                <label for="project" class="col-sm-4 col-form-label">project</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" id="project" required maxlength="120" placeholder="project name">
                </div>
              </div>
            ${WeekDays.map(day => `
              <div class="mb-3 row">
                <label for="${day}" class="col-sm-4 col-form-label">${day}</label>
                <div class="col-sm-8">
                  <input type="number" class="form-control" required id="${day}" min="0" max="24" placeholder="Hours">
                </div>
              </div>
            `).join('')}
            <button type="button" id="timeEntryFormBtn" class="btn btn-success w-100">Submit</button>
          </div>
        </div>
      </div>
    `;
    this.querySelector('#timeEntryFormBtn').addEventListener('click', (e) => {
      e.preventDefault();
      this.submitEntry(weekStartStr);
    });
  }

  async submitEntry(weekStartStr) {
    const session = await supabase.auth.getSession();
    const userId = session.data.session.user.id;
    const entries = [];
    const project = this.querySelector(`#project`).value;
    if (project.length === 0) {
      alert("Enter Project");
      this.querySelector(`#project`).focus();
      return;
    }

    for (let index = 0; index < WeekDays.length; index++) {
      const day = WeekDays[index];
      const nextDate = new Date(this.weekStart);
      nextDate.setDate(nextDate.getDate() + index);
      const hours = parseFloat(this.querySelector(`#${day}`).value) || 0;
      if (hours >= 0 && hours < 24) {
        entries.push({
          userid: userId, hours,
          project, date: nextDate.toJSON(),
        })
      } else {
        alert("Enter valid hours for " + day);
        this.querySelector(`#${day}`).focus();
        return;
      }
    }

    if (entries.length > 0) {

      const { error } = await supabase.from('time_entries').upsert(entries).select();

      if (error) {
        alert(error.message);
        return;
      }

      alert('Time entry submitted successfully!');
    }

  }
}

customElements.define('time-entry', TimeEntry);
