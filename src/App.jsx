import { useState, useEffect, useContext } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router'; 
import { UserContext } from './contexts/UserContext'; 
import * as problemService from './services/problemService';
// Components
import NavBar from './Components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './Components/Dashboard/Dashboard';
import Landing from './Components/Landing/Landing';
import CardList from './components/flashCard/cardList';
import CardDetail from './components/flashCard/CardDetail';
import ProblemList from './Components/Problem/problemList';
import ProblemForm from './Components/Problem/problemForm';
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
    const getAllProblems = async () => {
      try {
        const data = await problemService.index();
        console.log("Data from server:", data);
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
//---Card--
const CardDetailWrapper = () => {
    const { cardId } = useParams(); 
    const problem = problems.find((oneproblem) => oneproblem.id === Number(cardId)); 
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
        <Route path="/problems" element={<ProblemList problems={problems} />} />
        <Route path="/problems/new" element={<ProblemForm updateProblem={addProblem} />} />
        <Route path="/problems/:problemId"  element={<ProblemDetail findProblemToUpdate={setProblemToUpdate} user={user} />} />        
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
          path="/terms/new"
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
        {/* cards Route*/}
        <Route path="/cards" element={<CardList cards={problems} />} />
        <Route path="/cards/:cardId" element={<CardDetailWrapper />} />


      </Routes>
    </>
  );
};
export default App