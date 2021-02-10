const Model = require('./Model');

class User extends Model {
    /**
     * Creates a new User
     * @param {int} id
     * @param {string} username
     * @param {string} email
     * @param {string} password
     */
    constructor(id, username, email, password)
    {
        super(id);
        this.username = username;
        this.email = email;
        this.password = password;
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
        let user = new User(results.insertId, username, email, password);
        return user;
    }
	getUsername = () => this.username;
	setUsername = value => { this.username = value; }
	getEmail = () => this.email;
	setEmail = value => { this.email = value; }
	getPassword = () => this.password;
	setPassword = value => { this.password = value; }
}

module.exports = User;
