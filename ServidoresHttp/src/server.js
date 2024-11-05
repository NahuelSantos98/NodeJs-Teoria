import http from 'node:http'

const server = http.createServer((req, res)=>{
    res.end("Hola Mundo")
})

server.listen(3000, ()=>{
    console.log("Listening on port 3000...");
})