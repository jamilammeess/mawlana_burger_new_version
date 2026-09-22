
document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SETTINGS
    ========================== */

    // رقم واتساب المطعم
    // يجب أن يكون بدون (+) وبدون مسافات
    const WHATSAPP_NUMBER = "963980517535";


    /* =========================
       GOOGLE ANALYTICS
    ========================== */

    /*
     * إرسال Event إلى Google Analytics
     *
     * لا يتم إرسال:
     * - اسم الزبون
     * - رقم الهاتف
     * - العنوان
     * - الملاحظات
     */

    function trackEvent(eventName, parameters = {}) {

        if (typeof window.gtag !== "function") {
            return;
        }

        try {

            window.gtag(
                "event",
                eventName,
                parameters
            );

        } catch (error) {

            console.warn(
                "Google Analytics event error:",
                error
            );

        }

    }


    /*
     * تجهيز منتجات السلة بالشكل المناسب
     * لـ Google Analytics Ecommerce
     */

    function getAnalyticsItems() {

        return cart.map(function (item) {

            return {

                item_id:
                    String(item.id || ""),

                item_name:
                    String(item.name || "منتج"),

                price:
                    safeNumber(
                        item.price,
                        0
                    ),

                quantity:
                    safeNumber(
                        item.quantity,
                        1
                    )

            };

        });

    }


    /* =========================
       CART DATA
    ========================== */

    // السلة تبدأ فارغة مع كل جلسة جديدة.
    let cart = [];


    /* =========================
       ELEMENTS
    ========================== */

    const floatingCart =
        document.getElementById("floatingCart");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const closeCart =
        document.getElementById("closeCart");

    const cartItems =
        document.getElementById("cartItems");

    const cartEmpty =
        document.getElementById("cartEmpty");

    const cartCount =
        document.getElementById("cartCount");

    const cartBadge =
        document.getElementById("cartBadge");

    const cartTotal =
        document.getElementById("cartTotal");

    const whatsappOrder =
        document.getElementById("whatsappOrder");


    /* =========================
       SAFE NUMBER
    ========================== */

    function safeNumber(value, fallback = 0) {

        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : fallback;

    }


    /* =========================
       ESCAPE HTML
    ========================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================
       FORMAT PRICE
    ========================== */

    function formatPrice(price) {

        const numericPrice =
            safeNumber(price);

        return (
            numericPrice.toLocaleString("ar") +
            " ل.س"
        );

    }


    /* =========================
       GET CART COUNT
    ========================== */

    function getCartCount() {

        return cart.reduce(
            function (total, item) {

                const quantity =
                    safeNumber(
                        item.quantity,
                        0
                    );

                return total + quantity;

            },
            0
        );

    }


    /* =========================
       GET CART TOTAL
    ========================== */

    function getCartTotal() {

        return cart.reduce(
            function (total, item) {

                const price =
                    safeNumber(
                        item.price,
                        0
                    );

                const quantity =
                    safeNumber(
                        item.quantity,
                        0
                    );

                return total +
                    (price * quantity);

            },
            0
        );

    }


    /* =========================
       UPDATE CART COUNTER
    ========================== */

    function updateCartCounter() {

        const count =
            getCartCount();


        if (cartCount) {

            if (count === 0) {

                cartCount.textContent =
                    "السلة فارغة";

            } else if (count === 1) {

                cartCount.textContent =
                    "صنف واحد";

            } else if (
                count >= 2 &&
                count <= 10
            ) {

                cartCount.textContent =
                    count + " أصناف";

            } else {

                cartCount.textContent =
                    count + " صنف";

            }

        }


        if (cartBadge) {

            cartBadge.textContent =
                count;

        }


        if (floatingCart) {

            floatingCart.classList.toggle(
                "has-items",
                count > 0
            );

        }

    }


    /* =========================
       ADD TO CART
    ========================== */

    function addToCart(product) {

        if (!product || !product.id) {

            console.error(
                "بيانات المنتج غير صالحة:",
                product
            );

            return;

        }


        const productId =
            String(product.id);


        const productPrice =
            safeNumber(
                product.price,
                0
            );


        const existingProduct =
            cart.find(
                function (item) {

                    return String(item.id) ===
                        productId;

                }
            );


        /*
         * المنتج موجود مسبقًا
         */

        if (existingProduct) {

            existingProduct.quantity =
                safeNumber(
                    existingProduct.quantity,
                    0
                ) + 1;


            /*
             * Analytics:
             * إضافة كمية جديدة للمنتج
             */

            trackEvent(
                "add_to_cart",
                {
                    currency: "SYP",

                    value: productPrice,

                    items: [
                        {
                            item_id: productId,

                            item_name:
                                String(
                                    product.name ||
                                    "منتج"
                                ),

                            price: productPrice,

                            quantity: 1
                        }
                    ]
                }
            );

        }


        /*
         * المنتج جديد
         */

        else {

            cart.push({

                id: productId,

                name:
                    String(
                        product.name || "منتج"
                    ),

                price:
                    productPrice,

                image:
                    product.image
                        ? String(product.image)
                        : "",

                quantity: 1

            });


            /*
             * Analytics:
             * إضافة منتج جديد
             */

            trackEvent(
                "add_to_cart",
                {
                    currency: "SYP",

                    value: productPrice,

                    items: [
                        {
                            item_id: productId,

                            item_name:
                                String(
                                    product.name ||
                                    "منتج"
                                ),

                            price: productPrice,

                            quantity: 1
                        }
                    ]
                }
            );

        }


        renderCart();

        showAddAnimation();

    }


    /* =========================
       REMOVE PRODUCT
    ========================== */

    function removeFromCart(productId) {

        const product =
            cart.find(
                function (item) {

                    return String(item.id) ===
                        String(productId);

                }
            );


        /*
         * تسجيل الحذف قبل حذف المنتج
         */

        if (product) {

            trackEvent(
                "remove_from_cart",
                {
                    currency: "SYP",

                    value:
                        safeNumber(
                            product.price,
                            0
                        ) *
                        safeNumber(
                            product.quantity,
                            1
                        ),

                    items: [
                        {
                            item_id:
                                String(
                                    product.id
                                ),

                            item_name:
                                String(
                                    product.name ||
                                    "منتج"
                                ),

                            price:
                                safeNumber(
                                    product.price,
                                    0
                                ),

                            quantity:
                                safeNumber(
                                    product.quantity,
                                    1
                                )
                        }
                    ]
                }
            );

        }


        cart = cart.filter(
            function (item) {

                return String(item.id) !==
                    String(productId);

            }
        );


        renderCart();

    }


    /* =========================
       INCREASE QUANTITY
    ========================== */

    function increaseQuantity(productId) {

        const product =
            cart.find(
                function (item) {

                    return String(item.id) ===
                        String(productId);

                }
            );


        if (!product) {

            return;

        }


        product.quantity =
            safeNumber(
                product.quantity,
                0
            ) + 1;


        /*
         * Analytics
         */

        trackEvent(
            "quantity_change",
            {
                currency: "SYP",

                change_type: "increase",

                value:
                    safeNumber(
                        product.price,
                        0
                    ),

                items: [
                    {
                        item_id:
                            String(product.id),

                        item_name:
                            String(
                                product.name ||
                                "منتج"
                            ),

                        price:
                            safeNumber(
                                product.price,
                                0
                            ),

                        quantity:
                            product.quantity
                    }
                ]
            }
        );


        renderCart();

    }


    /* =========================
       DECREASE QUANTITY
    ========================== */

    function decreaseQuantity(productId) {

        const product =
            cart.find(
                function (item) {

                    return String(item.id) ===
                        String(productId);

                }
            );


        if (!product) {

            return;

        }


        const currentQuantity =
            safeNumber(
                product.quantity,
                1
            );


        if (currentQuantity > 1) {

            product.quantity =
                currentQuantity - 1;


            /*
             * Analytics
             */

            trackEvent(
                "quantity_change",
                {
                    currency: "SYP",

                    change_type: "decrease",

                    value:
                        safeNumber(
                            product.price,
                            0
                        ),

                    items: [
                        {
                            item_id:
                                String(product.id),

                            item_name:
                                String(
                                    product.name ||
                                    "منتج"
                                ),

                            price:
                                safeNumber(
                                    product.price,
                                    0
                                ),

                            quantity:
                                product.quantity
                        }
                    ]
                }
            );


            renderCart();

        }


        else {

            removeFromCart(productId);

        }

    }


    /* =========================
       RENDER CART
    ========================== */

    function renderCart() {

        if (!cartItems) {

            return;

        }


        cartItems.innerHTML = "";


        if (cart.length === 0) {

            if (cartEmpty) {

                cartEmpty.style.display =
                    "flex";

            }

            cartItems.style.display =
                "none";

        }


        else {

            if (cartEmpty) {

                cartEmpty.style.display =
                    "none";

            }


            cartItems.style.display =
                "flex";


            cart.forEach(
                function (item) {

                    const cartItem =
                        document.createElement("div");


                    cartItem.className =
                        "cart-item";


                    const itemId =
                        escapeHTML(
                            item.id
                        );


                    const itemName =
                        escapeHTML(
                            item.name
                        );


                    const itemImage =
                        escapeHTML(
                            item.image
                        );


                    const price =
                        safeNumber(
                            item.price,
                            0
                        );


                    const quantity =
                        Math.max(
                            1,
                            safeNumber(
                                item.quantity,
                                1
                            )
                        );


                    const itemTotal =
                        price * quantity;


                    const imageHTML =
                        itemImage
                            ? `
                                <img
                                    src="${itemImage}"
                                    alt="${itemName}"
                                    loading="lazy"
                                    onerror="
                                        this.style.display='none';
                                        this.nextElementSibling.style.display='inline-flex';
                                    "
                                >

                                <span
                                    style="display:none;"
                                    aria-hidden="true"
                                >
                                    🍔
                                </span>
                              `
                            : `
                                <span
                                    aria-hidden="true"
                                >
                                    🍔
                                </span>
                              `;


                    cartItem.innerHTML = `
                        <div class="cart-item-image">

                            ${imageHTML}

                        </div>


                        <div class="cart-item-info">

                            <h4>
                                ${itemName}
                            </h4>


                            <span class="cart-item-price">
                                ${formatPrice(price)}
                            </span>


                            <div
                                class="quantity-controls"
                                aria-label="تعديل كمية ${itemName}"
                            >

                                <button
                                    type="button"
                                    class="quantity-btn increase-btn"
                                    data-id="${itemId}"
                                    aria-label="زيادة كمية ${itemName}"
                                    title="زيادة الكمية"
                                >
                                    +
                                </button>


                                <span
                                    class="quantity-number"
                                    aria-live="polite"
                                >
                                    ${quantity}
                                </span>


                                <button
                                    type="button"
                                    class="quantity-btn decrease-btn"
                                    data-id="${itemId}"
                                    aria-label="إنقاص كمية ${itemName}"
                                    title="إنقاص الكمية"
                                >
                                    −
                                </button>

                            </div>

                        </div>


                        <div class="cart-item-actions">

                            <strong
                                class="cart-item-total"
                                title="إجمالي المنتج"
                            >
                                ${formatPrice(itemTotal)}
                            </strong>


                            <button
                                type="button"
                                class="remove-item"
                                data-id="${itemId}"
                                aria-label="حذف ${itemName} من السلة"
                                title="حذف المنتج"
                            >
                                🗑️
                            </button>

                        </div>
                    `;


                    cartItems.appendChild(
                        cartItem
                    );

                }
            );

        }


        if (cartTotal) {

            cartTotal.textContent =
                formatPrice(
                    getCartTotal()
                );

        }


        updateCartCounter();

    }


    /* =========================
       CART ITEM EVENTS
       EVENT DELEGATION
    ========================== */

    if (cartItems) {

        cartItems.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "button"
                    );


                if (!button) {

                    return;

                }


                const productId =
                    button.dataset.id;


                if (!productId) {

                    return;

                }


                if (
                    button.classList.contains(
                        "increase-btn"
                    )
                ) {

                    increaseQuantity(
                        productId
                    );

                }


                else if (
                    button.classList.contains(
                        "decrease-btn"
                    )
                ) {

                    decreaseQuantity(
                        productId
                    );

                }


                else if (
                    button.classList.contains(
                        "remove-item"
                    )
                ) {

                    removeFromCart(
                        productId
                    );

                }

            }
        );

    }


    /* =========================
       ADD PRODUCT EVENTS
    ========================== */

    const addButtons =
        document.querySelectorAll(
            ".add-to-cart-btn, .small-add-to-cart-btn, .drink-add-btn"
        );


    addButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productElement =
                        button.closest(
                            ".product-card, .small-product, .drink-item"
                        );


                    if (!productElement) {

                        console.error(
                            "لم يتم العثور على عنصر المنتج."
                        );

                        return;

                    }


                    const product = {

                        id:
                            productElement.dataset.id,

                        name:
                            productElement.dataset.name,

                        price:
                            productElement.dataset.price,

                        image:
                            productElement.dataset.image || ""

                    };


                    if (
                        !product.id ||
                        !product.name ||
                        product.price === undefined ||
                        product.price === ""
                    ) {

                        console.error(
                            "بيانات المنتج ناقصة:",
                            product
                        );

                        return;

                    }


                    if (
                        !Number.isFinite(
                            Number(product.price)
                        )
                    ) {

                        console.error(
                            "سعر المنتج غير صالح:",
                            product
                        );

                        return;

                    }


                    addToCart(
                        product
                    );


                    animateButton(
                        button
                    );

                }
            );

        }
    );


    /* =========================
       CATEGORY ANALYTICS
    ========================== */

    const categoryLinks =
        document.querySelectorAll(
            ".categories .category"
        );


    categoryLinks.forEach(
        function (categoryLink) {

            categoryLink.addEventListener(
                "click",
                function () {

                    const categoryName =
                        categoryLink
                            .querySelector("span:last-child");

                    const categoryText =
                        categoryName
                            ? categoryName.textContent.trim()
                            : categoryLink.textContent.trim();


                    const categoryId =
                        (
                            categoryLink.getAttribute("href") ||
                            ""
                        ).replace("#", "");


                    trackEvent(
                        "category_click",
                        {
                            category_name:
                                categoryText,

                            category_id:
                                categoryId
                        }
                    );

                }
            );

        }
    );


    /* =========================
       ADD BUTTON ANIMATION
    ========================== */

    function animateButton(button) {

        if (!button) {

            return;

        }


        const originalText =
            button.innerHTML;


        button.disabled = true;


        button.classList.add(
            "added"
        );


        button.innerHTML =
            "✓ تمت الإضافة";


        setTimeout(
            function () {

                button.innerHTML =
                    originalText;


                button.classList.remove(
                    "added"
                );


                button.disabled =
                    false;

            },
            1200
        );

    }


    /* =========================
       CART ADD ANIMATION
    ========================== */

    function showAddAnimation() {

        if (!floatingCart) {

            return;

        }


        floatingCart.classList.remove(
            "cart-bounce"
        );


        void floatingCart.offsetWidth;


        floatingCart.classList.add(
            "cart-bounce"
        );


        setTimeout(
            function () {

                floatingCart.classList.remove(
                    "cart-bounce"
                );

            },
            500
        );

    }


    /* =========================
       OPEN CART
    ========================== */

    if (floatingCart) {

        floatingCart.addEventListener(
            "click",
            function () {

                if (!cartOverlay) {

                    return;

                }


                renderCart();


                /*
                 * Analytics:
                 * فتح السلة
                 */

                trackEvent(
                    "view_cart",
                    {
                        currency: "SYP",

                        value:
                            getCartTotal(),

                        items:
                            getAnalyticsItems()
                    }
                );


                cartOverlay.classList.add(
                    "show"
                );


                document.body.style.overflow =
                    "hidden";

            }
        );

    }


    /* =========================
       CLOSE CART
    ========================== */

    if (closeCart) {

        closeCart.addEventListener(
            "click",
            closeCartPanel
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    cartOverlay
                ) {

                    closeCartPanel();

                }

            }
        );

    }


    function closeCartPanel() {

        if (cartOverlay) {

            cartOverlay.classList.remove(
                "show"
            );

        }


        document.body.style.overflow =
            "";

    }


    /* =========================
       ESC KEY - CLOSE CART
    ========================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                cartOverlay &&
                cartOverlay.classList.contains(
                    "show"
                )
            ) {

                closeCartPanel();

            }

        }
    );


    /* =========================
       GET CUSTOMER DATA
    ========================== */

    function getCustomerData() {

        const customerNameElement =
            document.getElementById(
                "customerName"
            );


        const customerPhoneElement =
            document.getElementById(
                "customerPhone"
            );


        const customerAddressElement =
            document.getElementById(
                "customerAddress"
            );


        const customerNotesElement =
            document.getElementById(
                "customerNotes"
            );


        return {

            name:
                customerNameElement
                    ? customerNameElement.value.trim()
                    : "",

            phone:
                customerPhoneElement
                    ? customerPhoneElement.value.trim()
                    : "",

            address:
                customerAddressElement
                    ? customerAddressElement.value.trim()
                    : "",

            notes:
                customerNotesElement
                    ? customerNotesElement.value.trim()
                    : "",

            nameElement:
                customerNameElement,

            phoneElement:
                customerPhoneElement,

            addressElement:
                customerAddressElement,

            notesElement:
                customerNotesElement

        };

    }


    /* =========================
       VALIDATE CUSTOMER DATA
    ========================== */

    function validateCustomerData(customer) {

        if (!customer.name) {

            alert(
                "يرجى إدخال الاسم"
            );


            if (customer.nameElement) {

                customer.nameElement.focus();

            }


            return false;

        }


        if (!customer.phone) {

            alert(
                "يرجى إدخال رقم الهاتف"
            );


            if (customer.phoneElement) {

                customer.phoneElement.focus();

            }


            return false;

        }


        if (!customer.address) {

            alert(
                "يرجى إدخال عنوان التوصيل"
            );


            if (customer.addressElement) {

                customer.addressElement.focus();

            }


            return false;

        }


        return true;

    }


    /* =========================
       BUILD WHATSAPP MESSAGE
    ========================== */

    function buildWhatsAppMessage(customer) {

        let message =
            "🍔 *طلب جديد - مولانا برغر*\n\n";


        message +=
            "━━━━━━━━━━━━━━\n\n";


        message +=
            "👤 *العميل:*\n" +
            customer.name +
            "\n\n";


        message +=
            "📱 *الهاتف:*\n" +
            customer.phone +
            "\n\n";


        message +=
            "📍 *العنوان:*\n" +
            customer.address +
            "\n\n";


        message +=
            "━━━━━━━━━━━━━━\n\n";


        message +=
            "🛒 *تفاصيل الطلب:*\n\n";


        cart.forEach(
            function (item, index) {

                const price =
                    safeNumber(
                        item.price,
                        0
                    );


                const quantity =
                    safeNumber(
                        item.quantity,
                        1
                    );


                const itemTotal =
                    price * quantity;


                message +=
                    `${index + 1}️⃣ *${item.name}*\n`;


                message +=
                    `الكمية: ${quantity}\n`;


                message +=
                    `سعر القطعة: ${formatPrice(price)}\n`;


                message +=
                    `الإجمالي: ${formatPrice(itemTotal)}\n\n`;

            }
        );


        message +=
            "━━━━━━━━━━━━━━\n\n";


        message +=
            "💰 *الإجمالي النهائي:*\n" +
            formatPrice(
                getCartTotal()
            ) +
            "\n\n";


        if (customer.notes) {

            message +=
                "📝 *ملاحظات:*\n" +
                customer.notes +
                "\n\n";

        }


        message +=
            "━━━━━━━━━━━━━━\n\n";


        message +=
            "🍔 شكراً لاختياركم مولانا برغر 🤍";


        return message;

    }


    /* =========================
       SEND ORDER TO WHATSAPP
    ========================== */

    if (whatsappOrder) {

        whatsappOrder.addEventListener(
            "click",
            sendToWhatsApp
        );

    }


    function sendToWhatsApp() {

        /*
         * التأكد من وجود طلب
         */

        if (cart.length === 0) {

            /*
             * Analytics:
             * محاولة طلب بدون منتجات
             */

            trackEvent(
                "empty_order_attempt"
            );


            alert(
                "سلة الطلب فارغة 🛒\n\nأضف المنتجات أولاً."
            );

            return;

        }


        /*
         * الحصول على بيانات الزبون
         */

        const customer =
            getCustomerData();


        /*
         * التحقق من بيانات الزبون
         */

        if (
            !validateCustomerData(
                customer
            )
        ) {

            /*
             * لا نرسل أي بيانات شخصية إلى Analytics.
             */

            return;

        }


        /*
         * Analytics:
         * بدأ المستخدم عملية الطلب
         *
         * ملاحظة:
         * لا نرسل بيانات الزبون.
         */

        trackEvent(
            "begin_checkout",
            {
                currency: "SYP",

                value:
                    getCartTotal(),

                items:
                    getAnalyticsItems()
            }
        );


        /*
         * حفظ بيانات Analytics قبل تفريغ السلة
         */

        const analyticsItems =
            getAnalyticsItems();

        const analyticsTotal =
            getCartTotal();

        const analyticsItemCount =
            getCartCount();


        /*
         * بناء رسالة واتساب
         */

        const message =
            buildWhatsAppMessage(
                customer
            );


        /*
         * إنشاء رابط واتساب
         */

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


        /*
         * فتح واتساب
         */

        const whatsappWindow =
            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );


        /*
         * إذا نجح فتح واتساب
         */

        if (whatsappWindow) {

            /*
             * Analytics:
             * تم الوصول فعليًا إلى خطوة إرسال الطلب
             */

            trackEvent(
                "whatsapp_order",
                {
                    currency: "SYP",

                    value:
                        analyticsTotal,

                    items_count:
                        analyticsItemCount,

                    items:
                        analyticsItems,

                    order_channel:
                        "whatsapp"
                }
            );


            /*
             * تفريغ السلة
             */

            cart = [];


            renderCart();


            clearCustomerForm();


            closeCartPanel();


            setTimeout(
                function () {

                    alert(
                        "تم تجهيز طلبك بنجاح ✅\n\nتم فتح واتساب لإرسال الطلب.\n\nيمكنك التواصل معنا عبر واتساب إذا أردت إجراء أي تعديل."
                    );

                },
                250
            );

        }


        /*
         * إذا منع المتصفح فتح واتساب
         */

        else {

            /*
             * Analytics:
             * تعذر فتح واتساب
             */

            trackEvent(
                "whatsapp_open_failed",
                {
                    currency: "SYP",

                    value:
                        analyticsTotal,

                    items_count:
                        analyticsItemCount
                }
            );


            alert(
                "تعذر فتح واتساب تلقائيًا.\n\nيرجى السماح بالنوافذ المنبثقة لهذا الموقع ثم المحاولة مرة أخرى."
            );

        }

    }


    /* =========================
       CLEAR CUSTOMER FORM
    ========================== */

    function clearCustomerForm() {

        const customerName =
            document.getElementById(
                "customerName"
            );


        const customerPhone =
            document.getElementById(
                "customerPhone"
            );


        const customerAddress =
            document.getElementById(
                "customerAddress"
            );


        const customerNotes =
            document.getElementById(
                "customerNotes"
            );


        if (customerName) {

            customerName.value = "";

        }


        if (customerPhone) {

            customerPhone.value = "";

        }


        if (customerAddress) {

            customerAddress.value = "";

        }


        if (customerNotes) {

            customerNotes.value = "";

        }

    }


    /* =========================
       EDIT ORDER VIA WHATSAPP
    ========================== */

    const editOrderWhatsApp =
        document.getElementById(
            "editOrderWhatsApp"
        );


    if (editOrderWhatsApp) {

        editOrderWhatsApp.addEventListener(
            "click",
            function () {

                /*
                 * Analytics:
                 * طلب تعديل عبر WhatsApp
                 */

                trackEvent(
                    "edit_order_whatsapp",
                    {
                        order_channel:
                            "whatsapp"
                    }
                );


                const message =
                    "مرحباً مولانا برغر 👋\n\n" +
                    "أرغب بتعديل طلبي الذي أرسلته مسبقاً عبر واتساب.\n\n" +
                    "يرجى مساعدتي في تعديل الطلب.\n\n" +
                    "شكراً لكم 🤍";


                const whatsappURL =
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* =========================
       INITIAL LOAD
    ========================== */

    cart = [];


    renderCart();


    updateCartCounter();

});
