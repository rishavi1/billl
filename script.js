let selectedProduct = {};
let quantity = 1;
let totalAmount = 0;
let subTotalAmount = 0;
let gstPercent = 5;

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
    subTotalAmount += total;

    let div = document.createElement("div");
    div.className = "invoice-item";
    div.innerHTML = `
        ${selectedProduct.name} x${quantity}
        <span style="float:right;">₹${total}</span>
    `;

    let startX = 0;
    div.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    div.addEventListener("touchmove", e => {
        let moveX = e.touches[0].clientX - startX;
        if (moveX < -70) {
            div.style.transform = "translateX(-100%)";
            setTimeout(() => {
                div.remove();
                subTotalAmount -= total;
                updateTotal();
            }, 300);
        }
    });

    document.getElementById("invoiceBody").appendChild(div);
    updateTotal();
    closeModal();
}

function updateTotal() {
    let discount = parseFloat(document.getElementById("discountInput")?.value) || 0;
    let gst = (subTotalAmount * gstPercent) / 100;
    let finalTotal = subTotalAmount + gst - discount;

    if (finalTotal < 0) finalTotal = 0;

    document.getElementById("subTotal").innerText = subTotalAmount.toFixed(2);
    document.getElementById("gstAmount").innerText = gst.toFixed(2);
    document.getElementById("grandTotal").innerText = finalTotal.toFixed(2);

    totalAmount = finalTotal;
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
    alert(
        "Payment Successful\n\n" +
        "Method: " + method +
        "\nTotal Paid: ₹" + totalAmount
    );
    clearInvoice();
}

function clearInvoice() {
    document.getElementById("invoiceBody").innerHTML = "";
    subTotalAmount = 0;
    totalAmount = 0;
    document.getElementById("discountInput").value = "";
    updateTotal();
    switchScreen("productScreen");
}

function switchScreen(id) {
    document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}
