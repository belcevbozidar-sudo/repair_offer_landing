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

    // Handle form submission simulation
    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-form-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Изпращане на кандидатурата... <i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate API request delay
            setTimeout(() => {
                applicationForm.style.display = 'none';
                successState.style.display = 'flex';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1200);
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
        roof: {
            text: "Чудесно! Нашите ремонтни бизнеси в този сектор получават средно между 12 и 18 реални запитвания за покриви още през първия месец от рекламите. Имате ли готов сайт в момента?",
            options: [
                { text: "Нямам сайт (нов бизнес сме)", next: "complete_cta" },
                { text: "Имам стар сайт, но не носи клиенти", next: "complete_cta" }
            ]
        },
        interior: {
            text: "Вътрешните ремонти (боядисване, гипскартон, шпакловка) са силен пазар. За да ви намерим добри обекти, е много важно да се разграничите от нискобюджетната конкуренция. В кой град работите предимно?",
            options: [
                { text: "София и околността", next: "complete_cta" },
                { text: "Пловдив, Варна или Бургас", next: "complete_cta" },
                { text: "Друго населено място", next: "complete_cta" }
            ]
        },
        build: {
            text: "Грубият строеж и цялостното строителство са високобюджетни проекти. Чрез рекламата филтрираме несериозните клиенти. Готови ли сте да инвестирате рекламен бюджет от поне 400 € на месец директно към Facebook?",
            options: [
                { text: "Да, готови сме с този бюджет", next: "complete_cta" },
                { text: "Не сме сигурни, искаме консултация", next: "complete_cta" }
            ]
        },
        other: {
            text: "Разбирам. Ние работим с различни специализирани услуги (ВиК, Електро, Отопление, Озеленяване). Имате ли готовност да поемете нови обекти през следващите 2 седмици?",
            options: [
                { text: "Да, имаме свободен капацитет веднага", next: "complete_cta" },
                { text: "Проучваме възможностите за следващия месец", next: "complete_cta" }
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
            { text: "Ремонт на покриви", next: "roof" },
            { text: "Вътрешни ремонти (боя, гипскартон)", next: "interior" },
            { text: "Цялостно строителство / груб строеж", next: "build" },
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

});
