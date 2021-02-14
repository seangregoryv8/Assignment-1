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
    constructor(id, user, email, password, avatar, created_at, edited_at, deleted_at)
    {
        super(id);
        this.setUsername(user);
        this.setEmail(email);
        this.setPassword(password);
        this.setAvatar(avatar);
        this.setCreatedAt(created_at);
        this.setEditedAt(edited_at);
        this.setDeletedAt(deleted_at);
    }

	getUsername = () => this.username;
	setUsername = value => { this.username = value; }
	getEmail = () => this.email;
	setEmail = value => { this.email = value; }
	getPassword = () => this.password;
	setPassword = value => { this.password = value; }
	getAvatar = () => this.avatar;
	setAvatar = value => { this.avatar = value; }
    
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
    
    static isNull = value => (value == null) ? null : value

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
        if (results.length == 0)
            return null;
        let _username = this.isNull(results[0].username), _email = this.isNull(results[0].email);
        let _password = this.isNull(results[0].password), _avatar = this.isNull(results[0].avatar);
        let _created = (results[0].created_at != null) ? results[0].created_at : new Date();
        let _edited = this.isNull(results[0].edited_at), _deleted = this.isNull(results[0].deleted_at);
        let user = new User(id, _username, _email, _password, _avatar, _created, _edited, _deleted);
        return user;
    }
    /**
     * Finds the User by their email and retruns a User object.
     * @param {string} email The User email.
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
        if (results.length == 0)
            return null;
        let _username = this.isNull(results[0].username), _id = this.isNull(results[0].id);
        let _password = this.isNull(results[0].password), _avatar = this.isNull(results[0].avatar);
        let _created = (results[0].created_at != null) ? results[0].created_at : new Date();
        let _edited = this.isNull(results[0].edited_at), _deleted = this.isNull(results[0].deleted_at);
        let user = new User(_id, _username, email, _password, _avatar, _created, _edited, _deleted);
        return user;
    }
	/**
	 * Persists the current state of this User object to the database.
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
            [this.getUsername(), this.getEmail(), this.getPassword(), avatar, this.getCreatedAt(), this.getEditedAt(), this.getId()]); }
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
}

module.exports = User;
