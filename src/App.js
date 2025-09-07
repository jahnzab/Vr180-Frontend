import React, { useState, useEffect } from 'react';
import { Upload, Download, Play, User, LogOut, MessageSquare, X } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import VR180Preview from './VR180Preview';
const API_BASE_URL = 'http://localhost:8000';
// const API_BASE_URL ='https://50f5b2c0f3d2.ngrok-free.app'
const FeedbackHeader = () => {
  const [allFeedback, setAllFeedback] = useState([]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/`);
      if (response.ok) {
        const data = await response.json();
        setAllFeedback(data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedback();
    // Optionally, refresh every 30 seconds
    const interval = setInterval(fetchFeedback, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary text-white py-2 px-4">
      <h5 className="mb-1">User Feedback on Jahanzaib's Platform</h5>
      <div style={{ maxHeight: "100px", overflowY: "auto" }}>
        {allFeedback.length > 0 ? (
          allFeedback.map((f, idx) => (
            <div key={idx} className="border-bottom py-1">
              <small>{f.content}</small>
            </div>
          ))
        ) : (
          <small>No feedback yet recorded Jahanzaib.</small>
        )}
      </div>
    </div>
  );
};

// -------------------------------
// Feedback Widget (Floating Button)
// -------------------------------
const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: feedback }),
      });

      if (response.ok) {
        setFeedback("");
        setIsOpen(false);
        alert("Feedback submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="position-fixed" style={{ bottom: "20px", right: "20px", zIndex: 1050 }}>
      <h6>Feed back</h6>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary rounded-circle p-3 shadow-lg"
          style={{ width: "60px", height: "60px" }}
        >
          <MessageSquare size={24} />
        </button>
      ) : (
         <div className="card shadow-lg" style={{ width: "320px" }}>
       
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Send Feedback</h6>
            <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-outline-secondary">
              <X size={16} />
            </button>
          </div>
          <div className="card-body">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report issues..."
              className="form-control mb-3"
              rows={4}
              style={{ resize: "none" }}
            />
            <button
              onClick={submitFeedback}
              disabled={isSubmitting || !feedback.trim()}
              className="btn btn-primary w-100"
            >
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
// Login Component
const LoginForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('username', formData.username);
          onLogin(formData.username);
        } else {
          setIsLogin(true);
          alert('Registration successful! Please login.');
        }
      } else {
        alert(data.detail || 'Authentication failed');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
    }
    setIsLoading(false);
  };

  return (
   <div
  className="min-vh-100 d-flex align-items-center justify-content-center"
  style={{
    backgroundImage: "url('vr.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4 fw-bold">
              {isLogin ? 'Login' : 'Register'}
            </h2>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="form-control"
              />
            </div>
            {!isLogin && (
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="form-control"
                />
              </div>
            )}
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="form-control"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn btn-primary w-100 mb-3"
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </button>
            <p className="text-center mb-0">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="btn btn-link p-0 text-decoration-none"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};
 // Add this import at the top
// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('upload');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser(username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    setUploadedVideo(null);
    setProcessedVideo(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedVideo(file);
    setProcessedVideo(null);
  };

  const processVideo = async () => {
    if (!uploadedVideo) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('video', uploadedVideo);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/convert/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setProcessedVideo(url);
      } else {
        alert('Video processing failed. Please try again.');
      }
    } catch (error) {
      alert('Error processing video. Please check your connection.');
    }
    setIsProcessing(false);
  };

  const downloadVideo = () => {
  if (processedVideo) {
    const a = document.createElement("a");
    a.href = processedVideo;
    a.download = `vr180_${uploadedVideo.name}`;
    a.click();
  }
};


  if (!user) {
    return (
      <>
        <LoginForm onLogin={setUser} />
        <FeedbackWidget />
      </>
    );
  }

  return (
     
     
      
    <div className="min-vh-100 bg-light">
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <span className="navbar-brand mb-0 h1 fw-bold">VR 180 Converter</span>
            <ul className="navbar-nav ms-4">
              <li className="nav-item">
                <button
                  onClick={() => setActiveSection('about')}
                  className={`nav-link btn btn-link ${activeSection === 'about' ? 'active' : ''}`}
                >
                  About
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => setActiveSection('upload')}
                  className={`nav-link btn btn-link ${activeSection === 'upload' ? 'active' : ''}`}
                >
                  Convert
                </button>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-3 d-flex align-items-center text-muted">
              <User size={16} className="me-1" />
              {user}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm d-flex align-items-center"
            >
              <LogOut size={16} className="me-1" />
              Logout
            </button>
          </div>
        </div>
        
      </nav>
     
  <FeedbackHeader />
      <main className="container py-4">
        {activeSection === 'about' && (
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="display-6 fw-bold mb-4">About VR 180 Converter</h2>
              <p className="lead text-muted mb-4">
                Transform your regular 2D videos into VR 180 using MiDAS smaller 
                Our platform leverages advanced algorithms to convert standard videos into VR-ready content with
                proper VR180 metadata.
              </p>
              
              <h4 className="fw-bold mb-3">Features:</h4>
              <ul className="list-unstyled">
                <li className="mb-2">• AI-powered 2D to VR 180 conversion</li>
                <li className="mb-2">• FFmpeg VR180 metadata integration</li>
                <li className="mb-2">• High-quality video processing</li>
                <li className="mb-2">• Secure user authentication</li>
                <li className="mb-2">• Fast and reliable conversion</li>
              </ul>
              
              <h4 className="fw-bold mb-3 mt-4">How it works:</h4>
              <p className="text-muted">
                Simply upload your 2D video, and our AI will analyze and convert it into a VR 180 format.
                The converted video will include all necessary metadata for compatibility with VR headsets
                and 360-degree video players.
              </p>
            </div>
          </div>
          
        )}

        {activeSection === 'upload' && (
          <div className="row">
            <div className="col-12">
              {/* Upload Section */}
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <h2 className="card-title fw-bold mb-4">Convert Your Video</h2>
                  
                  {!uploadedVideo ? (
                    <div className="border border-2 border-dashed rounded p-5 text-center bg-light">
                      <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="d-none"
                      />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer d-flex flex-column align-items-center"
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="bg-primary bg-opacity-10 rounded-circle p-4 mb-3">
                          <Upload size={48} className="text-primary" />
                        </div>
                        <h5 className="fw-bold">Upload your 2D video</h5>
                        <p className="text-muted">Click here or drag and drop your video file</p>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-light rounded p-4 mb-4">
                        <h5 className="fw-bold mb-3">Uploaded Video</h5>
                        <div className="d-flex align-items-center">
                          <Play size={24} className="text-primary me-3" />
                          <div>
                            <h6 className="fw-bold mb-1">{uploadedVideo.name}</h6>
                            <small className="text-muted">
                              {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-3">
                        <button
                          onClick={processVideo}
                          disabled={isProcessing}
                          className="btn btn-primary"
                        >
                          {isProcessing ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Processing...
                            </>
                          ) : (
                            'Convert to VR 180'
                          )}
                        </button>
                        
                        <button
                          onClick={() => {
                            setUploadedVideo(null);
                            setProcessedVideo(null);
                          }}
                          className="btn btn-outline-secondary"
                        >
                          Upload New Video
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview and Download Section */}
              {/* Preview and Download Section */}
              
{processedVideo && (
  <div className="card shadow-sm">
    <div className="card-body p-4">
      <h4 className="card-title fw-bold mb-4">VR 180 Conversion Complete!</h4>
      <div className="alert alert-success" role="alert">
        <strong>✓ Success!</strong> Your video has been successfully converted to VR 180 format
      </div>
      
      <div className="mb-4">
        <VR180Preview 
          videoSrc={processedVideo} 
          width={800} 
          height={400} 
        />
      </div>
      
      <div className="d-flex gap-2">
        <button 
          className="btn btn-primary" 
          onClick={downloadVideo}
        >
          Download VR 180 Video
        </button>
        
        <button 
          className="btn btn-outline-secondary"
          onClick={() => setProcessedVideo(null)}
        >
          Convert Another Video
        </button>
      </div>
    </div>
  </div>
)}
{/* {processedVideo && (
  
  <div className="card shadow-sm">
    <div className="card-body p-4">
      <h4 className="card-title fw-bold mb-4">VR 180 Conversion Complete!</h4>
      <div className="alert alert-success" role="alert">
        <strong>✓ Success!</strong> Your video has been successfully converted to VR 180 format 
      </div>

       
     <video src={processedVideo} controls autoPlay style={{ width: "100%" }} />

    <button onClick={downloadVideo}>
      Download VR 180 Video
    </button>
    </div>
  </div>
        )} */}
            </div>
          </div>
          
        )}
      </main>

      <FeedbackWidget />

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default App;