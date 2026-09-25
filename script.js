document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabs = document.querySelectorAll('.sidebar-nav li');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Extract tab name to update the table title
            let tabName = "";
            tab.childNodes.forEach(node => {
                if(node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                    tabName = node.textContent.trim();
                }
            });
            const titleEl = document.getElementById('table-title');
            if (titleEl) {
                titleEl.textContent = tabName + ' TRF';
            }
            
            // Switch back to table view when navigating tabs
            showTableView();

            // If they click on a tab with an unread badge, we can simulate reading it
            const badge = tab.querySelector('.badge');
            if (badge && badge.classList.contains('unread')) {
                badge.classList.remove('unread');
                // Simulate decreasing count
                let count = parseInt(badge.textContent);
                if (count > 0) {
                    badge.textContent = count - 1;
                    if (count - 1 === 0) {
                        badge.style.display = 'none'; // hide if 0
                    }
                }
            }
        });
    });
});

// View Routing Functions
function showFormView(trfNumber) {
    document.getElementById('table-view').style.display = 'none';
    document.getElementById('form-view').style.display = 'block';
    
    // Update the form header title to include TRF Number if provided
    if (trfNumber) {
        document.getElementById('form-title').textContent = 'TRF Details: ' + trfNumber;
        // Optionally update the input field value too
        const trfInput = document.querySelector('input[value="TRF000055"]');
        if (trfInput) {
            trfInput.value = trfNumber;
        }
    }
}

function showTableView() {
    document.getElementById('form-view').style.display = 'none';
    document.getElementById('table-view').style.display = 'block';
}

// Table Filtering & Actions Logic
document.addEventListener('DOMContentLoaded', () => {
    const globalSearch = document.querySelector('.global-search');
    const colFilters = document.querySelectorAll('.col-filter');

    if (globalSearch) {
        globalSearch.addEventListener('keyup', applyFilters);
    }
    colFilters.forEach(input => {
        input.addEventListener('keyup', applyFilters);
    });
});

function applyFilters() {
    const globalSearchInput = document.querySelector('.global-search');
    const globalSearch = globalSearchInput ? globalSearchInput.value.toLowerCase() : '';
    const rows = document.querySelectorAll('#table-body .data-row');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let showRow = true;
        let rowText = '';

        for (let i = 0; i < cells.length - 1; i++) { // Skip action column
            const cellText = cells[i].textContent.toLowerCase();
            rowText += cellText + ' ';

            // Column specific filter
            const filterInput = document.querySelector(`.col-filter[data-col="${i}"]`);
            if (filterInput && filterInput.value) {
                if (!cellText.includes(filterInput.value.toLowerCase())) {
                    showRow = false;
                }
            }
        }

        // Global search filter
        if (globalSearch && !rowText.includes(globalSearch)) {
            showRow = false;
        }

        row.style.display = showRow ? '' : 'none';
    });
}

function applyTopSearch() {
    // Top search now only has Start Date and End Date.
    // For this prototype, we'll just mock the search action.
    const rows = document.querySelectorAll('#table-body .data-row');
    rows.forEach(row => {
        row.style.display = '';
    });
}

function clearAllFilters() {

    const topSearchStart = document.getElementById('top-search-start');
    if (topSearchStart) topSearchStart.value = '';

    const topSearchEnd = document.getElementById('top-search-end');
    if (topSearchEnd) topSearchEnd.value = '';
    
    const globalSearchEl = document.querySelector('.global-search');
    if (globalSearchEl) globalSearchEl.value = '';
    
    document.querySelectorAll('.col-filter').forEach(input => input.value = '');
    
    const rows = document.querySelectorAll('#table-body .data-row');
    rows.forEach(row => row.style.display = '');
}

function handleAction(trfNumber, action) {
    const toast = document.getElementById('toast');
    toast.textContent = `TRF ${trfNumber} ${action} successfully.`;
    toast.style.backgroundColor = action === 'Accepted' ? '#00b09b' : '#ff5252';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        // Reset toast color for next time
        toast.style.backgroundColor = '#00b09b';
    }, 3000);
}
