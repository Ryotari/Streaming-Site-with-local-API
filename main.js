

document.addEventListener('DOMContentLoaded', function() {
    // Afficher le film à la une
    getFilmDatas(urlBestFilmList, getBestFilmUrl);
    for (let category of categories) {
    makeCategory(category);
    }
});

const urlBestFilmList = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
let bestFilmUrl;

function getFilmDatas(url, functionUrl, idDiv = "bestMovie") {
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
        console.log(data);
        return functionUrl(data, idDiv);
    })
    .catch(err => {
        console.log(err);
        alert(err);
    });
}

function getBestFilmUrl(result) {
    bestFilmUrl = result.results[0].url;
    getFilmDatas(bestFilmUrl, displayBestFilm)
}

function getFilmUrl(result,idDiv) {
    let div = document.createElement("div");
    div.setAttribute("id", idDiv + "__box");
    div.setAttribute("class", "category__box")
    document.getElementById(idDiv).appendChild(div);
    for (let i = 0; i < 5; i++) {
        filmUrl = result.results[i].url;
        getFilmDatas(filmUrl, displayFilm, idDiv);
    }
}

function displayBestFilm(data, idDiv) {
    // Ajoute les données récupérées au DOM
    document.getElementById("bestMovie__image").innerHTML = "<img src=" + data.image_url + "/>";
    document.getElementById("bestMovie__title").innerHTML = "<p>" + data.title + "</p>";
    document.getElementById("bestMovie__description").innerHTML = "<p>" + data.description + "</p>";
}

function displayFilm(data, idDiv) {
    // Ajoute les données récupérées au DOM
    let div = document.createElement("div")
    div.setAttribute("class", "movie__box")
    div.innerHTML += "<img src=" + data.image_url + "/>";
    document.getElementById(idDiv + "__box").appendChild(div);
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
let btn = document.getElementById("button__modal");
let close = document.getElementsByClassName("close")[0];

btn.addEventListener('click', function() {
    getFilmDatas(bestFilmUrl, filmInfosModale)
    modal.style.display = "block"
})


close.addEventListener('click', function() {
    modal.style.display = "None";
})

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function makeCategory(category) {
    let genre;
    let filmUrlList;
    let idDiv;
    if (category == "Films les mieux notés"){
        filmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
        idDiv = "bestMovies"
    }else{
        genre = category;
        idDiv = category;
        filmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=" + genre;
    }
    console.log(idDiv)
    let div = document.createElement("div");
    div.setAttribute("id", idDiv);
    div.setAttribute("class", "category")
    document.getElementById("categories").appendChild(div);
    let p = document.createElement("p");
    p.setAttribute("id", idDiv + "Title");
    p.setAttribute("class", "category__title")
    div.appendChild(p);
    let h1 = document.createElement("h1");
    h1.innerHTML = category;
    document.getElementById(idDiv + "Title").appendChild(h1);

    getFilmDatas(filmUrlList, getFilmUrl, idDiv);
}

const categories = [
    "Films les mieux notés",
    "Animation",
    "Mystery",
    "Sci-Fi",
    "Action"
];
