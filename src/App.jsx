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
        <Route path="/cards" element={<CardList />}/>
        <Route path="/cards/:cardId" element={<CardDetail />}/>


        <Route path="/terms" element={<TermList />}/>
        <Route path="/terms/new" element={<TermForm />} />
        <Route path="/terms/:termId" element={<TermDetail/>} />
        <Route path="/terms/:termId/update" element={<TermForm />}/>

        <Route path="/problems" element={<ProblemList />}/>
        <Route path="/problems/new" element={<ProblemForm />} />
        <Route path="/problems/:problemId" element={<ProblemDetail/>} />
        <Route path="/problems/:problemId/update" element={<ProblemForm />}/>


        <Route path="/solutions/new" element={<SolutionForm />} />
        <Route path="/problems/:problemId/update" element={<SolutionForm />}/>
       

      </Routes>
    </>
  );
};

export default App;