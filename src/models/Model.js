const Database = require('../database/Database');

class Model {
	constructor(id) { this.id = id; }
	static connect = () => Database.connect();
	getId = () => this.id;
	setId(id) { this.id = id; return this; }
	getCreatedAt = () => this.createdAt;
	setCreatedAt(created) { this.createdAt = created; return this; }
	getEditedAt = () => this.editedAt;
	setEditedAt(edited) { this.editedAt = edited; return this; }
	getDeletedAt = () => this.deletedAt;
	setDeletedAt(deleted) { this.deletedAt = deleted; return this; }
}

module.exports = Model;
