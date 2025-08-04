// Global variables
let currentUser = null;
let authToken = null;

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const sections = document.querySelectorAll('.section');
const authLinks = document.querySelectorAll('.auth-link');
const userLinks = document.querySelectorAll('.user-link');
const userOnlyElements = document.querySelectorAll('.user-only');
const loadingSpinner = document.getElementById('loadingSpinner');
const toastContainer = document.getElementById('toastContainer');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize application
function initializeApp() {
    // Check if user is logged in
    authToken = localStorage.getItem('authToken');
    if (authToken) {
        updateUIForLoggedInUser();
        loadUserProfile();
    } else {
        updateUIForLoggedOutUser();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);
    
    // Post form
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }
}

// Show/Hide sections
function showSection(sectionName) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        switch(sectionName) {
            case 'dashboard':
                loadUserProfile();
                break;
            case 'developers':
                loadDevelopers();
                break;
            case 'posts':
                loadPosts();
                break;
        }
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    authLinks.forEach(link => link.classList.add('hidden'));
    userLinks.forEach(link => link.classList.remove('hidden'));
    userOnlyElements.forEach(element => element.classList.remove('hidden'));
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    authLinks.forEach(link => link.classList.remove('hidden'));
    userLinks.forEach(link => link.classList.add('hidden'));
    userOnlyElements.forEach(element => element.classList.add('hidden'));
}

// Show loading spinner
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            updateUIForLoggedInUser();
            showToast('Login successful!', 'success');
            showSection('dashboard');
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            updateUIForLoggedInUser();
            showToast('Registration successful!', 'success');
            showSection('dashboard');
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Handle logout
async function logout() {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (response.ok) {
            authToken = null;
            currentUser = null;
            localStorage.removeItem('authToken');
            updateUIForLoggedOutUser();
            showToast('Logged out successfully!', 'success');
            showSection('home');
        } else {
            showToast('Logout failed', 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Even if logout fails on server, clear local data
        authToken = null;
        currentUser = null;
        localStorage.removeItem('authToken');
        updateUIForLoggedOutUser();
        showSection('home');
    } finally {
        hideLoading();
    }
}

// Load user profile
async function loadUserProfile() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE}/profile/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (response.ok) {
            const profile = await response.json();
            displayProfile(profile);
        } else if (response.status === 404) {
            displayNoProfile();
        } else {
            console.error('Failed to load profile');
        }
    } catch (error) {
        console.error('Profile loading error:', error);
    }
}

// Display profile
function displayProfile(profile) {
    const profilePreview = document.getElementById('profilePreview');
    
    const skillsHtml = profile.skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
    
    profilePreview.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">
                <i class="fas fa-user"></i>
            </div>
            <h2>${profile.user.name}</h2>
            <p class="profile-email">${profile.user.email}</p>
        </div>
        
        ${profile.bio ? `<div class="profile-section">
            <h3><i class="fas fa-info-circle"></i> Bio</h3>
            <p>${profile.bio}</p>
        </div>` : ''}
        
        <div class="profile-section">
            <h3><i class="fas fa-code"></i> Skills</h3>
            <div class="skills-container">
                ${skillsHtml}
            </div>
        </div>
        
        ${profile.location ? `<div class="profile-section">
            <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
            <p>${profile.location}</p>
        </div>` : ''}
        
        ${profile.website || profile.github ? `<div class="profile-section">
            <h3><i class="fas fa-link"></i> Links</h3>
            <div class="profile-links">
                ${profile.website ? `<a href="${profile.website}" target="_blank" class="profile-link">
                    <i class="fas fa-globe"></i> Website
                </a>` : ''}
                ${profile.github ? `<a href="https://github.com/${profile.github}" target="_blank" class="profile-link">
                    <i class="fab fa-github"></i> GitHub
                </a>` : ''}
            </div>
        </div>` : ''}
        
        <div class="profile-actions">
            <button class="btn btn-primary" onclick="showSection('edit-profile')">
                <i class="fas fa-edit"></i> Edit Profile
            </button>
            <button class="btn btn-danger" onclick="deleteProfile()">
                <i class="fas fa-trash"></i> Delete Profile
            </button>
        </div>
    `;
    
    // Populate edit form
    populateEditForm(profile);
}

// Display no profile message
function displayNoProfile() {
    const profilePreview = document.getElementById('profilePreview');
    profilePreview.innerHTML = `
        <div class="no-profile">
            <i class="fas fa-user-plus" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
            <h3>No Profile Found</h3>
            <p>You haven't created a profile yet. Create one to get started!</p>
            <button class="btn btn-primary" onclick="showSection('edit-profile')">
                <i class="fas fa-plus"></i> Create Profile
            </button>
        </div>
    `;
}

// Populate edit form
function populateEditForm(profile) {
    document.getElementById('profileBio').value = profile.bio || '';
    document.getElementById('profileSkills').value = profile.skills.join(', ');
    document.getElementById('profileWebsite').value = profile.website || '';
    document.getElementById('profileLocation').value = profile.location || '';
    document.getElementById('profileGithub').value = profile.github || '';
    document.getElementById('profileLinkedin').value = profile.social?.linkedin || '';
    document.getElementById('profileTwitter').value = profile.social?.twitter || '';
    document.getElementById('profilePortfolio').value = profile.social?.portfolio || '';
}

// Handle profile submit
async function handleProfileSubmit(e) {
    e.preventDefault();
    
    const profileData = {
        bio: document.getElementById('profileBio').value,
        skills: document.getElementById('profileSkills').value,
        website: document.getElementById('profileWebsite').value,
        location: document.getElementById('profileLocation').value,
        github: document.getElementById('profileGithub').value,
        linkedin: document.getElementById('profileLinkedin').value,
        twitter: document.getElementById('profileTwitter').value,
        portfolio: document.getElementById('profilePortfolio').value
    };
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Profile updated successfully!', 'success');
            showSection('dashboard');
            loadUserProfile();
        } else {
            showToast(data.message || 'Profile update failed', 'error');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Delete profile
async function deleteProfile() {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/profile/me`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (response.ok) {
            showToast('Profile deleted successfully!', 'success');
            displayNoProfile();
        } else {
            const data = await response.json();
            showToast(data.message || 'Profile deletion failed', 'error');
        }
    } catch (error) {
        console.error('Profile deletion error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Load developers (placeholder)
function loadDevelopers() {
    const developersGrid = document.getElementById('developersGrid');
    developersGrid.innerHTML = `
        <div class="developer-card">
            <div class="developer-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="developer-name">John Doe</div>
            <div class="developer-title">Full Stack Developer</div>
            <div class="developer-skills">
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">React</span>
                <span class="skill-tag">Node.js</span>
            </div>
            <button class="btn btn-primary">View Profile</button>
        </div>
        <div class="developer-card">
            <div class="developer-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="developer-name">Jane Smith</div>
            <div class="developer-title">Frontend Developer</div>
            <div class="developer-skills">
                <span class="skill-tag">Vue.js</span>
                <span class="skill-tag">CSS</span>
                <span class="skill-tag">TypeScript</span>
            </div>
            <button class="btn btn-primary">View Profile</button>
        </div>
    `;
}

// Load posts (placeholder)
function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = `
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar">JD</div>
                <div class="post-info">
                    <h4>John Doe</h4>
                    <div class="post-date">2 hours ago</div>
                </div>
            </div>
            <div class="post-content">
                Just finished building a new React component library! It includes reusable components for forms, navigation, and data visualization. Check it out on my GitHub!
            </div>
            <div class="post-actions">
                <button class="post-action">
                    <i class="fas fa-thumbs-up"></i>
                    <span>12</span>
                </button>
                <button class="post-action">
                    <i class="fas fa-comment"></i>
                    <span>5</span>
                </button>
                <button class="post-action">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </button>
            </div>
        </div>
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar">JS</div>
                <div class="post-info">
                    <h4>Jane Smith</h4>
                    <div class="post-date">5 hours ago</div>
                </div>
            </div>
            <div class="post-content">
                Looking for feedback on my latest project - a Vue.js dashboard for analytics. Any suggestions for improving the user experience?
            </div>
            <div class="post-actions">
                <button class="post-action">
                    <i class="fas fa-thumbs-up"></i>
                    <span>8</span>
                </button>
                <button class="post-action">
                    <i class="fas fa-comment"></i>
                    <span>3</span>
                </button>
                <button class="post-action">
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                </button>
            </div>
        </div>
    `;
}

// Handle post submit (placeholder)
async function handlePostSubmit(e) {
    e.preventDefault();
    
    const postText = document.getElementById('postText').value;
    
    if (!postText.trim()) {
        showToast('Please enter some text for your post', 'warning');
        return;
    }
    
    showToast('Post feature coming soon!', 'info');
    document.getElementById('postText').value = '';
}

// Add CSS for profile display
const additionalCSS = `
.profile-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e1e5e9;
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: white;
    font-size: 3rem;
}

.profile-header h2 {
    color: #333;
    margin-bottom: 0.5rem;
}

.profile-email {
    color: #666;
    font-size: 1.1rem;
}

.profile-section {
    margin-bottom: 2rem;
}

.profile-section h3 {
    color: #333;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.profile-section h3 i {
    color: #667eea;
}

.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.profile-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.profile-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #667eea;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #667eea;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.profile-link:hover {
    background: #667eea;
    color: white;
}

.profile-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e1e5e9;
}

.no-profile {
    text-align: center;
    padding: 3rem;
    color: #666;
}

.no-profile h3 {
    margin-bottom: 1rem;
    color: #333;
}

@media (max-width: 768px) {
    .profile-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .profile-links {
        justify-content: center;
    }
}
`;

// Add the additional CSS to the page
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);