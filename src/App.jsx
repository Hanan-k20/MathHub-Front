import { useContext } from 'react';
import { Routes, Route } from 'react-router';

import NavBar from './Components/NavBar/NavBar';
import SignUpForm from './Components/SignUpForm/SignUpForm';
import SignInForm from './Components/SignInForm/SignInForm';
import Landing from './Components/Landing/Landing';
import Dashboard from './Components/Dashboard/Dashboard';

import CardList from './Components/FlashCard/CardList';
import CardDetail from './Components/FlashCard/CardDetail';

import ProblemForm from './Components/Problem/problemForm';
import ProblemList from './Components/Problem/problemList';
import ProblemDetail from './Components/Problem/ProblemDetail';

import TermList from './Components/Term/TermList';
import TermDetail from './Components/Term/TermDetail';
import TermForm from './Components/Term/TermForm';

import SolutionForm from './Components/Solution/SolutionForm';

import { UserContext } from './contexts/UserContext'



const App = () => {
  const { user } = useContext(UserContext);
  

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/cards" element={<CardList cards={ cards } />}/>
        <Route path="/cards/:cardId" element={<CardDetail problem={problem} />}/>


        <Route path="/terms" element={<TermList terms={terms}/>}/>
        <Route path="/terms/new" element={<TermForm updateProblem={ updateProblem} problemToUpdate={problemToUpdate} updateOneProblem={updateOneProblem} />} />
        <Route path="/terms/:termId" element={<TermDetail findTermToUpdate={findTermToUpdate} deleteTerm={deleteTerm}/>} />
        <Route path="/terms/:termId/update" element={<TermForm updateProblem={ updateProblem} problemToUpdate={problemToUpdate} updateOneProblem={updateOneProblem}/>}/>

      <Route path="/problems" element={<ProblemList  problems = { problems }/>}/>
        <Route path="/problems/new" element={<ProblemForm updateProblem={ updateProblem} problemToUpdate={problemToUpdate} updateOneProblem={updateOneProblem} />} />
        <Route path="/problems/:problemId" element={<ProblemDetail findTermToUpdate={findTermToUpdate} deleteTerm={deleteTerm} />} />
        <Route path="/problems/:problemId/update" element={<ProblemForm updateProblem={ updateProblem} problemToUpdate={problemToUpdate} updateOneProblem={updateOneProblem}/>}/>


        <Route path="/solutions/new" element={<SolutionForm updateSolution={updateSolution}/>} />
        <Route path="/problems/:problemId/update" element={<SolutionForm updateSolution={updateSolution} />}/>
       

      </Routes>
    </>
  );
};

export default App;