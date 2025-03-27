import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Header from './components/Header';
import PlayerDropdown from './components/PlayerDropdown';
import StatCard from './components/StatCard';
import OPSChart from './components/OPSChart';

function App() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  return (
    <Container>
      <Header />
      <PlayerDropdown onSelect={setSelectedPlayerId} />

      <Row className="d-flex flex-wrap justify-content-center">
        {selectedPlayerId && (
          <StatCard title="OPS">
            <OPSChart playerId={selectedPlayerId} />
          </StatCard>
        )}
        {/* You can add more StatCard instances with different charts below */}
      </Row>
    </Container>
  );
}

export default App;