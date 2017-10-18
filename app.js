const resultsDivID = "results";
const searchInputID = "searchInput";
const apiKey = "";

function getTitle(search, loading) {
    if (search && search.length) {
        if (loading) {
            return `<h2>Loading results for "${search}"</h2>`;
        }
        return `<h2>Results for "${search}"</h2>`;
    }
    return `<h2>Results</h2>`;
}

function render(search, loading, imageList) {
    let newHTML = "";
    newHTML += getTitle(search, loading);
    if (imageList && imageList.length) {
        imageList.forEach(function (el) {
            newHTML += `<img src="${el}"></img>`;
        }, this);
    }
    document.getElementById(resultsDivID).innerHTML = newHTML;
}

async function search(terms) {
    render(terms, true);

    const searchTerms = encodeURI(terms);
    const searchHeaders = new Headers({ "Api-Key": apiKey });
    const searchURL = `https://api.gettyimages.com/v3/search/images?phrase=${searchTerms}`;
    const response = await fetch(searchURL, { method: 'GET', headers: searchHeaders });
    const results = await response.json();
    const images = results.images;
    const imgSrcList = images.map((item) => {
        if (item.display_sizes.length) {
            return item.display_sizes[0].uri;
        }
    });

    render(terms, false, imgSrcList);
}

document.getElementById(searchInputID).onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
        location.hash = document.getElementById(searchInputID).value;
        return false;
    }
}

window.onhashchange = () => {
    search(location.hash.substr(1));
    document.getElementById(searchInputID).value = location.hash.substr(1);
};

if (location.hash && location.hash !== "#") {
    search(location.hash.substr(1));
    document.getElementById(searchInputID).value = location.hash.substr(1);
} else {
    render();
}