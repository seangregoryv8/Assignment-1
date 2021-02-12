const Model = require('./Model');

class User extends Model
{
    /**
     * Creates a new User
     * @param {number} id 
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @param {string} avatar 
     * @param {Date} created_at 
     * @param {Date} edited_at 
     * @param {Date} deleted_at 
     */
    constructor(id, username, email, password, avatar, created_at, edited_at, deleted_at)
    {
        super(id);
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.setCreatedAt(created_at);
        this.setEditedAt(edited_at);
        this.setDeletedAt(deleted_at);
    }
    /**
     * Sees if the email is actually valid
     * @param {email}
     * @returns True if the email is valid, false if it isn't.
     */
    static validateEmail(email)
    {
        var reexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (reexp.test(email));
    }
    /**
     * Sees if the passed value is empty or not
     * @param {String} value The value of whatever is passed
     * @returns True if the value is empty, false if it isnt
     */
    static isEmpty = value => (value == null || value == "" || value == " ");
    /**
     * Creates a new User in the database and returns a User object
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @returns {User} The created User
     */
    static async create(username, email, password)
    {
        if (!this.validateEmail(email) || this.isEmpty(username) || this.isEmpty(email) || this.isEmpty(password))
            return null;
        const connection = await Model.connect();
        const sql = `INSERT INTO \`user\` (username, email, password) VALUES (?, ?, ?) `;
        let results;
        try { [results] = await connection.execute(sql, [username, email, password]); }
        catch (error) { console.log(error); return null; }
        finally { await connection.end(); }
        let user = new User(results.insertId, username, email, password, null, new Date(), null, null);
        return user;
    }
    /**
     * Finds the User by their ID and retruns a User object.
     * @param {number} id The User ID.
     * @returns {User} The User object
     */
    static async findById(id)
    {
		const connection = await Model.connect();
		const sql = `SELECT * FROM \`user\` WHERE \`id\` = ?;`;
		let results;
		try { [results] = await connection.execute(sql, [id]); }
		catch (error) { console.log(error); return null; }
		finally { await connection.end(); }
        let user = 0, avatar = 0, created = 0, edited = 0, deleted = 0;
        if (results.length == 0)
            user = null;
        else
        {
            avatar = (results[0].avatar != null) ? results[0].avatar : null;
            created = (results[0].created_at != null) ? results[0].created_at : new Date();
            edited = (results[0].edited_at != null) ? results[0].edited_at : null;
            deleted = (results[0].deleted_at != null) ? results[0].deleted_at : null;
            user = new User(results[0].id, results[0].username, results[0].email, results[0].password, avatar, created, edited, deleted);
        }
        return user;
    }
    /**
     * Finds the User by their email and retruns a User object.
     * @param {string} id The User email.
     * @returns {User} The User object
     */
    static async findByEmail(email)
    {
        if (!this.validateEmail(email))
            return null;
		const connection = await Model.connect();
		const sql = `SELECT * FROM \`user\` WHERE \`email\` = ?;`;
		let results;
		try { [results] = await connection.execute(sql, [email]); }
		catch (error) { console.log(error); return null; }
		finally { await connection.end(); }
        let user = 0, avatar = 0, created = 0, edited = 0, deleted = 0;
        if (results.length == 0)
            user = null;
        else
        {
            avatar = (results[0].avatar != null) ? results[0].avatar : null;
            created = (results[0].created_at != null) ? results[0].created_at : new Date();
            edited = (results[0].edited_at != null) ? results[0].edited_at : null;
            deleted = (results[0].deleted_at != null) ? results[0].deleted_at : null;
            user = new User(results[0].id, results[0].username, results[0].email, results[0].password, avatar, created, edited, deleted);
        }
        return user;
    }
	/**
	 * Persists the current state of this Pokemon object to the database.
	 * @returns {boolean} If the operation was successful.
	 */
	async save()
	{
        if (this.username == null || this.email == null || this.username == '' || this.email == '')
            return false;
		const connection = await Model.connect();
        this.setEditedAt(new Date())
        let avatar = (this.getAvatar() != null) ? this.getAvatar() : null;
        let sql = `UPDATE \`user\` SET username = ?, email = ?, password = ?, avatar = ?, created_at = ?, edited_at = ? WHERE id = ?`;
		let results;
		try { [results] = await connection.execute(sql,
            [this.username, this.email, this.password, avatar, this.createdAt, this.editedAt, this.id]); }
		catch (error) { console.log(error); return false; }
		finally{ await connection.end(); }
		return true;
	}
    
	/**
	 * Deletes the User with this ID from the database.
	 * @returns {boolean} If the operation was successful.
	 */
	async delete()
	{
		const connection = await Model.connect();
        this.setDeletedAt(new Date())
        let sql = `UPDATE \`user\` SET deleted_at = ? WHERE id = ?`;
		let results;
		try { [results] = await connection.execute(sql, [this.deletedAt, this.id]); }
		catch (error) { console.log(error); return false; }
		finally{ await connection.end(); }
        return true;
	}
	getUsername = () => this.username;
	setUsername = value => { this.username = value; }
	getEmail = () => this.email;
	setEmail = value => { this.email = value; }
	getPassword = () => this.password;
	setPassword = value => { this.password = value; }
	getAvatar = () => this.avatar;
	setAvatar = value => { this.avatar = value; }
}

module.exports = User;
