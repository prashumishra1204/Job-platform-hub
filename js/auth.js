// Authentication Manager
const Auth = {
    currentUser: null,
    
    init() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    },
    
    register(userData) {
        // Check if email exists
        const existingUser = Database.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error("Email already registered!");
        }
        
        const newUser = {
            id: Database.users.length + 1,
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        Database.users.push(newUser);
        Database.save();
        
        this.login(userData.email, userData.password);
        return newUser;
    },
    
    login(email, password) {
        const user = Database.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error("Invalid email or password!");
        }
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateUI();
        return user;
    },
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        window.location.href = 'index.html';
    },
    
    updateUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const userNameSpan = document.getElementById('user-name');
        
        if (this.currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'block';
                if (userNameSpan) userNameSpan.textContent = this.currentUser.name;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    },
    
    isAuthenticated() {
        return this.currentUser !== null;
    },
    
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }
});
