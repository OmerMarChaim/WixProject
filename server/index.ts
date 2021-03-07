import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket } from '../client/src/api';
import { randomInt } from 'crypto';
import { parseJsonSourceFileConfigFileContent } from 'typescript';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

let page = 1;
var newCloneTicket: Ticket;

app.use(bodyParser.json());



let paginatedData: Ticket[];
paginatedData= [];
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

//chack for OverFLOW
function setPage(pageNum: number)  {
  if (pageNum * PAGE_SIZE <= tempData.length) {
    return paginatedData = tempData.slice(0, pageNum * PAGE_SIZE);
  }
  return paginatedData;
}

app.get(APIPath, (req, res) => {

  // @ts-ignore
  page = req.query.page || 1;
  paginatedData=setPage(page);

  res.send(paginatedData);
});


app.post(APIPath, (req, res) => { //post function for clone request

  newCloneTicket = {
    id: req.body.ticket_id, title: req.body.ticket_title,
    content: req.body.ticket_content,
    userEmail: req.body.ticket_userEmail, creationTime: Date.now(),
    labels: req.body.ticket_labels
  }

  // @ts-ignore
  page = req.query.page || 1;
  tempData.unshift(newCloneTicket);
  paginatedData = setPage(page);

  res.send(paginatedData);

})
app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

