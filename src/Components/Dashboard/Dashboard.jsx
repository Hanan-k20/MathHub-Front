import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as testService from '../../services/testService';
import { Link } from 'react-router-dom';
import './Dashboard.css'; 

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await testService.test();
        setMessage(data.message);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchTest();
  }, [user]);

  return (
   <main className="dashboard-wrapper">
  <header className="dashboard-header">
    <h1>Welcome, <span>{user.username}</span></h1>
  </header>

  <section className="tools-grid">
    <Link to="/cards" className="tool-card">
      <div className="icon">🎴</div>
      <h3>FlashCards AI</h3>
      <p> Smart study cards with AI .</p>
    </Link>

    <Link to="/problems" className="tool-card">
      <div className="icon">🧬</div>
      <h3>MathLab</h3>
      <p>Solve complex equations with step-by-step guidance.</p>
    </Link>

    <Link to="/terms" className="tool-card">
      <div className="icon">📖</div>
      <h3>Dictionary</h3>
      <p>Master mathematical terms and academic definitions.</p>
    </Link>
  </section>
</main>
  );
};

export default Dashboard;