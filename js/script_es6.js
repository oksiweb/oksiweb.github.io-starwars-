(function(){

    let description = document.querySelector('.description');
    let allFilms = document.querySelector('.films');
    let container = document.querySelector('.container');
    let prev = document.querySelector('.prev');
    let next = document.querySelector('.next');
    let preloader = document.querySelector(".preloader");
    let heroId = 1;

    function addLoader() {
        preloader.classList.add('preloader-active');
        container.classList.add('start');
        container.classList.remove('end');
    }

    function removeLoader() {
        container.classList.add('end');
        container.classList.remove('start');
        preloader.classList.remove('preloader-active');
    }

    function removeContent(){
        description.textContent = '';
        allFilms.textContent = '';
    }

    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }

    function loadHero(id) {
        addLoader();
        return fetch('http://swapi.co/api/people/'+ id + '/', {method: 'get'})
            .then(checkStatus)
            .then(response => response.json())
            .then(heroes => {
                createHeroDescription(heroes);
                return heroes.films;
            })
            .then(films => {
                return Promise.all(films.map(film => loadFilms(film)));
            })
            .then(createFilmDescription)
            .then(() => removeLoader())
            .catch(error => {
                console.log("Failed",error);
                removeLoader();
                description.textContent = 'There is no such hero. Please, click button';
            })
    }

    function loadFilms(url) {
        return fetch(url, {method: 'get'})
            .then(checkStatus)
            .then(response => response.json())
    }

    function createHeroDescription(hero) {
        let ul = document.createElement('ul');
        let counter = 0;
        for(let key in hero){
            counter++;
            if(counter<=8){
                let title = key.split('_').map(item => item.charAt(0).toUpperCase()+item.slice(1)).join(' ');
                let li = document.createElement('li');
                li.textContent = `${title}: ${hero[key]}`;
                ul.appendChild(li);
            }
        }
        description.appendChild(ul);
    }

    function createFilmDescription(films) {
        let heroFilms = [];
        films.forEach((film )=>{
            heroFilms.push({
                title: film.title,
                id: film.episode_id
            });
        });
        films = heroFilms.sort((a, b) => a.id - b.id);
        let ul = document.createElement('ul');
        films.map(film => {
            let li = document.createElement('li');
            let liContent = "Episode " + film.id + ": " + film.title;
            li.textContent = liContent;
            ul.appendChild(li);
        });
        allFilms.appendChild(ul);
    }


    function nextClick(e) {
        if ( heroId < 88 ) {
            removeContent();
            loadHero(heroId++);
        }
        if( heroId > 1 ) {
            prev.removeAttribute('disabled');
        }
        if( heroId >= 88 ) {
            next.setAttribute('disabled', 'disabled');
        }
    }

    function prevClick(e) {
        if ( heroId > 1 ) {
            removeContent();
            loadHero(heroId--);
        }
        if( heroId === 1 ) {
            prev.setAttribute('disabled', 'disabled');
        }
        if( heroId < 88 ) {
            next.removeAttribute('disabled');
        }
    }

    loadHero(heroId);

    next.addEventListener('click', nextClick);
    prev.addEventListener('click', prevClick);

})();

