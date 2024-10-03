document.addEventListener('DOMContentLoaded', function() {
    const linkInput = document.getElementById('linkInput');
    const saveButton = document.getElementById('saveButton');
    const linkList = document.getElementById('linkList');
    let links = [];

    // Create a modal for the confirmation window
    const modal = document.createElement('div');
    modal.style.display = 'none'; // Initially hidden
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    modal.style.zIndex = '1000';
    document.body.appendChild(modal);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Title';
    modal.appendChild(titleInput);

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'URL';
    modal.appendChild(urlInput);

    const imageInput = document.createElement('input');
    imageInput.type = 'text';
    imageInput.placeholder = 'Image URL';
    modal.appendChild(imageInput);

    const descriptionInput = document.createElement('textarea');
    descriptionInput.placeholder = 'Description';
    modal.appendChild(descriptionInput);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Bookmark';
    modal.appendChild(deleteButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    modal.appendChild(closeButton);

    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        titleInput.value = '';
        urlInput.value = '';
        imageInput.value = '';
        descriptionInput.value = '';
    }

    // Open modal function
    function openModal(bookmark, linkIndex = null) {
        titleInput.value = bookmark.title || '';
        urlInput.value = bookmark.url || '';
        imageInput.value = bookmark.image || '';
        descriptionInput.value = bookmark.description || '';
        modal.style.display = 'block';

        // Save the bookmark to localStorage immediately
        if (linkIndex === null) {
            const newLink = `${bookmark.title}|${bookmark.url}|${bookmark.image}|${bookmark.description}`;
            links.push(newLink);
            localStorage.setItem('links', JSON.stringify(links));
            loadLinks(); // Refresh links display
        } else {
            // Update an existing link when edited
            links[linkIndex] = `${bookmark.title}|${bookmark.url}|${bookmark.image}|${bookmark.description}`;
            localStorage.setItem('links', JSON.stringify(links));
        }

        // Delete logic: removes the bookmark
        deleteButton.onclick = function() {
            if (linkIndex !== null) {
                links.splice(linkIndex, 1); // Remove link by index
                localStorage.setItem('links', JSON.stringify(links)); // Save updated list
                loadLinks(); // Refresh display
            }
            closeModal(); // Close modal
        };
    }

    // Load saved links from local storage
    function loadLinks() {
        links = JSON.parse(localStorage.getItem('links')) || [];
        displayLinks(links);
    }

    // Display links
    function displayLinks(linksToDisplay) {
        linkList.innerHTML = '';
        linksToDisplay.forEach((link, index) => {
            const [title, url, image, description] = link.split('|');
            const li = document.createElement('li');

            const a = document.createElement('a');
            a.href = url;
            a.textContent = title || 'Untitled';
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

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = function() {
                const bookmark = { title, url, image, description };
                openModal(bookmark, index); // Open modal with edit functionality
            };

            li.appendChild(a);
            li.appendChild(div);
            li.appendChild(editButton);
            linkList.appendChild(li);
        });
    }

    // Save link manually from input field
    saveButton.addEventListener('click', function() {
        const link = linkInput.value.trim();
        if (link) {
            const newBookmark = { title: link, url: link, image: '', description: '' };
            openModal(newBookmark); // Open modal to view and edit bookmark
            linkInput.value = ''; // Clear the input field
        } else {
            alert('Please enter a valid link.');
        }
    });

    // Check for saved bookmark from URL parameters and allow the user to edit it
    function checkForSavedHTML() {
        const params = getQueryParams();
        if (params.title && params.url) {
            const bookmark = {
                title: params.title,
                url: params.url,
                image: params.image || '',
                description: params.description || ''
            };
            openModal(bookmark); // Open modal for editing
        }
    }

    // Get query parameters from URL
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

    // Modal close button logic
    closeButton.addEventListener('click', function() {
        closeModal(); // Close the modal without saving
    });

    // Call checkForSavedHTML on page load to check for bookmark from query params
    checkForSavedHTML();

    // Load links on page load
    loadLinks();
});
