import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router';

const App = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [problems, setProblems] = useState([]);
  const [problemToUpdate, setProblemToUpdate] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [solutionToUpdate, setSolutionToUpdate] = useState(null);
  const [terms, setTerms] = useState(null)

  useEffect(() => {
    const getAllProblems = async () => {
      try {
        const data = await problemService.index();
        setProblems(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllProblems();
  }, []);

  // ---Problems ---
  const addProblem = (problem) => {
    setProblems([...problems, problem]);
    navigate('/problems');
  };

  const updateOneProblem = (updatedProblem) => {
    const newList = problems.map((p) => (p.id === updatedProblem.id ? updatedProblem : p));
    setProblems(newList);
    setProblemToUpdate(null);
    navigate(`/problems/${updatedProblem.id}`);
  };

  // ---Solutions ---
  const addSolution = (newSolution, problemId) => {
    setSolutions([...solutions, newSolution]);
    navigate(`/problems/${problemId}`);
  };

  const updateSolutionInState = (updatedSol, problemId) => {
    setSolutions(solutions.map((s) => (s.id === updatedSol.id ? updatedSol : s)));
    setSolutionToUpdate(null);
    navigate(`/problems/${problemId}`);
  };

// ---Terms ---
  const addTerm = (newTerm) => {
  setTerms([...terms, newTerm]);
};

const findTermToUpdate = (id) => {
  const found = terms.find(oneTerm => oneTerm.id === Number(id));
  setTermToUpdate(found);
};


const updateOneTerm = (updatedTerm) => {
  const updatedList = terms.map(oneTerm=> oneTerm.id === updatedTerm.id ? updatedTerm : oneTerm);
  setTerms(updatedList);
  setTermToUpdate(null);
};

const deleteTerm = (id) => {
  setTerms(terms.filter(oneTerm=> oneTerm.id !== Number(id)));
};


  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />


        <Route path="/cards" element={<CardList cards={problems} />} />

        {/* Problem Routes */}
        <Route path="/problems" element={<ProblemList problems={problems} />} />
        <Route path="/problems/new" element={<ProblemForm addProblem={addProblem} />} />
        <Route path="/problems/:problemId" element={<ProblemDetail setProblemToUpdate={setProblemToUpdate} />} />
        <Route path="/problems/:problemId/update" element={<ProblemForm problemToUpdate={problemToUpdate} updateOneProblem={updateOneProblem} />} />

        {/* Solution Routes*/}
        <Route
          path="/problems/:problemId/solutions/new"
          element={<SolutionForm addSolution={addSolution} />}
        />
        <Route
          path="/problems/:problemId/solutions/:solutionId/update"
          element={<SolutionForm updateSolution={updateSolutionInState} solutionToUpdate={solutionToUpdate} />}
        />

        {/* terms Route*/}
        <Route
          path="/terms"
          element={<TermList terms={terms} />}
        />

        <Route
          path="/terms/create"
          element={<TermForm addTerm={addTerm} />}
        />

        <Route
          path="/terms/:id"
          element={<TermDetail findTermToUpdate={findTermToUpdate} deleteTerm={deleteTerm} />}
        />

        <Route
          path="/terms/:id/update"
          element={<TermForm termToUpdate={termToUpdate} updateOneTerm={updateOneTerm} />}
        />
      </Routes>
    </>
  );
};
export default App