var Work = require('./Work.js');
var works = new Array();
class WorkDao{
    addWork(title,author,id){
        var check = true;
        var work = new Work(title,author,id,"---");
        for(const element of works){
            if(element.BookId == work.BookId){
                console.log(`This id ${element.BookId} already exists`);
                check = false;
                break;
            }
        }
        if(check){
            works.push(work);
        }
        return check;
    }

    deleteWork(id){
        for(var i=0;i<works.length;i++){
            if(id == works[i].BookId){
                works.splice(i,1);
                return true;
            }
        }
    }

    get worklist(){
        return works;
    }

    findWork(id){
        for(const element of works){
            if(element.BookId == id)
                return element;
        }
    }

    updateWork(title,author,id,review){
        for(var i = 0;i<works.length;i++){
            if(works[i].BookId == id){
                works[i].Title = title;
                works[i].Author = author;
                works[i].Review = review;
                break;
            }
        }
    }

    search(key){
        var filteredlist = new Array();
        for(const element of works){
            if(element.Title.toUpperCase().includes(key.toUpperCase())){
                filteredlist.push(element);
            }   
        }
        return filteredlist;
    }
}

module.exports = WorkDao;