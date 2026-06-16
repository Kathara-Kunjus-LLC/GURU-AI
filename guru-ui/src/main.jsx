import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import NotePage from './pages/NotePage'
import IngestPage from './pages/IngestPage'
import QueuePage from './pages/QueuePage'
import JobDetailPage from './pages/JobDetailPage'
import ReviewPage from './pages/ReviewPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/note/:title" element={<NotePage />} />
        <Route path="/domain/:parentDomain" element={<App />} />
        <Route path="/ingest" element={<IngestPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/queue/:jobId" element={<JobDetailPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
