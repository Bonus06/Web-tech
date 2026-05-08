const fs = require('fs');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const users = [];

// Base data for 10 users
const baseUsers = [
  { firstName: 'Alice', email: 'alice@example.com', password: 'password123' },
  { firstName: 'Bob', email: 'bob@example.com', password: 'secureBob456' },
  { firstName: 'Charlie', email: 'charlie@example.com', password: 'charliePass789' },
  { firstName: 'David', email: 'david@example.com', password: 'myPassword321' },
  { firstName: 'Eve', email: 'eve@example.com', password: 'eveSecret654' },
  { firstName: 'Frank', email: 'frank@example.com', password: 'frankpwd987' },
  { firstName: 'Grace', email: 'grace@example.com', password: 'gracePass111' },
  { firstName: 'Heidi', email: 'heidi@example.com', password: 'heidiSecure222' },
  { firstName: 'Ivan', email: 'ivan@example.com', password: 'ivanPassword333' },
  { firstName: 'Judy', email: 'judy@example.com', password: 'judySecret444' },
];

async function generateUsers() {
  const plaintextCredentials = [];
  
  for (let i = 0; i < baseUsers.length; i++) {
    const user = baseUsers[i];
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    
    users.push({
      id: i + 1,
      firstName: user.firstName,
      username: user.email,
      password: hashedPassword,
      registeredAt: new Date().toISOString()
    });
    
    plaintextCredentials.push({
      email: user.email,
      password: user.password
    });
  }

  // Write to auth_user.json
  fs.writeFileSync(
    'auth_user.json', 
    JSON.stringify(users, null, 2)
  );

  console.log(JSON.stringify(plaintextCredentials, null, 2));
}

generateUsers().catch(err => console.error(err));
