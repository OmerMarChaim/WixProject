import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket } from '../client/src/api';
import { randomInt } from 'crypto';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

let page1 = 1;

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
  page1 = req.query.page || 1;

  paginatedData = tempData.slice((page1 - 1) * PAGE_SIZE, page1 * PAGE_SIZE);

  res.send(paginatedData);
});


app.post(APIPath, (req, res) => { //post function for clone request

  //need to add the the big memory

  // @ts-ignore
  page1 = req.query.page

  let ticketToClone = tempData.filter((t) => !(t.id).localeCompare(req.body.ticket_id))

  ticketToClone[0].id.concat("b", "1"); // make each clone ticketId uniqe doesnt work
  //  i++;
  tempData.unshift(ticketToClone[0]);
  paginatedData = tempData.slice((page1 - 1) * PAGE_SIZE, page1 * PAGE_SIZE);



  // paginatedData.unshift(ticketToClone[0]) ; // to dysply it in the claient side

  //res.send(paginatedData); // what realy need to return

  res.send(1); // test 2b

  //teq.body.ticket_id give me the string

})
app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

