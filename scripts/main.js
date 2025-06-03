//=======Selection des elem ====================

const btnContainer   = document.querySelector('.bnt-container');
const displyCategory = document.querySelector('.display-category');
const popup          = document.querySelector('.popup');

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

// ==== Fonctions Fetch => API ====
async function getApi(choice = "airing_today") {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${choice}?api_key=6631e5f1dc96088e0d26b86da29b5b6a`);
        const data = await response.json();

        console.log(data.results, "data");
        
        return data.results
    }
    catch (error) {
        console.error(error);
    }
}

getApi();

async function displayApi() {
    
};
