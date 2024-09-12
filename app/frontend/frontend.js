const searchIcon = document.getElementById('searchIconImage');

const searchMask = document.getElementById('modalMask');
const searchModal = document.getElementById('modalSearch');

const categoriesItems = document.querySelectorAll('.searchCategoriesItem');
const resultCategoriesItems = document.querySelectorAll('.searchResultsCategoriesItem');
const suggestionsItems = document.querySelectorAll('.searchSuggestionsItem');

const searchBarIcon = document.getElementById('searchBarIcon');
const searchBarInput = document.getElementById('searchBarInput');
var selectedCategory = "";

searchIcon.addEventListener('click', function(e) {
    searchMask.classList.add('modalMaskShow');
    searchModal.classList.add('modalSearchShow');
});

searchMask.addEventListener('click', function() {
    if (event.target === searchMask) {
        searchMask.classList.remove('modalMaskShow');
        searchModal.classList.remove('modalSearchShow');
    }
});

categoriesItems.forEach(item => {
    item.addEventListener('click', function() {
        categoriesItems.forEach(el => el.classList.remove('selected'));
        this.classList.add('selected');
    });
});

function handleSearch() {
    location.href = './searchResults.html';
}

searchBarIcon.addEventListener('click', handleSearch);

searchBarInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

searchBarInput.addEventListener('input', function(event) {
    const suggestionListItems = document.querySelectorAll('.searchSuggestionsItem');
    suggestionListItems.forEach(item => {
        item.remove();
    });

    if (event.target.value === "") {
        return;
    }
    
    const suggestionList = document.querySelector('.searchSuggestionsList');
    for (let i = 1; i <= 3; i++) {
        var html = `
            <li class="searchSuggestionsItem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="searchSuggestionsIcon">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" fill="#bbbbbb"/>
                </svg>
                <p>Suggestion ${i}</p>
            </li>`;
        
        suggestionList.insertAdjacentHTML('beforeend', html);
    }    
});


resultCategoriesItems.forEach(item => {
    item.addEventListener('click', function() {
        resultCategoriesItems.forEach(el => el.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get('category');

    if (selectedCategory) {
        const resultCategoriesItems = document.querySelectorAll('.searchResultsCategoriesItem');
        resultCategoriesItems.forEach(el => el.classList.remove('selected'));

        const newSelected = document.querySelector(`.searchResultsCategoriesItem[data-result-category="${selectedCategory}"]`);
        if (newSelected) {
            newSelected.classList.add('selected');
        }
    }
});