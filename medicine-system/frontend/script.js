const API_BASE_URL = 'http://localhost:5000/api';

window.onload = function() {
    document.getElementById("medicineList").classList.add("hidden");
};

async function loadMedicinesFromAPI() {
    const response = await fetch(`${API_BASE_URL}/medicines`);
    const result = await response.json();
    if (result.success) {
        updateMedicineList(result.data);
    }
}

async function addMedicine() {
    const name = document.getElementById("name").value;
    const company = document.getElementById("company").value;
    const category = document.getElementById("category").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const expiry = document.getElementById("expiryDate").value;
    const desc = document.getElementById("description").value;

    if (!name || !company || !category || !price || !stock || !expiry) {
        alert("All fields except description must be filled!");
        return;
    }

    const response = await fetch(`${API_BASE_URL}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name, company, category,
            price: parseFloat(price),
            stock: parseInt(stock),
            expiryDate: expiry,
            description: desc
        })
    });
    const result = await response.json();
    if (result.success) {
        alert("Medicine added successfully!");
        document.getElementById("medicineForm").reset();
    }
}

// Search medicines
async function searchMedicine() {
    const query = document.getElementById("searchInput").value.trim();
    const listDiv = document.getElementById("medicineList");

    if (!query) {
        listDiv.classList.add("hidden");
        listDiv.innerHTML = "No medicines found.";
        return;
    }

    const response = await fetch(`${API_BASE_URL}/medicines/search/${encodeURIComponent(query)}`);
    const result = await response.json();
    if (result.success) {
        listDiv.classList.remove("hidden");
        updateMedicineList(result.data);
    }
}

// Delete medicine
async function deleteMedicine(id) {
    if (!confirm("Delete this medicine?")) return;
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) {
        alert("Medicine deleted!");
        searchMedicine();
    }
}

// Update medicine
async function updateMedicine(id) {
    const newPrice = prompt("Enter new price:");
    const newStock = prompt("Enter new stock:");
    const newExpiry = prompt("Enter new expiry date (YYYY-MM-DD):");

    if (!newPrice || !newStock || !newExpiry) {
        alert("All fields are required.");
        return;
    }

    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            price: parseFloat(newPrice),
            stock: parseInt(newStock),
            expiryDate: newExpiry
        })
    });
    const result = await response.json();
    if (result.success) {
        alert("Medicine updated successfully!");
        searchMedicine();
    }
}

// Display list
function updateMedicineList(medicines) {
    const listDiv = document.getElementById("medicineList");
    if (!medicines.length) {
        listDiv.innerHTML = "No medicines found.";
        return;
    }
    listDiv.innerHTML = '';
    medicines.forEach(m => {
        listDiv.innerHTML += `
        <div class="card">
            <strong>Name:</strong> ${m.name}<br>
            <strong>Company:</strong> ${m.company}<br>
            <strong>Category:</strong> ${m.category}<br>
            <strong>Price:</strong> ₹${m.price}<br>
            <strong>Stock:</strong> ${m.stock}<br>
            <strong>Expiry:</strong> ${new Date(m.expiryDate).toLocaleDateString()}<br>
            <strong>Description:</strong> ${m.description || 'N/A'}<br><br>
            <button onclick="updateMedicine('${m._id}')">Update</button>
            <button onclick="deleteMedicine('${m._id}')">Delete</button>
        </div>`;
    });
}