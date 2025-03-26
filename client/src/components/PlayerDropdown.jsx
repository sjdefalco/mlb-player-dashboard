import React, { useEffect, useState } from 'react';
import { Form, Container } from 'react-bootstrap';

const PlayerDropdown = ({ onSelect }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('/api/active_hitters')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Failed to load players:', err));
  }, []);

  return (
    <Container className="mb-4">
      <Form.Select onChange={(e) => {
          const selectedPlayerId = e.target.value;
          console.log("Selected Player ID:", selectedPlayerId);
          if (onSelect) {
            onSelect(selectedPlayerId);
          }
        }}>
        <option value="">Select a player</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </Form.Select>
    </Container>
  );
};

export default PlayerDropdown;