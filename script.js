/* =========================================
   FOODIE HUB
   Main JavaScript File
========================================= */


/* =========================================
   GET CART
========================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("foodieCart")
        ) || [];

    }

    catch (error) {

        return [];

    }

}



/* =========================================
   SAVE CART
========================================= */

function saveCart(cart) {

    localStorage.setItem(
        "foodieCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}



/* =========================================
   ADD TO CART
========================================= */

function addToCart(name, price) {

    const cart = getCart();

    const existingItem = cart.find(
        item => item.name === name
    );


    if (existingItem) {

        existingItem.qty++;

    }

    else {

        cart.push({

            name: name,

            price: price,

            qty: 1

        });

    }


    saveCart(cart);


    showMessage(
        name + " added to cart! 🛒"
    );

}



/* =========================================
   CART COUNT
========================================= */

function updateCartCount() {

    const cart = getCart();


    const count = cart.reduce(

        (total, item) => {

            return total + item.qty;

        },

        0

    );


    document
        .querySelectorAll("#cartCount")
        .forEach(element => {

            element.textContent = count;

        });

}



/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQty(index, amount) {

    const cart = getCart();


    if (!cart[index]) {

        return;

    }


    cart[index].qty += amount;


    if (cart[index].qty <= 0) {

        cart.splice(index, 1);

    }


    saveCart(cart);


    renderCart();

}



/* =========================================
   REMOVE ITEM
========================================= */

function removeItem(index) {

    const cart = getCart();


    if (!cart[index]) {

        return;

    }


    const itemName = cart[index].name;


    cart.splice(index, 1);


    saveCart(cart);


    renderCart();


    showMessage(
        itemName + " removed from cart"
    );

}



/* =========================================
   DISPLAY CART
========================================= */

function renderCart() {

    const cartBox =
        document.getElementById("cartItems");


    if (!cartBox) {

        return;

    }


    const emptyCart =
        document.getElementById("emptyCart");


    const cart = getCart();


    cartBox.innerHTML = "";



    /* EMPTY CART */

    if (cart.length === 0) {

        emptyCart.style.display = "block";

        updateBill();

        return;

    }


    emptyCart.style.display = "none";



    /* DISPLAY EACH ITEM */

    cart.forEach(

        (item, index) => {


            const row =
                document.createElement("div");


            row.className = "cart-row";


            row.innerHTML = `

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <small>
                        ₹${item.price} each
                    </small>

                </div>


                <div class="qty">

                    <button
                        onclick="changeQty(${index}, -1)"
                    >
                        −
                    </button>


                    <span>
                        ${item.qty}
                    </span>


                    <button
                        onclick="changeQty(${index}, 1)"
                    >
                        +
                    </button>

                </div>


                <strong>

                    ₹${item.price * item.qty}

                </strong>


                <button
                    class="remove"
                    onclick="removeItem(${index})"
                >

                    ✕

                </button>

            `;


            cartBox.appendChild(row);

        }

    );


    updateBill();

}



/* =========================================
   UPDATE BILL
========================================= */

function updateBill() {

    const cart = getCart();


    const subtotal = cart.reduce(

        (total, item) => {

            return total +
                item.price * item.qty;

        },

        0

    );


    let delivery = 0;


    if (subtotal > 0) {

        if (subtotal >= 500) {

            delivery = 0;

        }

        else {

            delivery = 40;

        }

    }


    const finalTotal =
        subtotal + delivery;



    const subtotalElement =
        document.getElementById("subtotal");


    const deliveryElement =
        document.getElementById("delivery");


    const totalElement =
        document.getElementById("totalBox");



    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" + subtotal;

    }


    if (deliveryElement) {

        if (delivery === 0 && subtotal > 0) {

            deliveryElement.textContent =
                "FREE";

        }

        else {

            deliveryElement.textContent =
                "₹" + delivery;

        }

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" + finalTotal;

    }


    updateCartCount();

}



/* =========================================
   PLACE ORDER
========================================= */

function placeOrder() {

    const cart = getCart();


    /* CHECK CART */

    if (cart.length === 0) {

        showMessage(
            "Please add at least one item."
        );

        return;

    }



    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    const phone =
        document
            .getElementById("customerPhone")
            .value
            .trim();


    const address =
        document
            .getElementById("customerAddress")
            .value
            .trim();



    /* VALIDATION */

    if (
        !name ||
        phone.length !== 10 ||
        !/^\d+$/.test(phone) ||
        !address
    ) {

        showMessage(
            "Please enter valid customer details."
        );

        return;

    }



    /* CALCULATE TOTAL */

    const subtotal = cart.reduce(

        (total, item) => {

            return total +
                item.price * item.qty;

        },

        0

    );


    const delivery =
        subtotal >= 500
            ? 0
            : 40;


    const total =
        subtotal + delivery;



    /* CREATE ORDER */

    const order = {

        id:
            "#FOOD" +
            Math.floor(
                10000 +
                Math.random() * 90000
            ),

        total: total,

        name: name,

        phone: phone,

        address: address,

        items: cart,

        date:
            new Date().toLocaleString()

    };



    /* SAVE ORDER */

    localStorage.setItem(

        "lastOrder",

        JSON.stringify(order)

    );



    /* CLEAR CART */

    localStorage.removeItem(
        "foodieCart"
    );



    /* OPEN CONFIRMATION */

    location.href =
        "Orderconfirmation.html";

}



/* =========================================
   LOAD ORDER CONFIRMATION
========================================= */

function loadConfirmation() {

    const order =
        JSON.parse(
            localStorage.getItem("lastOrder")
        );


    if (!order) {

        return;

    }


    const orderId =
        document.getElementById("orderId");


    const total =
        document.getElementById("paidTotal");


    const customer =
        document.getElementById(
            "customerDisplay"
        );



    if (orderId) {

        orderId.textContent =
            order.id;

    }


    if (total) {

        total.textContent =
            "₹" + order.total;

    }


    if (customer) {

        customer.textContent =
            order.name;

    }

}



/* =========================================
   SEARCH + CATEGORY FILTER
========================================= */

function filterFood() {

    const search =
        (
            document
                .getElementById("searchFood")
                ?.value || ""
        ).toLowerCase();


    const category =
        document
            .getElementById("categoryFilter")
            ?.value || "all";



    document
        .querySelectorAll(
            ".menu-container .card"
        )
        .forEach(card => {


            const foodName =
                card.dataset.name;


            const foodCategory =
                card.dataset.category;


            const nameMatch =
                foodName.includes(search);


            const categoryMatch =
                category === "all" ||
                foodCategory === category;



            if (
                nameMatch &&
                categoryMatch
            ) {

                card.style.display =
                    "block";

            }

            else {

                card.style.display =
                    "none";

            }

        });

}



/* =========================================
   BACK BUTTON
========================================= */

function goBack() {

    if (history.length > 1) {

        history.back();

    }

    else {

        location.href =
            "index.html";

    }

}



/* =========================================
   SUCCESS MESSAGE
========================================= */

function showMessage(text) {

    let toast =
        document.getElementById("toast");


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "toast";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent = text;


    toast.classList.add("show");


    setTimeout(

        () => {

            toast.classList.remove(
                "show"
            );

        },

        2200

    );

}



/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        updateCartCount();

    }

);