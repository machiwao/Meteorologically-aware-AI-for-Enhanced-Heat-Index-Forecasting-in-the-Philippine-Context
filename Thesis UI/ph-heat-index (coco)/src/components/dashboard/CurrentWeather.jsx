<div className="dashboard">

  {/* --- MAIN HEAT INDEX CARD --- */}
  <div className="main-card">
    <div className="date">October 1, 2025</div>
    <div className="main-temp">44°C</div>
    <div className="danger-text">Danger (42 – 51°C)</div>
  </div>

  {/* --- SIDE FORECAST CARDS --- */}
  <div className="side-cards">
    <div className="forecast-card">
      <div className="forecast-date">October 2, 2025</div>
      <div className="forecast-temp">42°C</div>
    </div>

    <div className="forecast-card">
      <div className="forecast-date">October 3, 2025</div>
      <div className="forecast-temp">40°C</div>
    </div>
  </div>

  {/* --- HEAT INDEX TREND --- */}
  <div className="trend-card">
    <div className="trend-header">
      <span className="trend-title">Heat Index</span>
      <div className="trend-tabs">
        <button className="active">Month</button>
        <button>Year</button>
      </div>
    </div>

    {/* Your chart component here */}
    <LineChart width={550} height={220} data={chartData}>
      <Line type="monotone" dataKey="temp" stroke="#E53935" strokeWidth={3} />
      <XAxis dataKey="month" />
    </LineChart>
  </div>

</div>
