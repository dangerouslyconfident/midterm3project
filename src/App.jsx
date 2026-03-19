import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [viewMode, setViewMode] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => {
        const r = ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'Data', 'Cloud', 'Security', 'QA', 'Systems'];
        const l = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal'];
        const c = ['TechCorp', 'InnoSoft', 'CloudSync', 'DataFlow', 'NetWorks', 'Appify', 'CyberShield', 'WebGen', 'DevSpace', 'SysOps'];
        const d = [
          'We are looking for a passionate engineer to join our fast-paced team and build scalable services.',
          'Join us to create pixel-perfect, highly interactive interfaces for millions of users worldwide.',
          'Help us build the next generation of our cloud infrastructure platform using modern technologies.',
          'Work with massive datasets and implement solutions to improve our core product recommendations.',
          'Ensure the security and reliability of our systems through rigorous architectural enhancements.',
          'Lead a cross-functional team to deliver end-to-end features on our flagship applications.',
          'Design, develop, and maintain our high-traffic APIs serving thousands of requests per second.',
          'Architect robust cloud solutions and optimize our systems for maximum operational efficiency.',
          'Collaborate directly with product managers to define and implement engaging user experiences.',
          'Drive development strategies and maintain our comprehensive technical frameworks across teams.'
        ];
        const formattedJobs = data.slice(0, 30).map(job => {
          const role = r[job.id % r.length];
          return {
            id: job.id,
            title: `${l[job.id % l.length]} ${role} Engineer`,
            company: c[(job.id * 3) % c.length],
            description: d[job.id % d.length],
            role: role
          };
        });
        setJobs(formattedJobs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveToggle = (job) => {
    if (savedJobs.find(j => j.id === job.id)) {
      setSavedJobs(savedJobs.filter(j => j.id !== job.id));
    } else {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const currentList = viewMode === 'all' ? jobs : savedJobs;
  const filteredJobs = currentList.filter(job =>
    job.role.toLowerCase().includes(searchText.toLowerCase()) ||
    job.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">💼</div>
          <h1>JobBoard</h1>
        </div>
        <div className="stats">
          <span className="badge">Saved: {savedJobs.length}</span>
        </div>
      </header>

      <main className="main-content">
        <div className="controls">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by role or title..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="view-toggles">
            <button
              className={viewMode === 'all' ? 'active' : ''}
              onClick={() => setViewMode('all')}
            >
              All Jobs
            </button>
            <button
              className={viewMode === 'saved' ? 'active' : ''}
              onClick={() => setViewMode('saved')}
            >
              Saved ({savedJobs.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="state-container">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="state-container empty-state">
            <div className="empty-icon">📭</div>
            <p>No jobs found in this view.</p>
          </div>
        ) : (
          <div className="job-grid">
            {filteredJobs.map(job => {
              const isSaved = savedJobs.some(j => j.id === job.id);
              return (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <h2>{job.title}</h2>
                      <span className="company">{job.company}</span>
                    </div>
                    <div className="role-badge">{job.role}</div>
                  </div>
                  <p className="description">{job.description}</p>
                  <div className="job-card-footer">
                    <button
                      className={`save-btn ${isSaved ? 'saved' : ''}`}
                      onClick={() => handleSaveToggle(job)}
                    >
                      {isSaved ? '★ Saved' : '☆ Save Job'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
