class Work{
    constructor(title,author,bookId,review){
        this.title = title;
        this.author = author;
        this.bookId = bookId;
        this.review = review;
    }

    set Title(title){
        this.title = title;
    }

    set Author(author){
        this.author = author;
    }

    set BookId(bookId){
        this.bookId = bookId;
    }

    set Review(review){
        this.review = review;
    }

    get Title(){
        return this.title;
    }

    get Author(){
        return this.author;
    }

    get BookId(){
        return this.bookId;
    }

    get Review(){
        return this.review;
    }
}
module.exports = Work;