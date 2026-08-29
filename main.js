/**
 * ============================================
 * HIGHDEE TECHNOLOGIES - MAIN JAVASCRIPT FILE
 * ============================================
 * 
 * FILE: main.js
 * DESCRIPTION: All client-side functionality for the Highdee Technologies website
 * DEPENDENCIES: Supabase JS SDK (loaded via CDN)
 * 
 * TABLE OF CONTENTS:
 * 1.  SUPABASE CONFIGURATION
 * 2.  SUPABASE FUNCTIONS
 * 3.  NAVIGATION FUNCTIONS
 * 4.  PAGE ROUTING FUNCTIONS
 * 5.  UI/UX FUNCTIONS
 * 6.  CONTACT FORM FUNCTIONS
 * 7.  SCROLL ANIMATION FUNCTIONS
 * 8.  INITIALIZATION
 * ============================================
 */

// ============================================
// 1. SUPABASE CONFIGURATION
// ============================================

/**
 * Supabase Configuration Object
 * Contains the connection credentials for Supabase
 * @constant {Object} SUPABASE_CONFIG
 * @property {string} url - The Supabase project URL
 * @property {string} anonKey - The Supabase anonymous public key
 * 
 * ⚠️ IMPORTANT: Replace these values with your actual Supabase credentials
 * You can find them in your Supabase dashboard → Settings → API
 */
const SUPABASE_CONFIG = {
    url: "https://wjxldmgnglrrthzkzots.supabase.co",     // ⚠️ REPLACE THIS
    anonKey: "sb_publishable_Z4EiH6YUo-ThIDN-mKQYOg_u-JjPbD3"                    // ⚠️ REPLACE THIS
};

// Initialize Supabase client
const supabaseClient = supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
);

// ============================================
// 2. SUPABASE FUNCTIONS
// ============================================

/**
 * 2.1 SUBMIT CONTACT FORM TO SUPABASE
 * 
 * @function submitContactForm
 * @description Inserts form data into the 'contact_submissions' table in Supabase
 * @param {Object} formData - The form data object
 * @param {string} formData.fullName - Full name of the sender
 * @param {string} formData.organization - Organization name (optional)
 * @param {string} formData.email - Email address of the sender
 * @param {string} formData.phone - Phone number (optional)
 * @param {string} formData.serviceNeeded - Selected service type
 * @param {string} formData.projectType - Selected project type
 * @param {string} formData.budgetRange - Selected budget range
 * @param {string} formData.message - Message content (optional)
 * @returns {Promise<Object>} - { success: boolean, data: any, error: string }
 * 
 * @example
 * const result = await submitContactForm({
 *     fullName: "John Doe",
 *     email: "john@example.com",
 *     message: "Hello, I need a website."
 * });
 */
async function submitContactForm(formData) {
    try {
        // Prepare data for insertion
        const insertData = {
            full_name: formData.fullName || '',
            organization: formData.organization || '',
            email: formData.email || '',
            phone: formData.phone || '',
            service_needed: formData.serviceNeeded || '',
            project_type: formData.projectType || '',
            budget_range: formData.budgetRange || '',
            message: formData.message || '',
            created_at: new Date().toISOString()
        };

        // Perform the insert operation
        const { data, error } = await supabaseClient
            .from("contact_submissions")
            .insert([insertData])
            .select();

        // Handle errors
        if (error) {
            console.error("[Supabase Error] submitContactForm:", error);
            return { 
                success: false, 
                error: error.message,
                details: error
            };
        }

        // Success
        console.log("[Supabase] Contact form submitted successfully:", data);
        return { 
            success: true, 
            data: data,
            error: null
        };

    } catch (err) {
        console.error("[Supabase Exception] submitContactForm:", err);
        return { 
            success: false, 
            error: err.message || "An unexpected error occurred",
            details: err
        };
    }
}

/**
 * 2.2 LOAD STUDENTS FROM SUPABASE
 * 
 * @function loadStudents
 * @description Fetches all student records from the 'students' table
 * @returns {Promise<Object>} - { success: boolean, data: Array, error: string }
 * 
 * @example
 * const result = await loadStudents();
 * if (result.success) {
 *     result.data.forEach(student => console.log(student.name));
 * }
 */
async function loadStudents() {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("[Supabase Error] loadStudents:", error);
            return { 
                success: false, 
                data: null,
                error: error.message 
            };
        }

        console.log(`[Supabase] Loaded ${data.length} students`);
        return { 
            success: true, 
            data: data,
            error: null
        };

    } catch (err) {
        console.error("[Supabase Exception] loadStudents:", err);
        return { 
            success: false, 
            data: null,
            error: err.message 
        };
    }
}

/**
 * 2.3 ADD A STUDENT TO SUPABASE
 * 
 * @function addStudent
 * @description Inserts a new student record into the 'students' table
 * @param {Object} studentData - The student data
 * @param {string} studentData.name - Student's full name
 * @param {string} studentData.class - Student's class/grade
 * @param {string} studentData.gender - Student's gender
 * @returns {Promise<Object>} - { success: boolean, data: any, error: string }
 */
async function addStudent(studentData) {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .insert([
                {
                    name: studentData.name || '',
                    class: studentData.class || '',
                    gender: studentData.gender || '',
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error("[Supabase Error] addStudent:", error);
            return { 
                success: false, 
                data: null,
                error: error.message 
            };
        }

        console.log("[Supabase] Student added successfully:", data);
        return { 
            success: true, 
            data: data,
            error: null
        };

    } catch (err) {
        console.error("[Supabase Exception] addStudent:", err);
        return { 
            success: false, 
            data: null,
            error: err.message 
        };
    }
}

/**
 * 2.4 DELETE A STUDENT FROM SUPABASE
 * 
 * @function deleteStudent
 * @description Deletes a student record from the 'students' table by ID
 * @param {number|string} studentId - The ID of the student to delete
 * @returns {Promise<Object>} - { success: boolean, error: string }
 */
async function deleteStudent(studentId) {
    try {
        const { error } = await supabaseClient
            .from("students")
            .delete()
            .eq("id", studentId);

        if (error) {
            console.error("[Supabase Error] deleteStudent:", error);
            return { 
                success: false, 
                error: error.message 
            };
        }

        console.log(`[Supabase] Student ${studentId} deleted successfully`);
        return { 
            success: true, 
            error: null 
        };

    } catch (err) {
        console.error("[Supabase Exception] deleteStudent:", err);
        return { 
            success: false, 
            error: err.message 
        };
    }
}

/**
 * 2.5 GET ALL CONTACT SUBMISSIONS
 * 
 * @function getContactSubmissions
 * @description Fetches all contact form submissions from the 'contact_submissions' table
 * @param {number} [limit=100] - Maximum number of records to return
 * @returns {Promise<Object>} - { success: boolean, data: Array, error: string }
 * 
 * @example
 * const result = await getContactSubmissions(50);
 * if (result.success) {
 *     result.data.forEach(sub => console.log(sub.full_name, sub.email));
 * }
 */
async function getContactSubmissions(limit = 100) {
    try {
        const { data, error } = await supabaseClient
            .from("contact_submissions")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("[Supabase Error] getContactSubmissions:", error);
            return { 
                success: false, 
                data: null,
                error: error.message 
            };
        }

        console.log(`[Supabase] Loaded ${data.length} contact submissions`);
        return { 
            success: true, 
            data: data,
            error: null 
        };

    } catch (err) {
        console.error("[Supabase Exception] getContactSubmissions:", err);
        return { 
            success: false, 
            data: null,
            error: err.message 
        };
    }
}

// ============================================
// 3. NAVIGATION FUNCTIONS
// ============================================

/**
 * 3.1 GET DOM REFERENCES
 * 
 * @function getDomReferences
 * @description Gets all DOM element references used by the site
 * @returns {Object} - Object containing all DOM references
 */
function getDomReferences() {
    return {
        navToggle: document.getElementById('navToggle'),
        navLinks: document.getElementById('navLinks'),
        navOverlay: document.getElementById('navOverlay'),
        header: document.getElementById('siteHeader'),
        pages: document.querySelectorAll('.page'),
        navAnchors: document.querySelectorAll('[data-page]'),
        contactForms: document.querySelectorAll('#contactForm, #contactForm2'),
        revealElements: document.querySelectorAll('.reveal')
    };
}

/**
 * 3.2 TOGGLE MOBILE NAVIGATION
 * 
 * @function toggleMobileNav
 * @description Opens or closes the mobile navigation menu
 * @param {boolean} forceState - Optional: true to open, false to close
 */
function toggleMobileNav(forceState) {
    const { navLinks, navToggle, navOverlay } = getDomReferences();
    
    if (forceState === true) {
        navLinks.classList.add('open');
        navToggle.classList.add('open');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else if (forceState === false) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // Toggle
        const isOpen = navLinks.classList.contains('open');
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('open');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }
}

/**
 * 3.3 CLOSE MOBILE NAVIGATION
 * 
 * @function closeMobileNav
 * @description Closes the mobile navigation menu
 * @alias toggleMobileNav(false)
 */
function closeMobileNav() {
    toggleMobileNav(false);
}

/**
 * 3.4 SETUP NAVIGATION EVENTS
 * 
 * @function setupNavigation
 * @description Sets up all navigation-related event listeners
 */
function setupNavigation() {
    const { navToggle, navOverlay } = getDomReferences();

    // Toggle button click
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            toggleMobileNav();
        });
    }

    // Overlay click to close
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileNav);
    }

    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    });
}

// ============================================
// 4. PAGE ROUTING FUNCTIONS
// ============================================

/**
 * 4.1 SHOW A SPECIFIC PAGE
 * 
 * @function showPage
 * @description Hides all pages and displays the requested page
 * @param {string} pageId - The ID of the page to show (e.g., 'home', 'about')
 */
function showPage(pageId) {
    const { pages, navAnchors } = getDomReferences();

    // Hide all pages
    pages.forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // Fallback to home
        const home = document.getElementById('page-home');
        if (home) home.classList.add('active');
    }

    // Update navigation active states
    navAnchors.forEach(a => {
        a.classList.toggle('active', a.dataset.page === pageId);
    });

    // Close mobile nav
    closeMobileNav();

    // Update URL hash
    if (pageId === 'home') {
        history.pushState(null, '', '#');
    } else {
        history.pushState(null, '', '#' + pageId);
    }

    // Trigger reveal animations after page change
    setTimeout(triggerReveals, 300);
}

/**
 * 4.2 SETUP PAGE ROUTING
 * 
 * @function setupPageRouting
 * @description Sets up all page routing event listeners
 */
function setupPageRouting() {
    const { navAnchors } = getDomReferences();

    // Navigation link clicks
    navAnchors.forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) showPage(page);
        });
    });

    // Hash change
    window.addEventListener('hashchange', handleHash);

    // Initial hash handling
    handleHash();
}

/**
 * 4.3 HANDLE URL HASH
 * 
 * @function handleHash
 * @description Checks the URL hash and navigates to the corresponding page
 */
function handleHash() {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'about', 'solutions', 'services', 'projects', 'initiatives', 'insights', 'contact'];
    
    if (hash && validPages.includes(hash) && document.getElementById('page-' + hash)) {
        showPage(hash);
    } else {
        showPage('home');
    }
}

// ============================================
// 5. UI/UX FUNCTIONS
// ============================================

/**
 * 5.1 HANDLE SCROLL HEADER
 * 
 * @function handleScrollHeader
 * @description Adds/removes a 'scrolled' class to the header based on scroll position
 */
function handleScrollHeader() {
    const { header } = getDomReferences();
    if (!header) return;

    const current = window.pageYOffset || document.documentElement.scrollTop;
    if (current > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

/**
 * 5.2 SETUP SCROLL HEADER
 * 
 * @function setupScrollHeader
 * @description Sets up the scroll event listener for the header
 */
function setupScrollHeader() {
    window.addEventListener('scroll', handleScrollHeader, { passive: true });
}

/**
 * 5.3 GET FORM DATA FROM CONTACT FORM
 * 
 * @function getContactFormData
 * @description Extracts all form data from a contact form element
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} - Form data object
 */
function getContactFormData(form) {
    return {
        fullName: form.querySelector('input[placeholder="Your full name"]')?.value || '',
        organization: form.querySelector('input[placeholder="Your organization name"]')?.value || '',
        email: form.querySelector('input[type="email"]')?.value || '',
        phone: form.querySelector('input[type="tel"]')?.value || '',
        serviceNeeded: form.querySelector('select:first-of-type')?.value || '',
        projectType: form.querySelector('select:nth-of-type(2)')?.value || '',
        budgetRange: form.querySelector('select:last-of-type')?.value || '',
        message: form.querySelector('textarea')?.value || ''
    };
}

/**
 * 5.4 UPDATE BUTTON STATE
 * 
 * @function updateButtonState
 * @description Updates a button's appearance during form submission
 * @param {HTMLElement} btn - The button element
 * @param {string} state - The state: 'sending', 'success', 'error', 'idle'
 * @param {string} originalText - The original button text (for 'idle' state)
 */
function updateButtonState(btn, state, originalText = '') {
    const states = {
        sending: {
            html: '<i class="fas fa-spinner fa-spin"></i> Sending...',
            disabled: true
        },
        success: {
            html: '<i class="fas fa-check"></i> Sent!',
            disabled: true
        },
        error: {
            html: '<i class="fas fa-exclamation-circle"></i> Error!',
            disabled: true
        },
        idle: {
            html: originalText,
            disabled: false
        }
    };

    const stateConfig = states[state];
    if (stateConfig) {
        btn.innerHTML = stateConfig.html;
        btn.disabled = stateConfig.disabled;
    }
}

// ============================================
// 6. CONTACT FORM FUNCTIONS
// ============================================

/**
 * 6.1 HANDLE CONTACT FORM SUBMISSION
 * 
 * @function handleContactFormSubmit
 * @description Handles the submission of a contact form
 * @param {Event} event - The form submit event
 */
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const btn = form.querySelector('.btn');
    const originalText = btn.innerHTML;

    // Get form data
    const formData = getContactFormData(form);

    // Update button to sending state
    updateButtonState(btn, 'sending');

    try {
        // Submit to Supabase
        const result = await submitContactForm(formData);

        if (result.success) {
            // Success
            updateButtonState(btn, 'success');
            form.reset();
            
            // Reset after 3 seconds
            setTimeout(() => {
                updateButtonState(btn, 'idle', originalText);
            }, 3000);
        } else {
            // Error
            console.error('Form submission error:', result.error);
            updateButtonState(btn, 'error');
            
            // Reset after 3 seconds
            setTimeout(() => {
                updateButtonState(btn, 'idle', originalText);
            }, 3000);
        }
    } catch (err) {
        // Exception
        console.error('Form submission exception:', err);
        updateButtonState(btn, 'error');
        
        setTimeout(() => {
            updateButtonState(btn, 'idle', originalText);
        }, 3000);
    }
}

/**
 * 6.2 SETUP CONTACT FORMS
 * 
 * @function setupContactForms
 * @description Sets up all contact form event listeners
 */
function setupContactForms() {
    const { contactForms } = getDomReferences();
    
    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactFormSubmit);
    });
}

/**
 * 6.3 LOAD STUDENTS INTO LIST (EXAMPLE)
 * 
 * @function displayStudents
 * @description Loads students from Supabase and displays them in a container
 * @param {string} containerId - The ID of the container element
 */
async function displayStudents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const result = await loadStudents();
    
    if (!result.success) {
        container.innerHTML = `<p style="color:red;">Error loading students: ${result.error}</p>`;
        return;
    }

    if (result.data.length === 0) {
        container.innerHTML = '<p>No students found.</p>';
        return;
    }

    container.innerHTML = '';
    result.data.forEach(student => {
        container.innerHTML += `
            <div class="student">
                <strong>${student.name}</strong><br>
                Class: ${student.class || 'N/A'}<br>
                Gender: ${student.gender || 'N/A'}
            </div>
        `;
    });
}

// ============================================
// 7. SCROLL ANIMATION FUNCTIONS
// ============================================

/**
 * 7.1 TRIGGER REVEAL ANIMATIONS
 * 
 * @function triggerReveals
 * @description Checks which '.reveal' elements are in view and adds 'visible' class
 */
function triggerReveals() {
    const elements = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 60) {
            el.classList.add('visible');
        }
    });
}

/**
 * 7.2 SETUP SCROLL REVEALS
 * 
 * @function setupScrollReveals
 * @description Sets up scroll event listeners for reveal animations
 */
function setupScrollReveals() {
    // Initial check
    setTimeout(triggerReveals, 400);

    // Listen for scroll
    window.addEventListener('scroll', triggerReveals, { passive: true });
    window.addEventListener('resize', triggerReveals, { passive: true });
}

// ============================================
// 8. INITIALIZATION
// ============================================

/**
 * 8.1 INITIALIZE THE WEBSITE
 * 
 * @function init
 * @description Main initialization function that sets up everything
 */
function init() {
    console.log('[Highdee Technologies] Initializing website...');

    // Setup navigation
    setupNavigation();
    console.log('[✓] Navigation setup complete');

    // Setup page routing
    setupPageRouting();
    console.log('[✓] Page routing setup complete');

    // Setup scroll header
    setupScrollHeader();
    console.log('[✓] Scroll header setup complete');

    // Setup scroll reveals
    setupScrollReveals();
    console.log('[✓] Scroll reveals setup complete');

    // Setup contact forms
    setupContactForms();
    console.log('[✓] Contact forms setup complete');

    console.log('[Highdee Technologies] Website initialized successfully!');
    console.log('  - Supabase URL:', SUPABASE_CONFIG.url);
    console.log('  - Contact forms:', document.querySelectorAll('#contactForm, #contactForm2').length);
}

/**
 * 8.2 START THE APPLICATION
 * 
 * @description Wait for DOM to be ready, then initialize
 */
document.addEventListener('DOMContentLoaded', init);

// If DOM is already loaded, initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
}