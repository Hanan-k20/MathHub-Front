import { useState, useEffect, useContext } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import * as problemService from './services/problemService';
import * as termService from './services/termService';
import NavBar from './Components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './Components/Dashboard/Dashboard';
import Landing from './Components/Landing/Landing';
import CardList from './components/FlashCard/cardList';
import CardDetail from './components/FlashCard/CardDetail';
import ProblemList from './Components/Problem/problemList';
import ProblemForm from './Components/Problem/ProblemForm';
import ProblemDetail from './Components/Problem/ProblemDetail';
import TermList from './Components/Term/TermList';
import TermDetail from './Components/Term/TermDetail';
import TermForm from './Components/Term/TermForm';
import SolutionForm from './Components/Solution/SolutionForm';
import SolutionDetail from './Components/Solution/SolutionDetail';
import { MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"]]
  }
};

const App = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [problems, setProblems] = useState([]);
  const [problemToUpdate, setProblemToUpdate] = useState(null);
  const [terms, setTerms] = useState([]);
  const [termToUpdate, setTermToUpdate] = useState(null);
  const [solutionToUpdate, setSolutionToUpdate] = useState(null);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const data = await problemService.index();
        setProblems(data || []);
        const termsData = await termService.index();
        setTerms(termsData || []);
      } catch (error) {
        console.log(error);
      }
    };
    getAllData();
  }, []);

  const addProblem = async (problemData) => {
    try {
      const newProblem = await problemService.create(problemData);
      setProblems([...problems, newProblem]);
      navigate('/problems');
    } catch (error) {
      console.error(error);
    }
  };

  const updateOneProblem = async (id, updatedData) => {
    try {
      const updatedProblem = await problemService.update(id, updatedData);
      setProblems(prev => prev.map(p => p.id === Number(id) ? updatedProblem : p));
      setProblemToUpdate(null);
      navigate('/problems');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProblem = async (id) => {
    try {
      await problemService.remove(id);
      setProblems(prev => prev.filter(p => p.id !== Number(id)));
      navigate('/problems');
    } catch (error) {
      console.error(error);
    }
  };

  const addSolution = (newSolution, problemIdFromForm) => {
    setProblems(problems.map(p => {
      if (p.id === Number(problemIdFromForm)) {
        const currentSols = p.solutions || [];
        return { ...p, solutions: [...currentSols, newSolution] };
      }
      return p;
    }));
    navigate(`/problems/${problemIdFromForm}`);
  };

  const updateSolutionInState = (updatedSol, problemId) => {
    setProblems(problems.map(p => {
      if (p.id === Number(problemId)) {
        const updatedSols = (p.solutions || []).map(s => s.id === updatedSol.id ? updatedSol : s);
        return { ...p, solutions: updatedSols };
      }
      return p;
    }));
    setSolutionToUpdate(null);
    navigate(`/problems/${problemId}`);
  };

  const findSolutionToUpdate = (problemId, solutionId) => {
    const problem = problems.find(p => p.id === Number(problemId));
    const solution = (problem?.solutions || []).find(s => s.id === Number(solutionId));
    setSolutionToUpdate(solution);
  };

  const addTerm = async (termData) => {
    try {
      const newTerm = await termService.create(termData);
      setTerms([...terms, newTerm]);
      navigate('/terms');
    } catch (error) {
      console.error(error);
    }
  };

  const updateOneTerm = async (id, updatedData) => {
    try {
      const updatedTerm = await termService.update(id, updatedData);
      setTerms(terms.map(t => t.id === Number(id) ? updatedTerm : t));
      setTermToUpdate(null);
      navigate(`/terms/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTerm = async (id) => {
    try {
      await termService.remove(id);
      setTerms(terms.filter(t => t.id !== Number(id)));
      navigate('/terms');
    } catch (error) {
      console.error(error);
    }
  };

  const findTermToUpdate = (id) => {
    setTermToUpdate(terms.find(t => t.id === Number(id)));
  };

  const CardDetailWrapper = () => {
    const { cardId } = useParams();
    const problem = problems.find(p => p.id === Number(cardId));
    if (!problem && problems.length > 0) return <h2>Problem not found!</h2>;
    if (!problem) return <h2>Loading...</h2>;
    return <CardDetail problem={problem} />;
  };

  return (
    <>
      <NavBar />
      <MathJaxContext config={config}>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
          <Route path='/sign-up' element={<SignUpForm />} />
          <Route path='/sign-in' element={<SignInForm />} />
          <Route path="/problems" element={ <ProblemList problems={problems} user={user} deleteProblem={deleteProblem} findProblemToUpdate={setProblemToUpdate} />} />
          <Route path="/problems/new" element={<ProblemForm updateProblem={addProblem} />} />
          <Route path="/problems/:problemId" element={<ProblemDetail findProblemToUpdate={setProblemToUpdate} user={user} deleteProblem={deleteProblem} />} />
          <Route path="/problems/:problemId/update" element={<ProblemForm problemToUpdate={problemToUpdate} updateOneProblem={updateOneProblem}  /> } />
          <Route path="/problems/:problemId/solutions/new" element={<SolutionForm updateSolution={addSolution} />} />
          <Route path="/problems/:problemId/solutions/:solutionId" element={<SolutionDetail user={user} findSolutionToUpdate={findSolutionToUpdate} />} />
          <Route path="/problems/:problemId/solutions/:solutionId/update" element={<SolutionForm updateSolution={updateSolutionInState} solutionToUpdate={solutionToUpdate} />} />
          <Route path="/terms" element={<TermList terms={terms} />} />
          <Route path="/terms/new" element={<TermForm addTerm={addTerm} />} />
          <Route path="/terms/:id/update" element={<TermForm termToUpdate={termToUpdate} updateOneTerm={updateOneTerm} />} />
          <Route path="/terms/:id" element={<TermDetail findTermToUpdate={findTermToUpdate} deleteTerm={deleteTerm} />} />
          <Route path="/cards" element={<CardList cards={problems} />} />
          <Route path="/cards/:cardId" element={<CardDetailWrapper />} />
        </Routes>
      </MathJaxContext>
    </>
  );
};

export default App;