const Model = require('./Model');

class User extends Model {
    /**
     * Creates a new User
     * @param {int} id
     * @param {string} username
     * @param {string} email
     * @param {string} password
     */
    constructor(username, email, password)
    {
        super(id);
        this.username = username;
        this.email = email;
        this.password = password;
    }
    
}

module.exports = User;
