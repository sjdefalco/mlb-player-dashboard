import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, children }) => {
  return (
    <Card className="m-2 flex-fill" style={{ minWidth: '300px', height: '300px' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {/* Reserve space for the chart */}
        <div style={{ height: '250px' }}>
          {children}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;