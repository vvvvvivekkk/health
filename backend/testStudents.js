const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB Connected');
  
  const User = require('./models/userModel');
  
  // Check existing students
  const students = await User.find({ role: 'student' });
  console.log(`\nFound ${students.length} students:`);
  students.forEach(s => console.log(`- ${s.name} (${s.email})`));
  
  // Check all users
  const allUsers = await User.find({});
  console.log(`\nTotal users in database: ${allUsers.length}`);
  allUsers.forEach(u => console.log(`- ${u.name} (${u.email}) - Role: ${u.role}`));
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
