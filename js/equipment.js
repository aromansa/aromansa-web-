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
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztc-muiy4o5hhr0j8a@resize_w900_nl.webp",
            alt: "Lavender Essential Oil Aromansa",
            description: "Sulingan bunga lavender dengan wangi floral lembut untuk meredakan penat dan menemani tidur malam yang lelap.",
            price: "Rp65.000 / 10ml"
        },
        {
            id: 2,
            title: "Peppermint Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztp-muiy4o5hc4qr32@resize_w900_nl.webp",
            alt: "Peppermint Essential Oil Aromansa",
            description: "Ekstrak daun peppermint beraroma mint dingin yang menyegarkan kepala berat dan membantu menjaga fokus kerja.",
            price: "Rp55.000 / 10ml"
        },
        {
            id: 3,
            title: "Sweet Orange Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztn-muixuin3hyiw3c@resize_w900_nl.webp",
            alt: "Sweet Orange Essential Oil Aromansa",
            description: "Perasan kulit jeruk manis dengan aroma segar dan hangat yang mencerahkan suasana ruang keluarga.",
            price: "Rp45.000 / 10ml"
        },
        {
            id: 4,
            title: "Frangipani Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81zto-muiy4o5hkk5fae@resize_w900_nl.webp",
            alt: "Frangipani Essential Oil Aromansa",
            description: "Harum bunga kamboja tropis yang anggun dan menenangkan, menghadirkan nuansa spa alami di kamar tidur.",
            price: "Rp75.000 / 10ml"
        },
        {
            id: 5,
            title: "Lemon Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81zte-muixuin3f5e083@resize_w900_nl.webp",
            alt: "Lemon Essential Oil Aromansa",
            description: "Aroma citrus bersih dari kulit lemon segar untuk menetralkan bau ruangan dan membangkitkan energi pagi.",
            price: "Rp45.000 / 10ml"
        },
        {
            id: 6,
            title: "Palmarosa Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztc-muiy4o5hexvna9@resize_w900_nl.webp",
            alt: "Palmarosa Essential Oil Aromansa",
            description: "Perpaduan wangi rumput botanikal dan mawar lembut yang nyaman untuk relaksasi sore maupun campuran perawatan kulit.",
            price: "Rp75.000 / 10ml"
        },
        {
            id: 7,
            title: "Lemongrass Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztk-muixuin3krns17@resize_w900_nl.webp",
            alt: "Lemongrass Essential Oil Aromansa",
            description: "Sulingan serai wangi yang segar dan bersih untuk menyegarkan udara rumah sekaligus membantu menghalau nyamuk.",
            price: "Rp45.000 / 10ml"
        },
        {
            id: 8,
            title: "Spearmint Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztm-muiy4o5j4qv9dc@resize_w900_nl.webp",
            alt: "Spearmint Essential Oil Aromansa",
            description: "Karakter mint yang lebih lembut dan manis dibanding peppermint, nyaman dihirup untuk menyegarkan pikiran.",
            price: "Rp55.000 / 10ml"
        },
        {
            id: 9,
            title: "Eucalyptus Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztq-muixuin3nksode@resize_w900_nl.webp",
            alt: "Eucalyptus Essential Oil Aromansa",
            description: "Uap herbal hangat dari daun eucalyptus yang melegakan tarikan napas saat cuaca dingin atau hidung tersumbat.",
            price: "Rp40.000 / 10ml"
        },
        {
            id: 10,
            title: "Ylang-Ylang Essential Oil",
            category: "single-oils",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztg-muixuin3qdxk27@resize_w900_nl.webp",
            alt: "Ylang-Ylang Essential Oil Aromansa",
            description: "Ekstrak bunga kenanga dengan wangi floral eksotis yang membantu meredakan ketegangan emosi di penghujung hari.",
            price: "Rp70.000 / 10ml"
        },
        // ROLL-ON
        {
            id: 11,
            title: "Gandapura Roll-On",
            category: "roll-on",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81zte-muiy8d4xqjur36@resize_w900_nl.webp",
            alt: "Gandapura Roll-On Aromansa",
            description: "Roll-on siap oles dengan minyak gandapura hangat untuk meredakan pegal di pundak, tengkuk, dan persendian.",
            price: "Rp30.000 / 10ml"
        },
        {
            id: 12,
            title: "Peppermint Roll-On",
            category: "roll-on",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztm-muiy8d4xnqpvf7@resize_w900_nl.webp",
            alt: "Peppermint Roll-On Aromansa",
            description: "Kemasan roll-on saku praktis untuk dioleskan di pelipis dan pergelangan tangan saat butuh kesegaran instan.",
            price: "Rp30.000 / 10ml"
        },
        // SPRAY
        {
            id: 13,
            title: "Lavender Linen & Room Spray",
            category: "spray",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81ztq-muiy8d4xkxkz1a@resize_w900_nl.webp",
            alt: "Lavender Spray Aromansa",
            description: "Semprotan praktis beraroma lavender lembut untuk bantal, sprei, dan udara kamar agar istirahat malam lebih tenang.",
            price: "Rp60.000 / 100ml"
        },
        {
            id: 14,
            title: "Peppermint Linen & Room Spray",
            category: "spray",
            image: "https://down-id.img.susercontent.com/file/id-11134207-81zth-muiy4o5hndab9f@resize_w900_nl.webp",
            alt: "Peppermint Spray Aromansa",
            description: "Semprotan ruangan beraroma peppermint segar untuk menjernihkan udara ruang kerja dan menghilangkan bau pengap.",
            price: "Rp60.000 / 100ml"
        }
    ];

    // ===== Category Labels =====
    var categoryLabels = {
        'single-oils': 'Essential Oil · 10ml',
        'roll-on': 'Roll-On · 10ml',
        'spray': 'Linen Spray · 100ml'
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

    // ===== Helper: Parse price string (e.g. "Rp65.000 / 10ml" -> 65000) =====
    function parseItemPrice(priceStr) {
        if (typeof priceStr === 'number') return priceStr;
        if (!priceStr) return 50000;
        var pricePart = String(priceStr).split('/')[0];
        return parseInt(pricePart.replace(/\D/g, ''), 10) || 50000;
    }

    // ===== Render Equipment =====
    function renderEquipment() {
        if (!container) return;
        
        var start = (currentPage - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var pageItems = filteredItems.slice(start, end);

        container.innerHTML = '';

        if (pageItems.length === 0) {
            container.innerHTML =
                '<div class="empty-catalog-message" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #faf8f5; border-radius: 16px; border: 1px dashed #d1c7b7;">' +
                    '<i class="fa fa-search" style="font-size: 32px; color: #a39580; margin-bottom: 14px; display: inline-block;"></i>' +
                    '<h3 style="font-family: \'Playfair Display\', Georgia, serif; font-size: 22px; color: #2d3748; margin-bottom: 8px;">Aroma yang Anda cari tidak ditemukan</h3>' +
                    '<p style="color: #656d62; max-width: 440px; margin: 0 auto 20px; font-size: 14px; line-height: 1.6;">Coba gunakan kata kunci lain (mis. Lavender, tidur, fokus) atau klik tombol di bawah untuk melihat seluruh koleksi.</p>' +
                    '<button type="button" class="btn-product-stunning btn-product-primary" id="btn-reset-catalog" style="display: inline-flex; width: auto; padding: 10px 24px; margin: 0 auto;">' +
                        '<span>Lihat Semua Koleksi</span>' +
                    '</button>' +
                '</div>';
            var resetCatalogBtn = container.querySelector('#btn-reset-catalog');
            if (resetCatalogBtn) {
                resetCatalogBtn.addEventListener('click', function() {
                    resetAllFilters();
                });
            }
            if (resultsCount) {
                resultsCount.textContent = 'Menampilkan 0 dari 0 produk';
            }
            if (paginationContainer) {
                paginationContainer.innerHTML = '';
            }
            return;
        }

        pageItems.forEach(function(item) {
            var card = document.createElement('div');

            // Check if image exists, if not use placeholder
            var imageHTML;
            if (item.image && item.image !== '') {
                 imageHTML = '<img src="' + item.image + '" alt="' + item.alt + '" loading="lazy" decoding="async" onerror="handleImageError(this, \'' + item.title.split(' ')[0] + '\')">';
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
                            '<a href="https://www.tokopedia.com/aromansa" target="_blank" rel="noopener noreferrer" class="btn-product-stunning btn-product-secondary">' +
                                '<i class="fa fa-store"></i>' +
                                '<span>Tokopedia</span>' +
                            '</a>' +
                            '<button type="button" class="btn-product-stunning btn-product-cart" data-cart-item=\'' + JSON.stringify({
                                id: 'prod-' + item.id,
                                name: item.title,
                                price: parseItemPrice(item.price),
                                size: (categoryLabels[item.category] || '').split('·')[1] ? (categoryLabels[item.category] || '').split('·')[1].trim() : '10ml',
                                image: item.image || ''
                            }) + '\'>' +
                                '<i class="fa fa-cart-plus"></i>' +
                                '<span>+ Keranjang</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            container.appendChild(card);
        });

        // Bind cart buttons
        container.querySelectorAll('.btn-product-cart').forEach(function(btn) {
            btn.addEventListener('click', function() {
                try {
                    var itemData = JSON.parse(this.getAttribute('data-cart-item'));
                    if (window.aromansaCart) {
                        window.aromansaCart.addItem(itemData);
                    }
                } catch(e) {
                    console.error('Error adding to cart:', e);
                }
            });
        });

        renderPagination();

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = 'Menampilkan ' + pageItems.length + ' dari ' + filteredItems.length + ' produk';
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
        prevBtn.innerHTML = '&laquo; Sebelumnya';
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
        nextBtn.innerHTML = 'Berikutnya &raquo;';
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

    // Reset Filters
    function resetAllFilters() {
        filteredItems = equipmentItems.slice();
        currentPage = 1;
        filterButtons.forEach(function(b) { b.classList.remove('active'); });
        var allBtn = document.querySelector('.filter-tab-stunning[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');
        if (searchInput) searchInput.value = '';
        renderEquipment();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    var resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
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
