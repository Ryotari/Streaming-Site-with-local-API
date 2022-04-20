

document.addEventListener('DOMContentLoaded', function() {
    // Afficher le film à la une
    getFilmDatas(urlBestFilmList, getBestFilmUrl);
    for (let category of categories) {
    makeCategory(category);
    }
});

const urlBestFilmList = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";

function getFilmDatas(url, functionUrl, idDiv = "bestMovies") {
    // 1. Envoyer une requête vers l'API pour obtenir le meilleur film
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        // 2. Récupérer le meilleur film dans le résultat de la requête
        return res.json()
    })
    .then(data => {
        // 3. Afficher le meilleur film dans notre page Html
        return functionUrl(data, idDiv);
    })
    .catch(err => {
        console.log(err);
        alert(err);
    });
}

function getBestFilmUrl(result) {
    let bestFilmUrl = result.results[0].url;
    getFilmDatas(bestFilmUrl, displayBestFilm)
}

function getFilmUrl(result, idDiv) {
    let div = document.getElementById(idDiv + "__box");
    div.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        filmUrl = result.results[i].url;
        getFilmDatas(filmUrl, displayFilm, idDiv);
    };

}

function displayBestFilm(data, idDiv) {
    // Ajoute les données récupérées au DOM
    document.getElementById("bestMovie__image").innerHTML = "<img src=" + data.image_url + "/>";
    document.getElementById("bestMovie__title").innerHTML = "<p>" + data.title + "</p>";
    document.getElementById("bestMovie__description").innerHTML = "<p>" + data.description + "</p>";
    let btn = document.getElementById("button__modal");
    btn.addEventListener('click', function() {
    filmInfosModale(data);
    modal.style.display = "block";
})    
}

function displayFilm(data, idDiv) {
    // Ajoute les données récupérées au DOM
    let div = document.createElement("div");
    div.setAttribute("class", "movie__box");
    console.log("ici " + idDiv)
    document.getElementById(idDiv + "__box").appendChild(div);

    div.innerHTML += "<img src=" + data.image_url + "/>";
    div.addEventListener('click', function() {
        filmInfosModale(data);
        modal.style.display = "block";
    });
}

function filmInfosModale(result) {
    document.getElementById("headerModal__originalTitle").innerHTML = "<p>" + result.original_title + "</p>";
    document.getElementById("headerModal__filmImage").innerHTML = "<img src=" + result.image_url + "alt='Best Film Image' />";
    document.getElementById("infoModalText__genres").innerHTML = "<p>Genres : " + result.genres + "</p>";
    document.getElementById("infoModalText__datePublished").innerHTML = "<p>Date de sortie : " + result.date_published + "</p>";
    document.getElementById("infoModalText__rated").innerHTML = "<p>Classification : " + result.rated + "</p>";
    document.getElementById("infoModalText__imdbScore").innerHTML = "<p>Score IMDB : " + result.imdb_score + "</p>";
    document.getElementById("infoModalText__directors").innerHTML = "<p>Réalisateur : " + result.directors + "</p>";
    document.getElementById("infoModalText__actors").innerHTML = "<p>Acteurs : " + result.actors + "</p>";
    document.getElementById("infoModalText__duration").innerHTML = "<p>Durée : " + result.duration +  " min</p>";
    document.getElementById("infoModalText__countries").innerHTML = "<p>Pays : " + result.countries + "</p>";
    document.getElementById("infoModalText__worldwideGrossIncome").innerHTML = "<p>Box Office : " + result.worldwide_gross_income  + " $</p>";
    document.getElementById("infoModalText__longDescription").innerHTML = "<p>Résumé : " + result.long_description + "</p>";
}

let modal = document.getElementById("myModal");
let close = document.getElementsByClassName("close")[0];

close.addEventListener('click', function() {
    modal.style.display = "None";
})

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function makeCategory(category) {
    let filmUrlList;
    let idDiv;

    idDiv = category;
    if (category == "Films les mieux notés"){
        idDiv = "bestMovies"
    }

    console.log(idDiv)
    let div = document.createElement("div");
    div.setAttribute("id", idDiv);
    div.setAttribute("class", "category");
    div.setAttribute("slide", 1);
    document.getElementById("categories").appendChild(div);

    let h1 = document.createElement("h1");
    h1.innerHTML = category;
    document.getElementById(idDiv).appendChild(h1);

    let divSec = document.createElement("div");
    divSec.setAttribute("id", idDiv + "__box");
    divSec.setAttribute("class", "category__box");
    document.getElementById(idDiv).appendChild(divSec);

    let leftSlideDiv = document.createElement("div");
    let rightSlideDiv = document.createElement("div");
    leftSlideDiv.setAttribute("id", idDiv + "__prev");
    leftSlideDiv.setAttribute("class", "category__prev");
    leftSlideDiv.innerHTML = "<";
    rightSlideDiv.setAttribute("id", idDiv + "__next");
    rightSlideDiv.setAttribute("class", "category__next");
    rightSlideDiv.innerHTML = ">";
    div.appendChild(rightSlideDiv);
    div.appendChild(leftSlideDiv);

    leftSlideDiv = document.getElementById(idDiv + "__prev");
    leftSlideDiv.addEventListener('click', function() {
        let nbSlide = div.getAttribute("slide") - 1;
        if (nbSlide == 0) {
            nbSlide = 7;
        }

        div.setAttribute("slide", nbSlide);

        displaySlide(category, idDiv);
    });

    rightSlideDiv = document.getElementById(idDiv + "__next");
    rightSlideDiv.addEventListener('click', function() {
        
        let nbSlide = parseInt(div.getAttribute("slide")) + 1;

        if (nbSlide == 8) {
            nbSlide = 1;
        };
        div.setAttribute("slide", nbSlide);

        displaySlide(category, idDiv);
    });

    displaySlide(category, idDiv);
}

function displaySlide (category, idDiv){
    let nbSlide = document.getElementById(idDiv).getAttribute("slide");
    if (category == "Films les mieux notés"){
        filmUrlList = "http://localhost:8000/api/v1/titles/?page=" + nbSlide + "&sort_by=-imdb_score";
    } else {
        filmUrlList = "http://localhost:8000/api/v1/titles/?page=" + nbSlide + "&sort_by=-imdb_score&genre=" + category;
    }
    getFilmDatas(filmUrlList, getFilmUrl, idDiv);
}



const categories = [
    "Films les mieux notés",
    "Animation",
    "Mystery",
    "Sci-Fi",
    "Action"
];
