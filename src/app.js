import './components/login.js';
import './components/signup.js';
import './components/profile.js';
import './components/time-entry.js';
import './components/admin-users.js';
import './components/admin-times.js';

const supabaseUrl = 'https://ttuahhexroqgiyixxmsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dWFoaGV4cm9xZ2l5aXh4bXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjY1OTYsImV4cCI6MjA2MTg0MjU5Nn0.K5m2Dyzw-IPqhfBGwoY9xRvw_fCWPTOYiHpsFD13RFM';
export const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

window.onload = async () => {
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    navigateTo('login-component')
  } else {
    routeByRole(session.data.session.user);
  }
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
}

async function routeByRole(authUser) {
  const { id: userId } = authUser;
  const { data, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
  let profileFetched = data;

  if (profileError) {
    // If profile doesn't exist, create one
    if (profileError.code === 'PGRST116') {
      // const {data: authUser, error: authError} =
      //   await supabase.auth.admin.getUserById(userId);
      // if (authError) throw authError;

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, email: authUser?.email || '', role: ROLES.USER })
        .select()
        .single();

      if (insertError) throw insertError;
      profileFetched = newProfile;
    } else {
      throw profileError;
    }
  }

  if (data.role === ROLES.ADMIN) {
    document.getElementById("nav-admin").classList.remove("d-none");
    navigateTo("admin-users");
  } else {
    document.getElementById("nav-user").classList.remove("d-none");
    navigateTo("time-entry");
  }
}

async function navigateTo(componentName, event) {
  let userWelcome = "";
  if (event) {
    document.querySelector("#nav-admin-ul")?.querySelector(".active")?.classList.remove("active");
    document.querySelector("#nav-user-ul")?.querySelector(".active")?.classList.remove("active");
    event.currentTarget.classList.add("active");
  }
  if (componentName) {
    switch (componentName) {
      case "login-component":
        const { error } = await supabase.auth.signOut();
        document.getElementById("nav-admin").classList.add("d-none");
        document.getElementById("nav-user").classList.add("d-none");
        if (error) {
          alert(error);
        }
        break;
      default:
        const session = await supabase.auth.getSession();
        if (session.data.session) {
          userWelcome = "<h4 class='text-center text-bg-warning'> Welcome " + session.data.session.user.email + "</h4>";
        }
        break;
    }
    document.getElementById('app').innerHTML = `${userWelcome}<${componentName}></${componentName}>`;
  }
}

window.navigateTo = navigateTo;