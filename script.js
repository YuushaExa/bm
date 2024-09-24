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

    // Display links based on the filter
    function displayLinks(linksToDisplay) {
        linkList.innerHTML = '';
        linksToDisplay.forEach(link => {
            const li = document.createElement('li');
            li.textContent = link;
            linkList.appendChild(li);
        });
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
