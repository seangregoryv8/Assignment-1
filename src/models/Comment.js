const Model = require('./Model');
const User = require('./User'); //Put in
const Category = require('./Category'); //Put in
const Post = require('./Post'); //Put in

class Comment extends Model
{
    /**
     * Creates a new Comment
     * @param {number} id 
     * @param {Post} post
     * @param {User} user
     * @param {Comment} reply
     * @param {string} content 
     * @param {Date} created 
     * @param {Date} edited 
     * @param {Date} deleted 
     */
    constructor(id, post, user, reply, content, created, edited, deleted)
    {
        super(id);
        this.setPost(post);
        this.setUser(user);
        this.setRepliedTo(reply);
        this.setContent(content);
        this.setCreatedAt(created);
        this.setEditedAt(edited);
        this.setDeletedAt(deleted);
    }
    static isEmpty = value => (value == null || value == "" || value == " ")
    isEmpty = value => (value == null || value == "" || value == " ")

    static isNull = value => (value == null || value == undefined) ? null : value

    getUser = () => this.user;
    setUser = value => { this.user = value; }
    getRepliedTo = () => this.reply;
    setRepliedTo = value => { this.reply = value; }
    getPost = () => this.post;
    setPost = value => { this.post = value; }
	getContent = () => this.content;
	setContent = value => { this.content = value; }

    /**
     * Creates a new Comment class
     * @param {number} postId
     * @param {number} userId 
     * @param {number} replyId 
     * @param {string} content 
     */
    static async create(userId, postId, content, replyId)
    {
        const connection = await Model.connect();
        const sql = `INSERT INTO \`comment\` (post_id, content) VALUES (?, ?) `;
        let results;
        try { [results] = await connection.execute(sql, [postId, content]); }
        catch (error) { console.log(error); return null; }
        finally { await connection.end(); }
        const user = (userId != null) ? await User.findById(userId) : null;
        const post = await Post.findById(postId);
        const reply = (replyId != null || replyId != undefined) ? await Comment.findById(replyId) : null;
        let comment = (this.isEmpty(post) || this.isEmpty(content) || this.isEmpty(user)) ?
            null : new Comment(results.insertId, post, user, reply, content, new Date(), null, null);
        return comment;
    }

    /**
     * Finds the Comment by its ID
     * @param {number} id The Comment ID.
     * @returns {Comment} The Comment object
     */
    static async findById(id)
    {
		const connection = await Model.connect();
		const sql = `SELECT * FROM \`comment\` WHERE \`id\` = ?;`;
		let results;
		try { [results] = await connection.execute(sql, [id]); }
		catch (error) { console.log(error); return null; }
		finally { await connection.end(); }
        if (results.length == 0)
            return null;
        let _user = await User.findById(results[0].user_id), _reply = await Comment.findById(results[0].reply_id), _post = await Post.findById(results[0].post_id),
            _content = this.isNull(results[0].content), _created = (results[0].created_at != null) ? results[0].created_at : new Date(),
            _edited = this.isNull(results[0].edited_at), _deleted = this.isNull(results[0].deleted_at);
        let comment = new Comment(id, _post, _user, _reply, _content, _created, _edited, _deleted);
        return comment;
    }
    
	/**
	 * Persists the current state of this Comment object to the database.
	 * @returns {boolean} If the operation was successful.
	 */
	async save()
	{
        if (this.isEmpty(this.getContent()))
            return false;
		const connection = await Model.connect();
        this.setEditedAt(new Date());
		let results, _user = this.getUser(), _reply = this.getRepliedTo()
        let sql = (_reply != null) ?
            `UPDATE \`comment\` SET user_id = ?, reply_id = ?, content = ?, created_at = ?, edited_at = ? WHERE id = ?` : 
            `UPDATE \`comment\` SET user_id = ?, content = ?, created_at = ?, edited_at = ? WHERE id = ?`;
		try
        {
            [results] = (_reply != null) ?
                await connection.execute(sql, [_user.getId(), _reply.getId(), this.getContent(), this.getCreatedAt(), this.getEditedAt(), this.getId()]) : 
                await connection.execute(sql, [_user.getId(), this.getContent(), this.getCreatedAt(), this.getEditedAt(), this.getId()]);
        }
		catch (error) { console.log(error); return false; }
		finally{ await connection.end(); }
		return true;
	}
    
	/**
	 * Deletes the Comment with this ID from the database.
	 * @returns {boolean} If the operation was successful.
	 */
	async delete()
	{
		const connection = await Model.connect();
        this.setDeletedAt(new Date())
        let sql = `UPDATE \`comment\` SET deleted_at = ? WHERE id = ?`;
		let results;
		try { [results] = await connection.execute(sql, [this.getDeletedAt(), this.getId()]); }
		catch (error) { console.log(error); return false; }
		finally{ await connection.end(); }
        return true;
	}
}

module.exports = Comment;
