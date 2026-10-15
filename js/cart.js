
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =====================================================
       1. قوائم المنتجات
    ===================================================== */

    const burgersList = [
        {
            id: "mawlana-burger",
            name: "مولانا برغر",
            englishName: "MAWLANA BURGER",
            price: 600,
            image: "images/burgers/mawlana_burger.png",
            description: "قطعتين من اللحم مع الخس والجبن والصوص الخاص",
            isNew: false,
            isFeatured: true,
            badge: "الأكثر طلباً",
            alt: "مولانا برغر"
        },
        {
            id: "m4-burger",
            name: "M4 برغر",
            englishName: "M4 BURGER",
            price: 600,
            image: "images/burgers/M4.png",
            description: "قطعة من اللحم مع البصل المكرمل والجبن والصوص الحار الخاص",
            isNew: true,
            isFeatured: true,
            badge: "",
            alt: "M4 برغر"
        },
        {
            id: "chicken-in-burger",
            name: "تشكن ان برغر",
            englishName: "CHICKEN IN BURGER",
            price: 550,
            image: "images/burgers/chikenIN.png",
            description: "قطعتين من الدجاج مع الطماطم والجبن والصوص الحار الخاص",
            isNew: true,
            isFeatured: true,
            badge: "",
            alt: "تشكن ان برغر"
        },
        {
            id: "dynamite-shrimp-burger",
            name: "داينمت شريمب",
            englishName: "DYNAMITE SHRIMP BURGER",
            price: 600,
            image: "images/burgers/daynamet shrimp.png",
            description: "الروبيان المقلي مع البطاطا وصوص الداينمت الخاص",
            alt: "داينمت شريمب",
            isNew: true,
            isFeatured: false,
            badge: ""
        },
        {
            id: "classic-burger",
            name: "كلاسيك برغر",
            englishName: "CLASSIC BURGER",
            price: 500,
            image: "images/burgers/classic.png",
            description: "قطعة لحم بقري مشوية مع جبنة وخس وطماطم وبصل وصوص البرغر الخاص",
            isNew: false,
            isFeatured: false,
            badge: "",
            alt: "كلاسيك برغر"
        },
        {
            id: "sanofghan-burger",
            name: "صن اف غن برغر",
            englishName: "SANOFGHAN BURGER",
            price: 600,
            image: "images/burgers/sanofghan.png",
            description: "قطعتين من الدجاج مع شريحتين من الجبن والصوص الخاص وهالبينو وذرة مغطاة",
            isNew: false,
            isFeatured: false,
            badge: "",
            alt: "صن اف غن برغر"
        },
        {
            id: "dynamite-fries-burger",
            name: "داينمت فرايز",
            englishName: "DYNAMITE FRIES BURGER",
            price: 350,
            image: "images/burgers/dainametFraiz.png",
            description: "الدجاج المقرمش مع البطاطا وصوص الداينمت الخاص",
            alt: "داينمت فرايز"
        },
         {
            id: "Crispy_fay-burger",
            name: "كرسيبي فاي",
            englishName: "Crispy Fay BURGER",
            price: 480,
            image: "images/burgers/crispyFay_burger.png",
            description: "الدجاج المقرمش مع الخس والجبن والصوص الخاص",
            alt: "كريسبي فاي"
        },
        {
            id: "mawlana-fries-burger",
            name: "مولانا فرايز",
            englishName: "MAWLANA FRIES BURGER",
            price: 270,
            image: "images/burgers/fraiz.png",
            description: "البطاطا المقرمشة مع الجبن السائل وصوص مولانا الخاص",
            alt: "مولانا فرايز"
        },
        {
            id: "salted-fries-burger",
            name: "سولتد فرايز",
            englishName: "SALTED FRIES BURGER",
            price: 160,
            image: "images/burgers/fraizm.png",
            description: "البطاطا المقرمشة مع الملح وصوص البرغر الخاص",
            alt: "سولتد فرايز"
        },
        {
            id: "potato-sandwich-burger",
            name: "سندويش بطاطا",
            englishName: "POTATO SANDWICH",
            price: 250,
            image: "images/burgers/botatoSandwish.png",
            description: "البطاطا مع خبز السمون والجبن السائل والصوص الخاص",
            alt: "سندويش بطاطا"
        }
    ];

    const mealsList = [
        {
            id: "mawlana-meal",
            name: " وجبة مولانا الدبل",
            englishName: "MAWLANA MEAL",
            price: 750,
            image: "images/meals/meal1.png",
            description: "وجبة الدجاج الدبل أو اللحم مع بطاطا وعلبة صوص",
            alt: "وجبة مولانا"
        },
        {
            id: "mawlana-classic-meal",
            name: "وجبة مولانا كلاسيك",
            englishName: "MAWLANA CLASSIC MEAL",
            price: 650,
            image: "images/meals/meal1.png",
            description: "وجبة الدجاج الكلاسيك أو اللحم مع بطاطا وصوص",
            alt: "وجبة مولانا كلاسيك"
        }
    ];

    const specialDrinksList = [
        {
            id: "mohito-strawberry",
            name: "موهيتو بطعم الفريز",
            englishName: "MOHITO STRAWBERRY",
            price: 200,
            image: "images/drinks/mohito.jpg",
            alt: "موهيتو بطعم الفريز"
        },
        {
            id: "passion-juice",
            name: "عصير بنكهة فاكهة الباشون الطازجة",
            englishName: "PASSION JUICE",
            price: 200,
            image: "images/drinks/bation.jpg",
            alt: "عصير باشون"
        },
        {
            id: "ocean-juice",
            name: "العصير الأزرق المنعش بنكهة المحيط",
            englishName: "OCEAN JUICE",
            price: 200,
            image: "images/drinks/blueSerron.jpg",
            alt: "العصير الأزرق"
        }
    ];

    const drinksList = [
        {
            id: "cola-liter",
            name: "كولا ليتر",
            price: 110
        },
        {
            id: "sprite",
            name: "سبرايت",
            price: 100
        },
        {
            id: "water",
            name: "ماء",
            price: 50
        },
        {
            id: "cola-can",
            name: "بيبسي / كولا تنك",
            price: 100
        }
    ];

    /* =====================================================
       2. الإعدادات
    ===================================================== */

    const WHATSAPP_NUMBER = "963980517535";

    /* =====================================================
       3. العناصر الأساسية
    ===================================================== */

    let cart = [];

    const $ = selector => document.querySelector(selector);

    const floatingCart = $("#floatingCart");
    const cartOverlay = $("#cartOverlay");
    const cartPanel = $("#cartPanel");
    const closeCartButton = $("#closeCart");
    const cartItemsElement = $("#cartItems");
    const cartEmpty = $("#cartEmpty");
    const cartCount = $("#cartCount");
    const cartBadge = $("#cartBadge");
    const cartTotal = $("#cartTotal");
    const whatsappOrder = $("#whatsappOrder");

    /* =====================================================
       4. الدوال المساعدة
    ===================================================== */

    function safeNumber(value, fallback = 0) {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatPrice(value) {
        return `${safeNumber(value).toLocaleString("en-US")} ل.س`;
    }

    function trackEvent(eventName, parameters = {}) {
        if (typeof window.gtag === "function") {
            try {
                window.gtag("event", eventName, parameters);
            } catch (error) {
                console.warn("Google Analytics error:", error);
            }
        }
    }

    /* =====================================================
       5. عرض البرغر والوجبات
    ===================================================== */

    function renderMainProduct(product) {
        const id = escapeHTML(product.id);
        const name = escapeHTML(product.name);
        const englishName = escapeHTML(product.englishName || "");
        const description = escapeHTML(product.description || "");
        const image = escapeHTML(product.image || "");
        const alt = escapeHTML(product.alt || product.name);
        const price = safeNumber(product.price);

        let badge = "";

        if (product.isNew) {
            badge = '<span class="product-badge new">جديد</span>';
        } else if (product.badge) {
            badge = `<span class="product-badge">${escapeHTML(product.badge)}</span>`;
        }

        const featuredClass = product.isFeatured ? " featured" : "";

        return `
            <article
                class="product-card${featuredClass}"
                data-id="${id}"
                data-name="${name}"
                data-price="${price}"
                data-image="${image}">

                <div class="product-image">
                    ${badge}
                    <img src="${image}" alt="${alt}" loading="lazy">
                </div>

                <div class="product-info">
                    <div class="product-title">
                        <div>
                            <h3>${name}</h3>
                            ${englishName ? `<span>${englishName}</span>` : ""}
                        </div>
                        <strong>${formatPrice(price)}</strong>
                    </div>

                    ${description ? `<p>${description}</p>` : ""}

                    <button class="add-to-cart-btn" type="button">
                        <span>🛒</span>
                        أضف إلى الطلب
                    </button>
                </div>
            </article>
        `;
    }

    /* =====================================================
       6. المشروبات المميزة
    ===================================================== */

    function renderSpecialDrink(product) {
        const id = escapeHTML(product.id);
        const name = escapeHTML(product.name);
        const englishName = escapeHTML(product.englishName || "");
        const image = escapeHTML(product.image || "");
        const alt = escapeHTML(product.alt || product.name);
        const price = safeNumber(product.price);

        return `
            <article
                class="small-product"
                data-id="${id}"
                data-name="${name}"
                data-price="${price}"
                data-image="${image}">

                <div class="small-product-image">
                    <img src="${image}" alt="${alt}" loading="lazy">
                </div>

                <div class="small-product-info">
                    <h3>${name}</h3>
                    ${englishName ? `<span>${englishName}</span>` : ""}
                </div>

                <strong>${formatPrice(price)}</strong>

                <button
                    class="small-add-to-cart-btn"
                    type="button"
                    aria-label="إضافة ${name} إلى الطلب">+</button>
            </article>
        `;
    }

    /* =====================================================
       7. المشروبات العادية
    ===================================================== */

    function renderDrink(product) {
        const id = escapeHTML(product.id);
        const name = escapeHTML(product.name);
        const price = safeNumber(product.price);

        return `
            <article
                class="drink-item"
                data-id="${id}"
                data-name="${name}"
                data-price="${price}">

                <span>${name}</span>
                <strong>${formatPrice(price)}</strong>

                <button
                    class="drink-add-btn"
                    type="button"
                    aria-label="إضافة ${name} إلى الطلب">+</button>
            </article>
        `;
    }

    /* =====================================================
       8. عرض قوائم المنتجات
    ===================================================== */

    function renderProductList(list, containerId, renderer) {
        const container = document.getElementById(containerId);

        if (!container) {
            console.error(`لم يتم العثور على العنصر: ${containerId}`);
            return;
        }

        container.innerHTML = list.map(renderer).join("");
    }

    renderProductList(burgersList, "burgersGrid", renderMainProduct);
    renderProductList(mealsList, "mealsGrid", renderMainProduct);
    renderProductList(specialDrinksList, "specialDrinksGrid", renderSpecialDrink);
    renderProductList(drinksList, "drinksGrid", renderDrink);

    /* =====================================================
       9. حسابات السلة
    ===================================================== */

    function getCartCount() {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function updateCartCounter() {
        const count = getCartCount();

        if (cartCount) {
            cartCount.textContent = `${count} أصناف`;
        }

        if (cartBadge) {
            cartBadge.textContent = count;
        }

        if (cartTotal) {
            cartTotal.textContent = formatPrice(getCartTotal());
        }

        if (floatingCart) {
            floatingCart.classList.remove("cart-bounce");
            void floatingCart.offsetWidth;
            floatingCart.classList.add("cart-bounce");
        }
    }

    /* =====================================================
       10. فتح وإغلاق السلة
    ===================================================== */

    function openCartPanel() {
        if (!cartOverlay) return;

        cartOverlay.classList.add("show");
        cartOverlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("cart-open");
    }

    function closeCartPanel() {
        if (!cartOverlay) return;

        cartOverlay.classList.remove("show");
        cartOverlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("cart-open");
    }

    if (floatingCart) {
        floatingCart.addEventListener("click", openCartPanel);
    }

    if (closeCartButton) {
        closeCartButton.addEventListener("click", closeCartPanel);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener("click", function (event) {
            if (event.target === cartOverlay) {
                closeCartPanel();
            }
        });
    }

    if (cartPanel) {
        cartPanel.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeCartPanel();
        }
    });

    /* =====================================================
       11. إضافة المنتجات إلى السلة
       السلة لا تفتح تلقائياً عند الإضافة
    ===================================================== */

    function addToCart(productCard) {
        const id = productCard.dataset.id;
        const name = productCard.dataset.name;
        const price = safeNumber(productCard.dataset.price);
        const image = productCard.dataset.image || "";

        if (!id || !name || price < 0) return;

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }

        trackEvent("add_to_cart", {
            currency: "SYP",
            value: price,
            items: [{
                item_id: id,
                item_name: name,
                price: price,
                quantity: 1
            }]
        });

        renderCart();
    }

    /* =====================================================
       12. تأثير الزر الأخضر عند الإضافة
    ===================================================== */

    document.addEventListener("click", function (event) {
        const button = event.target.closest(
            ".add-to-cart-btn, .small-add-to-cart-btn, .drink-add-btn"
        );

        if (!button) return;

        const productCard = button.closest("[data-id][data-price]");

        if (!productCard) {
            console.error("تعذر العثور على بطاقة المنتج.");
            return;
        }

        addToCart(productCard);

        if (button.successTimeout) {
            clearTimeout(button.successTimeout);
        }

        if (!button.dataset.originalContent) {
            button.dataset.originalContent = button.innerHTML;
        }

        button.classList.add("added-success");
        button.innerHTML = '<span class="success-check">✓</span> تمت الإضافة';

        button.style.setProperty("background-color", "#198754", "important");
        button.style.setProperty("background", "#198754", "important");
        button.style.setProperty("color", "#ffffff", "important");
        button.style.setProperty("border-color", "#198754", "important");

        button.successTimeout = setTimeout(function () {
            button.classList.remove("added-success");
            button.innerHTML = button.dataset.originalContent;

            button.style.removeProperty("background-color");
            button.style.removeProperty("background");
            button.style.removeProperty("color");
            button.style.removeProperty("border-color");

            button.successTimeout = null;
        }, 1500);
    });

    /* =====================================================
       13. عرض محتويات السلة
    ===================================================== */

    function renderCart() {
        if (!cartItemsElement) return;

        const isEmpty = cart.length === 0;

        if (cartEmpty) {
            cartEmpty.style.display = isEmpty ? "flex" : "none";
        }

        cartItemsElement.style.display = isEmpty ? "none" : "flex";

        if (isEmpty) {
            cartItemsElement.innerHTML = "";
            updateCartCounter();
            return;
        }

        cartItemsElement.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${escapeHTML(item.id)}">

                <div class="cart-item-image">
                    ${
                        item.image
                            ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">`
                            : `<span>🍔</span>`
                    }
                </div>

                <div class="cart-item-info">
                    <h4>${escapeHTML(item.name)}</h4>

                    <span class="cart-item-price">
                        ${formatPrice(item.price)}
                    </span>

                    <div class="quantity-controls">
                        <button
                            class="quantity-btn"
                            type="button"
                            data-action="increase"
                            aria-label="زيادة الكمية">+</button>

                        <span class="quantity-number">${item.quantity}</span>

                        <button
                            class="quantity-btn"
                            type="button"
                            data-action="decrease"
                            aria-label="إنقاص الكمية">−</button>
                    </div>
                </div>

                <div class="cart-item-actions">
                    <strong>${formatPrice(item.price * item.quantity)}</strong>

                    <button
                        class="remove-item"
                        type="button"
                        data-action="remove"
                        aria-label="حذف ${escapeHTML(item.name)}">✕</button>
                </div>
            </div>
        `).join("");

        updateCartCounter();
    }

    /* =====================================================
       14. التحكم بكميات السلة
    ===================================================== */

    if (cartItemsElement) {
        cartItemsElement.addEventListener("click", function (event) {
            const button = event.target.closest("[data-action]");

            if (!button) return;

            const row = button.closest(".cart-item");
            if (!row) return;

            const item = cart.find(product => product.id === row.dataset.id);
            if (!item) return;

            const action = button.dataset.action;

            if (action === "increase") {
                item.quantity += 1;
            }

            if (action === "decrease") {
                item.quantity -= 1;

                if (item.quantity <= 0) {
                    cart = cart.filter(product => product.id !== item.id);
                }
            }

            if (action === "remove") {
                cart = cart.filter(product => product.id !== item.id);
            }

            renderCart();
        });
    }

    /* =====================================================
       15. بيانات العميل
    ===================================================== */

    function getCustomerData() {
        return {
            name: $("#customerName")?.value.trim() || "",
            phone: $("#customerPhone")?.value.trim() || "",
            address: $("#customerAddress")?.value.trim() || "",
            notes: $("#customerNotes")?.value.trim() || ""
        };
    }

    function validateCustomerData(customer) {
        if (!customer.name) {
            alert("يرجى إدخال الاسم.");
            $("#customerName")?.focus();
            return false;
        }

        if (!customer.phone) {
            alert("يرجى إدخال رقم الهاتف.");
            $("#customerPhone")?.focus();
            return false;
        }

        if (!customer.address) {
            alert("يرجى إدخال عنوان التوصيل.");
            $("#customerAddress")?.focus();
            return false;
        }

        return true;
    }

    /* =====================================================
       16. إنشاء رسالة واتساب
    ===================================================== */

    function buildWhatsAppMessage(customer) {
        let message = "🍔 *طلب جديد - مولانا برغر*\n\n";

        message += `👤 *اسم العميل:*\n${customer.name}\n\n`;
        message += `📱 *رقم الهاتف:*\n${customer.phone}\n\n`;
        message += `📍 *عنوان التوصيل:*\n${customer.address}\n\n`;
        message += "━━━━━━━━━━━━━━\n";
        message += "🛒 *تفاصيل الطلب:*\n\n";

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `الكمية: ${item.quantity}\n`;
            message += `سعر القطعة: ${formatPrice(item.price)}\n`;
            message += `الإجمالي: ${formatPrice(item.price * item.quantity)}\n\n`;
        });

        message += "━━━━━━━━━━━━━━\n";
        message += `💰 *الإجمالي النهائي: ${formatPrice(getCartTotal())}*\n\n`;

        if (customer.notes) {
            message += `📝 *ملاحظات العميل:*\n${customer.notes}\n\n`;
        }

        message += "🤍 شكراً لاختياركم مولانا برغر";

        return message;
    }

    /* =====================================================
       17. إرسال الطلب إلى واتساب
    ===================================================== */

    function sendToWhatsApp() {
        if (cart.length === 0) {
            trackEvent("empty_order_attempt");
            alert("سلة الطلب فارغة 🛒\n\nأضف المنتجات أولاً.");
            return;
        }

        const customer = getCustomerData();

        if (!validateCustomerData(customer)) return;

        const total = getCartTotal();
        const message = buildWhatsAppMessage(customer);

        const url =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        trackEvent("begin_checkout", {
            currency: "SYP",
            value: total,
            items: cart.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        });

        const whatsappWindow = window.open(url, "_blank");

        if (!whatsappWindow) {
            alert(
                "تعذر فتح واتساب. اسمح بالنوافذ المنبثقة في المتصفح ثم حاول مجدداً."
            );
            return;
        }

        trackEvent("whatsapp_order", {
            currency: "SYP",
            value: total,
            items_count: getCartCount(),
            order_channel: "whatsapp"
        });
    }

    if (whatsappOrder) {
        whatsappOrder.addEventListener("click", sendToWhatsApp);
    }

    /* =====================================================
       18. إضاءة زر قسم المنيو عند الضغط عليه
       تنتقل الإضاءة من الزر السابق إلى الزر المحدد
    ===================================================== */

    const categoryButtons = document.querySelectorAll(".category");

    function activateCategory(selectedButton) {
        categoryButtons.forEach(function (button) {
            const isSelected = button === selectedButton;

            button.classList.toggle("active", isSelected);

            if (isSelected) {
                button.setAttribute("aria-current", "true");
            } else {
                button.removeAttribute("aria-current");
            }
        });
    }

    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activateCategory(button);
        });
    });

    /* =====================================================
       19. التهيئة الأولية
    ===================================================== */

    renderCart();
    updateCartCounter();

});
