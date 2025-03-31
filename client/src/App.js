import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Header from './components/Header';
import PlayerDropdown from './components/PlayerDropdown';
import StatCard from './components/StatCard';
import CareerChart from './components/CareerChart';
import SplitsBarChart from './components/SplitsBarChart';
import TeamChart from './components/TeamChart';

function App() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [activeTab, setActiveTab] = useState('batters');

  return (
    <Container>
      <Header />
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="batters" title="Batters">
          <PlayerDropdown onSelect={setSelectedPlayerId} playerType="batter" />

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
      </Tab>

      <Tab eventKey="pitchers" title="Pitchers">
        <PlayerDropdown onSelect={setSelectedPlayerId} playerType="pitcher" />
        {selectedPlayerId && (
          <>
          <Row className="gx-1 d-flex flex-wrap justify-content-center">
            <Col md={8}>
              <StatCard title="ERA">
                <CareerChart
                  playerId={selectedPlayerId}
                  statKey="era"
                  title="ERA"
                  color="#8884d8"
                  endpoint={`/api/pitcher_stats/${selectedPlayerId}`}
                />
              </StatCard>
            </Col>
            <Col md={4}>
            <StatCard title="ERA Trending">
              <SplitsBarChart
                playerId={selectedPlayerId}
                statKey="era"
                title="ERA"
                color="#8884d8"
                endpoint={`/api/pitcher_stats/${selectedPlayerId}/splits`}
              />
            </StatCard>
            </Col>
          </Row>

          <Row className="gx-1 d-flex flex-wrap justify-content-center">
            <Col md={8}>
              <StatCard title="WHIP">
                <CareerChart
                  playerId={selectedPlayerId}
                  statKey="whip"
                  title="WHIP"
                  color="#8884d8"
                  endpoint={`/api/pitcher_stats/${selectedPlayerId}`}
                />
              </StatCard>
            </Col>
            <Col md={4}>
            <StatCard title="WHIP Trending">
              <SplitsBarChart
                playerId={selectedPlayerId}
                statKey="whip"
                title="WHIP"
                color="#8884d8"
                endpoint={`/api/pitcher_stats/${selectedPlayerId}/splits`}
              />
            </StatCard>
            </Col>
          </Row>

          <Row className="gx-1 d-flex flex-wrap justify-content-center">
            <Col md={8}>
              <StatCard title="K per 9">
                <CareerChart
                  playerId={selectedPlayerId}
                  statKey="strikeoutsPer9Inn"
                  title="K per 9"
                  color="#8884d8"
                  endpoint={`/api/pitcher_stats/${selectedPlayerId}`}
                />
              </StatCard>
            </Col>
            <Col md={4}>
            <StatCard title="K per 9 Trending">
              <SplitsBarChart
                playerId={selectedPlayerId}
                statKey="strikeoutsPer9Inn"
                title="K per 9"
                color="#8884d8"
                endpoint={`/api/pitcher_stats/${selectedPlayerId}/splits`}
              />
            </StatCard>
            </Col>
          </Row>

          <Row className="gx-1 d-flex flex-wrap justify-content-center">
            <Col md={8}>
              <StatCard title="K:BB Ratio">
                <CareerChart
                  playerId={selectedPlayerId}
                  statKey="strikeoutWalkRatio"
                  title="K:BB Ratio"
                  color="#8884d8"
                  endpoint={`/api/pitcher_stats/${selectedPlayerId}`}
                />
              </StatCard>
            </Col>
            <Col md={4}>
            <StatCard title="K:BB Trending">
              <SplitsBarChart
                playerId={selectedPlayerId}
                statKey="strikeoutsPer9Inn"
                title="K:BB Ratio"
                color="#8884d8"
                endpoint={`/api/pitcher_stats/${selectedPlayerId}/splits`}
              />
            </StatCard>
            </Col>
          </Row>

          <Row className="gx-1 d-flex flex-wrap justify-content-center">
            <Col md={8}>
              <StatCard title="Pitches per Inning">
                <CareerChart
                  playerId={selectedPlayerId}
                  statKey="pitchesPerInning"
                  title="Pitches per Inning"
                  color="#8884d8"
                  endpoint={`/api/pitcher_stats/${selectedPlayerId}`}
                />
              </StatCard>
            </Col>
            <Col md={4}>
            <StatCard title="Pitches per Inning">
              <SplitsBarChart
                playerId={selectedPlayerId}
                statKey="pitchesPerInning"
                title="Pitches per Inning"
                color="#8884d8"
                endpoint={`/api/pitcher_stats/${selectedPlayerId}/splits`}
              />
            </StatCard>
            </Col>
          </Row>

          </>
        )}
      </Tab>
      <Tab eventKey="teams" title="Teams">
        <StatCard title="Team OPS">
          <TeamChart 
            statKey="ops"
            title="OPS"
            color="#8884d8"
            endpoint={'/api/team_stats/hitting'}
          />
        </StatCard>
        <StatCard title="Team BABIP">
          <TeamChart 
            statKey="babip"
            title="BABIP"
            color="#8884d8"
            endpoint={'/api/team_stats/hitting'}
          />
        </StatCard>
        <StatCard title="Team ERA">
          <TeamChart 
            statKey="era"
            title="ERA"
            color="#8884d8"
            endpoint={'/api/team_stats/pitching'}
          />
        </StatCard>
        <StatCard title="Team WHIP">
          <TeamChart 
            statKey="whip"
            title="WHIP"
            color="#8884d8"
            endpoint={'/api/team_stats/pitching'}
          />
        </StatCard>
        <StatCard title="Team Pitches per Inning">
          <TeamChart 
            statKey="pitchesPerInning"
            title="Pitches per Inning"
            color="#8884d8"
            endpoint={'/api/team_stats/pitching'}
          />
        </StatCard>
        <StatCard title="Team OPS Against">
          <TeamChart 
            statKey="opsAgainst"
            title="OPS Against"
            color="#8884d8"
            endpoint={'/api/team_stats/pitching'}
          />
        </StatCard>
      </Tab>
    </Tabs>
    </Container>
  );
}

export default App;