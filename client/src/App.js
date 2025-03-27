import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import PlayerDropdown from './components/PlayerDropdown';
import StatCard from './components/StatCard';
import OPSChart from './components/OPSChart';
import BABIPChart from './components/BabipChart';
import OPSSplitsChart from './components/OPSSplitsChart';
import BABIPSplitsChart from './components/BabipSplitsChart';

function App() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  return (
    <Container>
      <Header />
      <PlayerDropdown onSelect={setSelectedPlayerId} />

      {selectedPlayerId && (
        <>
          <Row className="gx-1 d-flex flex-wrap justify-content-center">
          <Col md={8}>
              <StatCard title="OPS">
                <OPSChart playerId={selectedPlayerId} />
              </StatCard>
            </Col>
            <Col md={4}>
              <StatCard title="OPS Trending">
                <OPSSplitsChart playerId={selectedPlayerId} />
              </StatCard>
            </Col>
          </Row>

          <Row className="gx-1 d-flex flex-wrap justify-content-center">
            <Col md={8}>
              <StatCard title="BABIP">
                <BABIPChart playerId={selectedPlayerId} />
              </StatCard>
            </Col>
            <Col md={4}>
              <StatCard title="BABIP Trending">
                <BABIPSplitsChart playerId={selectedPlayerId} />
              </StatCard>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;