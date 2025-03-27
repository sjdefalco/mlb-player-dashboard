import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend, Cell } from 'recharts';

const BABIPSplitsChart = ({ playerId }) => {
  const [splitsData, setSplitsData] = useState([]);

  useEffect(() => {
    if (playerId) {
      fetch(`/api/hitter_stats/${playerId}/splits`)
        .then(res => res.json())
        .then(data => {
            const formattedData = [
              { name: 'L15', babip: parseFloat(data.last15.babip) },
              { name: 'L30', babip: parseFloat(data.last30.babip) },
              { name: 'Season', babip: parseFloat(data.season.babip) }
            ];
            setSplitsData(formattedData);
          })
        .catch(err => console.error('Error fetching BABIP splits:', err));
    }
  }, [playerId]);

  if (splitsData.length === 0) {
    return <div>No BABIP splits available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={splitsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="babip" name="BABIP">
          {splitsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === splitsData.length - 1 ? '#555555' : '#8884d8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BABIPSplitsChart;