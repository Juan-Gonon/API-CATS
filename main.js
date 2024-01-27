// const URL = 'https://api.thecatapi.com/v1/images/search';
const apiURL = 'https://api.thecatapi.com/v1/images/search?limit=8&api_key=live_fkcA6ho5HOqOUScngIY0LCekfptB7wA0KQ4KFtF6HBpOc6R4uxSS4eqWQf6TSFWK';

// const apiFavorites = 'https://api.thecatapi.com/v1/favourites';
const apiUpload = 'https://api.thecatapi.com/v1/images/upload';

//Instancia de AXIOS
const axioInstance = new axios.create({
    baseURL: "https://api.thecatapi.com/v1",
    headers:{
        'Content-Type': 'application/json;charset=utf-8'
    },
    params:{
        'limit': 8,
        'api_key':'live_fkcA6ho5HOqOUScngIY0LCekfptB7wA0KQ4KFtF6HBpOc6R4uxSS4eqWQf6TSFWK',
    }
});



const imgBx = document.querySelector('.container');
const spanError = document.getElementById('error');
const btnImage = document.getElementById('btnFile');



let cats = "";
let contador = 0;
let idCats = [];



getCats();
getFavorites()


function getCats(){
    axioInstance('/images/search')
    .then(
        (res)=>{
            // console.log(res)
            if(res.status == 200){
                const data = res.data;
                    data.forEach((i)=>{
                        // console.log(i)
                        cats = `
                                <div class="card">
                                    <div class="imgBx">
                                        <img alt="Fto de Gatos" width="300" src="${i.url}">
                                    </div>
                                    <div class="conentBx">
                                        <button href="#" id="${i.id}" class="btns">
                                            <span><ion-icon name="heart" ></ion-icon></span>
                                        </button>
                                        <button href="#" class="btns">
                                            <span><ion-icon name="chatbubble"></ion-icon></span>
                                        </button>
                                        <button href="#" class="btns">
                                            <span><ion-icon name="paw"></ion-icon></span>
                                        </button>
                                    </div>
                                </div>
                                
                                `
                        imgBx.innerHTML += cats;
                        contador++;
                       
                        if(contador === data.length){
                            const btns = document.querySelectorAll('.btns')
        
                            btns.forEach((i)=>{
                             
                                if(i.id){
                                    i.onclick = ()=>{
                                        if(i.classList.toggle('active')){
                                            postFavorites(i.id)
                                        }else{
                                            idCats.forEach((j)=>{
                                                if(j.image_id === i.id){
                                                    console.log('delete: ' + j.id)
                                                    deleteFavorites(j.id)
                                                }
                                            })
                                            //inputDelete(i.id)
                                            
                                        }
                                        
                                    }
                                }
                            })
                        }       
                        
                    })
                    
            }else{
                spanError.innerHTML = "Hubo un error: " + res.status;
            }
        }
    )
}

function getFavorites(){
    axioInstance('/favourites',{
        params:{
            'limit': 20,
        }
    })
    .then(
        (res)=>{
            if(res.status == 200){
                const data = res.data
                const section = document.querySelector('.favorites')
                section.innerHTML = "";
                       
                        data.forEach((i)=>{
                            const article = document.createElement('article');
                            const img = document.createElement('img');
                            const btn = document.createElement('button');
                            const btnText = document.createTextNode('Delete')

                            btn.appendChild(btnText)
        

                            img.src = i.image.url;
                            article.appendChild(img)
                            article.appendChild(btn)
                            section.appendChild(article)

                            idCats.push(i);
                            btn.id = i.id;

                            inputDelete(btn);
                           
                        })
            }else{
                spanError.innerHTML = "Hubo un error: " + res.status;
            }
        }
    )
}


async function postFavorites(idGats){
    // console.log(idGats)

    const {data, status} = await axioInstance.post('/favourites', {
        image_id: idGats,
    })

    if(status !== 200){
        spanError.innerHTML = "Hubo un error: " + status + data.message
    }else{
        getFavorites()
    }

    
}

function inputDelete(btns){
    //console.log(btns)
    btns.onclick = ()=>{
       // console.log(btns.id)
        deleteFavorites(btns.id)
    }

}

function deleteFavorites(idelete){

    axioInstance(`/favourites/${idelete}`, {
        method: "DELETE"
    }).then(
        (res)=>{
            console.log(res)
           if(res.status != 200){
                spanError.innerHTML = res.status;
           }else{
            getFavorites()
           }
        }
    )


}


btnImage.onclick = ()=>{
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    const imagePreview = document.getElementById('imgPrev');
    imagePreview.src = '';

    fetch(apiUpload, {
        method: "post",
        headers: {
            //"Content-Type": "multipart/form-data",
            "X-API-KEY": "live_fkcA6ho5HOqOUScngIY0LCekfptB7wA0KQ4KFtF6HBpOc6R4uxSS4eqWQf6TSFWK"
        },
        body: formData
    }).then(
        (res)=>{
            if(res.status !== 201){
                spanError.innerHTML = "Hubo un error: " + res.status + res.json().message
            }else{
                res.json().then(
                    (data)=>{
                        //console.log(data)
                        postFavorites(data.id)
                    }
                )
            }
        }
    )
}

function previewImage() {
    const fileInput = document.getElementById('file');
    const imagePreview = document.getElementById('imgPrev');


    const file = fileInput.files[0];

    if(file){
        const reader = new FileReader();

        reader.onload = function (e){
            imagePreview.src = e.target.result;
            
        }
        reader.readAsDataURL(file);
    }

}






