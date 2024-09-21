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
        li.textContent = `${link.title} (${link.url})`; // Display title and URL
        linkList.appendChild(li);
    });
}


    // Fetch the page title from the URL
    async function fetchPageTitle(url) {
        try {
            const response = await fetch(url, { mode: 'cors' });
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            return doc.title; // Return the page title
        } catch (error) {
            console.error('Error fetching page title:', error);
            return null; // Return null if there's an error
        }
    }

    // Save link to local storage
    saveButton.addEventListener('click', async function() {
        const link = linkInput.value.trim();
        if (link) {
            const title = await fetchPageTitle(link);
            if (title) {
                const links = JSON.parse(localStorage.getItem('links')) || [];
                links.push({ url: link, title: title });
                localStorage.setItem('links', JSON.stringify(links));
                linkInput.value = ''; // Clear the input field
                loadLinks(); // Refresh the displayed links
            } else {
                alert('Could not fetch the page title. Please check the link.');
            }
        } else {
            alert('Please enter a valid link.');
        }
    });

    // Load links on page load
    loadLinks();
});
