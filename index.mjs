import F from 'fastify';
import Fs from '@fastify/static';
import path from 'node:path';
import ejs from 'ejs';
import Fv from '@fastify/view';
import Furl from '@fastify/formbody';
import lr from 'line-reader';
import {qlist} from './loadtickets.mjs';
import Datastore from 'nedb';

let Q=qlist("questions.txt");

//СУБД NeDB
var db = new Datastore({filename : 'answers'});
db.loadDatabase();

let students=[];
lr.eachLine("students.txt", (line)=>{
  students.push(line.trim());
});

const __dirname=import.meta.dirname;
const server=F({
    logger: true
  });

 server.register(Furl) ;

server.register(Fs,{
  root: path.join(__dirname,"/"),
 });

 server.register(Fv, {
  engine: { ejs: ejs },
});


// server.get("/:name", async (q,a)=>{
//   let name=q.params.name;
//   console.log(name);
//   return a.sendFile(name);
// });

// server.post("/q1", async (q,a) =>{
//   let QQ=q.body["QQ"];
//   return a.send(QQ);
// });

server.get("/", async (q,a)=>{
  return a.sendFile("login.html");
});

server.get("/q", async (q,a) => {
  let name="Иванопуло";
  let ticket=1;
    //neDb
    // db.insert({name : name, ticket: ticket}, (err)=>{if (err) console.log(`db error ${err}`)});

  return a.view('questions.ejs', {name: name, ticket: ticket, Q: Q[ticket-1].Questions});
});

// server.post("/q", async (q,a)=>{
//   let {name, ticket} = q.body;
//   if (students.findIndex((el)=> el == name) >= 0){

//   //neDb
//     return a.view('questions.ejs', {name: name, ticket: ticket, Q: Q[ticket]});
//   }
//   else{
//     return a.redirect("/");
//   }
// });
server.get("/a", async (q,a)=>{
  let name="Иванопуло";
  let ticket=1;
  let msg;
  let aaaa=db.find({name:name});
  console.log(aaaa);

  db.find({name: name}, function (err, docs) {
    if (err) 
      msg=`db error find ${err}`;
    else{
      msg=docs[0];
      console.dir(docs[0]);
      console.dir(msg);
      return a.send(msg);
    }
  });
});

server.post("/ejs", async (q,a)=>{
  let {name, ticket, A} = q.body;
 
  //neDb
  db.insert({name : name, ticket: Number(ticket), A:A}, (err)=>{if (err) console.log(`db error ${err}`)});

//  console.log('before update');
//  db.find({name: name, ticket: Number(ticket)}, function (err, docs) {
//     if (err) 
//       console.log(`db error find ${err}`);
//     console.log(docs);
//   });

//   db.update({name: name, ticket: Number(ticket)}, {name:name,ticket:Number(ticket),A:A}, {}, (err, numberOfUpdated)=>{if (err) console.log(`db error update ${err}`); console.log(numberOfUpdated);});
  
//   console.log('after update');
//   db.find({name: name, ticket: Number(ticket)}, function (err, docs) {
//     if (err) 
//       console.log(`db error find ${err}`);
//     console.log(docs);
//   });

  return a.view('answer.ejs', {name: name, ticket: ticket, Q: Q[ticket].Questions, A:A})
});

// server.setErrorHandler(async (error, q,a)=>{
//   return a.sendFile(path.join(__dirname,'404.html'));
// });

server.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`);
  });