import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket } from '../client/src/api';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 30;



app.use(bodyParser.json());



var paginatedData = [];

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});


app.get(APIPath, (req, res) => {

  // @ts-ignore
  const page: number = req.query.page || 1;

  paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  console.log(req.body)

  res.send(paginatedData);
});


app.post(APIPath, (req, res) => { //post function for clone request

  // var ticketToClone = tempData.filter((t) => (t.id).match(req.body))

  // paginatedData.push(ticketToClone[0]);


  // @ts-ignore
  const page: number = req.query.page || 1;


  paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);



  var ticketToClone = paginatedData.filter((t) => !(t.id).localeCompare(req.body.ticket_id))

  paginatedData.push(ticketToClone[0]) ; // test to see if i can change betwn them

  res.send(paginatedData); // what realy need to return

  //teq.body.ticket_id give me the string
 // res.send(ticketToClone);

})

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

