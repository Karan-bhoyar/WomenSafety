 document.addEventListener("DOMContentLoaded", () => {
  


    // Auth modal elements
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const mobileSignupBtn = document.getElementById('mobile-signup-btn');
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeSignupModal = document.getElementById('close-signup-modal');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');

    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Auth modal functions
    const openLoginModal = () => {
      loginModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      mobileMenu.classList.add('hidden');
    };

    const openSignupModal = () => {
      signupModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      mobileMenu.classList.add('hidden');
    };

    const closeAuthModals = () => {
      loginModal.classList.add('hidden');
      signupModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      loginForm.reset();
      signupForm.reset();
      // Reset password strength indicators
      const strengthBar = document.getElementById('password-strength-bar');
      const strengthText = document.getElementById('password-strength-text');
      const matchMessage = document.getElementById('password-match-message');
      if (strengthBar) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'bg-red-500 h-2 rounded-full transition-all duration-300';
      }
      if (strengthText) strengthText.textContent = 'Enter a password';
      if (matchMessage) matchMessage.classList.add('hidden');
    };

    // Auth event listeners
    loginBtn.addEventListener('click', openLoginModal);
    signupBtn.addEventListener('click', openSignupModal);
    mobileLoginBtn.addEventListener('click', openLoginModal);
    mobileSignupBtn.addEventListener('click', openSignupModal);
    closeLoginModal.addEventListener('click', closeAuthModals);
    closeSignupModal.addEventListener('click', closeAuthModals);

    // Switch between modals
    switchToSignup.addEventListener('click', () => {
      loginModal.classList.add('hidden');
      signupModal.classList.remove('hidden');
      loginForm.reset();
    });

    switchToLogin.addEventListener('click', () => {
      signupModal.classList.add('hidden');
      loginModal.classList.remove('hidden');
      signupForm.reset();
    });

    // Close modals when clicking outside
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) closeAuthModals();
    });

    signupModal.addEventListener('click', (e) => {
      if (e.target === signupModal) closeAuthModals();
    });

    // Header background on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('bg-indigo-900', 'bg-opacity-95', 'backdrop-blur-sm');
      } else {
        header.classList.remove('bg-indigo-900', 'bg-opacity-95', 'backdrop-blur-sm');
      }
    });

    // Password visibility toggles
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    const toggleSignupPassword = document.getElementById('toggle-signup-password');
    const loginPasswordInput = document.getElementById('login-password');
    const signupPasswordInput = document.getElementById('signup-password');

    toggleLoginPassword.addEventListener('click', () => {
      const type = loginPasswordInput.type === 'password' ? 'text' : 'password';
      loginPasswordInput.type = type;
    });

    toggleSignupPassword.addEventListener('click', () => {
      const type = signupPasswordInput.type === 'password' ? 'text' : 'password';
      signupPasswordInput.type = type;
    });

    // Password strength checker
    const passwordStrengthBar = document.getElementById('password-strength-bar');
    const passwordStrengthText = document.getElementById('password-strength-text');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const passwordMatchMessage = document.getElementById('password-match-message');

    signupPasswordInput.addEventListener('input', (e) => {
      const password = e.target.value;
      const strength = calculatePasswordStrength(password);
      
      passwordStrengthBar.style.width = `${strength.percentage}%`;
      passwordStrengthBar.className = `${strength.colorClass} h-2 rounded-full transition-all duration-300`;
      passwordStrengthText.textContent = strength.text;
      passwordStrengthText.className = `text-xs ${strength.textColorClass} mt-1`;
    });

    confirmPasswordInput.addEventListener('input', (e) => {
      const password = signupPasswordInput.value;
      const confirmPassword = e.target.value;
      
      if (confirmPassword.length > 0) {
        if (password === confirmPassword) {
          passwordMatchMessage.textContent = '✓ Passwords match';
          passwordMatchMessage.className = 'text-xs text-green-600 mt-1';
          passwordMatchMessage.classList.remove('hidden');
        } else {
          passwordMatchMessage.textContent = '✗ Passwords do not match';
          passwordMatchMessage.className = 'text-xs text-red-600 mt-1';
          passwordMatchMessage.classList.remove('hidden');
        }
      } else {
        passwordMatchMessage.classList.add('hidden');
      }
    });

    function calculatePasswordStrength(password) {
      let score = 0;
      if (password.length >= 8) score += 25;
      if (password.match(/[a-z]/)) score += 25;
      if (password.match(/[A-Z]/)) score += 25;
      if (password.match(/[0-9]/)) score += 15;
      if (password.match(/[^a-zA-Z0-9]/)) score += 10;

      if (score < 30) {
        return {
          percentage: score,
          colorClass: 'bg-red-500',
          textColorClass: 'text-red-600',
          text: 'Weak password'
        };
      } else if (score < 60) {
        return {
          percentage: score,
          colorClass: 'bg-yellow-500',
          textColorClass: 'text-yellow-600',
          text: 'Fair password'
        };
      } else if (score < 90) {
        return {
          percentage: score,
          colorClass: 'bg-blue-500',
          textColorClass: 'text-blue-600',
          text: 'Good password'
        };
      } else {
        return {
          percentage: score,
          colorClass: 'bg-green-500',
          textColorClass: 'text-green-600',
          text: 'Strong password'
        };
      }
    }

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const rememberMe = document.getElementById('remember-me').checked;
      const submitBtn = document.getElementById('login-submit-btn');

 
  // Simulate login delay
  setTimeout(() => {
    // Example condition for validation
    if (email === "user@gmail.com" && password === "12345") {
      // ✅ Success
      toastMessage.textContent = `Welcome back! Successfully logged in as ${email}`;
      toast.classList.remove('hidden');
    } else {
      // ❌ Failure
      toastMessage.textContent = `Login failed! Invalid email or password.`;
      toast.classList.remove('hidden');
      toast.classList.add('bg-red-500'); // Optional: red color for error
    }

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }, 2000);
});
    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById('signup-first-name').value;
      const lastName = document.getElementById('signup-last-name').value;
      const email = document.getElementById('signup-email').value;
      const phone = document.getElementById('signup-phone').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      const emergencyContact = document.getElementById('signup-emergency-contact').value;
      const emergencyPhone = document.getElementById('signup-emergency-phone').value;
      const termsAccepted = document.getElementById('signup-terms').checked;
      const notifications = document.getElementById('signup-notifications').checked;
      const submitBtn = document.getElementById('signup-submit-btn');

      // Validate passwords match
      if (password !== confirmPassword) {
        passwordMatchMessage.textContent = '✗ Passwords do not match';
        passwordMatchMessage.className = 'text-xs text-red-600 mt-1';
        passwordMatchMessage.classList.remove('hidden');
        return;
      }

      // Simulate signup
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';

      setTimeout(() => {
        // Show success toast
        toastMessage.textContent = `Welcome ${firstName}! Your SafeSteps account has been created successfully.`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
          toast.classList.add('hidden');
        }, 5000);

        closeAuthModals();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }, 2500);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Close mobile menu if open
          mobileMenu.classList.add('hidden');
        }
      });
    });

    // Emergency report modal functionality
    const reportBtn = document.getElementById('report-emergency-btn');
    const modal = document.getElementById('report-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const emergencyForm = document.getElementById('emergency-form');
    const detectLocationBtn = document.getElementById('detect-location-btn');
    const locationInput = document.getElementById('report-location');
    const locationStatus = document.getElementById('location-status');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Open modal
    reportBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    // Close modal functions
    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      emergencyForm.reset();
      locationStatus.textContent = '';
    };

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Location detection
    detectLocationBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        locationStatus.textContent = 'Detecting location...';
        detectLocationBtn.disabled = true;
        detectLocationBtn.textContent = '⏳';

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            locationInput.value = `${lat}, ${lng}`;
            locationStatus.textContent = 'Location detected successfully!';
            locationStatus.className = 'text-xs text-green-600 mt-1';
            detectLocationBtn.disabled = false;
            detectLocationBtn.textContent = '📍';
          },
          (error) => {
            locationStatus.textContent = 'Unable to detect location. Please enter manually.';
            locationStatus.className = 'text-xs text-red-600 mt-1';
            detectLocationBtn.disabled = false;
            detectLocationBtn.textContent = '📍';
          }
        );
      } else {
        locationStatus.textContent = 'Geolocation is not supported by this browser.';
        locationStatus.className = 'text-xs text-red-600 mt-1';
      }
    });

    // Form submission
    emergencyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(emergencyForm);
      const name = document.getElementById('report-name').value || 'Anonymous';
      const location = document.getElementById('report-location').value;
      const description = document.getElementById('report-description').value;
      const contact = document.getElementById('report-contact').value;

      // Simulate sending alert
      const sendBtn = document.getElementById('send-alert-btn');
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending...';

      setTimeout(() => {
        // Show success toast
        toastMessage.textContent = `Alert sent for ${name} at ${location}`;
        toast.classList.remove('hidden');
        
        // Hide toast after 5 seconds
        setTimeout(() => {
          toast.classList.add('hidden');
        }, 5000);

        // Close modal
        closeModal();
        
        // Reset button
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Alert';
      }, 2000);
    });

    // Contact form functionality
    const contactForm = document.getElementById('contact-form');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById('contact-first-name').value;
      const lastName = document.getElementById('contact-last-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;
      const newsletter = document.getElementById('contact-newsletter').checked;

      // Simulate form submission
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = `
        <svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Sending...
      `;

      setTimeout(() => {
  // Show success toast
  toastMessage.textContent = `Thank you ${firstName}! We'll respond to your ${subject.toLowerCase()} inquiry within 24 hours.`;
  toast.classList.remove('hidden');
  
  // ✅ Show "Message Sent ✓" on button
  contactSubmitBtn.innerHTML = `
    <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
    </svg>
    Message Sent ✓
  `;
  
  // Enable button again
  contactSubmitBtn.disabled = false;

  // Hide toast after 5 seconds
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 5000);

  // Reset form
  contactForm.reset();

  // ⏳ After 3 seconds, return to normal "Send Message"
  setTimeout(() => {
    contactSubmitBtn.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
      </svg>
      Send Message
    `;
  }, 3000);

  // Smooth scroll to contact section
  document.getElementById('contact-form').scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}, 2000);

    });

    // Initialize Element SDK if available
    if (window.elementSdk) {
      const defaultConfig = {
        hero_headline: "Safer Steps, Stronger Communities",
        hero_subheadline: "Empowering women with instant emergency alerts, live location sharing, and community support for safer journeys every day.",
        features_title: "Powerful Features for Your Safety",
        footer_copyright: "© 2024 SafeSteps. All rights reserved. Made with ❤️ for women's safety."
      };

      const onConfigChange = async (config) => {
        // Update hero headline
        const heroHeadline = document.getElementById('hero-headline');
        if (heroHeadline) {
          heroHeadline.textContent = config.hero_headline || defaultConfig.hero_headline;
        }

        // Update hero subheadline
        const heroSubheadline = document.getElementById('hero-subheadline');
        if (heroSubheadline) {
          heroSubheadline.textContent = config.hero_subheadline || defaultConfig.hero_subheadline;
        }

        // Update features title
        const featuresTitle = document.getElementById('features-title');
        if (featuresTitle) {
          featuresTitle.textContent = config.features_title || defaultConfig.features_title;
        }

        // Update footer copyright
        const footerCopyright = document.getElementById('footer-copyright');
        if (footerCopyright) {
          footerCopyright.textContent = config.footer_copyright || defaultConfig.footer_copyright;
        }
      };

      const mapToCapabilities = (config) => ({
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      });

      const mapToEditPanelValues = (config) => new Map([
        ["hero_headline", config.hero_headline || defaultConfig.hero_headline],
        ["hero_subheadline", config.hero_subheadline || defaultConfig.hero_subheadline],
        ["features_title", config.features_title || defaultConfig.features_title],
        ["footer_copyright", config.footer_copyright || defaultConfig.footer_copyright]
      ]);

      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
      });
    }

    // Add some interactive animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe feature cards for animation
    document.querySelectorAll('.feature-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });

    // Add floating animation to decorative elements
    const floatingElements = document.querySelectorAll('[class*="animate-pulse"], [class*="animate-bounce"]');
    floatingElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.5}s`;
    });

    // Parallax bubble animation
  document.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const bubbles = document.querySelectorAll(".parallax-bubble");

    bubbles.forEach((bubble, index) => {
      const speed = (index + 1) * 0.2; // each bubble moves differently
      const translateY = scrollY * speed * 0.1; 
      const translateX = scrollY * speed * 0.05 * (index % 2 === 0 ? 1 : -1);
      bubble.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  });
});

// ✅ Signup Form
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  let isSubmitting = false;

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;

    // Get form values
    const firstName = document.getElementById("signup-first-name").value.trim();
    const lastName = document.getElementById("signup-last-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("signup-confirm-password").value.trim();
    const emergencyContact = document.getElementById("signup-emergency-contact").value.trim();
    const emergencyPhone = document.getElementById("signup-emergency-phone").value.trim();
    const notifications = document.getElementById("signup-notifications").checked;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      isSubmitting = false;
      return;
    }

    const signupData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      emergencyContact,
      emergencyPhone,
      notifications,
    };

    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Signup successful! Please login now.");

        signupForm.reset();

        const signupModal = document.getElementById("signup-modal");
        const loginModal = document.getElementById("login-modal");

        // ✅ Step 1: hide signup modal completely
        if (signupModal) signupModal.classList.add("hidden");

        // ✅ Step 2: delay a bit to allow transition & click to end
        setTimeout(() => {
          // Remove any inline styles or extra 'hidden' states
          if (loginModal) {
            loginModal.classList.remove("hidden");
            loginModal.style.display = "flex"; // ensure it shows properly
          }
        }, 800);
      } else {
        alert(data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Signup Error:", err);
      alert("Signup failed! Server error.");
    } finally {
      isSubmitting = false;
    }
  });
}


// ✅ Login Form
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Login successful!");

        // ✅ Clear form and close modal
        loginForm.reset();
        const loginModal = document.getElementById("login-modal");
        if (loginModal) loginModal.classList.add("hidden");

        // ✅ Redirect to home page (index.html)
        window.location.href = "index.html";
      } else {
        alert(data.message || "Login failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed! Server error.");
    }
  });
}




// ✅ Contact Form
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      firstName: document.getElementById("contact-first-name").value,
      lastName: document.getElementById("contact-last-name").value,
      email: document.getElementById("contact-email").value,
      phone: document.getElementById("contact-phone").value,
      subject: document.getElementById("contact-subject").value,
      message: document.getElementById("contact-message").value,
      newsletter: document.getElementById("contact-newsletter").checked,
    };

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      alert(result.message);
    } catch (err) {
      alert("Failed to send message! Server error.");
    }
  });
}



// 🚨 Emergency Report Form
const emergencyForm = document.getElementById("emergency-form");
if (emergencyForm) {
  emergencyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reportData = {
      name: document.getElementById("report-name").value,
      location: document.getElementById("report-location").value,
      description: document.getElementById("report-description").value,
      contact: document.getElementById("report-contact").value,
    };

    try {
      const res = await fetch("/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      const data = await res.json();
      alert(data.message);
      emergencyForm.reset();
    } catch (err) {
      alert("Failed to send emergency report! Server error.");
    }
  });

  // 📍 Detect current location (optional)
  const detectBtn = document.getElementById("detect-location-btn");
  const locationField = document.getElementById("report-location");
  const locationStatus = document.getElementById("location-status");

  if (detectBtn) {
    detectBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        locationStatus.textContent = "Geolocation not supported.";
        return;
      }
      locationStatus.textContent = "Detecting location...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          locationField.value = `Lat: ${latitude}, Long: ${longitude}`;
          locationStatus.textContent = "Location detected successfully!";
        },
        () => {
          locationStatus.textContent = "Unable to detect location.";
        }
      );
    });
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const profileMenu = document.getElementById("profile-menu");
  const profileButton = document.getElementById("profileButton");
  const profileName = document.getElementById("profile-name");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const logoutBtn = document.getElementById("logoutBtn");

  // ✅ Check if user already logged in
  const user = localStorage.getItem("loggedUser");
  if (user) showProfile(user);

  // ✅ Simulate login success only once
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // 💥 Prevent double event trigger

      const email = document.getElementById("login-email").value;
      const name = email.split("@")[0];
      localStorage.setItem("loggedUser", name);
      showProfile(name);

      const loginModal = document.getElementById("login-modal");
      if (loginModal) loginModal.classList.add("hidden");

      // ✅ Removed alert for login success
    });
  }

  // ✅ Show profile function
  function showProfile(name) {
    if (!loginBtn || !signupBtn || !profileMenu) return;
    loginBtn.classList.add("hidden");
    signupBtn.classList.add("hidden");
    profileMenu.classList.remove("hidden");
    profileName.textContent = name;
  }

  // ✅ Logout function
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      loginBtn.classList.remove("hidden");
      signupBtn.classList.remove("hidden");
      profileMenu.classList.add("hidden");
      dropdownMenu.classList.add("hidden");
      alert("Logged out successfully!");
    });
  }

  // ✅ Toggle dropdown visibility
  if (profileButton) {
    profileButton.addEventListener("click", () => {
      dropdownMenu.classList.toggle("hidden");
    });
  }
});



// Show popup when button clicked
document.getElementById("call-help-btn").addEventListener("click", () => {
    document.getElementById("sos-popup").classList.remove("hidden");
});

// Save SOS & Send SMS
document.getElementById("save-sos-btn").addEventListener("click", async () => {
    const number = document.getElementById("sos-number").value.trim();

    if (!number) {
        alert("Please enter a phone number!");
        return;
    }

    try {
        // 1️⃣ Save in MongoDB
        const saveRes = await fetch("http://localhost:5000/save-sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ number })
        });

        const saveData = await saveRes.json();

        if (!saveData.success) {
            alert("Failed to save contact!");
            return;
        }

        // 2️⃣ Send SMS alert
        const smsRes = await fetch("http://localhost:5000/send-sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ number })
        });

        const smsData = await smsRes.json();

        if (!smsData.success) {
            alert("Saved but SMS failed!");
            return;
        }

        alert("Contact Saved & SMS Alert Sent! 🚨");
        document.getElementById("sos-popup").classList.add("hidden");

    } catch (err) {
        console.log(err);
        alert("Server error! Check console.");
    }
});




// Show popup (example: when clicking a button)
document.getElementById("call-help-btn").addEventListener("click", () => {
    document.getElementById("sos-popup").classList.remove("hidden");
});

// Close popup
document.getElementById("close-sos-btn").addEventListener("click", () => {
    document.getElementById("sos-popup").classList.add("hidden");
});



// Select all emergency number links
document.querySelectorAll('.grid a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // prevent default navigation

        const number = link.getAttribute('href').replace('tel:', '');

        // Try to trigger the call via tel:
        window.location.href = `tel:${number}`;

        // Optional fallback for desktop: show prompt
        if (!/Mobi|Android/i.test(navigator.userAgent)) {
            alert(`To call ${number} on your computer, you need a calling app (Skype, Teams, etc.).\nOr dial manually: ${number}`);
        }
    });
});




function initMap() {
    // Default location (center of the map)
    const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Example: New Delhi

    // Create the map
    const map = new google.maps.Map(document.getElementById("safe-zones-map"), {
        center: defaultLocation,
        zoom: 13,
    });

    // Marker for user location (optional)
    const userMarker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "You are here",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff"
        }
    });

    // Places service to find nearby police, hospitals, shelters
    const service = new google.maps.places.PlacesService(map);

    const types = ["police", "hospital", "point_of_interest"]; // you can add "shelter" if available

    types.forEach(type => {
        service.nearbySearch({
            location: defaultLocation,
            radius: 5000, // 5km radius
            type: [type]
        }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                results.forEach(place => {
                    const marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                        title: place.name
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<strong>${place.name}</strong><br>${place.vicinity || ""}`
                    });

                    marker.addListener("click", () => {
                        infoWindow.open(map, marker);
                    });
                });
            }
        });
    });
}

// Initialize map after page loads
window.addEventListener("load", initMap);





document.addEventListener("DOMContentLoaded", () => {

    const alertBtn = document.getElementById("alertContactsBtn");

    alertBtn.addEventListener("click", async () => {

        // Step 1: Load saved SOS contacts from localStorage
        let savedContacts = JSON.parse(localStorage.getItem("sosContacts")) || [];

        if (savedContacts.length === 0) {
            alert("❌ No SOS Contacts Saved!");
            return;
        }

        // Step 2: Send SMS to each saved contact
        for (let num of savedContacts) {
            try {
                await fetch("http://localhost:5000/send-sos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ number: num })
                });

                console.log("SMS Sent to:", num);

            } catch (error) {
                console.error("SMS Failed:", num, error);
            }
        }

        // Step 3: Show success popup
        alert("🚨 SOS Alerts Sent to All Saved Contacts!");
    });

});
