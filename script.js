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
            const [title, url, image, description] = link.split('|'); // Split the title, URL, image, and description
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = url;
            a.textContent = title;
            a.target = '_blank'; // Open in a new tab
            li.appendChild(a);

            // Add click event to display details
            li.addEventListener('click', function() {
                displayBookmarkDetails(title, image, description);
            });

            linkList.appendChild(li);
        });
    }

    // Display bookmark details
    function displayBookmarkDetails(title, image, description) {
        const bookmarkImage = document.getElementById('bookmarkImage');
        const bookmarkDescription = document.getElementById('bookmarkDescription');

        // Set the image source and description text
        bookmarkImage.src = image;
        bookmarkImage.style.display = image ? 'block' : 'none'; // Show the image if available
        bookmarkDescription.textContent = description || 'No description available.';
    }

    // Save link to local storage
    saveButton.addEventListener('click', function() {
        const link = linkInput.value.trim();
        if (link) {
            // Here you would typically fetch the og:title, og:image, and og:description
            // For demonstration, we'll use placeholder values
            const title = "Sample Title"; // Replace with actual title
            const image = "https://via.placeholder.com/150"; // Replace with actual image URL
            const description = "Sample description for the bookmark."; // Replace with actual description

            links.push(`${title}|${link}|${image}|${description}`);
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
