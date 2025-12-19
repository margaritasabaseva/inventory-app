// Inventory Manager Application
class InventoryManager {
    constructor() {
        this.items = this.loadItems();
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.editingItemId = null;
        this.initializeCollapse();
        this.initializeEventListeners();
        this.displayItems();
    }

    // Initialize collapse functionality
    initializeCollapse() {
        const collapseBtn = document.getElementById('collapseBtn');
        const collapsibleContent = document.querySelector('.collapsible-content');
        
        collapseBtn.addEventListener('click', () => {
            collapseBtn.classList.toggle('collapsed');
            collapsibleContent.classList.toggle('collapsed');
            
            // Update aria-label for accessibility
            const isCollapsed = collapseBtn.classList.contains('collapsed');
            collapseBtn.setAttribute('aria-label', isCollapsed ? 'Expand section' : 'Collapse section');
        });
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
        const cancelBtn = document.getElementById('cancelBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addItem();
        });

        cancelBtn.addEventListener('click', () => {
            this.resetForm();
        });

        searchInput.addEventListener('input', () => this.displayItems());
        filterCategory.addEventListener('change', () => this.displayItems());

        // Add sorting event listeners to table headers
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const sortKey = header.getAttribute('data-sort');
                this.sortItems(sortKey);
            });
        });
    }

    // Add new item or update existing
    addItem() {
        if (this.editingItemId) {
            // Update existing item
            const item = this.items.find(i => i.id === this.editingItemId);
            if (item) {
                item.name = document.getElementById('itemName').value.trim();
                item.category = document.getElementById('category').value;
                item.location = document.getElementById('location').value;
                item.quantity = parseInt(document.getElementById('quantity').value);
                item.barcode = document.getElementById('barcode').value.trim();
                item.notes = document.getElementById('notes').value.trim();
            }
            this.showNotification('Item updated successfully!', 'success');
            this.editingItemId = null;
        } else {
            // Add new item
            const item = {
                id: Date.now().toString(),
                name: document.getElementById('itemName').value.trim(),
                category: document.getElementById('category').value,
                location: document.getElementById('location').value,
                quantity: parseInt(document.getElementById('quantity').value),
                barcode: document.getElementById('barcode').value.trim(),
                notes: document.getElementById('notes').value.trim(),
                dateAdded: new Date().toISOString()
            };
            this.items.push(item);
            this.showNotification('Item added successfully!', 'success');
        }

        this.saveItems();
        this.displayItems();
        this.resetForm();
    }

    // Sort items by column
    sortItems(column) {
        // Toggle sort direction if clicking the same column
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.displayItems();
        this.updateSortIndicators();
    }

    // Update sort direction indicators
    updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (header.getAttribute('data-sort') === this.sortColumn) {
                header.classList.add(this.sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
            }
        });
    }

    // Remove item
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveItems();
        this.displayItems();
        this.showNotification('Item removed successfully!', 'success');
    }

    // Increment item quantity
    incrementQuantity(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity++;
            this.saveItems();
            this.displayItems();
        }
    }

    // Decrement item quantity or set to zero
    decrementQuantity(id) {
        const item = this.items.find(item => item.id === id);
        if (item && item.quantity > 0) {
            item.quantity--;
            this.saveItems();
            this.displayItems();
        }
    }

    // Edit item
    editItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            // Expand the form section if it's collapsed
            const collapseBtn = document.getElementById('collapseBtn');
            const collapsibleContent = document.querySelector('.collapsible-content');
            
            if (collapsibleContent.classList.contains('collapsed')) {
                collapseBtn.classList.remove('collapsed');
                collapsibleContent.classList.remove('collapsed');
                collapseBtn.setAttribute('aria-label', 'Collapse section');
            }
            
            this.editingItemId = id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('category').value = item.category;
            document.getElementById('location').value = item.location;
            document.getElementById('quantity').value = item.quantity;
            document.getElementById('barcode').value = item.barcode || '';
            document.getElementById('notes').value = item.notes || '';
            
            // Update button text and show cancel button
            const submitBtn = document.querySelector('.btn-primary');
            const cancelBtn = document.getElementById('cancelBtn');
            submitBtn.textContent = 'Update Item';
            submitBtn.style.background = '#f39c12';
            cancelBtn.style.display = 'inline-block';
            
            // Scroll to form
            document.querySelector('.add-item-section').scrollIntoView({ behavior: 'smooth' });
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

        // Apply sorting
        if (this.sortColumn) {
            filteredItems.sort((a, b) => {
                let aVal = a[this.sortColumn];
                let bVal = b[this.sortColumn];

                // Handle quantity as number
                if (this.sortColumn === 'quantity') {
                    aVal = parseInt(aVal);
                    bVal = parseInt(bVal);
                }
                // Handle dates
                else if (this.sortColumn === 'dateAdded') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                // Handle strings (case-insensitive)
                else {
                    aVal = (aVal || '').toString().toLowerCase();
                    bVal = (bVal || '').toString().toLowerCase();
                }

                if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // Move items with quantity 0 to the bottom
        filteredItems.sort((a, b) => {
            if (a.quantity === 0 && b.quantity > 0) return 1;
            if (a.quantity > 0 && b.quantity === 0) return -1;
            return 0;
        });

        this.renderItems(filteredItems);
        this.updateItemCount(filteredItems.length, this.items.length);
    }

    // Render items to DOM
    renderItems(items) {
        const inventoryList = document.getElementById('inventoryList');

        if (items.length === 0) {
            inventoryList.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                        <h3 style="margin-bottom: 10px;">No items found</h3>
                        <p>Start by adding your first inventory item above!</p>
                    </td>
                </tr>
            `;
            return;
        }

        inventoryList.innerHTML = items.map(item => `
            <tr class="${item.quantity === 0 ? 'zero-quantity' : ''}" onclick="inventoryApp.editItem('${item.id}')" style="cursor: pointer;">
                <td><span class="table-item-name">${this.escapeHtml(item.name)}</span></td>
                <td><span class="table-category">${this.escapeHtml(item.category)}</span></td>
                <td>${this.escapeHtml(item.location)}</td>
                <td><span class="table-barcode">${item.barcode ? this.escapeHtml(item.barcode) : '-'}</span></td>
                <td><div class="table-notes" title="${this.escapeHtml(item.notes)}">${item.notes ? this.escapeHtml(item.notes) : '-'}</div></td>
                <td style="white-space: nowrap;">${this.formatDate(item.dateAdded)}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td onclick="event.stopPropagation();">
                    <div class="action-buttons">
                        <button class="btn btn-action btn-increment" onclick="inventoryApp.incrementQuantity('${item.id}')" title="Increase quantity">
                            +
                        </button>
                        <button class="btn btn-action btn-decrement" onclick="inventoryApp.decrementQuantity('${item.id}')" title="Decrease quantity" ${item.quantity === 0 ? 'disabled' : ''}>
                            −
                        </button>
                    </div>
                </td>
            </tr>
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
        this.editingItemId = null;
        const submitBtn = document.querySelector('.btn-primary');
        const cancelBtn = document.getElementById('cancelBtn');
        submitBtn.textContent = 'Add Item';
        submitBtn.style.background = '';
        cancelBtn.style.display = 'none';
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
