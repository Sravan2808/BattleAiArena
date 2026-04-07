import express from 'express';
import runGraph from "./ai/graph.ai.js";

const app = express();
// app.use(express.json());

app.get("/run-graph",async (req,res)=>{
    const result = await runGraph("Write an code for factorial function in JavaScript");
    res.status(200).json(result);
})

app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok"});
})



export default app;