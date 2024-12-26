import F from 'fastify';
import Fs from '@fastify/static';
import path from 'node:path';
import ejs from 'ejs';
import Fv from '@fastify/view';
import Furl from '@fastify/formbody';
import lr from 'line-reader';
import {qlist} from './loadtickets.mjs';
import Datastore from 'nedb-promises';

// let Q=qlist("questions.txt");

//СУБД NeDB
var db = Datastore.create({filename : 'answers.db', autoload: true});
var students = Datastore.create({filename : 'students.db', autoload: true});
var questions = Datastore.create({filename : 'questions.db', autoload: true});
// db.loadDatabase();
// NeDB

// чтение студентов из файла
// let students=[];
// lr.eachLine("students.txt", (line)=>{
//   students.push(line.trim());
// });

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

// server.post("/q1", async (q,a) =>{
//   let QQ=q.body["QQ"];
//   return a.send(QQ);
// });

server.get("/", async (q,a)=>{
  return a.sendFile("login.html");
});

// server.get("/q", async (q,a) => {
//   let name="Иванопуло";
//   let ticket=1;
//     //neDb
//     // db.insert({name : name, ticket: ticket}, (err)=>{if (err) console.log(`db error ${err}`)});

//   return a.view('questions.ejs', {name: name, ticket: ticket, Q: Q[ticket-1].Questions});
// });

server.post("/q", async (q,a)=>{
  let {name, ticket} = q.body;
  // проверка на студента
  let stud = await students.findOne({group: group, name: name});
  if (stud){
    let QQ=await questions.findOne({group: group, t:Number(ticket)});
    let Q=QQ.questions;
    return a.view('questions.ejs', {name: stud.name, surname: stud.surname, ticket: ticket, Q: Q});
  }else{
    return a.redirect("/");
  }
});

server.get("/a", async (q,a)=>{
  // let name="Иванопуло";
  // let ticket=1;

  let aaaa=await db.find({});
  
  aaaa.forEach(el => { console.log(el)});
  return a.send({aaaa});
});

server.post("/ejs", async (q,a)=>{
  let {name, ticket, A} = q.body;
 
  //neDb
  db.insert({name : name, ticket: Number(ticket), A:A});
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

server.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`);
  });