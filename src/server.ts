import express = require('express')
const app = express()
import bodyparser = require('body-parser');
let ejs = require('ejs');

import path = require('path');
app.use(express.static(path.join(__dirname, '/public')))

import {MetricsHandler} from './metrics';
import { ok } from 'assert';
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');
app.use(bodyparser.json())
app.use(bodyparser.urlencoded( { extended: true}))

const port: string = process.env.PORT || '8080'

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send('ok')
  })
})
app.get('/metrics/', (req: any, res: any) => {
  dbMet.getAllTemp((err: Error | null, result: any | null) => {
    if (err) throw err
    res.status(200).send( result)
  })
})

app.get('/metrics/:id', (req: any, res: any) => {
  dbMet.getTempId(req.params.id,(err: Error | null, result: any | null) => {
    if (err) throw err
    res.status(200).send( result)
  })
})

app.get(
    '/hello/:name', 
    (req, res) => res.render('yellow.ejs', {name: req.params.name})
)



app.get('/metrics.json', (req: any, res: any) => {
    MetricsHandler.get((err, data)=>{
        if(err) throw err
        res.status(200).json(data)
    });
})



app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})