//=======Selection des elem ====================

const btnContainer   = document.querySelector('.btn-container');
const displayCategory = document.querySelector('.display-category');
const popup          = document.querySelector('.popup');
//pagination
const backPage = document.querySelector('.back');
const nextPage = document.querySelector('.next');
const numeroPage = document.querySelector('.numero-page')

//====Fonctions Utilitaires =====================
//je crée la balise , je lui ajoutes une classe ainsi que son contenu
function createElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }
    if (content) {
        element.innerHTML = content;
    }
    return element;
}
// j'insère ma balise et son contenu dans un parent
function appendElement(parent, child) {
    parent.append(child);
}
//Variables
let currentPage = 1;
let currentCategory    = "airing_today"
let totalPage = 0;

// ==== Fonctions Fetch => API ====
async function getApi(choice = "airing_today", pageCategory ="1") {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${choice}?api_key=6631e5f1dc96088e0d26b86da29b5b6a&page=${pageCategory}`);
        const data = await response.json();
        
        return data
    }
    catch (error) {
        console.error(error);
    }
}

async function displayApi(category = currentCategory, page = currentPage) {
    currentPage     = page;
    currentCategory = category;

    const movies = await getApi(category, page);
    totalPage = movies.total_pages;
   

    numeroPage.innerHTML = ""; 
    numeroPage.innerHTML = `${movies.page}/${totalPage}`; 

    displayCategory.innerHTML = ""; 
    
    movies.results.forEach(movie => {

        const carte  = createElement("div","card","");
        const titre  = createElement("h2","",`${movie.name}`);
        const figure = createElement("figure","",`<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_name}">`);
        const scoreOverlay = createElement('div','score',`${movie.vote_average} /10`)

        appendElement(displayCategory, carte);
        appendElement(carte, titre);
        appendElement(carte, figure);
        appendElement(carte, scoreOverlay)
    });

    // Mettre à jour l'état des boutons de pagination
    backPage.disabled = currentPage <= 1;
    nextPage.disabled = currentPage >= movies.total_pages;
};

displayApi();

// ==== Events ====
btnContainer.addEventListener('click', function (event) {
    event.preventDefault();
    
    const btnCategory = document.querySelectorAll('button');
    btnCategory.forEach(bouton => {

        bouton.classList.remove("active");
    })
    
    if(event.target.dataset.category){
        const category = event.target.dataset.category;
        event.target.classList.add('active');
        
        currentCategory = category;
        currentPage = 1;
        
        

        displayApi(currentCategory, currentPage)
    }
    
})

backPage.addEventListener('click',function (event) {
    event.preventDefault();

    if (currentPage > 1 ) {
        currentPage -= 1;

        displayApi(currentCategory, currentPage);
    }
   
    
})
nextPage.addEventListener('click',function (event) {
    event.preventDefault();

    currentPage += 1;
    
    displayApi(currentCategory, currentPage);

})