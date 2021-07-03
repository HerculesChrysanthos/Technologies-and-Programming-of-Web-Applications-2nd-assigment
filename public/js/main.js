var templates = {};

templates.workDetails = Handlebars.compile(`
    <article class="worksArticle">
        <h2>{{title}}</h2>
        <ul>
            <li>Author: {{author}}</li>
            <li>ID: {{bookId}}</li>
        </ul>
        <p class="articleButtons">
            <button id="{{saveBtnId}}" onclick="storeBook('{{title}}','{{author}}',{{bookId}})">SAVE</button>
            <button id="{{cancelBtnId}}" hidden="hidden" onclick="cancelWork({{bookId}},1)">CANCEL</button>
        </p>
    </article>
    `
);

templates.favoriteWorks = Handlebars.compile(`
    <article class="worksArticle">
        <h2>{{title}}</h2>
        <ul>
            <li>Author: {{author}}</li>
            <li>ID: {{id}}</li>
            <li>Review: {{review}}</li>
        </ul>
        <p class="articleButtons">
            <button id="{{id}}" onclick="redirect({{id}})">EDIT</button>
            <button id="{{id}}" onclick="cancelWork({{id}},2)">DELETE</button>
        </p>
    </article>
    `
);

function getTitles(){
    let givenTitle = document.getElementById('givenTitle').value;
    let results = document.getElementById('results');
    results.innerHTML = "<h3>Loading...</h3>";
    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    let init = {
        method: "GET",
        headers: myHeaders
    }

    let url = 'https://reststop.randomhouse.com/resources/works?search=' + givenTitle;
    
    fetch(url,init)
    .then(response => response.json())
    .then(data => {
        let content= `<h3>Search results for: ${givenTitle}</h3>`;
        if(Object.keys(data).length == 1){
            content+= "<h3>Did not find any books containing this title.</h3>"
        }
        else{
            for(var i=0;i<data.work.length;i++){
                var title = data.work[i].titleweb.replace(/['']/g,"");
                if(title.toUpperCase().includes(givenTitle.toUpperCase())){
                    var author = data.work[i].authorweb.replace(/['']/g,"");
                    var bookId = data.work[i].workid;
                    var saveBtnId = "save" + bookId;
                    var cancelBtnId = "cancel" + bookId;
                    content += templates.workDetails({
                        title: title,
                        author: author,
                        bookId: bookId,
                        saveBtnId: saveBtnId,
                        cancelBtnId: cancelBtnId
                    });
                }
            }
        }
        results.innerHTML = content;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function storeBook(title,author,bookId){
    var cancelbtn = document.getElementById("cancel" + bookId);
    let myPostHeaders = new Headers();
    myPostHeaders.append('Content-Type', 'application/json');
    let params = {title: title,author: author,id: bookId};
    let options = {
        method: "POST",
        headers: myPostHeaders,
        body: JSON.stringify(params)
    };
    fetch('Work',options)
    .then(response =>{
        if(response.status == 201){
            alert("Book added to favorites.");
            cancelbtn.hidden= false;
        }
        else if(response.status == 401){
            alert("This book already exists.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function cancelWork(bookId,deleteType){
    let myDeleteHeaders = new Headers();
    myDeleteHeaders.append('Content-Type', 'application/json');
    let params = {id: bookId};
    let options = {
        method: "DELETE",
        headers: myDeleteHeaders,
        body: JSON.stringify(params)
    };
    fetch('Work',options)
    .then(response =>{
        if(response.status == 201){
            alert("Book successfully deleted from favorites.");
            if(deleteType == 1){
                document.getElementById("cancel" + bookId).hidden= true;
            }
            else{
                favoritesList();
            }
            
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function favoritesList(){
    let results = document.getElementById('favorites_results');
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let options = {
        method: "GET",
        headers: myHeaders
    }
    fetch('/Work/worklist',options)
    .then(response =>response.json())
    .then(data => {
        let content = '';
        for(const element of data){
            content += templates.favoriteWorks({
                title: element.title,
                author: element.author,
                id: element.bookId,
                review: element.review
            });
        }
        results.innerHTML = content;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function redirect(id){
    location.href = `favorites/work=${id}`;
}

function editWork(){
    var pathArray = window.location.pathname.split('/');
    var id = pathArray[2].substr(5);
    var title = document.getElementById('title');
    var author = document.getElementById('author');
    var bookId = document.getElementById('bookId');
    var review = document.getElementById('review');
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let options = {
        method: "GET",
        headers: myHeaders
    }
    fetch(`/Work/worklist/${id}`,options)
    .then(response =>response.json())
    .then(data => {
        title.value = data.title;
        author.value = data.author;
        bookId.value = data.bookId;
        review.value = data.review;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function saveWork(){
    var title = document.getElementById('title');
    var author = document.getElementById('author');
    var bookId = document.getElementById('bookId');
    var review = document.getElementById('review');
    let myPostHeaders = new Headers();
    myPostHeaders.append('Content-Type', 'application/json');
    let params = {title: title,author: author,bookId: bookId,review: review};
    let options = {
        method: "POST",
        headers: myPostHeaders,
        body: JSON.stringify(params)
    };
    fetch('/favorites',options)
    .catch(error => {
        console.error('Error:', error);
    });
}

function search(){
    var key = document.getElementById("givenFavTitle").value;
    if(key.length > 0){
        let results = document.getElementById('favorites_results');
        let options = {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        };
        fetch(`/Work/fiterlist/${key}`,options)
        .then(response =>response.json())
        .then(data => {
            if(data.length > 0){
                let content = '';
                for(const element of data){
                    content += templates.favoriteWorks({
                        title: element.title,
                        author: element.author,
                        id: element.bookId,
                        review: element.review
                    });
                }
                setTimeout(function(){
                    results.innerHTML = content;
                },500);
            }
            else{
                results.innerHTML = 'Did not find any book with this key. Please try again!';
        
            }
           
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else{
        setTimeout(function(){
            favoritesList();
        },500);
    }
}