import F from 'fastify'
import Fs from '@fastify/static'
import path from 'node:path'

const __dirname=import.meta.dirname;
const server=F({
    logger: true
  });

//   server.register(Fs,{

//   });

  server.get("/", async (q,a)=>{
    return a.sendFile('quill.html')
  })

server.setErrorHandler(async (error, q,a)=>{
    return a.sendFile('404.html');
})

server.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`);
  })

