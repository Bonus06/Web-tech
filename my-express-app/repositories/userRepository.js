const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../auth_user.json');

class UserRepository {
  getUsers() {
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf-8');
      return JSON.parse(usersData);
    } catch (err) {
      console.log('Could not load auth_user.json, using empty users array');
      return [];
    }
  }

  saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }

  findByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.username === email || u.email === email);
  }

  addUser(user) {
    const users = this.getUsers();
    user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push(user);
    this.saveUsers(users);
    return user;
  }
}

module.exports = new UserRepository();
