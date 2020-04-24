const mysql = require('mysql');

const User = ({
  name: {type: 'String', nullable: false, primary: true},
  email: {type: 'String', nullable: false, unique: true},
  password: {type: 'String', nullable: false, required: true},
  
}
);


module.exports = User;