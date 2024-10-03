document.addEventListener('DOMContentLoaded', function() {
    const linkInput = document.getElementById('linkInput');
    const saveButton = document.getElementById('saveButton');
    const linkList = document.getElementById('linkList');
    let links = [];

    // Create a modal for editing the bookmark
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

    const imagePreview = document.createElement('img');
    imagePreview.style.width = '100px';
    imagePreview.style.display = 'none'; // Hidden if no image URL is provided
    modal.appendChild(imagePreview);

    const descriptionInput = document.createElement('textarea');
    descriptionInput.placeholder = 'Description';
    modal.appendChild(descriptionInput);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Bookmark';
    modal.appendChild(deleteButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    modal.appendChild(closeButton);

    const saveChangesButton = document.createElement('button');
    saveChangesButton.textContent = 'Save Changes';
    modal.appendChild(saveChangesButton);

    let editingIndex = null; // Track the index of the bookmark being edited

    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
        titleInput.value = '';
        urlInput.value = '';
        imageInput.value = '';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        descriptionInput.value = '';
        editingIndex = null; // Reset editing index
    }

    // Open modal for editing or adding a bookmark
    function openModal(bookmark, index = null) {
        titleInput.value = bookmark.title || '';
        urlInput.value = bookmark.url || '';
        imageInput.value = bookmark.image || '';
        descriptionInput.value = bookmark.description || '';

        // Display the image preview if an image URL is provided
        if (bookmark.image) {
            imagePreview.src = bookmark.image;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none'; // Hide if no image URL
        }

        modal.style.display = 'block';
        editingIndex = index; // Track the index if we're editing

        // Event listener to update image preview if the image URL changes
        imageInput.addEventListener('input', function() {
            if (imageInput.value.trim()) {
                imagePreview.src = imageInput.value.trim();
                imagePreview.style.display = 'block';
            } else {
                imagePreview.style.display = 'none';
            }
        });

        // Delete logic: removes the bookmark
        deleteButton.onclick = function() {
            if (editingIndex !== null) {
                links.splice(editingIndex, 1); // Remove the link at the given index
                localStorage.setItem('links', JSON.stringify(links)); // Save updated list to localStorage
                loadLinks(); // Refresh the displayed links
            }
            closeModal(); // Close the modal
        };
    }

    // Load saved links from localStorage
    function loadLinks() {
        links = JSON.parse(localStorage.getItem('links')) || [];
        displayLinks(links);
    }

    // Display the list of saved links
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
                openModal(bookmark, index); // Open modal for editing
            };

            li.appendChild(a);
            li.appendChild(div);
            li.appendChild(editButton);
            linkList.appendChild(li);
        });
    }

    // Save the bookmark or update it
    saveChangesButton.addEventListener('click', function() {
        const updatedBookmark = {
            title: titleInput.value.trim(),
            url: urlInput.value.trim(),
            image: imageInput.value.trim(),
            description: descriptionInput.value.trim()
        };

        if (editingIndex === null) {
            // Add a new bookmark
            links.push(`${updatedBookmark.title}|${updatedBookmark.url}|${updatedBookmark.image}|${updatedBookmark.description}`);
        } else {
            // Update an existing bookmark
            links[editingIndex] = `${updatedBookmark.title}|${updatedBookmark.url}|${updatedBookmark.image}|${updatedBookmark.description}`;
        }

        localStorage.setItem('links', JSON.stringify(links)); // Save to localStorage
        loadLinks(); // Refresh the displayed links
        closeModal(); // Close the modal
    });

    // Save a new link manually via input field
    saveButton.addEventListener('click', function() {
        const link = linkInput.value.trim();
        if (link) {
            const newBookmark = { title: link, url: link, image: '', description: '' };
            openModal(newBookmark); // Open modal for the new bookmark
            linkInput.value = ''; // Clear the input field
        } else {
            alert('Please enter a valid link.');
        }
    });

    // Check for saved bookmark from URL parameters and open modal
    function checkForSavedHTML() {
        const params = getQueryParams();
        if (params.title && params.url) {
            const bookmark = {
                title: params.title,
                url: params.url,
                image: params.image || '',
                description: params.description || ''
            };
            openModal(bookmark); // Open modal to view and edit bookmark
        }
    }

    // Get URL query parameters
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
        closeModal(); // Close modal without saving
    });

    // Load saved links and check for bookmark from URL parameters
    loadLinks();
    checkForSavedHTML();
});
