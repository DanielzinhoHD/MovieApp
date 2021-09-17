const SEARCH_MOVIE_URL = "https://api.themoviedb.org/3/search/movie?api_key=4315d351a466b792ac57f8880c939f90";
const POPULARITY_MOVIE_URL = "https://api.themoviedb.org/3/trending/movie/day?api_key=4315d351a466b792ac57f8880c939f90&sort_by=popularity.desc";
const TOPRATED_MOVIE_URL = "https://api.themoviedb.org/3/movie/top_rated?api_key=4315d351a466b792ac57f8880c939f90&page=1"
const UPCOMING_MOVIE_URL = "https://api.themoviedb.org/3/movie/upcoming?api_key=4315d351a466b792ac57f8880c939f90&page=1"
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

const form = document.querySelector("#form");
const input = document.querySelector("#input");
const screen = document.querySelector(".screen");
const main = document.querySelector("main");
const homeBtn = document.querySelector(".homeBtn");
const favBtn = document.querySelector(".favList");

let favList = JSON.parse(localStorage.getItem("favList")) || [];
let favOnOff = false;

home();

function home(){
    input.value = '';
    main.innerHTML = '';
    showTrending();
    showRanked();
    showUpcoming();
}

homeBtn.addEventListener("click", () => {
    home();
    if(favOnOff){
        favOnOff = !favOnOff;
    }
})

function generateBanners(lista, div){
    lista.results.forEach((movie) => {
        if(movie.poster_path){
            const img = IMAGE_PATH + movie.poster_path;
            const divEl = document.createElement("div");
            divEl.classList.add("movie");
            
            if(Number.isInteger(movie.vote_average)){
                movie.vote_average += ".0";
            }

            let favTest = '';
            if(favList.includes(movie.id)){
                favTest = "<i class=\"fas fa-star\"></i>"
            }else{
                favTest = "<i class=\"far fa-star\"></i>"
            }

            divEl.innerHTML = `
                <span>
                    <button class="favBtn">${favTest}</button>
                    <img src="${img}" class="banner">
                </span>
                <h2>${movie.vote_average}</h2>
            `;

            const favBtn = divEl.querySelector(".favBtn");
            favBtn.addEventListener("click", () => {
                toggleFavBtn(favBtn, movie.id);
                updateFavList(divEl);
            })

            const banner = divEl.querySelector(".banner");
            banner.addEventListener("click", async () => {
                const movieEl = await fetch(`http://api.themoviedb.org/3/movie/${movie.id}?api_key=4315d351a466b792ac57f8880c939f90`);
                const listaEl = await movieEl.json()

                if(listaEl.homepage){
                    open(listaEl.homepage), "_blank";
                }else{
                    alert("Sorry, but this movie has no webpage");
                }
            })
            
            div.appendChild(divEl);
        }
    })
}

function updateFavList(){
    if(favOnOff){
        const div = document.querySelector(".margin-correction");
        div.innerHTML = '';

        generateFavBanners(div);
    }
}

async function showTrending(){
    let page = 1;
    const movie = await fetch(POPULARITY_MOVIE_URL + "&page=" + page);
    const lista = await movie.json();

    const h1 = document.createElement("h1");
    h1.innerText = 'Trending';
    main.appendChild(h1);

    const div = document.createElement("div");
    div.classList.add("container");
    
    div.addEventListener("scroll", async () => {
        const percent = getScrollPercentageWidth(div);
        if(percent >= 90){
            page++;
            
            const movie = await fetch(POPULARITY_MOVIE_URL + "&page=" + page);
            const lista = await movie.json();

            generateBanners(lista, div);
        }
    })

    generateBanners(lista, div);

    main.appendChild(div);
}

async function showRanked(){
    let page = 1;
    const movie = await fetch(TOPRATED_MOVIE_URL);
    const lista = await movie.json();

    const h1 = document.createElement("h1");
    h1.innerText = 'Top rated'
    main.appendChild(h1);

    const div = document.createElement("div");
    div.classList.add("container");

    div.addEventListener("scroll", async () => {
        const percent = getScrollPercentageWidth(div);
        if(percent >= 90){
            page++;
            
            const movie = await fetch(TOPRATED_MOVIE_URL + "&page=" + page);
            const lista = await movie.json();

            generateBanners(lista, div);
        }
    })

    generateBanners(lista, div);

    main.appendChild(div);
}

async function showUpcoming(){
    let page = 1;
    const movie = await fetch(UPCOMING_MOVIE_URL);
    const lista = await movie.json();

    const h1 = document.createElement("h1");
    h1.innerText = 'Upcoming movies'
    main.appendChild(h1);

    const div = document.createElement("div");
    div.classList.add("container");

    div.addEventListener("scroll", async () => {
        console.log("a")
        const percent = getScrollPercentageWidth(div);
        if(percent >= 90){
            page++;
            
            const movie = await fetch(UPCOMING_MOVIE_URL + "&page=" + page);
            const lista = await movie.json();

            generateBanners(lista, div);
        }
    })

    generateBanners(lista, div);

    main.appendChild(div);
}

async function searchMovies(text){
    
    const movie = await fetch(SEARCH_MOVIE_URL + "&query=" + text);
    const lista = await movie.json();

    const h1 = document.createElement("h1");
    h1.innerText = `Results for: ${text}`
    main.appendChild(h1);

    const div = document.createElement("div");
    div.classList.add("results");

    generateBanners(lista, div);

    main.appendChild(div)
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = ''

    const text = input.value;
    input.innerText = '';

    searchMovies(text);
})

favBtn.addEventListener("click", () => {
    if(localStorage.getItem("favList") != '[]'){
        home();

        favOnOff = !favOnOff;

        if(favOnOff){
            const div = document.createElement("div");
            div.classList.add("container");
            div.classList.add("margin-correction");
        
            generateFavBanners(div)
        
            main.appendChild(div);
        }  
    }else{
        alert("You haven't added any movie to your favorite list yet")
    }
})

function generateFavBanners(div){
    favList.forEach(async (id) => {
    
        const movie = await fetch(`http://api.themoviedb.org/3/movie/${id}?api_key=4315d351a466b792ac57f8880c939f90`);
        const lista = await movie.json()
        const img = IMAGE_PATH + lista.poster_path;

        const divEl = document.createElement("div");
        divEl.classList.add("movie");
            
        if(Number.isInteger(lista.vote_average)){
            lista.vote_average += ".0";
        }

        let favTest = '';
        if(favList.includes(id)){
            favTest = "<i class=\"fas fa-star\"></i>"
        }else{
            favTest = "<i class=\"far fa-star\"></i>"
        }

        divEl.innerHTML = `
            <span>
                <button class="favBtn">${favTest}</button>
                <img src="${img}" class="banner">
            </span>
            <h2>${lista.vote_average}</h2>
        `;

        const favBtn = divEl.querySelector(".favBtn")
        favBtn.addEventListener("click", () => {
            toggleFavBtn(favBtn, lista.id);
            favOnOff = !favOnOff;         
        })

        const banner = divEl.querySelector(".banner");
            banner.addEventListener("click", async () => {
                const movieEl = await fetch(`http://api.themoviedb.org/3/movie/${lista.id}?api_key=4315d351a466b792ac57f8880c939f90`);
                const listaEl = await movieEl.json()

                if(listaEl.homepage){
                    open(listaEl.homepage), "_blank";
                }else{
                    alert("Sorry, but this movie has no webpage");
                }
            })

        div.appendChild(divEl);
    })
}

function getScrollPercentageWidth(div){
    let scrollSide = div.scrollLeft;
    let docWidth = div.scrollWidth;
    const winWidth = window.innerWidth;
    let scrollPercent = scrollSide / (docWidth - winWidth) * 100;

    return Math.round(scrollPercent);
}

function addLS(id){
    favList.push(id)

    localStorage.setItem("favList", JSON.stringify(favList))
}

function removeLS(id){
    const index = favList.indexOf(id);
    favList.splice(index, 1);

    localStorage.setItem("favList", JSON.stringify(favList))
}

function toggleFavBtn(favBtn, id){
    if(favBtn.innerHTML == "<i class=\"far fa-star\"></i>"){
        favBtn.innerHTML = "<i class=\"fas fa-star\"></i>";
        addLS(id);
    }else{
        favBtn.innerHTML = "<i class=\"far fa-star\"></i>";
        removeLS(id);
    }
}