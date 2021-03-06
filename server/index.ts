import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket } from '../client/src/api';
import { randomInt } from 'crypto';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

let page = 1;
var newCloneTicket: Ticket;

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
  page = req.query.page || 1;

  paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(paginatedData);
});


app.post(APIPath, (req, res) => { //post function for clone request

  //let ticketToClone = tempData.filter((t) => !(t.id).localeCompare(req.body.ticket_id))
  newCloneTicket= { id: req.body.ticket_id,title: req.body.ticket_title,
                    content: req.body.ticket_content,
                  userEmail:req.body.ticket_userEmail,creationTime:Date.now(),
                labels:req.body.ticket_labels }
/*   newCloneTicket.id = req.bodnelsy.ticket_id;
  newCloneTicket.title = req.body.ticket_title;
  newCloneTicket.content = req.body.ticket_content;
  newCloneTicket.userEmail = req.body.ticket_userEmail;
  //newCloneTicket.labels = req.body.ticket_labels;
  newCloneTicket.creationTime = Date.now(); // update the timstemp
   */
    // @ts-ignore
    page = req.query.page || 1;
  tempData.unshift(newCloneTicket);
  paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(paginatedData); 

})
app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

