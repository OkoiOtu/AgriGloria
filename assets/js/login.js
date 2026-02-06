// Mobile device detection
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const mobileWarning = document.getElementById('mobileWarning');
  const loginContainer = document.getElementById('loginContainer');
  
  // Check if on mobile
  if (isMobileDevice()) {
    // Show warning, hide login
    mobileWarning.style.display = 'flex';
    loginContainer.style.display = 'none';
    
    // Add refresh button functionality
    document.getElementById('refreshPage').addEventListener('click', function() {
      location.reload();
    });
  } else {
    // Show login, hide warning
    mobileWarning.style.display = 'none';
    loginContainer.style.display = 'block';
    
    // Initialize login form functionality
    initializeLoginForm();
  }
  
  // Listen for window resize
  window.addEventListener('resize', function() {
    if (isMobileDevice()) {
      mobileWarning.style.display = 'flex';
      loginContainer.style.display = 'none';
    } else {
      mobileWarning.style.display = 'none';
      loginContainer.style.display = 'block';
    }
  });
});

// Separate function for login form initialization
function initializeLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const message = document.getElementById('loginMessage');
  
  // Apply wave effect to labels - EXACT WAVE EFFECT
  const labels = document.querySelectorAll('.form-control label');
  
  labels.forEach(label => {
    // Split the text into individual letters and wrap each in a span
    label.innerHTML = label.innerText
      .split('')
      .map((letter, idx) => 
        `<span style="transition-delay: ${idx * 50}ms">${letter}</span>`
      )
      .join('');
  });
  
  // Fix for the wave effect staying when input has content
  const inputs = document.querySelectorAll('.form-control input');
  
  inputs.forEach(input => {
    // Add 'has-value' class when input has content (on page load)
    if (input.value.trim() !== '') {
      input.parentElement.classList.add('has-value');
    }
    
    // Add 'has-value' class when user types
    input.addEventListener('input', function() {
      if (this.value.trim() !== '') {
        this.parentElement.classList.add('has-value');
      } else {
        this.parentElement.classList.remove('has-value');
      }
    });
    
    // Add 'focused' class when input is focused (for optional styling)
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });
  
  // Form submission handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Clear previous message
    message.textContent = '';
    message.style.color = '';
    message.style.backgroundColor = '';

    if (!email || !password) {
      message.textContent = 'Email and password are required';
      message.style.color = '#d32f2f';
      message.style.backgroundColor = '#ffebee';
      message.style.padding = '10px';
      message.style.borderRadius = '5px';
      return;
    }

    // Show loading state
    const submitBtn = loginForm.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message || 'Login failed. Please check your credentials.';
        message.style.color = '#d32f2f';
        message.style.backgroundColor = '#ffebee';
        message.style.padding = '10px';
        message.style.borderRadius = '5px';
        
        // Add shake animation to form on error
        loginForm.style.animation = 'shake 0.5s';
        setTimeout(() => {
          loginForm.style.animation = '';
        }, 500);
        
        return;
      }

      // ✅ Save token & user
      localStorage.setItem('agrigloria_token', data.token);
      localStorage.setItem('agrigloria_user', JSON.stringify(data.user));

      message.textContent = 'Login successful! Redirecting...';
      message.style.color = '#2f7d32';
      message.style.backgroundColor = '#e8f5e9';
      message.style.padding = '10px';
      message.style.borderRadius = '5px';

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);

    } catch (error) {
      message.textContent = 'Server error. Please try again.';
      message.style.color = '#d32f2f';
      message.style.backgroundColor = '#ffebee';
      message.style.padding = '10px';
      message.style.borderRadius = '5px';
      console.error(error);
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
  
  // Add shake animation for errors
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
  
  // Auto-focus email input
  document.getElementById('email').focus();
}