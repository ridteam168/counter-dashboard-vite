import './App.css';

const LoadingAnimation = () => {
  
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-dot"></div>
      </div>
      <div className="loading-text">
        <div className="loading-text-words">
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
      <div className="loading-dashboard-skeleton">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="skeleton-card">
            <div className="skeleton-header"></div>
            <div className="skeleton-value"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;