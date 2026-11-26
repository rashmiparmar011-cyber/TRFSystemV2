document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabs = document.querySelectorAll('.sidebar-nav li');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Switch back to table view when navigating tabs
            // Extract tab name to update the table title
            let tabName = "";
            tab.childNodes.forEach(node => {
                if(node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                    tabName = node.textContent.trim();
                }
            });
            const titleEl = document.getElementById('table-title');
            if (titleEl && tabName !== 'Dashboard') {
                titleEl.textContent = tabName + ' TRF';
            }

            // Tab click keeps badge display persistent
        });
    });
});

// View Routing Functions
function showDashboardView() {
    document.getElementById('table-view').style.display = 'none';
    document.getElementById('form-view').style.display = 'none';
    const dv = document.getElementById('dashboard-view');
    if(dv) dv.style.display = 'block';
}

function showFormView(trfNumber) {
    const dv = document.getElementById('dashboard-view');
    if(dv) dv.style.display = 'none';
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
    const dv = document.getElementById('dashboard-view');
    if(dv) dv.style.display = 'none';
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

// Upload Test Result Modal Logic
let currentUploadRow = null;
let currentUploadTestName = '';
let currentFileName = '';

function openUploadModal(testName, button) {
    currentUploadTestName = testName;
    currentUploadRow = button ? button.closest('tr') : null;

    // Check if the row already has an uploaded file
    const existingFileName = currentUploadRow ? (currentUploadRow.dataset.fileName || '') : '';
    currentFileName = existingFileName || (testName ? testName.replace(/\s+/g, '_') + '_Result.pdf' : 'test_result.pdf');

    // Update modal file display
    updateModalFileDisplay(currentFileName);

    // Reset file input
    const fileInput = document.getElementById('modal-file-input');
    if (fileInput) fileInput.value = '';

    // Reset comment input
    const commentInput = document.getElementById('modal-comment');
    if (commentInput) {
        commentInput.value = '';
        commentInput.style.borderColor = '';
    }

    const modal = document.getElementById('upload-modal');
    if (modal) {
        modal.style.display = 'flex';
        if (commentInput) {
            setTimeout(() => commentInput.focus(), 100);
        }
    }
}

function updateModalFileDisplay(fileName) {
    const fileNameSpan = document.getElementById('modal-file-name');
    const fileTextSpan = document.getElementById('modal-file-text');
    const crossBtn = document.getElementById('modal-file-cross');
    if (!fileNameSpan || !fileTextSpan) return;

    if (fileName && fileName.trim()) {
        fileTextSpan.textContent = fileName;
        fileNameSpan.classList.remove('empty');
        fileNameSpan.style.display = 'inline-flex';
        fileNameSpan.title = fileName;
        if (crossBtn) crossBtn.style.display = 'inline-flex';
    } else {
        fileTextSpan.textContent = 'No file chosen';
        fileNameSpan.classList.add('empty');
        fileNameSpan.title = 'No file chosen';
        if (crossBtn) crossBtn.style.display = 'none';
    }
}

function closeUploadModal() {
    const modal = document.getElementById('upload-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function triggerFileInput() {
    const fileInput = document.getElementById('modal-file-input');
    if (fileInput) {
        fileInput.click();
    }
}

function handleFileSelected(event) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
        currentFileName = fileInput.files[0].name;
        updateModalFileDisplay(currentFileName);
    }
}

function removeSelectedFile(event) {
    if (event) {
        event.stopPropagation();
    }
    const fileInput = document.getElementById('modal-file-input');
    if (fileInput) fileInput.value = '';
    currentFileName = '';
    updateModalFileDisplay('');
}

function submitUploadResult() {
    const commentInput = document.getElementById('modal-comment');
    const comment = commentInput ? commentInput.value.trim() : '';

    if (!comment) {
        if (commentInput) {
            commentInput.style.borderColor = '#e53e3e';
            commentInput.focus();
        }
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = 'Please enter a comment before submitting.';
            toast.style.backgroundColor = '#ff5252';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
        return;
    }

    // Update row fields in the table
    if (currentUploadRow) {
        // Save file name on row dataset
        currentUploadRow.dataset.fileName = currentFileName;

        const inputs = currentUploadRow.querySelectorAll('input');
        // inputs[0]: Test Name
        // inputs[1]: Assigned To
        // inputs[2]: Submitted By (column: Submitted By)
        // inputs[3]: Submitted On (column: Submitted On)
        // inputs[4]: Remark (column: Remark)
        // inputs[5]: Test Status (column: Test Status)
        if (inputs[2] && !inputs[2].value) {
            inputs[2].value = inputs[1] ? inputs[1].value : 'Hardik Patel';
        }
        if (inputs[3] && !inputs[3].value) {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            inputs[3].value = `${dd}-${mm}-${yyyy}`;
        }
        if (inputs[4]) {
            inputs[4].value = comment;
        }
        if (inputs[5]) {
            inputs[5].value = 'Submitted';
        }
    }

    closeUploadModal();

    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = `Test result ${currentFileName ? '(' + currentFileName + ') ' : ''}uploaded successfully.`;
        toast.style.backgroundColor = '#00b09b';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// Close modal when clicking outside or pressing Escape
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('upload-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeUploadModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('upload-modal');
            if (modal && modal.style.display !== 'none') {
                closeUploadModal();
            }
        }
    });
});



