class CommentDTO {

    constructor (comment) {
        this._id = blog._id;
        this.content = blog.content;
        this.createdAt = blog.createdAt;
        this.authorUserName = blog.author.username;
    }


}

module.exports = CommentDTO;