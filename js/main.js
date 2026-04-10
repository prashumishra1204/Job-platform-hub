// Main JavaScript - Fixed Search Functionality

// Search jobs function (fixed)
function searchJobs() {
    const keyword = document.getElementById('search-keyword')?.value || '';
    const location = document.getElementById('search-location')?.value || '';
    
    console.log('Searching for:', keyword, location); // Debug log
    
    // Get filtered jobs
    const filtered = Database.getJobs({ keyword, location });
    
    // Display results
    displaySearchResults(filtered);
    
    // Show toast notification
    showToast(`Found ${filtered.length} jobs matching your search`, 'info');
}

// Display search results on homepage
function displaySearchResults(jobs) {
    const container = document.getElementById('featured-jobs');
    if (!container) return;
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc;"></i>
                <h3>No jobs found</h3>
                <p>Try different keywords or location</p>
                <button onclick="resetSearch()" class="btn-primary">Reset Search</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.slice(0, 6).map(job => `
        <div class="job-card animated-card">
            <div class="job-header">
                <h3 class="job-title">${job.title}</h3>
                <span class="job-badge ${job.type === 'Remote' ? 'remote' : 'fulltime'}">${job.type || 'Full-time'}</span>
            </div>
            <div class="job-company">
                <i class="fas fa-building"></i> ${job.company}
            </div>
            <div class="job-details">
                <span><i class="fas fa-map-marker-alt"></i> ${job.location || 'Remote'}</span>
                <span><i class="fas fa-dollar-sign"></i> ${job.salary || 'Competitive'}</span>
            </div>
            <p class="job-description">${(job.description || '').substring(0, 100)}...</p>
            <div class="job-tags">
                ${(job.requirements || []).slice(0, 3).map(req => `<span class="tag">${req}</span>`).join('')}
            </div>
            <button onclick="applyForJob(${job.id})" class="btn-apply">
                <i class="fas fa-paper-plane"></i> Apply Now
            </button>
        </div>
    `).join('');
}

// Reset search
function resetSearch() {
    document.getElementById('search-keyword').value = '';
    document.getElementById('search-location').value = '';
    const allJobs = Database.getJobs();
    displaySearchResults(allJobs);
    showToast('Search reset', 'info');
}

// Apply for job (fixed)
function applyForJob(jobId) {
    if (!Auth.isAuthenticated()) {
        showToast('Please login to apply for jobs!', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    if (Auth.currentUser.role !== 'employee') {
        showToast('Only employees can apply for jobs!', 'error');
        return;
    }
    
    try {
        Database.applyForJob(Auth.currentUser.id, jobId);
        showToast('Application submitted successfully!', 'success');
        
        // Animate the button
        const btn = event.target.closest('.btn-apply');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Applied!';
            btn.disabled = true;
            btn.style.background = '#10b981';
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <div class="toast-progress"></div>
    `;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Load featured jobs on page load
document.addEventListener('DOMContentLoaded', () => {
    const featuredJobs = Database.getJobs();
    displaySearchResults(featuredJobs);
});
