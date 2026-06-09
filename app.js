document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Mobile Menu Navigation
    // ==========================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on resize if desktop size reached
    window.addEventListener('resize', () => {
        if (window.innerWidth > 868 && mobileNavOverlay.classList.contains('active')) {
            toggleMenu();
        }
    });

    // ==========================================
    // 2. Modal Popup Contact Form
    // ==========================================
    const modal = document.getElementById('contact-modal');
    const triggerButtons = document.querySelectorAll('.trigger-popup');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const successCloseBtn = document.getElementById('success-close-btn');
    const applicationForm = document.getElementById('application-form');
    const successState = document.getElementById('modal-success-msg');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form and success state after animation finishes
        setTimeout(() => {
            if (applicationForm && successState) {
                applicationForm.style.display = 'flex';
                successState.style.display = 'none';
                applicationForm.reset();
            }
        }, 300);
    }

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', closeModal);
    }

    // Close on background click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Handle form submission simulation and backend call
    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-form-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            const clientPhone = document.getElementById('client-phone').value;
            const clientDesc = document.getElementById('client-desc').value;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Изпращане на кандидатурата... <i class="fas fa-spinner fa-spin"></i>';
            
            fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: clientPhone,
                    description: clientDesc
                })
            }).then(() => {
                applicationForm.style.display = 'none';
                successState.style.display = 'flex';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }).catch(err => {
                console.error('Fetch error, falling back to success display:', err);
                applicationForm.style.display = 'none';
                successState.style.display = 'flex';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }

    // ==========================================
    // 2b. Leave Review Modal Form
    // ==========================================
    const reviewModal = document.getElementById('review-modal');
    const leaveReviewBtn = document.getElementById('leave-review-btn');
    const closeReviewModalBtn = document.getElementById('close-review-modal-btn');
    const reviewSuccessCloseBtn = document.getElementById('review-success-close-btn');
    const reviewForm = document.getElementById('review-form');
    const reviewSuccessState = document.getElementById('review-success-msg');
    const reviewPhotoInput = document.getElementById('review-photo');
    const fileChosenText = document.getElementById('file-chosen-text');

    function openReviewModal() {
        if (reviewModal) {
            reviewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeReviewModal() {
        if (reviewModal) {
            reviewModal.classList.remove('active');
            document.body.style.overflow = '';
            // Reset form and success state after animation finishes
            setTimeout(() => {
                if (reviewForm && reviewSuccessState) {
                    reviewForm.style.display = 'flex';
                    reviewSuccessState.style.display = 'none';
                    reviewForm.reset();
                    if (fileChosenText) {
                        fileChosenText.textContent = 'Няма избрана снимка';
                    }
                }
            }, 300);
        }
    }

    if (leaveReviewBtn) {
        leaveReviewBtn.addEventListener('click', openReviewModal);
    }

    if (closeReviewModalBtn) {
        closeReviewModalBtn.addEventListener('click', closeReviewModal);
    }

    if (reviewSuccessCloseBtn) {
        reviewSuccessCloseBtn.addEventListener('click', closeReviewModal);
    }

    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                closeReviewModal();
            }
        });
    }

    if (reviewPhotoInput && fileChosenText) {
        reviewPhotoInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileChosenText.textContent = `Избран файл: ${this.files[0].name}`;
            } else {
                fileChosenText.textContent = 'Няма избрана снимка';
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-review-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Изпращане... <i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                reviewForm.style.display = 'none';
                reviewSuccessState.style.display = 'flex';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1000);
        });
    }

    // ==========================================
    // 3. Interactive Chatbot Simulator
    // ==========================================
    const chatMessages = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options-container');

    // Chatbot logic structure
    const chatFlow = {
        // First Choice Responses
        repairs: {
            text: "Ремонтните дейности (вътрешни ремонти, покриви и др.) са изключително конкурентен пазар. За да ви намерим добри обекти, е много важно да се разграничите от нискобюджетната конкуренция. Имате ли работещ сайт в момента?",
            options: [
                { text: "Нямам сайт (нов бизнес сме)", next: "complete_cta" },
                { text: "Имам сайт, но не носи клиенти", next: "complete_cta" }
            ]
        },
        build: {
            text: "Строителството и грубият строеж са високобюджетни проекти с голяма печалба. Нашата система помага да филтрирате случайните хора и да достигнете до сериозни инвеститори. Готови ли сте да инвестирате рекламен бюджет от поне 400 € (782 лв.) на месец директно към Facebook?",
            options: [
                { text: "Да, готови сме с този бюджет", next: "complete_cta" },
                { text: "Не сме сигурни, искаме консултация", next: "complete_cta" }
            ]
        },
        solar: {
            text: "Соларните инсталации са изключително бързо развиващ се пазар с висок марж. За да си гарантирате постоянни запитвания за фотоволтаици, е важно да достигнете до собственици на къщи и производствени обекти. Имате ли готовност да поемете нови инсталации през следващите 2 седмици?",
            options: [
                { text: "Да, имаме свободен капацитет веднага", next: "complete_cta" },
                { text: "Проучваме възможностите за следващия месец", next: "complete_cta" }
            ]
        },
        other: {
            text: "Разбирам. Ние работим с различни специализирани монтажни и ремонтни услуги. За да изградим работеща система за вас, е важно да се разграничим от евтината конкуренция. Работите ли предимно с частни клиенти или с фирми (B2B)?",
            options: [
                { text: "Основно с частни клиенти", next: "complete_cta" },
                { text: "Основно с фирми (B2B)", next: "complete_cta" },
                { text: "И с двете групи", next: "complete_cta" }
            ]
        },
        
        // Final Call to Action
        complete_cta: {
            text: "Разбрах. Изглежда, че нашата система е точно това, от което се нуждаете, за да напълните графика си. Тъй като работим само с 2 нови бизнеса на месец и правим всичко сами, е необходимо да попълните кратко запитване за подбор.",
            options: [
                { text: "Кандидатствай за подбор сега 🚀", action: "trigger_form" }
            ]
        }
    };

    function appendMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = text;
        
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'chat-message bot typing-indicator';
        indicatorDiv.id = 'typing-indicator';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        
        indicatorDiv.appendChild(bubble);
        chatMessages.appendChild(indicatorDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function handleOptionClick(option) {
        // 1. Clear options UI
        optionsContainer.innerHTML = '';
        
        // 2. Add User message
        appendMessage(option.text, true);
        
        // 3. Show typing indicator
        setTimeout(() => {
            appendTypingIndicator();
            
            // 4. Load next step
            setTimeout(() => {
                removeTypingIndicator();
                
                if (option.action === 'trigger_form') {
                    // Trigger the popup modal directly
                    openModal();
                    // Reset chatbot options back to start so they can play again
                    resetChatbot();
                } else {
                    const stepData = chatFlow[option.next];
                    if (stepData) {
                        appendMessage(stepData.text);
                        renderOptions(stepData.options);
                    }
                }
            }, 1000);
        }, 400);
    }

    function renderOptions(optionsList) {
        optionsContainer.innerHTML = '';
        optionsList.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.innerHTML = opt.text;
            btn.addEventListener('click', () => {
                handleOptionClick(opt);
            });
            optionsContainer.appendChild(btn);
        });
    }

    function resetChatbot() {
        chatMessages.innerHTML = `
            <div class="chat-message bot">
                <div class="message-bubble">
                    Здравейте! Аз съм вашият дигитален асистент. Каква ремонтна услуга ви интересува днес?
                </div>
            </div>
        `;
        renderOptions([
            { text: "Ремонтни дейности", next: "repairs" },
            { text: "Строителство", next: "build" },
            { text: "Соларни инсталации", next: "solar" },
            { text: "Друго", next: "other" }
        ]);
    }

    // Set up initial options click events
    const initialButtons = document.querySelectorAll('.chat-option-btn');
    initialButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextKey = this.getAttribute('data-next');
            const optionText = this.textContent;
            handleOptionClick({ text: optionText, next: nextKey });
        });
    });

    // Add CSS styling rules for typing indicator dynamically if needed
    const style = document.createElement('style');
    style.innerHTML = `
        .typing-indicator {
            display: flex;
            align-items: center;
        }
        .typing-dot {
            height: 8px;
            width: 8px;
            float: left;
            margin: 0 1px;
            background-color: var(--color-gray-dark);
            border-radius: 50%;
            opacity: 0.4;
            animation: typingGlow 1.4s infinite both;
        }
        .typing-dot:nth-child(2) {
            animation-delay: .2s;
        }
        .typing-dot:nth-child(3) {
            animation-delay: .4s;
        }
        @keyframes typingGlow {
            0% { opacity: .4; }
            20% { opacity: 1; }
            100% { opacity: .4; }
        }
        body.no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 4. FAQ Accordion Toggle
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

});
