import { HumanMessage } from "@langchain/core/messages";
import {
  StateSchema,
  MessagesValue,
  ReducedValue,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import { mistralModel, cohereModel, geminiModel } from "./models.service.js";
import { createAgent, providerStrategy } from "langchain";

const State = new StateSchema({
  messages: MessagesValue,
  solution_1: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  solution_2: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  judge_recommandation: new ReducedValue(
    z
      .object({ solution_1_score: z.number(), solution_2_score: z.number() })
      .default({
        solution_1_score: 0,
        solution_2_score: 0,
      }),
    {
      reducer: (current, next) => {
        return next;
      },
    },
  ),
});

const solutionNode: GraphNode<typeof State> = async (state) => {
  console.log(state);
  const [mistral_solution, cohere_solution] = await Promise.all([
    mistralModel.invoke(state.messages),
    cohereModel.invoke(state.messages),
  ]);

  return {
    solution_1: mistral_solution.text,
    solution_2: cohere_solution.text,
  };
};

const judgeNode: GraphNode<typeof State> = async (state) => {
  const { solution_1, solution_2 } = state;
  const judge = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
      }),
    ),
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(
        `You are a judge. You need to compare two solutions for the question: ${state.messages[0].text}. The first solution is: ${solution_1}. The second solution is: ${solution_2}. Please give each solution a score from 0 to 10 based on their quality.Where 10 means the solution is perfect and 0 means the solution is completely wrong.`,
      ),
    ],
  });

  const result = judgeResponse.structuredResponse
  return{
    judge_recommandation:result
  }
};

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();

export default async function (userMessage: string) {
  const result = await graph.invoke({
    messages: [new HumanMessage(userMessage)],
  });
  console.log(result);
  return result.messages;
}
