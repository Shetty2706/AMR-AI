export default function AMSAlerts({ alerts }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-800">AMS Alerts</h2>
      <div className="flex flex-wrap gap-2">
        {(alerts?.length ? alerts : ['No alerts yet.']).map((alert, idx) => (
          <span
            key={`${alert}-${idx}`}
            className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
          >
            {alert}
          </span>
        ))}
      </div>
    </div>
  )
}
