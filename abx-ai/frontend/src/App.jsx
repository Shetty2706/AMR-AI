import { useState } from 'react'
import InputForm from './components/InputForm'
import RecommendationPanel from './components/RecommendationPanel'
import AMSAlerts from './components/AMSAlerts'
import Navbar from './components/Navbar'
import { ams, predict } from './api'

export default function App() {
  const [recommendation, setRecommendation] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (payload) => {
    setLoading(true)
    setError('')
    try {
      const [predictionData, amsData] = await Promise.all([predict(payload), ams(payload)])
      setRecommendation(predictionData)
      setAlerts(amsData.alerts)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to fetch recommendation. Check backend service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-6 lg:grid-cols-2">
        <section className="rounded-lg bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Patient Input</h2>
          <InputForm onSubmit={handleSubmit} loading={loading} />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </section>

        <RecommendationPanel recommendation={recommendation} />
        <AMSAlerts alerts={alerts} />
      </main>
    </div>
  )
}
