import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { GamifiedLearning } from "./components/GamifiedLearning";
import { Chatbot } from "./components/Chatbot";
import { SignRecognition } from "./components/SignRecognition";
import { Quiz } from "./components/Quiz";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "learning", Component: GamifiedLearning },
      { path: "chatbot", Component: Chatbot },
      { path: "signs", Component: SignRecognition },
      { path: "quiz", Component: Quiz },
    ],
  },
]);
