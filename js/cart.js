
document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SETTINGS
    ========================== */

    // رقم واتساب المطعم
    // يجب أن يكون بدون (+) وبدون مسافات
    const WHATSAPP_NUMBER = "+963940015220";


    /* =========================
       CART DATA
    ========================== */

    // السلة تبدأ فارغة مع كل جلسة جديدة.
    // لا يوجد localStorage حتى لا تنتقل طلبات
    // الزبون السابق إلى الزبون الجديد.
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


        /*
         * النص الموجود داخل زر السلة
         */

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


        /*
         * الرقم الموجود على Badge
         */

        if (cartBadge) {

            cartBadge.textContent =
                count;

        }


        /*
         * حالة زر السلة
         */

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


        /*
         * البحث عن المنتج إذا كان موجودًا
         */

        const existingProduct =
            cart.find(
                function (item) {

                    return String(item.id) ===
                        productId;

                }
            );


        /*
         * إذا كان المنتج موجودًا
         * نزيد الكمية فقط
         */

        if (existingProduct) {

            existingProduct.quantity =
                safeNumber(
                    existingProduct.quantity,
                    0
                ) + 1;

        }


        /*
         * إذا كان جديدًا
         */

        else {

            cart.push({

                id: productId,

                name:
                    String(
                        product.name || "منتج"
                    ),

                price:
                    safeNumber(
                        product.price,
                        0
                    ),

                image:
                    product.image
                        ? String(product.image)
                        : "",

                quantity: 1

            });

        }


        /*
         * إعادة رسم السلة
         */

        renderCart();


        /*
         * حركة زر السلة
         */

        showAddAnimation();

    }


    /* =========================
       REMOVE PRODUCT
    ========================== */

    function removeFromCart(productId) {

        cart = cart.filter(
            function (item) {

                return String(item.id) !==
                    String(productId);

            }
        );


        /*
         * تحديث السلة مباشرة
         */

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


        /*
         * إذا كانت الكمية أكثر من 1
         * ننقص واحدة
         */

        if (currentQuantity > 1) {

            product.quantity =
                currentQuantity - 1;

            renderCart();

        }


        /*
         * إذا كانت الكمية = 1
         * نحذف المنتج بالكامل
         */

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


        /*
         * تفريغ المحتوى القديم
         */

        cartItems.innerHTML = "";


        /*
         * السلة فارغة
         */

        if (cart.length === 0) {

            if (cartEmpty) {

                cartEmpty.style.display =
                    "flex";

            }

            cartItems.style.display =
                "none";

        }


        /*
         * السلة تحتوي على منتجات
         */

        else {

            if (cartEmpty) {

                cartEmpty.style.display =
                    "none";

            }


            cartItems.style.display =
                "flex";


            /*
             * رسم كل منتج
             */

            cart.forEach(
                function (item) {

                    const cartItem =
                        document.createElement("div");


                    cartItem.className =
                        "cart-item";


                    /*
                     * البيانات الآمنة
                     */

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


                    /*
                     * صورة المنتج
                     */

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


                    /*
                     * HTML الخاص بالمنتج
                     */

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


                    /*
                     * إضافة المنتج إلى السلة
                     */

                    cartItems.appendChild(
                        cartItem
                    );

                }
            );

        }


        /*
         * تحديث الإجمالي
         */

        if (cartTotal) {

            cartTotal.textContent =
                formatPrice(
                    getCartTotal()
                );

        }


        /*
         * تحديث العداد
         */

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


                /*
                 * زيادة الكمية
                 */

                if (
                    button.classList.contains(
                        "increase-btn"
                    )
                ) {

                    increaseQuantity(
                        productId
                    );

                }


                /*
                 * إنقاص الكمية
                 */

                else if (
                    button.classList.contains(
                        "decrease-btn"
                    )
                ) {

                    decreaseQuantity(
                        productId
                    );

                }


                /*
                 * حذف المنتج بالكامل
                 */

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


                    /*
                     * استخراج بيانات المنتج
                     */

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


                    /*
                     * التحقق من البيانات
                     */

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


                    /*
                     * التحقق من السعر
                     */

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


                    /*
                     * إضافة المنتج
                     */

                    addToCart(
                        product
                    );


                    /*
                     * حركة زر الإضافة
                     */

                    animateButton(
                        button
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


        /*
         * حفظ النص الأصلي
         */

        const originalText =
            button.innerHTML;


        /*
         * منع الضغط المتكرر
         */

        button.disabled = true;


        /*
         * تغيير التصميم
         */

        button.classList.add(
            "added"
        );


        button.innerHTML =
            "✓ تمت الإضافة";


        /*
         * إعادة الزر إلى حالته الأصلية
         */

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


        /*
         * إزالة الحركة القديمة
         */

        floatingCart.classList.remove(
            "cart-bounce"
        );


        /*
         * إجبار المتصفح على إعادة تشغيل animation
         */

        void floatingCart.offsetWidth;


        /*
         * تشغيل الحركة
         */

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


                /*
                 * تحديث السلة قبل فتحها
                 */

                renderCart();


                /*
                 * فتح السلة
                 */

                cartOverlay.classList.add(
                    "show"
                );


                /*
                 * منع تمرير الصفحة بالخلفية
                 */

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


    /*
     * إغلاق عند الضغط خارج السلة
     */

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


        /*
         * إضافة كل المنتجات
         */

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


        /*
         * الملاحظات إذا كانت موجودة
         */

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

            return;

        }


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
             * تفريغ السلة
             */

            cart = [];


            /*
             * إعادة رسم السلة
             */

            renderCart();


            /*
             * مسح بيانات الزبون
             */

            clearCustomerForm();


            /*
             * إغلاق نافذة السلة
             */

            closeCartPanel();


            /*
             * إعلام الزبون
             */

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
             * لا نحذف السلة
             */

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

    /*
     * اختياري:
     *
     * إذا كان لديك زر في HTML بهذا الشكل:
     *
     * id="editOrderWhatsApp"
     *
     * فسيتم فتح واتساب برسالة خاصة
     * لطلب تعديل الطلب.
     */

    const editOrderWhatsApp =
        document.getElementById(
            "editOrderWhatsApp"
        );


    if (editOrderWhatsApp) {

        editOrderWhatsApp.addEventListener(
            "click",
            function () {

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

    /*
     * التأكيد أن السلة جديدة وفارغة
     * عند كل تحميل للموقع.
     */

    cart = [];


    /*
     * رسم السلة
     */

    renderCart();


    /*
     * تحديث العداد
     */

    updateCartCounter();

});

