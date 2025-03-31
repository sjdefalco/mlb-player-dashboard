import React, { useState, useEffect } from 'react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
  } from 'recharts';

const TeamChart = ({ statKey, title, color, endpoint }) => {
  const [teamData, setTeamData] = useState([]);
  const [leagueAvg, setLeagueAvg] = useState(null);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((stats) => {
        const processed = stats.map((team) => {
          const value = parseFloat(team[statKey]);
          return {
            team: team.team,
            abr: team.abr,
            value: value,
            leagueAvg: null // Placeholder, will be updated below
          };
        });
        const leagueAverage = processed.reduce((acc, team) => acc + team.value, 0) / processed.length;
        setLeagueAvg(leagueAverage);
        const updatedData = processed
          .filter(entry => entry.team !== "MLB Average" && entry.team !== "All Teams")
          .map((entry) => ({
            ...entry,
            leagueAvg: leagueAverage
          }));
        setTeamData(updatedData);
      })
      .catch((err) => console.error(`Error fetching ${title} stats:`, err));
  }, [statKey, endpoint, title]);

  if (!teamData || teamData.length === 0) {
    return <div>No {title} data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={teamData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="abr" tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="value" name={`Team ${title}`}>
          {teamData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={color}
            />
          ))}
        </Bar>
        {leagueAvg && (
          <Line
            dataKey="leagueAvg"
            type="monotone"
            stroke="red"
            dot={false}
            name={`League ${title}`}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TeamChart;