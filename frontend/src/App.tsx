import { Routes, Route } from 'react-router-dom'
import { Navbar1 } from "./components/navbar1"
import JobPosting from "./pages/jobs/JobPosting"

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar1 />
      <div className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<JobPosting />} />
          <Route path="/jobs" element={<JobPosting />} />
        </Routes>
      </div>
    </div>
  )
}