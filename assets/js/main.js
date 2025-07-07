// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav').classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav ul li a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav').classList.remove('active');
    });
});

// Chatbot Toggle
const chatbotIcon = document.querySelector('.chatbot-icon');
const chatbotWindow = document.querySelector('.chatbot-window');
const closeChatbot = document.querySelector('.close-chatbot');

chatbotIcon.addEventListener('click', function() {
    chatbotWindow.style.display = 'flex';
});

closeChatbot.addEventListener('click', function() {
    chatbotWindow.style.display = 'none';
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    console.log('forms: ', forms);
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            console.log('formData: ', formData);
            
            // Send data via AJAX
            const baseUrl = 'http://localhost:3000';
            const endpoint = this.id === 'application-form' ? '/api/apply' : '/api/contact';
            fetch(baseUrl + endpoint, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('data: ', data);
                const messageBox = document.getElementById('form-message');
                if (data.success) {
                    if (messageBox) {
                        messageBox.textContent = 'Thank you for your submission! We will get back to you soon.';
                        messageBox.style.color = 'green';
                        messageBox.style.display = 'block';
                    }
                    this.reset();
                    // Close modal if it's an application form
                    if (this.id === 'application-form') {
                        document.getElementById('application-modal').style.display = 'none';
                    }
                } else {
                    if (messageBox) {
                        messageBox.textContent = 'There was an error submitting your form. Please try again.';
                        messageBox.style.color = 'red';
                        messageBox.style.display = 'block';
                    }
                }
            })
            .catch(async error => {
                // Try to get backend error response if available
                if (error.response) {
                    const text = await error.response.text();
                    console.error('Backend error response:', text);
                }
                console.error('Error:', error);
            });
        });
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     const forms = document.querySelectorAll('form');
    
//     forms.forEach(form => {
//         form.addEventListener('submit', function(e) {
//             e.preventDefault();
            
//             // Get form data
//             const formData = new FormData(this);
            
//             // Local development settings
//             const baseUrl = 'http://localhost:3000';
//             console.log("this.id: ", this.id);
//             const endpoint = this.id === 'application-form' ? '/api/apply' : '/api/contact';
//             console.log('endpoint: ', endpoint);
            
//             console.log('Submitting to:', baseUrl + endpoint);
            
//             fetch(baseUrl + endpoint, {
//                 method: 'POST',
//                 body: formData
//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Success:', data);
//                 alert(data.message || 'Thank you for your submission!');
//                 this.reset();
                
//                 if (this.id === 'application-form') {
//                     document.getElementById('application-modal').style.display = 'none';
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 alert(`Error: ${error.message || 'Failed to submit form'}`);
//             });
//         });
//     });
// });

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Active nav link based on scroll position
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav ul li a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(sectionId)) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Modal handling
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    const modal = document.getElementById('application-modal');
    
    // Get all buttons that should open the modal
    const btns = document.querySelectorAll('.open-modal');
    
    // Get the <span> element that closes the modal
    const closeBtn = document.querySelector('.close-modal');
    
    // When the user clicks on a button, open the modal
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'block';
            // If position was specified in the button, set it in the form
            const position = this.getAttribute('data-position');
            if (position) {
                document.getElementById('position').value = position;
            }
        });
    });
    
    // When the user clicks on <span> (x), close the modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});