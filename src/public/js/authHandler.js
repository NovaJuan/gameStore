function loginHandler(user){
    document.getElementById('errors').innerHTML ='';
    fetch('/api/auth/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(user)
    })
    .then(res=>res.json())
    .then(data => {
        if(data.errors){
            const {errors} = data;
            errors.map(error=>{
                document.getElementById('errors').innerHTML +=`<p class='text-danger'>${error}<p/>`
            })
        }else{
            window.location = '/';
        }
    })
}

function signupHandler(user){
    document.getElementById('errors').innerHTML ='';
    fetch('/api/auth/signup',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(user)
    }).then(res=>res.json())
    .then(data => {
        if(data.errors){
            const errors = data.errors;
            errors.map(error =>{
                document.getElementById('errors').innerHTML +=`<p class='text-danger'>${error}<p/>`
            });
        }else{
            window.location = '/login'
        }
    })
    .catch(err=>console.log(err));      
}

document.querySelector('form').addEventListener('submit',(e)=>{
    e.preventDefault();
    if(e.target.id == 'signupForm'){
        const user = {
            email:document.getElementById('email').value,
            username:document.getElementById('username').value,
            password:document.getElementById('password').value,
        }
        signupHandler(user);
    }else{
        const user = {
            email:document.getElementById('email').value,
            password:document.getElementById('password').value
        }
        loginHandler(user);
    }
});