import F from 'fastify';
import Fs from '@fastify/static';
import path from 'node:path';
import ejs from 'ejs';
import Fv from '@fastify/view';
import Furl from '@fastify/formbody';
import lr from 'line-reader';
import {qlist} from './loadtickets.mjs';
import Datastore from 'nedb-promises';

//СУБД NeDB
var db = Datastore.create({filename : 'answers.db', autoload: true});
var students = Datastore.create({filename : 'students.db', autoload: true});
var questions = Datastore.create({filename : 'questions.db', autoload: true});
var tablo = Datastore.create({filename : 'tablo.db', autoload: true});
// db.loadDatabase();
// NeDB

let bilets=[];

var group='3ПС5';
const __dirname=import.meta.dirname;
const server=F({
    logger: true
  });

server.register(Furl);

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

server.get("/start", async (q,a) =>{
  return a.sendFile('config.html');
});

server.post("/start-config", async (q,a) =>{
  group= q.body.group;
  console.log(`Группа изменена на ${group}`);
  return a.send("Done");
});

server.get("/", async (q,a)=>{
  return a.sendFile("login.html");
});

function newTicket(){
  let bilet;
  do
  {
    bilet = Math.floor(Math.random()*30)+1;
  }
  while (bilets.includes(bilet));
  bilets.push(bilet);
  return bilet;
}

server.post("/q", async (q,a)=>{
  let {name, ticket} = q.body;

  // проверка на студента
  let stud = await students.findOne({group: group, name: name});
  if (stud){
    ticket=newTicket();
    let QQ=await questions.findOne({group: group, t:Number(ticket)});
    let Q=QQ.questions;
    await tablo.insert({status:'P',name: stud.name, surname: stud.surname, sid:stud._id, tacket:ticket, time:new Date().toLocaleTimeString(), active: true});
    return a.view('questions.ejs', {name: stud.name, surname: stud.surname, ticket: ticket, Q: Q});
  }else{
    return a.redirect("/");
  }
});

server.get("/mark", async (q,a)=>{
  let id=q.query.id;
  await  tablo.update({sid: id, status:'R'}, {$set: {active:false, status:'F'}});
  return a.redirect('/tablo');
});

server.get("/tablo", async (q,a)=>{
  let active=await tablo.find({active: true});
  return a.view("tablo.ejs", {active:active});
});

server.post("/ejs", async (q,a)=>{
  let {name, ticket, A} = q.body;
  //tablo
  let r = await tablo.update({name:name, status:'P'},{$set: {status:'R'}});
  if (r==1){
  //neDb
      db.insert({name : name, ticket: Number(ticket), A:A});
  }
  return a.redirect("/");
});

server.get("/loginprep", async (q,a) => {
  return a.sendFile("loginprep.html");
});

server.post("/prep", async (q,a) => {
  let {name} = q.body;
  let stud=await students.findOne({group: group, name:name})  
  let AA=await db.findOne({name:name});
  if (AA){
    let QQ=await questions.findOne({group:group, t: Number(AA.ticket)});
    let Q=QQ.questions;
    let ticket=AA.ticket;
    let A=AA.A;

    return a.view('answer.ejs', {name: name, surname:stud.surname, ticket: ticket, Q: Q, A:A});
  }else{
    return a.redirect("/loginprep");
  }
});

// server.setErrorHandler(async (error, q,a)=>{
//   return a.sendFile(path.join(__dirname,'404.html'));
// });

server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`);
    console.log(`Запустите ${address}/start и установите группу.`);
    console.log(`Для группы ${group}`);
  });