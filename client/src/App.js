import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import PlayerDropdown from './components/PlayerDropdown';
import StatCard from './components/StatCard';

function App() {
  return (
    <Container>
      <Header />
      <PlayerDropdown />

      <Row className="d-flex flex-wrap justify-content-center">
        <StatCard title="Batting Trends" />
        <StatCard title="Season Summary" />
        <StatCard title="Pitching Trends" />
        <StatCard title="Overall Rating" />
      </Row>
    </Container>
  );
}

export default App;
