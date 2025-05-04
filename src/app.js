import './components/login.js';
import './components/signup.js';
import './components/profile.js';
import './components/time-entry.js';
import './components/admin-users.js';
import './components/admin-times.js';

const supabaseUrl = 'https://ttuahhexroqgiyixxmsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dWFoaGV4cm9xZ2l5aXh4bXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjY1OTYsImV4cCI6MjA2MTg0MjU5Nn0.K5m2Dyzw-IPqhfBGwoY9xRvw_fCWPTOYiHpsFD13RFM';
export const supabase = supabase.createClient(supabaseUrl, supabaseKey);

window.onload = async () => {
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    document.getElementById('app').innerHTML = '<login-component></login-component>';
  } else {
    routeByRole(session.data.session.user.id);
  }
};

async function routeByRole(userId) {
  const { data } = await supabase.from('users').select('*').eq('id', userId).single();
  if (data.role === 'admin') {
    document.getElementById('app').innerHTML = '<admin-users></admin-users>';
  } else {
    document.getElementById('app').innerHTML = '<time-entry></time-entry>';
  }
}
function navigateTo(componentName) {
    document.getElementById('app').innerHTML = `<${componentName}></${componentName}>`;
  }
  