import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title }) => (
  <Card className="m-2 flex-fill" style={{ minWidth: '300px', height: '250px' }}>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <div style={{
        backgroundColor: '#eee',
        width: '100%',
        height: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span>Placeholder Chart</span>
      </div>
    </Card.Body>
  </Card>
);

export default StatCard;