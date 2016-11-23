(function(){

    var description = document.querySelector('.description');
    var allFilms = document.querySelector('.films');
    var container = document.querySelector('.container');
    var prev = document.querySelector('.prev');
    var next = document.querySelector('.next');
    var preloader = document.querySelector(".preloader");
    var heroId = 1;

    function addLoader() {
        preloader.classList.add('preloader-active');
        container.setAttribute('style', 'opacity: 0');
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

    function removeLoader() {
        container.setAttribute('style', 'opacity: 1; transition: all 1s ease-out');
        preloader.classList.remove('preloader-active');
    }

    function loadHero(id) {
        addLoader();
        return fetch('http://swapi.co/api/people/'+ id + '/', {method: 'get'})
            .then(checkStatus)
            .then(function(response){
                return response.json();
            })
            .then(function(heroes) {
                createHeroDescription(heroes);
                return heroes.films;
            })
            .then(function(films){
                return Promise.all(films.map(function(film){
                        return loadFilms(film);
                    })
                );
            })
            .then(createFilmDescription)
            .then(function(){
                removeLoader();
            })
            .catch(function(error) {
                console.log("Failed",error);
                removeLoader();
                description.textContent = 'There is no such hero. Please, click button';

           })
    }

    function loadFilms(url) {
        return fetch(url, {method: 'get'})
            .then(checkStatus)
            .then(function(response){
                return response.json();
            })
    }

    function createHeroDescription(hero) {
        var hero = [
            "Name: " + hero.name,
            "Height: " + hero.height,
            "Mass: " + hero.mass,
            "Hair Color: " + hero.hair_color,
            "Skin Color: " + hero.skin_color,
            "Eye Color: " + hero.eye_color,
            "Birth Year: " + hero.birth_year,
            "Gender: " + hero.gender
        ];
        var ul = document.createElement('ul');
        hero.forEach(function(value){
            var li = document.createElement('li');
            li.textContent = value;
            ul.appendChild(li);
        });
        description.appendChild(ul);
    }

    function createFilmDescription(films) {
        var heroFilms = [];
        films.forEach(function(film ){
            heroFilms.push({
                title: film.title,
                id: film.episode_id
            });
        });
        films = heroFilms.sort(function(a, b){
            return a.id - b.id ;
        });
        var ul = document.createElement('ul');
        films.map(film => {
            var li = document.createElement('li');
            var liContent = "Episode " + film.id + ": " + film.title;
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

