document.addEventListener('DOMContentLoaded', function() {
    const linkInput = document.getElementById('linkInput');
    const saveButton = document.getElementById('saveButton');
    const linkList = document.getElementById('linkList');
    const showAllButton = document.getElementById('showAllButton');
    const justBookmarksButton = document.getElementById('justBookmarksButton');
    const advancedBookmarksButton = document.getElementById('advancedBookmarksButton');

    let links = [];

    // Load saved links from local storage
    function loadLinks() {
        links = JSON.parse(localStorage.getItem('links')) || [];
        displayLinks(links);
    }

    // Display links properly (handles title, url, image, description)
    function displayLinks(linksToDisplay) {
        linkList.innerHTML = '';
        linksToDisplay.forEach(link => {
            const [title, url, image, description] = link.split('|');
            const li = document.createElement('li');

            const a = document.createElement('a');
            a.href = url;
            a.textContent = title;
            a.target = '_blank';

            const div = document.createElement('div');

            if (image) {
                const img = document.createElement('img');
                img.src = image;
                img.style.width = '100px';
                div.appendChild(img);
            }

            if (description) {
                const p = document.createElement('p');
                p.textContent = description;
                div.appendChild(p);
            }

            li.appendChild(a);
            li.appendChild(div);
            linkList.appendChild(li);
        });
    }

    // Check for saved bookmark from URL parameters and save to local storage
    function checkForSavedHTML() {
        const params = getQueryParams();
        if (params.title && params.url) {
            const title = params.title;
            const url = params.url;
            const image = params.image || '';
            const description = params.description || '';

            const newLink = `${title}|${url}|${image}|${description}`;
            let savedLinks = JSON.parse(localStorage.getItem('links')) || [];
            savedLinks.push(newLink);
            localStorage.setItem('links', JSON.stringify(savedLinks));

            alert('Bookmark saved!');
            window.history.replaceState({}, document.title, "/bm/");
            loadLinks(); // Update the displayed links
        }
    }

    // Save link manually from input field
    saveButton.addEventListener('click', function() {
        const link = linkInput.value.trim();
        if (link) {
            const newLink = `${link}|${link}| | `;  // Title and URL same, no image/description
            links.push(newLink);
            localStorage.setItem('links', JSON.stringify(links));
            linkInput.value = ''; // Clear input field
            displayLinks(links); // Refresh the displayed links
        } else {
            alert('Please enter a valid link.');
        }
    });

    // Show all bookmarks
    showAllButton.addEventListener('click', function() {
        displayLinks(links);
    });

    // Filter and show just bookmarks (no 'advanced' keyword)
    justBookmarksButton.addEventListener('click', function() {
        const justBookmarks = links.filter(link => !link.toLowerCase().includes('advanced'));
        displayLinks(justBookmarks);
    });

    // Filter and show advanced bookmarks (contains 'advanced')
    advancedBookmarksButton.addEventListener('click', function() {
        const advancedBookmarks = links.filter(link => link.toLowerCase().includes('advanced'));
        displayLinks(advancedBookmarks);
    });

    // Helper function to get query parameters
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const regex = /([^&=]+)=([^&]*)/g;
        let m;
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return params;
    }

    // Call checkForSavedHTML on page load to check for bookmark from query params
    checkForSavedHTML();
    
    // Load links on page load
    loadLinks();
});
