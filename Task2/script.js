/**
 * ==============================================================================
 * Intermediate HTML, CSS, and JavaScript - Task 2 Application Script
 * ==============================================================================
 * 
 * Demonstrates:
 * 1. Semantic DOM selection and Event Listeners
 * 2. Form submission intercepting and regex validation
 * 3. Dynamic error state handling and live UI feedback
 * 4. Flexbox & CSS Grid runtime property manipulation
 * 5. Dynamic interactive To-Do List with DOM node creation & manipulation
 * 6. Responsive navigation bar handling & smooth scrolling
 */

// Wait until DOM is fully parsed
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ==========================================================================
     MODULE 1: Navigation & Mobile Menu Toggle
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], main[id]');

  // Toggle mobile dropdown
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Smooth scroll and active state handler for nav links
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }

      // Update active nav class
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight current active section in nav on scroll
    let currentId = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentId) {
          link.classList.add('active');
        }
      });
    }
  });


  /* ==========================================================================
     MODULE 2: Contact Form & JavaScript Form Validation
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userSubjectInput = document.getElementById('userSubject');
  const userMessageInput = document.getElementById('userMessage');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // Error Message Elements
  const userNameError = document.getElementById('userNameError');
  const userEmailError = document.getElementById('userEmailError');
  const userMessageError = document.getElementById('userMessageError');

  // Alert Box
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const formSuccessDetails = document.getElementById('formSuccessDetails');
  const closeAlertBtn = document.getElementById('closeAlertBtn');

  // Live Inspector Elements
  const valStatusName = document.getElementById('valStatusName');
  const valStatusEmail = document.getElementById('valStatusEmail');
  const valStatusMsg = document.getElementById('valStatusMsg');
  const valStatusOverall = document.getElementById('valStatusOverall');

  // Regular expression for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Helper: Show input error state
   */
  function setInputError(input, errorElement, message) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('is-invalid');
      formGroup.classList.remove('is-valid');
    }
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  /**
   * Helper: Show input valid state
   */
  function setInputValid(input, errorElement) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('is-invalid');
      formGroup.classList.add('is-valid');
    }
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  /**
   * Helper: Clear input states
   */
  function clearInputState(input, errorElement) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('is-invalid');
      formGroup.classList.remove('is-valid');
    }
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  /**
   * Validate Individual Fields
   */
  function validateName() {
    const value = userNameInput.value.trim();
    if (value === '') {
      setInputError(userNameInput, userNameError, 'Full name is required.');
      if (valStatusName) {
        valStatusName.textContent = 'Missing (Error)';
        valStatusName.className = 'metric-value status-error';
      }
      return false;
    } else if (value.length < 2) {
      setInputError(userNameInput, userNameError, 'Name must be at least 2 characters.');
      if (valStatusName) {
        valStatusName.textContent = 'Too Short';
        valStatusName.className = 'metric-value status-error';
      }
      return false;
    } else {
      setInputValid(userNameInput, userNameError);
      if (valStatusName) {
        valStatusName.textContent = 'Valid ✓';
        valStatusName.className = 'metric-value status-valid';
      }
      return true;
    }
  }

  function validateEmail() {
    const value = userEmailInput.value.trim();
    if (value === '') {
      setInputError(userEmailInput, userEmailError, 'Email address is required.');
      if (valStatusEmail) {
        valStatusEmail.textContent = 'Missing (Error)';
        valStatusEmail.className = 'metric-value status-error';
      }
      return false;
    } else if (!emailRegex.test(value)) {
      setInputError(userEmailInput, userEmailError, 'Please enter a valid email address (e.g. name@domain.com).');
      if (valStatusEmail) {
        valStatusEmail.textContent = 'Invalid Format';
        valStatusEmail.className = 'metric-value status-error';
      }
      return false;
    } else {
      setInputValid(userEmailInput, userEmailError);
      if (valStatusEmail) {
        valStatusEmail.textContent = 'Valid ✓';
        valStatusEmail.className = 'metric-value status-valid';
      }
      return true;
    }
  }

  function validateMessage() {
    const value = userMessageInput.value.trim();
    const length = value.length;
    if (valStatusMsg) {
      valStatusMsg.textContent = length + ' chars';
    }

    if (value === '') {
      setInputError(userMessageInput, userMessageError, 'Message content cannot be blank.');
      return false;
    } else if (length < 10) {
      setInputError(userMessageInput, userMessageError, 'Message must be at least 10 characters (' + (10 - length) + ' more needed).');
      return false;
    } else {
      setInputValid(userMessageInput, userMessageError);
      return true;
    }
  }

  // Real-time input validation listeners
  userNameInput.addEventListener('input', function () {
    if (userNameInput.closest('.form-group').classList.contains('is-invalid')) {
      validateName();
    } else {
      const val = userNameInput.value.trim();
      valStatusName.textContent = val ? val.slice(0, 14) + '...' : 'Awaiting Input';
      valStatusName.className = 'metric-value';
    }
  });

  userEmailInput.addEventListener('input', function () {
    if (userEmailInput.closest('.form-group').classList.contains('is-invalid')) {
      validateEmail();
    } else {
      const val = userEmailInput.value.trim();
      valStatusEmail.textContent = val ? (emailRegex.test(val) ? 'Valid ✓' : 'Typing...') : 'Awaiting Input';
      valStatusEmail.className = emailRegex.test(val) ? 'metric-value status-valid' : 'metric-value';
    }
  });

  userMessageInput.addEventListener('input', function () {
    const len = userMessageInput.value.trim().length;
    valStatusMsg.textContent = len + ' chars';
    if (userMessageInput.closest('.form-group').classList.contains('is-invalid') && len >= 10) {
      validateMessage();
    }
  });

  // Blur validation
  userNameInput.addEventListener('blur', function () {
    if (userNameInput.value.trim() !== '') validateName();
  });
  userEmailInput.addEventListener('blur', function () {
    if (userEmailInput.value.trim() !== '') validateEmail();
  });
  userMessageInput.addEventListener('blur', function () {
    if (userMessageInput.value.trim() !== '') validateMessage();
  });

  // Form Submit Handler
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop standard browser submission

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
      // All validations passed!
      const name = userNameInput.value.trim();
      const email = userEmailInput.value.trim();
      const subject = userSubjectInput.value;

      // Update inspector overall status
      if (valStatusOverall) {
        valStatusOverall.textContent = 'Submitted Successfully ✓';
        valStatusOverall.className = 'metric-value status-valid';
      }

      // Display custom success alert banner
      formSuccessDetails.textContent = `Thank you, ${name}! Your "${subject}" inquiry has been validated and recorded. An automated confirmation will be sent to ${email}.`;
      formSuccessAlert.classList.remove('hidden');

      // Scroll alert gently into view
      formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Reset form controls smoothly
      contactForm.reset();
      clearInputState(userNameInput, userNameError);
      clearInputState(userEmailInput, userEmailError);
      clearInputState(userMessageInput, userMessageError);

      // Auto-hide alert after 8 seconds
      setTimeout(function () {
        if (!formSuccessAlert.classList.contains('hidden')) {
          formSuccessAlert.classList.add('hidden');
          if (valStatusOverall) {
            valStatusOverall.textContent = 'Ready for Validation';
            valStatusOverall.className = 'metric-value status-ready';
          }
        }
      }, 8000);
    } else {
      // Validation failed
      if (valStatusOverall) {
        valStatusOverall.textContent = 'Errors Found ✗';
        valStatusOverall.className = 'metric-value status-error';
      }
    }
  });

  // Close alert button
  if (closeAlertBtn) {
    closeAlertBtn.addEventListener('click', function () {
      formSuccessAlert.classList.add('hidden');
      if (valStatusOverall) {
        valStatusOverall.textContent = 'Ready for Validation';
        valStatusOverall.className = 'metric-value status-ready';
      }
    });
  }

  // Clear / Reset Button
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', function () {
      contactForm.reset();
      clearInputState(userNameInput, userNameError);
      clearInputState(userEmailInput, userEmailError);
      clearInputState(userMessageInput, userMessageError);
      formSuccessAlert.classList.add('hidden');

      if (valStatusName) { valStatusName.textContent = 'Awaiting Input'; valStatusName.className = 'metric-value'; }
      if (valStatusEmail) { valStatusEmail.textContent = 'Awaiting Input'; valStatusEmail.className = 'metric-value'; }
      if (valStatusMsg) { valStatusMsg.textContent = '0 chars'; valStatusMsg.className = 'metric-value'; }
      if (valStatusOverall) { valStatusOverall.textContent = 'Ready for Validation'; valStatusOverall.className = 'metric-value status-ready'; }
    });
  }


  /* ==========================================================================
     MODULE 3: Interactive Flexbox & CSS Grid Sandbox Controls
     ========================================================================== */
  // Flexbox Controls
  const flexControls = document.getElementById('flexJustifyControls');
  const demoFlexBox = document.getElementById('demoFlexBox');

  if (flexControls && demoFlexBox) {
    const justifyButtons = flexControls.querySelectorAll('.btn-chip');
    justifyButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        justifyButtons.forEach(function (btn) { btn.classList.remove('active'); });
        button.classList.add('active');
        const justifyVal = button.getAttribute('data-justify');
        demoFlexBox.style.justifyContent = justifyVal;
      });
    });
  }

  // CSS Grid Controls
  const gridControls = document.getElementById('gridColumnsControls');
  const demoGridBox = document.getElementById('demoGridBox');

  if (gridControls && demoGridBox) {
    const gridButtons = gridControls.querySelectorAll('.btn-chip');
    gridButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        gridButtons.forEach(function (btn) { btn.classList.remove('active'); });
        button.classList.add('active');
        const colVal = button.getAttribute('data-columns');
        demoGridBox.style.gridTemplateColumns = colVal;
      });
    });
  }


  /* ==========================================================================
     MODULE 4: Dynamic To-Do List Application (DOM Manipulation)
     ========================================================================== */
  const todoInput = document.getElementById('todoInput');
  const addTodoBtn = document.getElementById('addTodoBtn');
  const todoList = document.getElementById('todoList');
  const todoInputError = document.getElementById('todoInputError');
  const todoEmptyState = document.getElementById('todoEmptyState');
  const pendingCountEl = document.getElementById('pendingCount');
  const totalCountEl = document.getElementById('totalCount');
  const completedCountEl = document.getElementById('completedCount');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const filterTabs = document.querySelectorAll('.filter-tab');

  // Active filter state
  let currentFilter = 'all';

  // Seed with beginner-friendly starter tasks
  let tasks = [
    { id: 1, text: 'Review HTML5 semantic elements & form tags', completed: true },
    { id: 2, text: 'Add client-side JavaScript regex validation', completed: true },
    { id: 3, text: 'Explore CSS Grid repeat(auto-fit, minmax(...))', completed: false }
  ];

  /**
   * Render tasks list to the DOM based on current filter
   */
  function renderTasks() {
    // Clear list container
    todoList.innerHTML = '';

    // Filter tasks
    const filteredTasks = tasks.filter(function (task) {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true; // 'all'
    });

    // Toggle empty state
    if (filteredTasks.length === 0) {
      todoEmptyState.classList.remove('hidden');
    } else {
      todoEmptyState.classList.add('hidden');
    }

    // Build DOM elements for each task item
    filteredTasks.forEach(function (task) {
      const li = document.createElement('li');
      li.className = 'todo-item' + (task.completed ? ' completed' : '');
      li.setAttribute('data-id', task.id);

      // Left Wrapper: Checkbox + Text
      const leftDiv = document.createElement('div');
      leftDiv.className = 'todo-item-left';

      // Custom Checkbox
      const checkbox = document.createElement('button');
      checkbox.type = 'button';
      checkbox.className = 'custom-checkbox' + (task.completed ? ' checked' : '');
      checkbox.setAttribute('aria-label', task.completed ? 'Mark task as incomplete' : 'Mark task as complete');
      checkbox.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      // Checkbox click listener (toggle completion)
      checkbox.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleTaskCompletion(task.id);
      });

      // Task label text
      const spanText = document.createElement('span');
      spanText.className = 'todo-text';
      spanText.textContent = task.text;

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(spanText);

      // Right Wrapper: Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn-delete-task';
      deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
      deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      `;

      // Delete task click listener
      deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteTask(task.id);
      });

      li.appendChild(leftDiv);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });

    // Update Counter Statistics
    updateTaskCounters();
  }

  /**
   * Update task count indicators
   */
  function updateTaskCounters() {
    const total = tasks.length;
    const completed = tasks.filter(function (t) { return t.completed; }).length;
    const pending = total - completed;

    if (totalCountEl) totalCountEl.textContent = total;
    if (completedCountEl) completedCountEl.textContent = completed;
    if (pendingCountEl) pendingCountEl.textContent = pending;
  }

  /**
   * Add a new task
   */
  function handleAddTask() {
    const text = todoInput.value.trim();

    if (text === '') {
      todoInput.classList.add('is-invalid');
      todoInputError.textContent = 'Please enter a task description.';
      todoInputError.style.display = 'block';
      todoInput.focus();
      return;
    }

    // Reset error
    todoInput.classList.remove('is-invalid');
    todoInputError.textContent = '';
    todoInputError.style.display = 'none';

    // Create new task object
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    tasks.unshift(newTask); // Add to top
    todoInput.value = '';
    todoInput.focus();

    // Re-render
    renderTasks();
  }

  /**
   * Toggle task completion state
   */
  function toggleTaskCompletion(id) {
    tasks = tasks.map(function (task) {
      if (task.id === id) {
        return Object.assign({}, task, { completed: !task.completed });
      }
      return task;
    });
    renderTasks();
  }

  /**
   * Delete task by ID with fade out
   */
  function deleteTask(id) {
    const taskItem = document.querySelector(`.todo-item[data-id="${id}"]`);
    if (taskItem) {
      taskItem.style.transition = 'all 0.25s ease';
      taskItem.style.opacity = '0';
      taskItem.style.transform = 'translateX(20px)';
      setTimeout(function () {
        tasks = tasks.filter(function (t) { return t.id !== id; });
        renderTasks();
      }, 250);
    } else {
      tasks = tasks.filter(function (t) { return t.id !== id; });
      renderTasks();
    }
  }

  /**
   * Clear completed tasks
   */
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', function () {
      tasks = tasks.filter(function (t) { return !t.completed; });
      renderTasks();
    });
  }

  // Add Task Button Click
  if (addTodoBtn) {
    addTodoBtn.addEventListener('click', handleAddTask);
  }

  // Add Task on Enter Key
  if (todoInput) {
    todoInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTask();
      }
    });

    todoInput.addEventListener('input', function () {
      if (todoInput.value.trim() !== '') {
        todoInput.classList.remove('is-invalid');
        todoInputError.textContent = '';
        todoInputError.style.display = 'none';
      }
    });
  }

  // Filter Tabs Event Listeners
  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter') || 'all';
      renderTasks();
    });
  });

  // Initial task list render
  renderTasks();

  console.log('✅ Intermediate Web Development (Task 2): script.js loaded and initialized.');
});
