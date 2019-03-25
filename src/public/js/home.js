window.onload = () => {
    fetchInfo();
    fetchGames();
}

function fetchInfo(){
    fetch('/api/auth/user')
    .then(res=>res.json())
    .then(data =>{
        document.getElementById('username').innerText ='Welcome, ' + data.username;
    })
    .catch(err => console.log(err));
}

function fetchGames() {
    document.getElementById('gamesTable').innerHTML = '';

    fetch('/api/games')
        .then(res => res.json())
        .then(data => {
            if(data.length > 0){
                data.map(game => {
                    document.getElementById('gamesTable')
                        .innerHTML += `<div class="col-sm-6 mb-3">
                                        <div class="card">
                                            <img src="${game.image.uri}" style="width:100%" class="card-img-top" alt="game cover">
                                            <div class="card-body">
                                                <h5 class="card-title">${game.title}</h5>
                                                <p class="card-text">${game.description}</p>
                                                <p class="card-text text-primary">${game.author}</p>
                                                <button value="${game._id}" class="btn btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    </div>`
                });
            }else{
                document.getElementById('gamesTable').innerHTML = "<div class='col-sm-12 text-center'><div class='card'><div class='card-body'<h3>There's no games to show :(</h3></div></div></div>";
            }
        })
        .catch(err => console.log(err))

}


//Adding game
document.getElementById('addForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const author = document.getElementById('author').value;
    const image = document.getElementById('image').files;

    const game = new FormData();

    game.append('image', image[0]);
    game.append('title', title);
    game.append('description', description);
    game.append('author', author);

    fetch('/api/games', {
            method: 'POST',
            body: game
        }).then(res => {
            fetchGames()
            res.json()
        })
        .then(data => {
            console.log(data)
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            document.getElementById('author').value = '';
            document.getElementById('image').value = '';
        })
        .catch(err => console.log(err));

});

//Deleting game
document.getElementById('gamesTable').addEventListener('click',(e)=>{
    if(e.target.value != undefined){
        fetch(`/api/games/${e.target.value}`,{
            method:'DELETE',
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res => {
            fetchGames();
            res.json();
        })
          .then(data => console.log(data))
          .catch(err => console.log(err));  
    }
})

//logging out
document.getElementById('logout').addEventListener('click',()=>{
    fetch('/api/auth/logout')
    .then(()=>window.location = '/login')
    .catch(err => console.log(err));
})