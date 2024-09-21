// script.js
document.addEventListener('DOMContentLoaded', function() {
    const linkInput = document.getElementById('linkInput');
    const saveButton = document.getElementById('saveButton');
    const linkList = document.getElementById('linkList');

    // Load saved links from local storage
    function loadLinks() {
        const links = JSON.parse(localStorage.getItem('links')) || [];
        linkList.innerHTML = '';
        links.forEach(link => {
            const li = document.createElement('li');
            li.textContent = link;
            linkList.appendChild(li);
        });
    }

    // Save link to local storage
    saveButton.addEventListener('click', function() {
        const link = linkInput.value.trim();
        if (link) {
            const links = JSON.parse(localStorage.getItem('links')) || [];
            links.push(link);
            localStorage.setItem('links', JSON.stringify(links));
            linkInput.value = ''; // Clear the input field
            loadLinks(); // Refresh the displayed links
        } else {
            alert('Please enter a valid link.');
        }
    });

    // Load links on page load
    loadLinks();
});
