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

  // Update the link display logic
function displayLinks(linksToDisplay) {
    linkList.innerHTML = '';
    linksToDisplay.forEach(link => {
        const [title, url, image, description] = link.split('|'); // Split title, URL, image, description
        const li = document.createElement('li');

        // Create anchor tag for the URL
        const a = document.createElement('a');
        a.href = url;
        a.textContent = title;
        a.target = '_blank'; // Open in a new tab

        // Create a div for description and image if available
        const div = document.createElement('div');

        if (image) {
            const img = document.createElement('img');
            img.src = image;
            img.style.width = '100px'; // Set image width, adjust as needed
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

// Update the checkForSavedHTML function to capture all fields
function checkForSavedHTML() {
    const params = getQueryParams();
    if (params.title && params.url) {
        const title = params.title;
        const url = params.url;
        const image = params.image || ''; // Handle missing image
        const description = params.description || ''; // Handle missing description

        const newLink = `${title}|${url}|${image}|${description}`;
        let savedLinks = JSON.parse(localStorage.getItem('links')) || [];
        savedLinks.push(newLink);
        localStorage.setItem('links', JSON.stringify(savedLinks));

        alert('Bookmark saved!');
        window.history.replaceState({}, document.title, "/bm/"); // Adjust the path as needed
    }
}


    // Save link to local storage
    saveButton.addEventListener('click', function() {
        const link = linkInput.value.trim();
        if (link) {
            links.push(link);
            localStorage.setItem('links', JSON.stringify(links));
            linkInput.value = ''; // Clear the input field
            displayLinks(links); // Refresh the displayed links
        } else {
            alert('Please enter a valid link.');
        }
    });

    // Show all bookmarks
    showAllButton.addEventListener('click', function() {
        displayLinks(links);
    });

    // Show just bookmarks (you can define what "just bookmarks" means)
    justBookmarksButton.addEventListener('click', function() {
        const justBookmarks = links.filter(link => !link.includes('advanced')); // Example filter
        displayLinks(justBookmarks);
    });

    // Show advanced bookmarks (you can define what "advanced bookmarks" means)
    advancedBookmarksButton.addEventListener('click', function() {
        const advancedBookmarks = links.filter(link => link.includes('advanced')); // Example filter
        displayLinks(advancedBookmarks);
    });

    // Load links on page load
    loadLinks();
});

// redirect

// Function to get query parameters
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

// Check for query parameters on page load
// Function to get query parameters
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
