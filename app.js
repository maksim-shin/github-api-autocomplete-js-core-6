// Selectors
const input = document.querySelector('.input-text');
const list = document.querySelector('.result-list')
const cardsContainer =document.querySelector('.cards-container')

// Functions
function debounce(fn, delay) {
    let timer;

    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, delay);
    };
}


function addRepository(repo) {

    const newCard = document.createElement('li');
    newCard.classList.add("card");
   

    newCard.innerHTML = `
    <div class="card-info">
        <p>Name: ${repo.name}</p>
        <p>Owner: ${repo.owner.login}</p>
        <p>Stars: ${repo.stargazers_count}</p>
    </div>
`;
    cardsContainer.appendChild(newCard);

    // Create DELETE button
    const trashButton = document.createElement('button');
    trashButton.classList.add('btn-trash');
    newCard.appendChild(trashButton);
    trashButton.addEventListener('click', () => {
        newCard.classList.add("fall");
        newCard.addEventListener('transitionend', function() {
            newCard.remove();
        })
    
    });

    }

    const searchRepositories = debounce(async () => {
    const value = input.value.trim();
    if (!value) {
        list.innerHTML = '';
        return;
    }
    const response = await fetch(`https://api.github.com/search/repositories?q=${value}`);
    const data = await response.json();
    const repositories = (data.items || [])
    .slice(0, 5)
    .sort((a, b) => a.name.localeCompare(b.name));
    
    list.innerHTML = '';
    repositories.forEach((repo) => {
       const li = document.createElement('li');
       li.textContent = repo.name;

    li.addEventListener('click', () => {
        addRepository(repo);
        input.value = '';
        list.innerHTML = '';
    });

    list.append(li);
       
    });
}, 300)


// Event listeners
input.addEventListener('input', searchRepositories)






