(function () {
    'use strict';

    // ===== Image Error Handler =====
    window.handleImageError = function(img, productName) {
        var parent = img.parentElement;
        if (parent) {
            parent.innerHTML = '<div class="placeholder-img"><i class="fa fa-leaf"></i><span>' + productName + '</span></div>';
        }
    };

    // ===== Essential Oil Product Data =====
    var equipmentItems = [
        // SINGLE OILS
        {
            id: 1,
            title: "Lavender Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbkb-m8lm1d5so45pe7@resize_w900_nl.webp",
            alt: "Lavender Essential Oil",
            description: "Premium therapeutic grade lavender oil for relaxation, sleep improvement, and stress relief. 100% pure and natural.",
            price: "Rp65.000/10ml"
        },
        {
            id: 2,
            title: "Peppermint Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk7-m8lm1d5swjkd8b@resize_w900_nl.webp",
            alt: "Peppermint Essential Oil",
            description: "Energizing and focusing oil. Natural headache reliever, digestive aid, and energy booster. Pure extract.",
            price: "Rp55.000/10ml"
        },
        {
            id: 3,
            title: "Sweet Orange Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk7-m8lmom5vxmbcb0@resize_w900_nl.webp",
            alt: "Sweet Orange Essential Oil",
            description: "Joyful and energizing citrus oil. Immune support and natural air freshener. Cold-pressed extraction.",
            price: "Rp45.000/10ml"
        },
        {
            id: 4,
            title: "Frangipani Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbka-m8lm1d5sqxalbc@resize_w900_nl.webp",
            alt: "Frangipani Essential Oil",
            description: "Exotic tropical floral aroma. Perfect for relaxation, spa treatments, and creating a luxurious atmosphere.",
            price: "Rp75.000/10ml"
        },
        {
            id: 5,
            title: "Lemon Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk9-m8lmom5w0fg89b@resize_w900_nl.webp",
            alt: "Lemon Essential Oil",
            description: "Uplifting and cleansing oil. Natural mood booster, immune support, and air purifier. Cold-pressed from fresh lemons.",
            price: "Rp45.000/10ml"
        },
        {
            id: 6,
            title: "Palmarosa Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk0-m8lm1d5stqfh5d@resize_w900_nl.webp",
            alt: "Palmarosa Essential Oil",
            description: "Gentle floral-grass scent. Excellent for skincare, moisture balance, and calming nervous tension.",
            price: "Rp75.000/10ml"
        },
        {
            id: 7,
            title: "Lemongrass Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk8-m8lmom5w38l4f9@resize_w900_nl.webp",
            alt: "Lemongrass Essential Oil",
            description: "Fresh citrus-herb aroma. Natural deodorizer, insect repellent, and digestive support.",
            price: "Rp45.000/10ml"
        },
        {
            id: 8,
            title: "Spearmint Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbka-m8lm1d5szcp93d@resize_w900_nl.webp",
            alt: "Spearmint Essential Oil",
            description: "Sweet minty fragrance. Milder than peppermint, perfect for children, digestive support, and fresh breath.",
            price: "Rp55.000/10ml"
        },
        {
            id: 9,
            title: "Eucalyptus Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk6-m8lmom5vut6g20@resize_w900_nl.webp",
            alt: "Eucalyptus Essential Oil",
            description: "Respiratory health supporter. Clears congestion, freshens air, and supports immune system naturally.",
            price: "Rp40.000/10ml"
        },
        {
            id: 10,
            title: "Ylang-Ylang Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk7-m8lm1d5t25u539@resize_w900_nl.webp",
            alt: "Ylang-Ylang Essential Oil",
            description: "Natural mood enhancer and romantic aroma. Stress reliever and emotional balancer. Pure floral extract.",
            price: "Rp70.000/10ml"
        },
        // ROLL-ON
        {
            id: 11,
            title: "Gandapura Roll-On",
            category: "roll-on",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk7-m8lhwlacnif6f7@resize_w900_nl.webp",
            alt: "Gandapura Roll-On",
            description: "Convenient roll-on bottle with wintergreen oil. Perfect for targeted application on sore muscles and joints.",
            price: "Rp30.000/10ml"
        },
        {
            id: 12,
            title: "Peppermint Roll-On",
            category: "roll-on",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk7-m8lhwlacqbk224@resize_w900_nl.webp",
            alt: "Peppermint Roll-On",
            description: "Ready-to-use peppermint oil roll-on. Great for headaches, energy, and focus on-the-go.",
            price: "Rp30.000/10ml"
        },
        // SPRAY
        {
            id: 13,
            title: "Lavender Spray",
            category: "spray",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk4-m8lhwlacghky46@resize_w900_nl.webp",
            alt: "Lavender Spray",
            description: "Pre-diluted lavender spray for easy application. Perfect for pillows, linens, and room freshening.",
            price: "Rp45.000/100ml"
        },
        {
            id: 14,
            title: "Peppermint Spray",
            category: "spray",
            image: "https://down-id.img.susercontent.com/file/id-11134207-7rbk1-m8lhwlackpaa92@resize_w900_nl.webp",
            alt: "Peppermint Spray",
            description: "Refreshing peppermint spray. Natural air freshener and energizing room mist.",
            price: "Rp45.000/100ml"
        }
    ];

    // ===== Category Labels =====
    var categoryLabels = {
        'single-oils': 'Single oils',
        'roll-on': 'Roll-on',
        'spray': 'Spray'
    };

    // ===== Remaining code (keep as is) =====
    var itemsPerPage = 12;
    var currentPage = 1;
    var filteredItems = equipmentItems.slice();

    // DOM elements
    var container = document.getElementById('equipment-container');
    var paginationContainer = document.getElementById('equipment-pagination');
    var searchInput = document.getElementById('equipment-search');
    var searchBtn = document.getElementById('search-btn');
    var resultsCount = document.getElementById('resultsCount');

    // ===== Render Equipment =====
    function renderEquipment() {
        if (!container) return;
        
        var start = (currentPage - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var pageItems = filteredItems.slice(start, end);

        container.innerHTML = '';

        pageItems.forEach(function(item) {
            var card = document.createElement('div');

            // Check if image exists, if not use placeholder
            var imageHTML;
            if (item.image && item.image !== '') {
                imageHTML = '<img src="' + item.image + '" alt="' + item.alt + '" onerror="handleImageError(this, \'' + item.title.split(' ')[0] + '\')">';
            } else {
                imageHTML = '<div class="placeholder-img"><i class="fa fa-leaf"></i><span>' + item.title.split(' ')[0] + '</span></div>';
            }

            card.innerHTML =
                '<div class="product-card-stunning">' +
                    '<div class="product-img-stunning">' +
                        imageHTML +
                    '</div>' +
                    '<div class="product-info-stunning">' +
                        '<span class="product-category-stunning">' + (categoryLabels[item.category] || item.category) + '</span>' +
                        '<h3>' + item.title + '</h3>' +
                        '<p>' + item.description + '</p>' +
                        '<div class="product-price-stunning">' + item.price + '</div>' +
                        '<div class="product-actions-stunning">' +
                            '<a href="https://shopee.co.id/aromansa_id" target="_blank" rel="noopener noreferrer" class="btn-product-stunning btn-product-primary">' +
                                '<i class="fa fa-shopping-bag"></i>' +
                                '<span>Shopee</span>' +
                            '</a>' +
                            '<a href="https://www.tokopedia.com/search?q=aromansa" target="_blank" rel="noopener noreferrer" class="btn-product-stunning btn-product-secondary">' +
                                '<i class="fa fa-store"></i>' +
                                '<span>Tokopedia</span>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            container.appendChild(card);
        });

        renderPagination();

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = 'Showing ' + pageItems.length + ' of ' + filteredItems.length + ' products';
        }
    }

    // ===== Render Pagination =====
    function renderPagination() {
        if (!paginationContainer) return;
        
        var totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        var ul = document.createElement('ul');
        ul.className = 'pagination';

        // Previous button
        var prevLi = document.createElement('li');
        prevLi.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
        var prevBtn = document.createElement('button');
        prevBtn.className = 'page-link';
        prevBtn.innerHTML = '&laquo; Previous';
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderEquipment();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        prevLi.appendChild(prevBtn);
        ul.appendChild(prevLi);

        // Page numbers
        for (var i = 1; i <= totalPages; i++) {
            var li = document.createElement('li');
            li.className = 'page-item' + (i === currentPage ? ' active' : '');
            var btn = document.createElement('button');
            btn.className = 'page-link';
            btn.innerHTML = i;
            btn.addEventListener('click', (function(pageNum) {
                return function() {
                    currentPage = pageNum;
                    renderEquipment();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
            })(i));
            li.appendChild(btn);
            ul.appendChild(li);
        }

        // Next button
        var nextLi = document.createElement('li');
        nextLi.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
        var nextBtn = document.createElement('button');
        nextBtn.className = 'page-link';
        nextBtn.innerHTML = 'Next &raquo;';
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderEquipment();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        nextLi.appendChild(nextBtn);
        ul.appendChild(nextLi);

        paginationContainer.appendChild(ul);
    }

    // ===== Filter Equipment =====
    function filterEquipment(category) {
        if (category === 'all') {
            filteredItems = equipmentItems.slice();
        } else {
            filteredItems = equipmentItems.filter(function(item) {
                return item.category === category;
            });
        }
        currentPage = 1;
        renderEquipment();
    }

    // ===== Search Equipment =====
    function searchEquipment(query) {
        var searchTerm = query.toLowerCase().trim();
        if (!searchTerm) {
            filteredItems = equipmentItems.slice();
        } else {
            filteredItems = equipmentItems.filter(function(item) {
                return item.title.toLowerCase().includes(searchTerm) ||
                       item.description.toLowerCase().includes(searchTerm) ||
                       item.category.toLowerCase().includes(searchTerm);
            });
        }
        currentPage = 1;
        renderEquipment();
    }

    // ===== Event Listeners =====
    var filterButtons = document.querySelectorAll('.filter-tab-stunning');
    
    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var category = btn.getAttribute('data-filter');
            filterEquipment(category);
        });
    });

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchEquipment(searchInput.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchEquipment(searchInput.value);
            }
        });

        searchInput.addEventListener('input', function() {
            filterButtons.forEach(function(b) { b.classList.remove('active'); });
            var allBtn = document.querySelector('.filter-tab-stunning[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');
            searchEquipment(this.value);
        });
    }

    // Reset Filters Button
    var resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            filteredItems = equipmentItems.slice();
            currentPage = 1;
            filterButtons.forEach(function(b) { b.classList.remove('active'); });
            var allBtn = document.querySelector('.filter-tab-stunning[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');
            if (searchInput) searchInput.value = '';
            renderEquipment();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Initialize =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            renderEquipment();
        });
    } else {
        renderEquipment();
    }

})();
