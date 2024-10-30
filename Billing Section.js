const employeeIDs = {
    '696969': 'Philrod',
    '009500': 'Florian',
    '567800': 'Pauline',
    '432100': 'Joriz'
};

let passcode = '';
let currentCashier = '';

function enterDigit(digit) {
    if (passcode.length < 6) {
        passcode += digit;
        document.getElementById('passcode-input').value = passcode;
    }
}

function clearPasscode() {
    passcode = '';
    document.getElementById('passcode-input').value = passcode;
}

function submitPasscode() {
    if (employeeIDs[passcode]) {
        currentCashier = employeeIDs[passcode];
        alert(`Welcome Employee: ${currentCashier}`);
        localStorage.setItem('currentCashier', currentCashier);
        window.location.href = 'Billing Section.html'; 
    } else {
        alert('Invalid Employee ID');
        clearPasscode(); 
    }
}

const itemPrices = {
    'Strawberry': 50,
    'Cheese': 50,
    'Mango': 50,
    'Avocado': 60,
    'Vanilla': 50,
    'Chocolate': 50,
    'Dark Chocolate': 75,
    'Cookies N Cream': 100,
    'Rocky Road': 100,
    'Ube': 50,
    'Blueberry Shortcake': 140,
    'Pistachio': 140,
    'Mint Chocolate': 140,
    'Chocolate Chip': 100,
    'Salted Caramel': 140,
    'Choco Vanilla': 100,
    'Tiramisu': 140,
    'Matcha': 140,
    'Pink Bubblegum': 160,
    'Strawberry Vanilla': 160,
    'Blueberry': 100,
    'Cotton Candy': 180,
    'Strawberry Lemonade': 160,
    'Rainbow': 180,
    'Moose Tracks': 180,
};

const inventoryStock = {
    'Strawberry': 100,
    'Cheese': 100,
    'Mango': 100,
    'Avocado': 100,
    'Vanilla': 100,
    'Chocolate': 100,
    'Dark Chocolate': 100,
    'Cookies N Cream': 100,
    'Rocky Road': 100,
    'Ube': 100,
    'Blueberry Shortcake': 100,
    'Pistachio': 100,
    'Mint Chocolate': 100,
    'Chocolate Chip': 100,
    'Salted Caramel': 100,
    'Choco Vanilla': 100,
    'Tiramisu': 100,
    'Matcha': 100,
    'Pink Bubblegum': 100,
    'Strawberry Vanilla': 100,
    'Blueberry': 100,
    'Cotton Candy': 100,
    'Strawberry Lemonade': 100,
    'Rainbow': 100,
    'Moose Tracks': 100,
};

function addItemToBill(itemName) {
    itemName = itemName.replace("Ice-Cream", "").trim();
    const billingItemsContainer = document.getElementById('billingItems');
    let itemElement = billingItemsContainer.querySelector(`[data-item="${itemName}"]`);
    const price = itemPrices[itemName];

    if (!price) {
        console.error(`Price for ${itemName} not found.`);
        return;
    }

    if (inventoryStock[itemName] === undefined) {
        console.error(`Item "${itemName}" not found in inventory`);
        return;
    }

    if (inventoryStock[itemName] > 0) {
        if (itemElement) {
            let quantitySpan = itemElement.querySelector('.quantity');
            let quantity = parseInt(quantitySpan.textContent.replace('x', '')) + 1; 
            quantitySpan.textContent = `x${quantity}`; 
            const priceSpan = itemElement.querySelector('.price'); 
            priceSpan.textContent = `$${(price * quantity).toFixed(2)}`;
        } else {
            itemElement = document.createElement('div');
            itemElement.className = 'billing-item';
            itemElement.setAttribute('data-item', itemName);
            itemElement.innerHTML = `<h4>${itemName} <span class="quantity">x1</span></h4><span class="price">$${price.toFixed(2)}</span>`;
            billingItemsContainer.appendChild(itemElement);
        }

        inventoryStock[itemName]--; 
        updateInventoryModal();
        updateTotal();  
    } else {
        alert(`${itemName} is out of stock!`);
    }
}

function removeItemFromBill(itemElement) {
    itemElement.classList.add('slide-out');
    setTimeout(() => {
        itemElement.remove();
        updateTotal();
    }, 300);
}

document.getElementById('billingItems').addEventListener('click', (event) => {
    if (event.target.closest('.billing-item')) {
        const itemElement = event.target.closest('.billing-item');
        removeItemFromBill(itemElement);
    }
});

function updateTotal() {
    const billingItemsContainer = document.getElementById('billingItems');
    const totalAmountElement = document.getElementById('totalAmount');
    let total = 0;

    const items = billingItemsContainer.querySelectorAll('.billing-item');
    items.forEach(item => {
        const itemName = item.getAttribute('data-item');
        const price = itemPrices[itemName];
        const quantity = parseInt(item.querySelector('.quantity').textContent.replace('x', ''));
        total += price * quantity;
    });

    totalAmountElement.textContent = `Total: $${total.toFixed(2)}`;
}

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const itemName = item.querySelector('h3').textContent;
        addItemToBill(itemName);
    });
});

document.querySelector('.charge-button').addEventListener('click', function() {
    document.getElementById('chargeModal').style.display = 'flex';
});

function closeModal() {
    document.getElementById('chargeModal').style.display = 'none';
}

document.getElementById('amountGiven').addEventListener('input', function() {
    const totalAmount = parseFloat(document.getElementById('totalAmount').textContent.replace('Total: $', ''));
    const amountGiven = parseFloat(this.value);
    const change = amountGiven - totalAmount;

    document.getElementById('changeAmount').textContent = (isNaN(change) || change < 0) ? 'Change: $0.00' : `Change: $${change.toFixed(2)}`;
});

function renderInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = ''; 

    // Sort items from lowest to highest stock quantity
    const sortedItems = Object.keys(inventoryStock).sort((a, b) => {
        return inventoryStock[a] - inventoryStock[b];
    });

    sortedItems.forEach(itemName => {
        const listItem = document.createElement('li');
        listItem.className = 'inventory-item';
        listItem.innerHTML = 
            `<h3>${itemName}</h3>
            <img src="images/${itemName}.png" alt="${itemName}" style="width: 50px; height: 50px; margin-right: 10px;">
            <span>Stock: ${inventoryStock[itemName]}</span>
            <input type="number" id="restock${itemName}" placeholder="Restock Qty" style="margin-left: 10px; width: 60px;">
            <button onclick="restockItem('${itemName}', 'stock${itemName}')">Restock</button>`;
        
        inventoryList.appendChild(listItem);
    });
}

function printReceipt() {
    const billingItemsContainer = document.getElementById('billingItems');
    const items = billingItemsContainer.querySelectorAll('.billing-item');
    const totalAmountElement = document.getElementById('totalAmount');
    
    let total = 0;
    const totalAmount = parseFloat(totalAmountElement.textContent.replace('Total: $', ''));
    const amountGiven = parseFloat(document.getElementById('amountGiven').value);
    const change = amountGiven - totalAmount;

    const paymentMethod = document.getElementById('paymentMethod').value;

    currentCashier = localStorage.getItem('currentCashier') || 'Unknown Cashier';

    let receiptContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    h1 {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <center><img src="Logo.png" alt="Logo" style="width: 100px; height: auto; margin-bottom: 5px;"></center>
                <h1>Receipt</h1>
                <h4><center>Chamber Ice-Cream</center></h4>
                <p><center>15555, Area C, Airport Village</center></p>
                <p><center>Moonwalk, Paranaque City</center></p>
                <p><center>NCR, Philippines</center></p>
                <br>
                <p><center>Cashier: ${currentCashier}</center></p>
                <p><center>Payment Method: ${paymentMethod}</center></p>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    items.forEach(item => {
        const itemName = item.getAttribute('data-item');
        const quantity = parseInt(item.querySelector('.quantity').textContent.replace('x', ''));
        const price = itemPrices[itemName] * quantity;
        total += price;

        receiptContent += `
            <tr>
                <td>${itemName}</td>
                <td>${quantity}</td>
                <td>$${price.toFixed(2)}</td>
            </tr>
        `;
    });

    receiptContent += `
            </tbody>
        </table>
        <h3 style="text-align: right;">Total: $${totalAmount.toFixed(2)}</h3>
        <h3 style="text-align: right;">Payment: $${amountGiven.toFixed(2)}</h3>
        <h3 style="text-align: right;">Change: $${(isNaN(change) || change < 0) ? '0.00' : change.toFixed(2)}</h3>
        <br>
        <p style="text-align: center;">Thank you for your purchase!</p>
        <p style="text-align: center;">Please visit us again!</p>
        <br>
        <p><center>Wifi: TheChamberIceCream</center></p>
        <p><center>Pass: Papapogi@123</center></p>
    </body>
</html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();

    document.getElementById('billingItems').innerHTML = '';
    document.getElementById('totalAmount').textContent = 'Total: $0.00'; 

    closeModal();
}

function openInventoryModal() {
    updateInventoryModal();
    document.getElementById("inventoryModal").style.display = "block";
}

function closeInventoryModal() {
    document.getElementById("inventoryModal").style.display = "none";
}

function restockItem(itemName, stockId) {
    const restockInput = document.getElementById(`restock${itemName}`); 
    const stockElement = document.getElementById(stockId); 
    const restockAmount = parseInt(restockInput.value); 

    if (!isNaN(restockAmount) && restockAmount > 0) {
        let currentStock = parseInt(stockElement.innerText); 
        stockElement.innerText = currentStock + restockAmount; 
        restockInput.value = ''; 
    } else {
        alert('Please enter a valid restock quantity.');
    }
}

function openReceiptModal() {
    document.getElementById("receiptModal").style.display = "block";
}

function closeReceiptModal() {
    document.getElementById("receiptModal").style.display = "none";
}

function filterMenu() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    let items = document.getElementsByClassName('menu-item');

    for (let i = 0; i < items.length; i++) {
        let itemName = items[i].getElementsByTagName('h3')[0].textContent.toLowerCase();
        if (itemName.includes(input)) {
            items[i].style.display = ""; 
        } else {
            items[i].style.display = "none";
        }
    }
}

