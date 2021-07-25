// IIFE wrap
let pokemonRepository = (function() { 
    
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function loadList() {
        return fetch(apiUrl).then(function(response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function(item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function(e) {
            console.error(e);
        })
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function(response) {
            return response.json();
        }).then(function (details) {
           item.imageUrlFront = details.sprites.front_default;
           item.imageUrlBack = details.sprites.back_default;
           item.height = details.height;
           item.types = details.types; 
        }).catch(function(e) {
            console.error(e);
        });
    }

    function addListItem(pokemon) {

        let pokemonList = document.querySelector('.list-group');
        let listItem = document.createElement('li');
        listItem.classList.add('group-list-item','pokemon-list');
        pokemonList.appendChild(listItem);

        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.setAttribute('data-target','#exampleModal')
        button.setAttribute('data-toggle','modal');
        
        button.classList.add('btn', 'button_one');
        listItem.appendChild(button);        
        button.addEventListener('click', function() {
            showDetails(pokemon);
        });
    }
           // ---------------- MODAL  -------------------- //           
           
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {

            // --------  ADDING POKEMON DETAILS to MODAL  --------------------
            
            let modal = $('.modal-body');
            modal.empty();

            let imageElement = document.createElement('img');
            imageElement.src = pokemon.imageUrlFront;
            //imageElement.classList.add('pokemon-image');
            modal.append(imageElement);   
            
            let imageElementBack = document.createElement('img');
            imageElementBack.src = pokemon.imageUrlBack;
            imageElementBack.classList.add('invisible');
            modal.append(imageElementBack);

            // -------------  SWAPPING FRONT and BACK IMAGES -----------------
            modal.on('click', function () {
                imageElement.classList.toggle('invisible');
                imageElementBack.classList.toggle('invisible');
            });
            

            // -------------  POKEMON NAME and HEIGHT  -------------------------
            let pokemonName = document.createElement('h1');
            pokemonName.innerText = pokemon.name;
            pokemonName.classList.add('pokemon-name');
            modal.append(pokemonName);

            let pokemonHeight = document.createElement('p');
            pokemonHeight.innerText = 'height: ' + pokemon.height;
            pokemonHeight.classList.add('pokemon-height');
            modal.append(pokemonHeight);
            

            // ---------  ACCESSING ARRAY inside an object  ------------ //
            let pokemonTypes = document.createElement('p');
            pokemonTypes.classList.add('pokemon-types');
            modal.append(pokemonTypes);
            
            let a = pokemon.types;
            let pokemonTypesText = 'type: ';
            for (let i = 0; i < a.length; i++) {
                console.log(a[i]);
                pokemonTypesText += a[i].type.name + '</br>';
            }
            // because the line below is placed after pokemonTypesText += a[i].type.name
            // the pokemonTypesText isn't just 'type: ' (as in the initial variable declaration)
            pokemonTypes.innerHTML = pokemonTypesText;
            
            
        });
    }

    /*
    function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }
    */

    function getAll() {
        return pokemonList;
    }

    function add(item) {
        //if (typeof(item) === 'object' && 
        //Object.keys(pokemonList[0]).every((key) => key in item)) {
        pokemonList.push(item);
        //} else {
        //alert('Wrong data format. Change format to object incl. all keys as follows {name:value, height:value, types:value}');
        //}
    }

    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
    };
})();

// calling 'getAll' function from inside the IIFE
console.log(pokemonRepository.getAll());

pokemonRepository.loadList().then(function() {          // fetch the remote data
    pokemonRepository.getAll().forEach(function(allPokemons) {  // then add each item from the fetched data 
        pokemonRepository.addListItem(allPokemons);             // to the html <ul class="pokemon-list"> 
    }); 
});                                                             // via the addListItem function.



