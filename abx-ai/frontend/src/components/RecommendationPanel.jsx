export default function RecommendationPanel({ recommendation }) {
  if (!recommendation) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-slate-500">
        Submit patient data to view recommendation.
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-800">Treatment Recommendation</h2>
      <div className="grid gap-2 text-sm text-slate-700">
        <p><strong>Drug:</strong> {recommendation.recommended_drug}</p>
        <p><strong>Dose:</strong> {recommendation.dose}</p>
        <p><strong>Frequency:</strong> {recommendation.frequency}</p>
        <p><strong>Duration:</strong> {recommendation.duration}</p>
        <p><strong>ESBL probability:</strong> {(recommendation.esbl_probability * 100).toFixed(0)}%</p>
        <p><strong>MRSA probability:</strong> {(recommendation.mrsa_probability * 100).toFixed(0)}%</p>
        <p><strong>Explanation:</strong> {recommendation.explanation}</p>
      </div>
    </div>
  )
}
