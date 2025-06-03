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

        console.log(data);
        
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
        const figure = createElement("figure","",`<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.name}">`);
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

async function displayApiPopup(titleMovie) {
    
    const movies = await getApi(currentCategory, currentPage);
    popup.innerHTML ="";


    const moviePopup = movies.results.find( movie => movie.name === titleMovie)

    if (moviePopup) {
         const carte  = createElement("div","card","");
         const figure = createElement("figure","card__poster",`<img src="https://image.tmdb.org/t/p/w500${moviePopup.backdrop_path}" alt="${moviePopup.name}">`);
         const description = createElement('div',"card__description","")
         const titre  = createElement("h2","",`${moviePopup.name}`);
         const paragraphe = createElement("p","",`${moviePopup.overview}`);
         const aireDate = createElement("p","",`
            First Air date ${moviePopup.first_air_date}`)
         const originCountry = createElement("p","",`Made In ${moviePopup.origin_country}`)

         
        appendElement(popup, carte);
        appendElement(carte, figure);
        appendElement(carte,description);
        appendElement(description,titre);
        appendElement(description, paragraphe);
        appendElement(description,aireDate);
        appendElement(description,originCountry);

        // bouton enlever la popup
        const btnClose = createElement("div","close-btn",`❎`)
        appendElement(popup,btnClose)

        btnClose.addEventListener("click",function(event){
            event.preventDefault

            popup.classList.remove("active");
        })
    }
}

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

displayCategory.addEventListener('click',function (event) {
    event.preventDefault();

    
    if (event.target.closest('.card')) {
        const titleMovie = event.target.closest('.card').querySelector("h2").innerText
        popup.classList.add('active');
        displayApiPopup(titleMovie);
    }
}) 