// Inventory Manager Application
class InventoryManager {
    constructor() {
        this.items = this.loadItems();
        this.initializeEventListeners();
        this.displayItems();
    }

    // Load items from localStorage
    loadItems() {
        const storedItems = localStorage.getItem('inventoryItems');
        let items = storedItems ? JSON.parse(storedItems) : [];
        
        // If no items exist, load sample data
        if (items.length === 0) {
            items = this.getSampleData();
            // Save sample data to localStorage
            localStorage.setItem('inventoryItems', JSON.stringify(items));
        }
        
        return items;
    }

    // Get sample data for initial testing
    getSampleData() {
        return [
            {
                id: '1',
                name: 'Blender',
                category: 'Appliances',
                location: 'Kitchen',
                quantity: 1,
                barcode: '012345678901',
                notes: 'Ninja brand, 1000W, for smoothies',
                dateAdded: new Date('2025-12-15').toISOString()
            },
            {
                id: '2',
                name: 'Winter Coats',
                category: 'Clothing',
                location: 'Closet',
                quantity: 4,
                barcode: '',
                notes: 'Family winter coats - 2 adult, 2 kids',
                dateAdded: new Date('2025-12-16').toISOString()
            },
            {
                id: '3',
                name: 'Screwdriver Set',
                category: 'Tools & Hardware',
                location: 'Garage',
                quantity: 1,
                barcode: '098765432109',
                notes: '24-piece set with case',
                dateAdded: new Date('2025-12-17').toISOString()
            },
            {
                id: '4',
                name: 'Board Games',
                category: 'Toys & Games',
                location: 'Living Room',
                quantity: 8,
                barcode: '',
                notes: 'Monopoly, Scrabble, Chess, Uno, and others',
                dateAdded: new Date('2025-12-10').toISOString()
            },
            {
                id: '5',
                name: 'Dish Soap',
                category: 'Cleaning Supplies',
                location: 'Kitchen',
                quantity: 3,
                barcode: '051234567890',
                notes: 'Dawn Ultra - bulk pack',
                dateAdded: new Date('2025-12-18').toISOString()
            },
            {
                id: '6',
                name: 'Desk Lamp',
                category: 'Electronics',
                location: 'Office',
                quantity: 2,
                barcode: '087654321098',
                notes: 'LED adjustable brightness',
                dateAdded: new Date('2025-12-12').toISOString()
            },
            {
                id: '7',
                name: 'Throw Pillows',
                category: 'Decor',
                location: 'Living Room',
                quantity: 6,
                barcode: '',
                notes: 'Blue and white pattern',
                dateAdded: new Date('2025-12-14').toISOString()
            },
            {
                id: '8',
                name: 'Printer Paper',
                category: 'Office Supplies',
                location: 'Office',
                quantity: 5,
                barcode: '012345098765',
                notes: 'A4 size, 500 sheets per pack',
                dateAdded: new Date('2025-12-11').toISOString()
            }
        ];
    }

    // Save items to localStorage
    saveItems() {
        localStorage.setItem('inventoryItems', JSON.stringify(this.items));
    }

    // Initialize event listeners
    initializeEventListeners() {
        const form = document.getElementById('addItemForm');
        const searchInput = document.getElementById('searchInput');
        const filterCategory = document.getElementById('filterCategory');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addItem();
        });

        searchInput.addEventListener('input', () => this.displayItems());
        filterCategory.addEventListener('change', () => this.displayItems());
    }

    // Add new item
    addItem() {
        const item = {
            id: Date.now().toString(),
            name: document.getElementById('itemName').value.trim(),
            category: document.getElementById('category').value,
            location: document.getElementById('location').value.trim(),
            quantity: parseInt(document.getElementById('quantity').value),
            barcode: document.getElementById('barcode').value.trim(),
            notes: document.getElementById('notes').value.trim(),
            dateAdded: new Date().toISOString()
        };

        this.items.push(item);
        this.saveItems();
        this.displayItems();
        this.resetForm();
        this.showNotification('Item added successfully!', 'success');
    }

    // Remove item
    removeItem(id) {
        if (confirm('Are you sure you want to remove this item?')) {
            this.items = this.items.filter(item => item.id !== id);
            this.saveItems();
            this.displayItems();
            this.showNotification('Item removed successfully!', 'success');
        }
    }

    // Display items with filtering
    displayItems() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('filterCategory').value;
        
        let filteredItems = this.items;

        // Apply category filter
        if (categoryFilter) {
            filteredItems = filteredItems.filter(item => item.category === categoryFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.notes.toLowerCase().includes(searchTerm) ||
                (item.barcode && item.barcode.toLowerCase().includes(searchTerm))
            );
        }

        this.renderItems(filteredItems);
        this.updateItemCount(filteredItems.length, this.items.length);
    }

    // Render items to DOM
    renderItems(items) {
        const inventoryList = document.getElementById('inventoryList');

        if (items.length === 0) {
            inventoryList.innerHTML = `
                <div class="empty-state">
                    <h3>No items found</h3>
                    <p>Start by adding your first inventory item above!</p>
                </div>
            `;
            return;
        }

        inventoryList.innerHTML = items.map(item => `
            <div class="inventory-item">
                <div class="item-header">
                    <div>
                        <div class="item-name">${this.escapeHtml(item.name)}</div>
                        <span class="item-category">${this.escapeHtml(item.category)}</span>
                    </div>
                </div>
                <div class="item-details">
                    <div class="item-detail">
                        <strong>Location:</strong>
                        <span>${this.escapeHtml(item.location)}</span>
                    </div>
                    <div class="item-detail">
                        <strong>Quantity:</strong>
                        <span>${item.quantity}</span>
                    </div>
                    ${item.barcode ? `
                        <div class="item-detail">
                            <strong>Barcode:</strong>
                            <span>${this.escapeHtml(item.barcode)}</span>
                        </div>
                    ` : ''}
                    <div class="item-detail">
                        <strong>Added:</strong>
                        <span>${this.formatDate(item.dateAdded)}</span>
                    </div>
                </div>
                ${item.notes ? `
                    <div class="item-notes">
                        <strong>Notes:</strong> ${this.escapeHtml(item.notes)}
                    </div>
                ` : ''}
                <button class="btn btn-danger" onclick="inventoryApp.removeItem('${item.id}')">
                    Remove Item
                </button>
            </div>
        `).join('');
    }

    // Update item count display
    updateItemCount(displayed, total) {
        const itemCount = document.getElementById('itemCount');
        if (displayed === total) {
            itemCount.textContent = `Total items: ${total}`;
        } else {
            itemCount.textContent = `Showing ${displayed} of ${total} items`;
        }
    }

    // Reset form after adding item
    resetForm() {
        document.getElementById('addItemForm').reset();
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show notification
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
let inventoryApp;
document.addEventListener('DOMContentLoaded', () => {
    inventoryApp = new InventoryManager();
});
