const express = require('express')
const app = express()
const pug = require('pug');
app.set('view engine', 'jade')
// app.set('views', './views')
app.get('/', (req,res) => {
res.render('input.pug');
});
console.log('test');
app.listen(3000, () => console.log("Listening on port 3000"));