(function () {
    'use strict';

    // ===== Mobile Nav Toggle =====
    var mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function (e) {
            e.preventDefault();
            document.body.classList.toggle('mobile-nav-active');
            this.classList.toggle('active');
            this.setAttribute('aria-expanded', String(document.body.classList.contains('mobile-nav-active')));
            
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

    var mobileNavClose = document.querySelector('.mobile-nav-close');
    if (mobileNavClose && mobileNavToggle) {
        mobileNavClose.addEventListener('click', function () {
            mobileNavToggle.click();
        });
    }

    var mobileBodyOverly = document.getElementById('mobile-body-overly');
    if (mobileBodyOverly) {
        mobileBodyOverly.addEventListener('click', function () {
            document.body.classList.remove('mobile-nav-active');
            var toggle = document.getElementById('mobile-nav-toggle');
            if (toggle) {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
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

    // ===== Floating Quick Access Drop-Up Widget =====
    function initWhatsAppWidget() {
        if (document.getElementById('whatsapp-widget') || document.body.classList.contains('ar-mood-page')) return;

        var widgetHTML = '<div id="whatsapp-widget" class="aromansa-hub">' +
            '<!-- Drop-Up Menu Container -->' +
            '<div class="aromansa-dropup" id="aromansa-dropup" role="dialog" aria-modal="true" aria-label="Menu Layanan & Toko Aromansa">' +
                '<div class="aromansa-dropup-inner">' +
                    '<div class="aromansa-dropup-header">' +
                        '<div class="dropup-brand">' +
                            '<div class="dropup-avatar">' +
                                '<i class="fa fa-leaf"></i>' +
                                '<span class="online-indicator"></span>' +
                            '</div>' +
                            '<div class="dropup-brand-text">' +
                                '<h4>Layanan Aromansa</h4>' +
                                '<span class="dropup-subtitle"><i class="fa fa-circle"></i> Online · 08.00–20.00 WIB</span>' +
                            '</div>' +
                        '</div>' +
                        '<button type="button" class="dropup-close-btn" id="aromansa-dropup-close" aria-label="Tutup menu">' +
                            '<i class="fa fa-times"></i>' +
                        '</button>' +
                    '</div>' +
                    '<div class="aromansa-dropup-list">' +
                        '<a href="ai-personalization.html" class="dropup-action-item item-ai" id="dropup-item-ai">' +
                            '<div class="action-icon ai-icon">' +
                                '<i class="fa fa-leaf"></i>' +
                            '</div>' +
                            '<div class="action-content">' +
                                '<div class="action-title-row">' +
                                    '<span class="action-title">Konsultan Aromansa</span>' +
                                    '<span class="badge-quiz">AI Quiz</span>' +
                                '</div>' +
                                '<span class="action-desc">Rekomendasi aroma personal sesuai mood &amp; kebutuhan</span>' +
                            '</div>' +
                            '<div class="action-arrow">' +
                                '<i class="fa fa-chevron-right"></i>' +
                            '</div>' +
                        '</a>' +
                        '<a href="https://wa.me/6285782909266?text=Halo%20Aromansa%2C%20saya%20ingin%20konsultasi%20mengenai%20produk%20essential%20oil." target="_blank" rel="noopener noreferrer" class="dropup-action-item item-wa" id="dropup-item-wa">' +
                            '<div class="action-icon wa-icon">' +
                                '<i class="fab fa-whatsapp"></i>' +
                            '</div>' +
                            '<div class="action-content">' +
                                '<div class="action-title-row">' +
                                    '<span class="action-title">Chat CS WhatsApp</span>' +
                                    '<span class="badge-online">Fast Response</span>' +
                                '</div>' +
                                '<span class="action-desc">Konsultasi langsung dengan admin official Aromansa</span>' +
                            '</div>' +
                            '<div class="action-arrow">' +
                                '<i class="fa fa-chevron-right"></i>' +
                            '</div>' +
                        '</a>' +
                        '<div class="dropup-action-item item-market" id="dropup-item-market">' +
                            '<div class="action-icon market-icon">' +
                                '<i class="fa fa-store"></i>' +
                            '</div>' +
                            '<div class="action-content">' +
                                '<div class="action-title-row">' +
                                    '<span class="action-title">Toko Online Resmi</span>' +
                                '</div>' +
                                '<span class="action-desc">Beli produk original dengan promo marketplace:</span>' +
                                '<div class="market-quick-links">' +
                                    '<a href="https://shopee.co.id/aromansa_id" target="_blank" rel="noopener noreferrer" class="market-chip shopee" aria-label="Beli di Shopee">' +
                                        '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png" alt="Shopee">' +
                                        '<span>Shopee</span>' +
                                        '<i class="fa fa-external-link-alt"></i>' +
                                    '</a>' +
                                    '<a href="https://www.tokopedia.com/aromansa" target="_blank" rel="noopener noreferrer" class="market-chip tokopedia" aria-label="Beli di Tokopedia">' +
                                        '<img src="https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/production/50438c64/tokopedia-logo.png" alt="Tokopedia">' +
                                        '<span>Tokopedia</span>' +
                                        '<i class="fa fa-external-link-alt"></i>' +
                                    '</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="aromansa-dropup-footer">' +
                        '<i class="fa fa-check-circle"></i>' +
                        '<span>100% Pure Therapeutic Grade · Pengiriman Cianjur</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<!-- Single Main Circular Floating Button -->' +
            '<button type="button" class="aromansa-fab-trigger whatsapp-float-btn" id="aromansa-fab-btn" aria-expanded="false" aria-haspopup="true" aria-label="Buka menu layanan Aromansa">' +
                '<span class="fab-pulse-ring"></span>' +
                '<span class="fab-icon-box">' +
                    '<i class="fa fa-comment-dots icon-open" aria-hidden="true"></i>' +
                    '<i class="fa fa-times icon-close" aria-hidden="true"></i>' +
                '</span>' +
                '<span class="fab-tooltip">Bantuan &amp; Toko</span>' +
            '</button>' +
        '</div>';

        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        var fabBtn = document.getElementById('aromansa-fab-btn');
        var dropup = document.getElementById('aromansa-dropup');
        var closeBtn = document.getElementById('aromansa-dropup-close');

        function toggleDropup(forceState) {
            if (!dropup || !fabBtn) return;
            var shouldOpen = typeof forceState === 'boolean' ? forceState : !dropup.classList.contains('show');
            if (shouldOpen) {
                dropup.classList.add('show');
                fabBtn.classList.add('active');
                fabBtn.setAttribute('aria-expanded', 'true');
            } else {
                dropup.classList.remove('show');
                fabBtn.classList.remove('active');
                fabBtn.setAttribute('aria-expanded', 'false');
            }
        }

        if (fabBtn) {
            fabBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleDropup();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleDropup(false);
            });
        }

        // Close when clicking outside the widget
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#whatsapp-widget')) {
                toggleDropup(false);
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropup && dropup.classList.contains('show')) {
                toggleDropup(false);
                if (fabBtn) fabBtn.focus();
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

    // ===== Smart Animate: Luxury Botanical Scroll & Stagger Reveal =====
    function initSmartAnimate() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        var revealSelectors = [
            '.section-head',
            '.section-header-modern',
            '.routine-header',
            '.faq-header-modern',
            '.category-card-stunning',
            '.bestseller-card',
            '.discovery-copy',
            '.discovery-visual',
            '.testimonial-card-stunning',
            '.benefit-card-stunning',
            '.product-card-stunning',
            '.routine-card',
            '.chat-container-modern',
            '.step-card-modern',
            '.contact-info-card-modern',
            '.contact-form-wrapper',
            '.map-wrapper',
            '.faq-item-modern',
            '.mood-intro',
            '.step-panel:not([hidden])',
            '#footer .footer-grid > div'
        ];

        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -36px 0px'
        });

        function bindRevealElements(root) {
            var scope = root || document;
            var elements = scope.querySelectorAll(revealSelectors.join(','));
            elements.forEach(function(el) {
                if (el.classList.contains('smart-reveal')) return;
                el.classList.add('smart-reveal');

                // Calculate sibling index for natural stagger effect within grids
                var parent = el.parentElement;
                if (parent) {
                    var siblings = Array.prototype.slice.call(parent.children);
                    var idx = siblings.indexOf(el);
                    el.style.setProperty('--stagger-idx', String(Math.max(0, idx % 6)));
                }
                revealObserver.observe(el);
            });
        }

        bindRevealElements(document);

        // Observe dynamic product catalog rendering on equipment.html
        var catalogContainer = document.getElementById('equipment-container');
        if (catalogContainer && window.MutationObserver) {
            var mutObserver = new MutationObserver(function() {
                bindRevealElements(catalogContainer);
            });
            mutObserver.observe(catalogContainer, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartAnimate);
    } else {
        initSmartAnimate();
    }

})();
