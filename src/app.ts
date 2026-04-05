import express from 'express';
import  useGraph  from "./services/graph.ai.service.js"

const app = express();
// app.use(express.json());

app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok"});
})

app.post("/use-graph",async (req,res)=>{
    await useGraph("Write a factorial number code using JavaScript?")
})

export default app;