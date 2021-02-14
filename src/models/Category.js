const Model = require('./Model');
const User = require('./User');

class Category extends Model
{
    /**
     * Creates a new Category
     * @param {number} id 
     * @param {User} userId 
     * @param {string} title 
     * @param {string} description 
     * @param {Date} created 
     * @param {Date} edited 
     * @param {Date} deleted 
     */
    constructor(id, userId, user, title, description, created, edited, deleted)
    {
        super(id)
        this.setUserId(userId);
        this.setUser(user);
        this.setTitle(title);
        this.setDescription(description);
        this.setCreatedAt(created);
        this.setEditedAt(edited);
        this.setDeletedAt(deleted);
    }
    static isEmpty = value => (value == null || value == "" || value == " ")

    static isNull = value => (value == null) ? null : value

    static async create(userId, title, description)
    {
        const connection = await Model.connect();
        const sql = `INSERT INTO \`category\` (title, description) VALUES (?, ?) `;
        let results;
        try { [results] = await connection.execute(sql, [title, description]); }
        catch (error) { console.log(error); return null; }
        finally { await connection.end(); }
        const user = await User.findById(userId);
        let cat = (user == null || this.isEmpty(title)) ? null : new Category(results.insertId, userId, user, title, description, new Date(), null, null);
        return cat;
    }
    /**
     * Finds the Category by its ID
     * @param {number} id The User ID.
     * @returns {Category} The User object
     */
    static async findById(id)
    {
		const connection = await Model.connect();
		const sql = `SELECT * FROM \`category\` WHERE \`id\` = ?;`;
		let results;
		try { [results] = await connection.execute(sql, [id]); }
		catch (error) { console.log(error); return null; }
		finally { await connection.end(); }
        if (results.length == 0)
            return null;
        let _user = await User.findById(results[0].userId), _userId = this.isNull(results[0].userID);
        let _title = this.isNull(results[0].title), _description = this.isNull(results[0].description)
        let _created = (results[0].created_at != null) ? results[0].created_at : new Date();
        let _edited = this.isNull(results[0].edited_at),  _deleted = this.isNull(results[0].deleted_at);
        let category = new Category(results[0].id, _user, _userId, _title, _description, _created, _edited, _deleted);
        return category;
    }
    /**
     * Finds the Category by its title
     * @param {string} title The Category title
     * @returns {Category} The Category object
     */
    static async findByTitle(title)
    {
		const connection = await Model.connect();
		const sql = `SELECT * FROM \`category\` WHERE \`title\` = ?;`;
		let results;
		try { [results] = await connection.execute(sql, [title]); }
		catch (error) { console.log(error); return null; }
		finally { await connection.end(); }
        if (results.length == 0)
            return null;
        let _user = await User.findById(results[0].userId), _userId = this.isNull(results[0].userID);
        let _id = this.isNull(results[0].id), _description = this.isNull(results[0].description)
        let _created = (results[0].created_at != null) ? results[0].created_at : new Date();
        let _edited = this.isNull(results[0].edited_at),  _deleted = this.isNull(results[0].deleted_at);
        let category = new Category(_id, _user, _userId, title, _description, _created, _edited, _deleted);
        return category;
    }
    
	/**
	 * Persists the current state of this Category object to the database.
	 * @returns {boolean} If the operation was successful.
	 */
	async save()
	{
        if (this.getTitle() == null || this.getTitle() == "")
            return false;
		const connection = await Model.connect();
        this.setEditedAt(new Date())
        let sql = `UPDATE \`category\` SET title = ?, description = ?, created_at = ?, edited_at = ? WHERE id = ?`;
		let results;
		try { [results] = await connection.execute(sql,
            [this.getTitle(), this.getDescription(), this.getCreatedAt(), this.getEditedAt(), this.getId()]); }
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
        let sql = `UPDATE \`category\` SET deleted_at = ? WHERE id = ?`;
		let results;
		try { [results] = await connection.execute(sql, [this.getDeletedAt(), this.getId()]); }
		catch (error) { console.log(error); return false; }
		finally{ await connection.end(); }
        return true;
	}
    getUserId = () => this.userId;
    setUserId = value => { this.userId = value; }
    getUser = () => this.user;
    setUser = value => { this.user = value; }
	getTitle = () => this.title;
	setTitle = value => { this.title = value; }
    getDescription = () => this.description;
    setDescription = value => { this.description = value; }
    
}

module.exports = Category;
