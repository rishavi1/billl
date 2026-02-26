let selectedProduct = {};
let quantity = 1;
let totalAmount = 0;

/* Auto Date */
document.getElementById("invoiceDate").innerText =
    new Date().toLocaleString();

/* Auto Invoice Number */
let invoiceCounter = localStorage.getItem("invoiceCounter") || 1001;
document.getElementById("invoiceNumberInput").value = invoiceCounter;

function openQuantity(name, price) {
    selectedProduct = { name, price };
    quantity = 1;
    document.getElementById("quantityValue").innerText = quantity;
    document.getElementById("modalProductName").innerText = name;
    document.getElementById("quantityModal").style.display = "flex";
}

function changeQty(change) {
    quantity += change;
    if (quantity < 1) quantity = 1;
    document.getElementById("quantityValue").innerText = quantity;
}

function confirmAdd() {
    let total = selectedProduct.price * quantity;
    totalAmount += total;

    let div = document.createElement("div");
    div.className = "invoice-item";
    div.innerHTML = `
        ${selectedProduct.name} x${quantity}
        <span style="float:right;">₹${total}</span>
    `;

    /* Swipe to remove */
    let startX = 0;
    div.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    div.addEventListener("touchmove", e => {
        let moveX = e.touches[0].clientX - startX;
        if (moveX < -70) {
            div.style.transform = "translateX(-100%)";
            setTimeout(() => {
                div.remove();
                totalAmount -= total;
                updateTotal();
            }, 300);
        }
    });

    document.getElementById("invoiceBody").appendChild(div);
    updateTotal();
    closeModal();
}

function updateTotal() {
    document.getElementById("grandTotal").innerText = totalAmount;
}

function closeModal() {
    document.getElementById("quantityModal").style.display = "none";
}

function printInvoice() {
    let customNo = document.getElementById("invoiceNumberInput").value;

    if (!customNo) {
        alert("Enter Invoice Number");
        return;
    }

    localStorage.setItem("invoiceCounter", parseInt(customNo) + 1);

    window.print();
}

function goToPayment() {
    switchScreen("paymentScreen");
}

function completePayment(method) {
    alert("Payment Successful via " + method);
    location.reload();
}

function switchScreen(id) {
    document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}