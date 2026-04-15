(function () {
    'use strict';

    // ===== Mobile Nav Toggle =====
    var mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function (e) {
            e.preventDefault();
            document.body.classList.toggle('mobile-nav-active');
            this.classList.toggle('active');
            
            // Toggle overlay
            var overlay = document.getElementById('mobile-body-overly');
            if (overlay) {
                if (document.body.classList.contains('mobile-nav-active')) {
                    overlay.classList.add('show');
                } else {
                    overlay.classList.remove('show');
                }
            }
        });
    }

    var mobileBodyOverly = document.getElementById('mobile-body-overly');
    if (mobileBodyOverly) {
        mobileBodyOverly.addEventListener('click', function () {
            document.body.classList.remove('mobile-nav-active');
            var toggle = document.getElementById('mobile-nav-toggle');
            if (toggle) toggle.classList.remove('active');
            this.classList.remove('show');
        });
    }

    // ===== Sticky Nav on Scroll =====
    var nav = document.getElementById('nav');
    if (nav) {
        var lastScroll = 0;
        window.addEventListener('scroll', function () {
            var currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.classList.add('header-scrolled');
            } else {
                nav.classList.remove('header-scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    // ===== Back to Top =====
    var backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Active Nav Link Highlight =====
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.parentElement.classList.add('menu-active');
        } else {
            link.parentElement.classList.remove('menu-active');
        }
    });

    // ===== Smooth Scroll for In-Page Links =====
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ===== Equipment Filter =====
    var filterButtons = document.querySelectorAll('.filter-btn');
    var equipmentCards = document.querySelectorAll('.equipment-card');

    if (filterButtons.length && equipmentCards.length) {
        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var filter = this.getAttribute('data-filter');

                filterButtons.forEach(function (btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                equipmentCards.forEach(function (card) {
                    var categories = card.getAttribute('data-category');
                    if (filter === 'all' || categories.indexOf(filter) !== -1) {
                        card.style.display = 'block';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    }
                });
            });
        });
    }

    // ===== Floating WhatsApp Widget =====
    function initWhatsAppWidget() {
        if (document.getElementById('whatsapp-widget')) return;

        var widgetHTML = '<div id="whatsapp-widget">' +
            '<div class="whatsapp-popup" id="whatsapp-popup">' +
                '<div class="whatsapp-header">' +
                    '<div class="header-info">' +
                        '<div class="agent-avatar"><i class="fa fa-headset"></i></div>' +
                        '<div class="agent-details">' +
                            '<h4>Aromansa Support</h4>' +
                            '<span class="status-badge"><i class="fa fa-circle"></i> Online</span>' +
                        '</div>' +
                    '</div>' +
                    '<button class="close-popup" id="close-whatsapp" aria-label="Close chat">' +
                        '<i class="fa fa-times"></i>' +
                    '</button>' +
                '</div>' +
                '<div class="whatsapp-body">' +
                    '<div class="chat-message">' +
                        '<div class="message-bubble">' +
                            '<p>Hello! Welcome to Aromansa support.</p>' +
                            '<p>Need help choosing the right essential oils?</p>' +
                            '<ul>' +
                                '<li>Product recommendations</li>' +
                                '<li>Usage and safety guidance</li>' +
                                '<li>Order and delivery support</li>' +
                            '</ul>' +
                            '<span class="message-time">Just now</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="whatsapp-footer">' +
                    '<div class="shop-platforms">' +
                        '<a href="https://shopee.co.id/aromansa_id" target="_blank" rel="noopener noreferrer" class="platform-btn shopee">' +
                            '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png" alt="Shopee" class="platform-logo">' +
                            '<span class="platform-text">Shop on Shopee</span>' +
                            '<i class="fa fa-external-link-alt"></i>' +
                        '</a>' +
                        '<a href="https://www.tokopedia.com/aromansa" target="_blank" rel="noopener noreferrer" class="platform-btn tokopedia">' +
                            '<img src="https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/production/50438c64/tokopedia-logo.png" alt="Tokopedia" class="platform-logo">' +
                            '<span class="platform-text">Shop on Tokopedia</span>' +
                            '<i class="fa fa-external-link-alt"></i>' +
                        '</a>' +
                        '<a href="https://wa.me/6285782909266?text=Hi%20Aromansa!%20I%27m%20interested%20in%20your%20essential%20oils%20products." target="_blank" rel="noopener noreferrer" class="platform-btn whatsapp">' +
                            '<i class="fab fa-whatsapp platform-icon"></i>' +
                            '<span class="platform-text">Chat on WhatsApp</span>' +
                            '<i class="fa fa-external-link-alt"></i>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="ai-mini-popup" id="ai-popup">' +
                '<a href="ai-personalization.html" class="mini-ai-btn" aria-label="Open AI Consultant">' +
                    '<i class="fa fa-robot"></i>' +
                    '<span>AI Consultant</span>' +
                '</a>' +
            '</div>' +
            '<button class="ai-float-btn" id="ai-btn" aria-label="AI Personalization">' +
                '<span class="notification-badge"></span>' +
                '<i class="fa fa-robot"></i>' +
                '<span class="tooltip-text">AI Personalization</span>' +
            '</button>' +
            '<div class="marketplace-mini-popup" id="marketplace-popup">' +
                '<a href="https://shopee.co.id/aromansa_id" target="_blank" rel="noopener noreferrer" class="mini-market-btn shopee" aria-label="Shop on Shopee">' +
                    '<i class="fa fa-shopping-bag"></i>' +
                    '<span>Shopee</span>' +
                '</a>' +
                '<a href="https://www.tokopedia.com/aromansa" target="_blank" rel="noopener noreferrer" class="mini-market-btn tokopedia" aria-label="Shop on Tokopedia">' +
                    '<i class="fa fa-store"></i>' +
                    '<span>Tokopedia</span>' +
                '</a>' +
            '</div>' +
            '<button class="marketplace-float-btn" id="marketplace-btn" aria-label="Marketplace links">' +
                '<i class="fa fa-store"></i>' +
                '<span class="tooltip-text">Marketplace</span>' +
            '</button>' +
            '<button class="whatsapp-float-btn" id="whatsapp-btn" aria-label="Chat with us">' +
                '<i class="fab fa-whatsapp"></i>' +
                '<span class="tooltip-text">Shop with us!</span>' +
            '</button>' +
        '</div>';

        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        var whatsappBtn = document.getElementById('whatsapp-btn');
        var whatsappPopup = document.getElementById('whatsapp-popup');
        var closeBtn = document.getElementById('close-whatsapp');
        var aiBtn = document.getElementById('ai-btn');
        var aiPopup = document.getElementById('ai-popup');
        var marketplaceBtn = document.getElementById('marketplace-btn');
        var marketplacePopup = document.getElementById('marketplace-popup');

        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                whatsappPopup.classList.toggle('show');
                if (aiPopup) aiPopup.classList.remove('show');
                if (marketplacePopup) marketplacePopup.classList.remove('show');
                if (aiBtn) {
                    var badge = aiBtn.querySelector('.notification-badge');
                    if (badge) badge.style.display = 'none';
                }
            });
        }

        if (aiBtn && aiPopup) {
            aiBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                aiPopup.classList.toggle('show');
                if (marketplacePopup) marketplacePopup.classList.remove('show');
                whatsappPopup.classList.remove('show');
            });
        }

        if (marketplaceBtn && marketplacePopup) {
            marketplaceBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                marketplacePopup.classList.toggle('show');
                if (aiPopup) aiPopup.classList.remove('show');
                whatsappPopup.classList.remove('show');
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                whatsappPopup.classList.remove('show');
            });
        }

        document.addEventListener('click', function(e) {
            if (!e.target.closest('#whatsapp-widget')) {
                whatsappPopup.classList.remove('show');
                if (aiPopup) aiPopup.classList.remove('show');
                if (marketplacePopup) marketplacePopup.classList.remove('show');
            }
        });
    }

    initWhatsAppWidget();

    // ===== Gallery Slideshow =====
    function initGallerySlideshow() {
        const slides = document.querySelectorAll('.gallery-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        let currentSlide = 0;
        let slideshowInterval;

        if (slides.length === 0) return;

        // Go to slide
        function goToSlide(index) {
            // Remove active from current
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            // Update index
            currentSlide = (index + slides.length) % slides.length;

            // Add active to new
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        // Next slide
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        // Previous slide
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Start autoplay
        function startAutoplay() {
            slideshowInterval = setInterval(nextSlide, 5000);
        }

        // Stop autoplay
        function stopAutoplay() {
            clearInterval(slideshowInterval);
        }

        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                stopAutoplay();
                nextSlide();
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                stopAutoplay();
                prevSlide();
                startAutoplay();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                stopAutoplay();
                goToSlide(index);
                startAutoplay();
            });
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        const container = document.querySelector('.slideshow-container');

        if (container) {
            container.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoplay();
            }, { passive: true });

            container.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoplay();
            }, { passive: true });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                nextSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                prevSlide();
            }
        }

        // Start autoplay
        startAutoplay();

        // Pause on hover
        if (container) {
            container.addEventListener('mouseenter', stopAutoplay);
            container.addEventListener('mouseleave', startAutoplay);
        }
    }

    initGallerySlideshow();

    // ===== Aromansa Story Slideshow =====
    function initStorySlideshow() {
        const slides = document.querySelectorAll('.story-slide');
        const dots = document.querySelectorAll('.story-dot');
        const prevBtn = document.querySelector('.story-prev');
        const nextBtn = document.querySelector('.story-next');
        const progressBar = document.querySelector('.story-progress-bar');
        let currentSlide = 0;
        let slideshowInterval;
        let progressInterval;
        const slideDuration = 6000; // 6 seconds per slide
        const progressStep = 100 / (slideDuration / 50); // Update every 50ms

        if (slides.length === 0) return;

        // Go to slide
        function goToSlide(index) {
            // Remove active from current
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            // Update index
            currentSlide = (index + slides.length) % slides.length;

            // Add active to new
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            // Reset progress
            resetProgress();
        }

        // Next slide
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        // Previous slide
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Progress bar animation
        function resetProgress() {
            clearInterval(progressInterval);
            let progress = 0;
            progressBar.style.width = '0%';
            
            progressInterval = setInterval(function() {
                progress += progressStep;
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 50);
        }

        // Start autoplay
        function startAutoplay() {
            resetProgress();
            slideshowInterval = setInterval(nextSlide, slideDuration);
        }

        // Stop autoplay
        function stopAutoplay() {
            clearInterval(slideshowInterval);
            clearInterval(progressInterval);
        }

        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                stopAutoplay();
                nextSlide();
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                stopAutoplay();
                prevSlide();
                startAutoplay();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                stopAutoplay();
                goToSlide(index);
                startAutoplay();
            });
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        const container = document.querySelector('.story-slideshow');

        if (container) {
            container.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoplay();
            }, { passive: true });

            container.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoplay();
            }, { passive: true });

            // Pause on hover
            container.addEventListener('mouseenter', stopAutoplay);
            container.addEventListener('mouseleave', startAutoplay);
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                nextSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                prevSlide();
            }
        }

        // Start autoplay
        startAutoplay();
    }

    initStorySlideshow();

    // ===== Journey Tabs (Story + Timeline) =====
    function initJourneyTabs() {
        const tabs = document.querySelectorAll('.journey-tab');
        const contents = document.querySelectorAll('.journey-content');
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineProgress = document.querySelector('.timeline-line-progress');

        if (tabs.length === 0) return;

        // Tab switching
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');

                // Remove active from all tabs
                tabs.forEach(function(t) { t.classList.remove('active'); });
                contents.forEach(function(c) { 
                    c.classList.remove('active'); 
                    c.style.opacity = '0';
                    c.style.transform = 'translateY(20px)';
                });

                // Add active to clicked tab
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab + '-tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                    // Trigger reflow for animation
                    setTimeout(function() {
                        targetContent.style.opacity = '1';
                        targetContent.style.transform = 'translateY(0)';
                    }, 50);
                }

                // If timeline tab, trigger scroll animation
                if (targetTab === 'timeline') {
                    setTimeout(animateTimeline, 100);
                }
            });
        });

        // Timeline scroll animation
        function animateTimeline() {
            const container = document.querySelector('.timeline-container');
            if (!container) return;

            timelineItems.forEach(function(item, index) {
                setTimeout(function() {
                    item.classList.add('visible');
                    // Update progress line
                    if (timelineProgress) {
                        const progress = ((index + 1) / timelineItems.length) * 100;
                        timelineProgress.style.height = progress + '%';
                    }
                }, index * 200);
            });
        }

        // Initial animation if timeline is visible on load
        const activeTimeline = document.querySelector('#timeline-tab.active');
        if (activeTimeline) {
            animateTimeline();
        }
    }

    initJourneyTabs();

    // ===== Games Modal =====
    function initGames() {
        var gamesModal = document.getElementById('gamesModal');
        var gamesOverlay = document.getElementById('gamesOverlay');
        var gamesClose = document.getElementById('gamesClose');
        var gameLinks = document.querySelectorAll('.game-link');
        var eventSimulator = document.getElementById('eventSimulator');
        var memoryGame = document.getElementById('memoryGame');

        function openModal(gameType) {
            if (gamesModal) {
                gamesModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Show/hide games based on selection
                if (gameType === 'event-simulator') {
                    eventSimulator.style.display = 'flex';
                    memoryGame.style.display = 'none';
                } else if (gameType === 'memory-game') {
                    eventSimulator.style.display = 'none';
                    memoryGame.style.display = 'flex';
                    initMemoryGame();
                }
            }
        }

        function closeModal() {
            if (gamesModal) {
                gamesModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Game link clicks
        if (gameLinks) {
            gameLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    var gameType = this.getAttribute('data-game');
                    openModal(gameType);
                });
            });
        }

        // Close button
        if (gamesClose) {
            gamesClose.addEventListener('click', closeModal);
        }

        // Overlay click
        if (gamesOverlay) {
            gamesOverlay.addEventListener('click', closeModal);
        }

        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    initGames();

    // ===== Event Simulator =====
    function initEventSimulator() {
        var checkboxes = document.querySelectorAll('.sim-checkbox');
        var totalElement = document.getElementById('simulatorTotal');
        var resetButton = document.getElementById('resetSimulator');

        function formatRupiah(amount) {
            return 'Rp ' + amount.toLocaleString('id-ID');
        }

        function updateTotal() {
            var total = 0;
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    total += parseInt(checkbox.getAttribute('data-price'));
                }
            });
            if (totalElement) {
                totalElement.textContent = formatRupiah(total);
            }
        }

        // Checkbox changes
        if (checkboxes) {
            checkboxes.forEach(function(checkbox) {
                checkbox.addEventListener('change', updateTotal);
            });
        }

        // Reset button
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                checkboxes.forEach(function(checkbox) {
                    checkbox.checked = false;
                });
                updateTotal();
            });
        }
    }

    initEventSimulator();

    // ===== Memory Card Game =====
    var memoryGameInitialized = false;
    function initMemoryGame() {
        if (memoryGameInitialized) return;
        
        var memoryGrid = document.getElementById('memoryGrid');
        var movesElement = document.getElementById('memoryMoves');
        var pairsElement = document.getElementById('memoryPairs');
        var timeElement = document.getElementById('memoryTime');
        var resetButton = document.getElementById('resetMemory');

        if (!memoryGrid) return;

        memoryGameInitialized = true;

        var cards = [
            { emoji: '🔊', name: 'Speaker' },
            { emoji: '🎤', name: 'Microphone' },
            { emoji: '💡', name: 'Light' },
            { emoji: '⛺', name: 'Tent' },
            { emoji: '🎸', name: 'Guitar' },
            { emoji: '📸', name: 'Camera' },
            { emoji: '🪑', name: 'Chair' },
            { emoji: '🎉', name: 'Party' }
        ];

        var gameCards = [];
        cards.forEach(function(card) {
            gameCards.push({ ...card });
            gameCards.push({ ...card });
        });

        // Shuffle cards
        for (var i = gameCards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = gameCards[i];
            gameCards[i] = gameCards[j];
            gameCards[j] = temp;
        }

        // Game state
        var flippedCards = [];
        var matchedPairs = 0;
        var moves = 0;
        var gameStarted = false;
        var timerInterval = null;
        var seconds = 0;

        function createCard(card, index) {
            var cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.setAttribute('data-name', card.name);
            cardElement.setAttribute('data-index', index);

            cardElement.innerHTML = 
                '<div class="memory-card-inner">' +
                    '<div class="memory-card-front">?</div>' +
                    '<div class="memory-card-back">' + card.emoji + '</div>' +
                '</div>';

            cardElement.addEventListener('click', function() {
                if (flippedCards.length >= 2) return;
                if (this.classList.contains('flipped')) return;
                if (this.classList.contains('matched')) return;

                if (!gameStarted) {
                    gameStarted = true;
                    startTimer();
                }

                this.classList.add('flipped');
                flippedCards.push(this);

                if (flippedCards.length === 2) {
                    moves++;
                    if (movesElement) {
                        movesElement.textContent = moves;
                    }
                    checkMatch();
                }
            });

            return cardElement;
        }

        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            seconds = 0;
            timerInterval = setInterval(function() {
                seconds++;
                var minutes = Math.floor(seconds / 60);
                var secs = seconds % 60;
                if (timeElement) {
                    timeElement.textContent = minutes + ':' + (secs < 10 ? '0' : '') + secs;
                }
            }, 1000);
        }

        function checkMatch() {
            var card1 = flippedCards[0];
            var card2 = flippedCards[1];
            var name1 = card1.getAttribute('data-name');
            var name2 = card2.getAttribute('data-name');

            if (name1 === name2) {
                setTimeout(function() {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matchedPairs++;
                    if (pairsElement) {
                        pairsElement.textContent = matchedPairs + '/8';
                    }
                    flippedCards = [];

                    if (matchedPairs === 8) {
                        clearInterval(timerInterval);
                        setTimeout(function() {
                            alert('🎉 Congratulations! You won in ' + moves + ' moves!');
                        }, 500);
                    }
                }, 500);
            } else {
                setTimeout(function() {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }

        // Build grid
        memoryGrid.innerHTML = '';
        gameCards.forEach(function(card, index) {
            memoryGrid.appendChild(createCard(card, index));
        });

        // Reset button
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                memoryGameInitialized = false;
                if (timerInterval) clearInterval(timerInterval);
                if (movesElement) movesElement.textContent = '0';
                if (pairsElement) pairsElement.textContent = '0/8';
                if (timeElement) timeElement.textContent = '0:00';
                initMemoryGame();
            });
        }
    }

    // ===== Simple Typewriter Effect =====
    function initTypewriter() {
        var textElement = document.getElementById('typewriterTextSimple');
        if (!textElement) return;

        var words = [
            { text: 'Essential Oils', emoji: '🌿' },
            { text: 'Lavender', emoji: '💜' },
            { text: 'Ylang-Ylang', emoji: '🌸' },
            { text: 'Peppermint', emoji: '🌱' },
            { text: 'Sweet Orange', emoji: '🍊' },
            { text: 'Frangipani', emoji: '🌺' },
            { text: 'Lemon', emoji: '🍋' },
            { text: 'Palmarosa', emoji: '🌾' },
            { text: 'Lemongrass', emoji: '🍃' },
            { text: 'Spearmint', emoji: '🌿' },
            { text: 'Eucalyptus', emoji: '💨' },
            { text: 'Roll-On', emoji: '💧' },
            { text: 'Spray', emoji: '✨' }
        ];
        var currentWordIndex = 0;
        var currentCharIndex = 0;
        var isDeleting = false;

        function type() {
            var currentEntry = words[currentWordIndex];
            var currentWord = currentEntry.text;
            var currentEmoji = currentEntry.emoji;

            if (isDeleting) {
                currentCharIndex--;
                textElement.innerHTML = currentWord.substring(0, currentCharIndex) + '<span class="typewriter-cursor">|</span>';

                if (currentCharIndex === 0) {
                    isDeleting = false;
                    currentWordIndex = (currentWordIndex + 1) % words.length;
                    setTimeout(type, 500);
                } else {
                    setTimeout(type, 40);
                }
            } else {
                currentCharIndex++;
                var typedText = currentWord.substring(0, currentCharIndex);
                var emojiHTML = currentCharIndex === currentWord.length ? ' <span class="typewriter-emoji">' + currentEmoji + '</span>' : '';
                textElement.innerHTML = typedText + emojiHTML + '<span class="typewriter-cursor">|</span>';

                if (currentCharIndex === currentWord.length) {
                    isDeleting = true;
                    setTimeout(type, 2500);
                } else {
                    setTimeout(type, 100);
                }
            }
        }

        setTimeout(type, 1000);
    }

    initTypewriter();

    // ===== Counter Animation =====
    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-target'));
        var duration = 1500;
        var increment = target / (duration / 16);
        var current = 0;

        function updateCounter() {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        updateCounter();
    }

    // Intersection Observer for counters
    var statsSection = document.querySelector('.stats-clean');
    if (statsSection) {
        var countersAnimated = false;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    var counters = document.querySelectorAll('.counter');
                    counters.forEach(function(counter) {
                        animateCounter(counter);
                    });
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // ===== Smooth Scroll for Anchor Links =====
    function initSmoothScroll() {
        var anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');
                if (targetId.length > 1 && document.querySelector(targetId)) {
                    e.preventDefault();
                    var target = document.querySelector(targetId);
                    var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initSmoothScroll();

    // ===== Instant Navbar Home Click =====
    function initNavbarHomeClick() {
        var homeLinks = document.querySelectorAll('.nav-menu a[href="index.html"], #mobile-nav a[href="index.html"]');
        homeLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                    e.preventDefault();
                    window.scrollTo(0, 0);
                }
            });
        });
    }

    initNavbarHomeClick();

    // ===== Story Tabs (Our Story & Journey) =====
    function initStoryTabs() {
        const tabs = document.querySelectorAll('.story-tab');
        const storyPanel = document.getElementById('storyPanel');
        const journeyPanel = document.getElementById('journeyPanel');
        
        if (tabs.length === 0) return;

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');

                // Remove active from all tabs
                tabs.forEach(function(t) { 
                    t.classList.remove('active'); 
                });

                // Add active to clicked tab
                this.classList.add('active');

                // Hide all panels
                if (storyPanel) {
                    storyPanel.classList.remove('active');
                }
                if (journeyPanel) {
                    journeyPanel.classList.remove('active');
                }

                // Show target panel
                if (targetTab === 'story' && storyPanel) {
                    setTimeout(function() {
                        storyPanel.classList.add('active');
                    }, 50);
                } else if (targetTab === 'journey' && journeyPanel) {
                    setTimeout(function() {
                        journeyPanel.classList.add('active');
                        // Trigger zigzag animation
                        setTimeout(animateZigzagTimeline, 100);
                    }, 50);
                }
            });
        });
    }

    initStoryTabs();

    // ===== Zigzag Timeline Scroll Animation =====
    function animateZigzagTimeline() {
        const zigzagItems = document.querySelectorAll('.zigzag-item');
        
        if (zigzagItems.length === 0) return;

        const zigzagTimeline = document.getElementById('zigzagTimeline');
        if (!zigzagTimeline) return;

        var timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        zigzagItems.forEach(function(item, index) {
            setTimeout(function() {
                timelineObserver.observe(item);
            }, index * 100);
        });
    }

    // Initial animation for journey panel if active
    var journeyPanel = document.getElementById('journeyPanel');
    if (journeyPanel && journeyPanel.classList.contains('active')) {
        setTimeout(animateZigzagTimeline, 300);
    }

})();
