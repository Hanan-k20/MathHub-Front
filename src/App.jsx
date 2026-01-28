import { useState, useEffect, useContext } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import * as problemService from './services/problemService';
import * as termService from './services/termService';

// Components
import NavBar from './Components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './Components/Dashboard/Dashboard';
import Landing from './Components/Landing/Landing';
import CardList from './components/FlashCard/cardList';
import CardDetail from './components/FlashCard/CardDetail';
import ProblemList from './Components/Problem/problemList';
import ProblemForm from './components/Problem/problemForm';
import ProblemDetail from './Components/Problem/ProblemDetail';
import TermList from './Components/Term/TermList';
import TermDetail from './Components/Term/TermDetail';
import TermForm from './Components/Term/TermForm';
import SolutionForm from './Components/Solution/SolutionForm';

const App = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [problems, setProblems] = useState([]);
  const [problemToUpdate, setProblemToUpdate] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [solutionToUpdate, setSolutionToUpdate] = useState(null);
  const [terms, setTerms] = useState([]);
  const [termToUpdate, setTermToUpdate] = useState(null);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const data = await problemService.index();
        setProblems(data || []);
        const termsData = await termService.index();
        setTerms(termsData || []);
      } catch (error) {
        console.log("Error loading data:", error);
      }
    };
    getAllData();
  }, []);

  // --- Problems ---
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

  // --- Solutions ---
const addSolution = (newSolution, problemIdFromForm) => {
  const updatedProblems = problems.map((p) => {
    if (p.id === Number(problemIdFromForm)) {
      const currentSols = p.solutions || p.Solutions || [];
      return {
        ...p,
        solutions: [...currentSols, newSolution],
        Solutions: [...currentSols, newSolution]
      };
    }
    return p;
  });

  setProblems(updatedProblems);

  navigate(`/problems/${problemIdFromForm}`);
};

  const updateSolutionInState = (updatedSol, problemId) => {
    setSolutions(solutions.map((solu) => (solu.id === updatedSol.id ? updatedSol : solu)));
    setSolutionToUpdate(null);
    navigate(`/problems/${problemId}`);
  };

  // --- Terms ---
  const addTerm = (newTerm) => {
    setTerms([...terms, newTerm]);
    navigate('/terms');
  };

  const findTermToUpdate = (id) => {
    const found = terms.find(oneTerm => oneTerm.id === Number(id));
    setTermToUpdate(found);
  };

  const updateOneTerm = (updatedTerm) => {
    const updatedList = terms.map(oneTerm => oneTerm.id === updatedTerm.id ? updatedTerm : oneTerm);
    setTerms(updatedList);
    setTermToUpdate(null);
    navigate(`/terms/${updatedTerm.id}`);
  };

  const deleteTerm = (id) => {
    setTerms(terms.filter(oneTerm => oneTerm.id !== Number(id)));
  };

  // --- Card Wrapper ---
  const CardDetailWrapper = () => {
    const { cardId } = useParams();
    const problem = problems.find((oneproblem) => oneproblem.id === Number(cardId));
    if (!problem && problems.length > 0) return <h2>Problem not found!</h2>;
    if (!problem) return <h2>Loading Card Data...</h2>;
    return <CardDetail problem={problem} />;
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />

        {/* Problem Routes */}
        <Route path="/problems" element={<ProblemList problems={problems} user={user}/>} />
        <Route path="/problems/new" element={<ProblemForm updateProblem={addProblem} />} />
        <Route path="/problems/:problemId" element={<ProblemDetail findProblemToUpdate={setProblemToUpdate} user={user} />} />
        <Route path="/problems/:problemId/update" element={<ProblemForm problemToUpdate={problemToUpdate} updateOneProblem={updateOneProblem} />} />

        {/* Solution Routes */}
        <Route path="/problems/:problemId/solutions/new" element={<SolutionForm updateSolution={addSolution} />} />
        <Route path="/problems/:problemId/solutions/:solutionId/update" element={<SolutionForm updateSolution={updateSolutionInState} solutionToUpdate={solutionToUpdate} />} />

        {/* Terms Routes */}
        <Route path="/terms" element={<TermList terms={terms} />} />
        <Route path="/terms/new" element={<TermForm addTerm={addTerm} />} />
        <Route path="/terms/:id/update" element={<TermForm termToUpdate={termToUpdate} updateOneTerm={updateOneTerm} />} />
        <Route path="/terms/:id" element={<TermDetail findTermToUpdate={findTermToUpdate} deleteTerm={deleteTerm} />} />

        {/* Cards Routes */}
        <Route path="/cards" element={<CardList cards={problems} />} />
        <Route path="/cards/:cardId" element={<CardDetailWrapper />} />
      </Routes>
    </>
  );
};

export default App;