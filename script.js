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

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Save Bookmark';
    modal.appendChild(confirmButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    modal.appendChild(cancelButton);

    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        titleInput.value = '';
        urlInput.value = '';
        imageInput.value = '';
        descriptionInput.value = '';
    }

    // Open modal function
    function openModal(bookmark) {
        titleInput.value = bookmark.title || '';
        urlInput.value = bookmark.url || '';
        imageInput.value = bookmark.image || '';
        descriptionInput.value = bookmark.description || '';
        modal.style.display = 'block';
    }

    // Load saved links from local storage
    function loadLinks() {
        links = JSON.parse(localStorage.getItem('links')) || [];
        displayLinks(links);
    }

    // Display links
    function displayLinks(linksToDisplay) {
        linkList.innerHTML = '';
        linksToDisplay.forEach(link => {
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

            li.appendChild(a);
            li.appendChild(div);
            linkList.appendChild(li);
        });
    }

    // Save or edit a link and update localStorage
    function saveLink(bookmark) {
        const newLink = `${bookmark.title}|${bookmark.url}|${bookmark.image}|${bookmark.description}`;
        links.push(newLink);
        localStorage.setItem('links', JSON.stringify(links));
        loadLinks(); // Refresh links display
    }

    // Save link manually from input field
    saveButton.addEventListener('click', function() {
        const link = linkInput.value.trim();
        if (link) {
            openModal({ title: link, url: link, image: '', description: '' }); // Open modal to edit the manually entered link
        } else {
            alert('Please enter a valid link.');
        }
    });

    // Check for saved bookmark from URL parameters and allow the user to edit and confirm it
    function checkForSavedHTML() {
        const params = getQueryParams();
        if (params.title && params.url) {
            const bookmark = {
                title: params.title,
                url: params.url,
                image: params.image || '',
                description: params.description || ''
            };
            openModal(bookmark); // Open modal for confirmation
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

    // Modal save button logic
    confirmButton.addEventListener('click', function() {
        const bookmark = {
            title: titleInput.value.trim(),
            url: urlInput.value.trim(),
            image: imageInput.value.trim(),
            description: descriptionInput.value.trim()
        };

        if (bookmark.url) {
            saveLink(bookmark); // Save the link to localStorage
            closeModal(); // Close the modal
        } else {
            alert('URL is required.');
        }
    });

    // Modal cancel button logic
    cancelButton.addEventListener('click', function() {
        closeModal(); // Close the modal without saving
    });

    // Call checkForSavedHTML on page load to check for bookmark from query params
    checkForSavedHTML();

    // Load links on page load
    loadLinks();
});
