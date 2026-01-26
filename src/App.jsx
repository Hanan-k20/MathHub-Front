import { useContext } from 'react';
import { Routes, Route } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';

import CardList from './components/flashCard/cardList';
import CardDetail from './components/FlashCard/CardDetail';

import ProblemForm from './components/Problem/problemForm';
import ProblemList from './components/problem/problemList';
import ProblemDetail from '/components/problem/problemDetail';

import TermList from './components/Term/TermList';
import TermDetail from './components/Term/TermDetail';
import TermForm from './components/Term/TermForm';

import SolutionForm from './components/solution/solutionForm';

import { UserContext } from './contexts/UserContext';



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