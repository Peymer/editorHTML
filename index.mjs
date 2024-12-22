import F from 'fastify'
import Fs from '@fastify/static'
import path from 'node:path'
import ejs from 'ejs'
import Fv from '@fastify/view'
import Furl from '@fastify/formbody'
import lr from 'line-reader'

let Q=[];
lr.eachLine('questions.txt', (line) => {
  Q.push(line);
});

let students=[];
lr.eachLine("students.txt", (line)=>{
  students.push(line.trim());
});


// let Q=[
// "Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. ",
// "Вопрос второй, на который ответить не может никто. Вопрос второй, на который ответить не может никто. Вопрос второй, на который ответить не может никто. Вопрос второй, на который ответить не может никто. Вопрос второй, на который ответить не может никто. ",
// "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// ];

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


server.post("/q", async (q,a)=>{
  let {name, ticket} = q.body;
  if (students.findIndex((el)=> el == name) >= 0)
  // let Q=[Q1, Q2]//, Q3];
  //let A=[A1, A2];
    return a.view('questions.ejs', {name: name, ticket: ticket, Q: Q});
  else
    return a.redirect("/");
});

server.post("/ejs", async (q,a)=>{
  let {name, ticket, A} = q.body;
  // let Q=[Q1, Q2];//, Q3];
  // let A=[A1, A2, A3];
  // if (question === undefined)
  //   question=0;
  return a.view('answer.ejs', {name: name, ticket: ticket, Q: Q, A:A})
});

server.setErrorHandler(async (error, q,a)=>{
  return a.sendFile(path.join(__dirname,'404.html'));
});

server.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`);
  });