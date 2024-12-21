import F from 'fastify'
import Fs from '@fastify/static'
import path from 'node:path'
import ejs from 'ejs'
import Fv from '@fastify/view'
import Furl from '@fastify/formbody'

let Q=[
// let Q1=
"Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. Вопрос первый очень важный. ",
// let Q2=
"Вопрос второй, на который ответить не может никто. Вопрос второй, на который ответить не может никто. Вопрос второй, на который ответить не может никто. Вопрос второй, на который ответить не может никто. Вопрос второй, на который ответить не может никто. ",
// let Q3=
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
// let Q=[Q1,Q2,Q3];
];

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

server.setErrorHandler(async (error, q,a)=>{
  return a.sendFile(path.join(__dirname,'404.html'));
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
  return a.view('questions.ejs', {Q : Q})
  // return a.sendFile('quill.html')
});

// server.get("/q", async (q,a)=>{
//   return a.send({hello:"ok"});
// });


server.post("/q", async (q,a)=>{
  let {name, ticket, A1, A2, question} = q.body;
  // let Q=[Q1, Q2]//, Q3];
  let A=[A1, A2];
  return a.view('question.ejs', {name: name, ticket: ticket, Q: Q, A:A})
});

server.post("/ejs", async (q,a)=>{
  let {name, ticket, A, question} = q.body;
  // let Q=[Q1, Q2];//, Q3];
  // let A=[A1, A2, A3];
  // if (question === undefined)
  //   question=0;
  return a.view('answer.ejs', {name: name, ticket: ticket, Q: Q, A:A})
});

server.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`);
  });