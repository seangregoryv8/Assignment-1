const Model = require('./Model');
const User = require('./User'); //Put in
const Category = require('./Category'); //Put in

class Post extends Model
{
    /**
     * Creates a new Category
     * @param {number} id 
     * @param {number} userId
     * @param {User} user
     * @param {number} catId
     * @param {Category} cat
     * @param {string} title
     * @param {Enumerator} type
     * @param {string} content 
     * @param {Date} created 
     * @param {Date} edited 
     * @param {Date} deleted 
     */
    constructor(id, user, cat, title, type, content, created, edited, deleted)
    {
        super(id);
        this.setUser(user);
        this.setCategory(cat);
        this.setTitle(title);
        this.setType(type);
        this.setContent(content);
        this.setCreatedAt(created);
        this.setEditedAt(edited);
        this.setDeletedAt(deleted);
    }
    static isEmpty = value => (value == null || value == "" || value == " ")
    isEmpty = value => (value == null || value == "" || value == " ")

    static isNull = value => (value == null) ? null : value

    getUser = () => this.user;
    setUser = value => { this.user = value; }
    getCategory = () => this.cat;
    setCategory = value => { this.cat = value; }
	getTitle = () => this.title;
	setTitle = value => { this.title = value; }
	getType = () => this.type;
	setType = value => { this.type = value; }
	getContent = () => this.content;
	setContent = value => { this.content = value; }
    
    /**
     * Creates a new Post class
     * @param {number} userId 
     * @param {number} catId 
     * @param {string} title 
     * @param {Enumerator} type 
     * @param {string} content 
     */
    static async create(userId, catId, title, type, content)
    {
        const connection = await Model.connect();
        const sql = `INSERT INTO \`post\` (user_id, category_id, title, type, content) VALUES (?, ?, ?, ?, ?) `;
        let results;
        if (this.findByTitle(title) == null)
            return null;
        try { [results] = await connection.execute(sql, [userId, catId, title, type, content]); }
        catch (error) { console.log(error); return null; }
        finally { await connection.end(); }
        if (this.isEmpty(title) || this.isEmpty(type) || this.isEmpty(content))
            return null;
        const user = await User.findById(userId), cat = await Category.findById(catId);
        let post = (this.isEmpty(user) || this.isEmpty(cat)) ? null : new Post(results.insertId, user, cat, title, type, content, new Date(), null, null);
        return post;
    }
    /**
     * Finds the Post by its ID
     * @param {number} id The User ID.
     * @returns {Post} The User object
     */
    static async findById(id)
    {
		const connection = await Model.connect();
		const sql = `SELECT * FROM \`post\` WHERE \`id\` = ?;`;
		let results;
		try { [results] = await connection.execute(sql, [id]); }
		catch (error) { console.log(error); return null; }
		finally { await connection.end(); }
        if (results.length == 0)
            return null;
        let _user = await User.findById(results[0].user_id),
            _cat = await Category.findById(results[0].category_id),
            _title = this.isNull(results[0].title), _type = this.isNull(results[0].type), _content = this.isNull(results[0].content),
            _created = (results[0].created_at != null) ? results[0].created_at : new Date(),
            _edited = this.isNull(results[0].edited_at), _deleted = this.isNull(results[0].deleted_at);
        let post = new Post(id, _user, _cat, _title, _type, _content, _created, _edited, _deleted);
        return post;
    }
    /**
     * Finds the Post by its title
     * @param {string} title The Category title
     * @returns {Category} The Category object
     */
    static async findByTitle(title)
    {
		const connection = await Model.connect();
		const sql = `SELECT * FROM \`post\` WHERE \`title\` = ?;`;
		let results;
		try { [results] = await connection.execute(sql, [title]); }
		catch (error) { console.log(error); return null; }
		finally { await connection.end(); }
        if (results.length == 0)
            return null;
        let _user = await User.findById(results[0].user_id),
            _cat = await Category.findById(results[0].category_id),
            _id = this.isNull(results[0].id), _type = this.isNull(results[0].type), _content = this.isNull(results[0].content),
            _created = (results[0].created_at != null) ? results[0].created_at : new Date(),
             _edited = this.isNull(results[0].edited_at), _deleted = this.isNull(results[0].deleted_at);
        let post = new Post(_id, _user, _cat, title, _type, _content, _created, _edited, _deleted);
        return post;
    }
    
	/**
	 * Persists the current state of this Post object to the database.
	 * @returns {boolean} If the operation was successful.
	 */
	async save()
	{
        if (this.isEmpty(this.getTitle()) || this.isEmpty(this.getContent()))
            return false;
		const connection = await Model.connect();
        this.setEditedAt(new Date());
        let sql = `UPDATE \`post\` SET title = ?, type = ?, content = ?, created_at = ?, edited_at = ? WHERE id = ?`;
		let results;
		try { [results] = await connection.execute(sql,
            [this.getTitle(), this.getType(), this.getContent(), this.getCreatedAt(), this.getEditedAt(), this.getId()]); }
		catch (error) { console.log(error); return false; }
		finally{ await connection.end(); }
		return true;
	}
    
	/**
	 * Deletes the Category with this ID from the database.
	 * @returns {boolean} If the operation was successful.
	 */
	async delete()
	{
		const connection = await Model.connect();
        this.setDeletedAt(new Date())
        let sql = `UPDATE \`post\` SET deleted_at = ? WHERE id = ?`;
		let results;
		try { [results] = await connection.execute(sql, [this.getDeletedAt(), this.getId()]); }
		catch (error) { console.log(error); return false; }
		finally{ await connection.end(); }
        return true;
	}
}

module.exports = Post;
