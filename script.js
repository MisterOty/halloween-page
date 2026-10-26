//MAKE A WEBSITE WHERE YOU GUESS WHICH MOVIE MADE MORE MONEY/IS HIGHER ON IMDB

let movieList = []
let yearMin = new Date().getFullYear()
let yearMax = yearMin + 1

let minInput = document.querySelector('#min-year')
let maxInput = document.querySelector('#max-year')

let maxYearEnable = false

minInput.value = `${yearMin}`
maxInput.value = `${yearMax}`

let listPos = 0
let currentBudget = []

const key = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OWFkMzE5NThkNmIxMzg3ZDg2ZDZkODcwMTBhZDI0YSIsIm5iZiI6MTc5Mjc3ODYzNC4yNDg5OTk4LCJzdWIiOiI2YWRiYTE4YTFlOWM0NGQ0NDEyMTZjNzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.O3G2G6czM7iCgCgfCIyhNSE0FzItbt13kPPWuDvJSRk'
const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`
    }
};

async function doStart(){
    for(let i = 1; i < 2; i++){
        let list = await getMovies(yearMin, yearMax, i)
        movieList.push(...list); 
    }
    listLength = movieList.length
    doPowerTurnOn()
    movieList = shuffleArray(movieList)
    createCard(movieList)
    // console.log(movieList[random])
    // console.log(movieList[random].poster_path)
    // document.querySelector('img').src = `${imgBaseUrl}${movieList[random].poster_path}`
    // document.querySelector('p').textContent = `${movieList[random].overview}`
    // conS(movieList)
}

async function getMovies(minY, maxY, num){
    let link = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${num}&sort_by=popularity.desc&vote_count.gte=100&primary_release_date.gte=${minY}-01-01`
    link += `&primary_release_date.lte=${maxY}-01-01`
    link += `&with_genres=27&with_original_language=en`
    try{
        const response = await fetch(link, options)
        if(!response.ok){
            throw new Error("Could not fetch resource")
        }
        const data = await response.json()
        return data.results
    }
    catch(error){
        console.error(error)
    }
}

async function getMovieInfo(movie_id){
    let link = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`
    try{
        const response = await fetch(link, options)
        if(!response.ok){
            throw new Error("Could not fetch resource")
        }
        const data = await response.json()
        return data
    }
    catch(error){
        console.error(error)
    }
}

async function conS(list) {
    for(let i = 0; i < list.length; i++){
        console.log(`${list[i].original_title}`)
    }
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const doCheck = () => {
    movieList = []
    if(minInput.value < 1980){
        minInput.value = 1980
    }
    if(minInput.value > new Date().getFullYear()){
        minInput.value = new Date().getFullYear()
    }
    if(maxInput.value <= minInput.value){
        maxInput.value = Number(minInput.value) + 1
    }
    if(maxInput.value > new Date().getFullYear() + 1){
        maxInput.value = new Date().getFullYear() + 1
    }
    if(!maxYearEnable){
        maxInput.value = Number(minInput.value) + 1
    }
    yearMin = minInput.value
    yearMax = maxInput.value
    doStart()
}

const doPowerTurnOn = () => {
    document.querySelector('.menu-box').style.display = `none`
    document.querySelector('main').style.background = `url(files/images/cinema-light.png)`
    document.querySelector('main').style.backgroundSize = `100% 100%`
    document.querySelector('main').classList.add('do-flash')
}

async function createCard(list){
    currentBudget = []
    document.querySelector('.choice-menu').innerHTML = ``
    for(let i = 0; i < 2; i++){
        let info = await getMovieInfo(list[i + listPos].id)
        let budget = Number(info.budget).toLocaleString() + "$"
        console.log(info)
        currentBudget.push(info.budget)
        document.querySelector('.choice-menu').innerHTML += `
            <div class="movie-select click-${i} undecided">
                <div class="movie-image" style='background: url(${imgBaseUrl}${list[i + listPos].poster_path});background-size: 100% 100%;'></div>
                <div class="movie-text">Budget: ${budget}</div>
            </div>`
        if(i == 1){
            document.querySelector(`.click-${i} .movie-text`).style.bottom = `-15%`
        }
    }
    console.log(currentBudget)
}

const doDataCheck = (num) => {
    document.querySelector(`.click-${num}`).classList.add('selected')
    document.querySelector(`.click-${1 - num}`).classList.add('unselected')
    if(currentBudget[num] >= currentBudget[1 - num]){
        console.log(movieList, listPos)
        doCinemaFlash('right')
        listPos++
        setTimeout(() => {
            createCard(movieList)
        }, 1250);
    }else{
        doCinemaFlash('wrong')
        setTimeout(() => {
            doEndScreen()
        }, 1250);
    }
    for(let i = 0; i < 2; i++){
        document.querySelector(`.click-${i} .movie-text`).style.bottom = `0%`;
        document.querySelector(`.click-${i}`).classList.remove('undecided')
    }
}

const doCinemaFlash = (type) => {
    document.querySelector('.box-container').style.transition = `background-color 0s`
    if(type == "right"){
        document.querySelector('.box-container').style.backgroundColor = `rgba(0, 255, 0, 0.5)`
    }else{
        document.querySelector('.box-container').style.backgroundColor = `rgba(255, 0, 0, 0.5)`
    }
    setTimeout(() => {
        document.querySelector('.box-container').style.transition = `background-color 0.5s`
        document.querySelector('.box-container').style.backgroundColor = `rgba(0, 0, 0, 0)`
    }, 500);

}

const doReset = () => {
    movieList = []
    document.querySelector('.menu-box').style.display = `flex`
    document.querySelector('.end-screen').style.display = `none`
}

const doEndScreen = () => {
    document.querySelector('.choice-menu').innerHTML = ``
    document.querySelector('.end-screen').style.display = `flex`
}

document.querySelector('#enableMaxY').addEventListener('change', () => {
    maxYearEnable = !maxYearEnable
    document.querySelector('.max-year-box').classList.toggle('toggle-off')
    document.querySelector('.max-year-box').classList.toggle('toggle-on')
})

document.querySelector('.choice-menu').addEventListener('click', (event) => {
    let clickedDiv = event.target.closest('.movie-select').classList[1].split('-')[1]
    doDataCheck(clickedDiv)
})