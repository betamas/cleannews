const express = require('express')
const app = express()
const pug = require('pug');
app.set('view engine', 'pug')
app.set('views', './views')
app.get('/', (req,res) => {
res.render('input')
})
app.listen(3000, () => console.log("Listening on port 3000"))