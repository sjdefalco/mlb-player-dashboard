import React, { useEffect, useRef, useState } from 'react';
import { Form, Container } from 'react-bootstrap';

const PlayerDropdown = ({ playerType, onSelect }) => {
  const [players, setPlayers] = useState([]);
  const inputRef = useRef(null); // <-- Add this

  useEffect(() => {
    const endpoint = playerType === "batter"
      ? '/api/active_hitters'
      : '/api/active_pitchers';

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setPlayers(data);

        // Reset the input field when player list updates
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      })
      .catch(err => console.error('Failed to load players:', err));
  }, [playerType]);

  return (
    <Container className="mb-4">
      <Form.Control
        ref={inputRef}
        list={`${playerType}-options`}
        placeholder="Type to search for a player"
        onChange={(e) => {
          const selectedName = e.target.value;
          const selectedPlayer = players.find(player => player.name === selectedName);
          if (onSelect && selectedPlayer) {
            onSelect(selectedPlayer.id);
          }
        }}
      />
      <datalist id={`${playerType}-options`}>
        {players.map((player) => (
          <option key={player.id} value={player.name} />
        ))}
      </datalist>
    </Container>
  );
};

export default PlayerDropdown;