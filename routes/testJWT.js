var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
      path:'/'
  })
});
router.get('/get', function(req, res, next) {
//   res.send('respond with a resource');
  const mytoken = jwt.sign({ name: '835612575@qq.com'},"ITlearn",{expiresIn:'1d'})
  res.json({
      token:mytoken
  })
// const mytoken = jwt.sign({id: '001', name: 'Tom'}, 'didi', {expiresIn: '1d'})  
// console.log(mytoken)  
// let mytoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiODM1NjEyNTc1QHFxLmNvbSIsImlhdCI6MTUxNzIzNzc4MCwiZXhwIjoxNTE3MjM3ODQwfQ.kU3QDqKfJi_7DsX2DyoWP-t-8vvrGw2sdDx0e3i_XNI'
const decoded = jwt.verify(mytoken, 'ITlearn')  
console.log(decoded)
});

module.exports = router;