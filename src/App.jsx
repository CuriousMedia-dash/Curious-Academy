import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import StartHere from "./pages/StartHere";
import LearningHub from "./pages/LearningHub";
import Playbooks from "./pages/Playbooks";
import Policies from "./pages/Policies";
import MeetTeam from "./pages/MeetTeam";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/start-here" element={<StartHere />} />

        <Route path="/learning-hub" element={<LearningHub />} />

        <Route path="/playbooks" element={<Playbooks />} />

        <Route path="/policies" element={<Policies />} />

        <Route path="/team" element={<MeetTeam />} />
      </Routes>
    </BrowserRouter>
  );
}