import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import PlayerDropdown from './components/PlayerDropdown';
import StatCard from './components/StatCard';
import OPSChart from './components/OPSChart';
import BABIPChart from './components/BabipChart';
import CareerChart from './components/CareerChart';
import SplitsBarChart from './components/SplitsBarChart';

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
                <CareerChart
                  playerId={selectedPlayerId}
                  statKey="ops"
                  title="OPS"
                  color="#8884d8"
                  endpoint={`/api/hitter_stats/${selectedPlayerId}`}
                />
              </StatCard>
            </Col>
            <Col md={4}>
            <StatCard title="OPS Trending">
              <SplitsBarChart
                playerId={selectedPlayerId}
                statKey="ops"
                title="OPS"
                color="#8884d8"
                endpoint={`/api/hitter_stats/${selectedPlayerId}/splits`}
              />
            </StatCard>
            </Col>
          </Row>

          <Row className="gx-1 d-flex flex-wrap justify-content-center">
            <Col md={8}>
              <StatCard title="BABIP">
                <CareerChart
                    playerId={selectedPlayerId}
                    statKey="babip"
                    title="BABIP"
                    color="#8884d8"
                    endpoint={`/api/hitter_stats/${selectedPlayerId}`}
                  />
              </StatCard>
            </Col>
            <Col md={4}>
            <StatCard title="BABIP Trending">
              <SplitsBarChart
                playerId={selectedPlayerId}
                statKey="babip"
                title="BABIP"
                color="#8884d8"
                endpoint={`/api/hitter_stats/${selectedPlayerId}/splits`}
              />
            </StatCard>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;