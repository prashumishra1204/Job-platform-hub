const Auth = {
    currentUser: null,
    
    init(){ const saved=localStorage.getItem('currentUser'); if(saved){ this.currentUser=JSON.parse(saved); this.updateUI(); } },
    
    register(userData){ const existing=Database.users.find(u=>u.email===userData.email); if(existing) throw new Error("Email already registered!"); const newUser={id:Database.users.length+1,...userData,createdAt:new Date().toISOString()}; Database.users.push(newUser); Database.save(); this.login(userData.email,userData.password); return newUser; },
    
    login(email,password){ const user=Database.users.find(u=>u.email===email&&u.password===password); if(!user) throw new Error("Invalid credentials!"); this.currentUser=user; localStorage.setItem('currentUser',JSON.stringify(user)); this.updateUI(); return user; },
    
    logout(){ this.currentUser=null; localStorage.removeItem('currentUser'); this.updateUI(); window.location.href='../index.html'; },
    
    updateUI(){ const authBtns=document.getElementById('auth-buttons'); const userMenu=document.getElementById('user-menu'); const userName=document.getElementById('user-name'); if(this.currentUser){ if(authBtns)authBtns.style.display='none'; if(userMenu){userMenu.style.display='block'; if(userName)userName.textContent=this.currentUser.name;} }else{ if(authBtns)authBtns.style.display='flex'; if(userMenu)userMenu.style.display='none'; } },
    
    isAuthenticated(){ return this.currentUser!==null; },
    
    hasRole(roles){ if(!this.currentUser) return false; return roles.includes(this.currentUser.role); },
    
    requireAuth(roles=null){ if(!this.isAuthenticated()){ window.location.href='login.html'; return false; } if(roles && !this.hasRole(roles)){ alert('Permission denied'); window.location.href='dashboard.html'; return false; } return true; },
    
    getDashboardUrl(){ if(!this.currentUser) return 'login.html'; const urls={admin:'admin/dashboard.html',employer:'employer/dashboard.html',recruiter:'recruiter/dashboard.html',employee:'employee/dashboard.html'}; return urls[this.currentUser.role]||'index.html'; }
};

document.addEventListener('DOMContentLoaded',()=>{ Auth.init(); const logoutBtn=document.getElementById('logout-btn'); if(logoutBtn){ logoutBtn.addEventListener('click',(e)=>{ e.preventDefault(); Auth.logout(); }); } });
