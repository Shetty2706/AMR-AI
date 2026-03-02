import { useState } from 'react'

const defaultForm = {
  age: 65,
  weight: 70,
  infection_site: 'UTI',
  temp: 37.5,
  hr: 92,
  bp: '120/70',
  wbc: 14,
  creatinine: 1.3,
  prior_antibiotics: false,
  comorbidities: '',
  unit: 'Ward'
}

export default function InputForm({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultForm)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const submit = (event) => {
    event.preventDefault()
    const payload = {
      age: Number(form.age),
      weight: Number(form.weight),
      infection_site: form.infection_site,
      wbc: Number(form.wbc),
      creatinine: Number(form.creatinine),
      unit: form.unit,
      prior_antibiotics: Boolean(form.prior_antibiotics),
      comorbidities: form.comorbidities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      {['age', 'weight', 'wbc', 'creatinine', 'temp', 'hr'].map((field) => (
        <label key={field} className="text-sm text-slate-700">
          <span className="mb-1 block font-medium capitalize">{field}</span>
          <input
            type="number"
            step="any"
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            required
          />
        </label>
      ))}

      <label className="text-sm text-slate-700">
        <span className="mb-1 block font-medium">Blood Pressure</span>
        <input
          type="text"
          name="bp"
          value={form.bp}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          placeholder="120/70"
        />
      </label>

      <label className="text-sm text-slate-700">
        <span className="mb-1 block font-medium">Infection Site</span>
        <select
          name="infection_site"
          value={form.infection_site}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          {['UTI', 'CAP', 'HAP', 'SSTI', 'Sepsis'].map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-slate-700">
        <span className="mb-1 block font-medium">Hospital Unit</span>
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option>ICU</option>
          <option>Ward</option>
        </select>
      </label>

      <label className="sm:col-span-2 text-sm text-slate-700">
        <span className="mb-1 block font-medium">Comorbidities (comma-separated)</span>
        <textarea
          name="comorbidities"
          value={form.comorbidities}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          rows={2}
          placeholder="Diabetes, CKD"
        />
      </label>

      <label className="sm:col-span-2 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="prior_antibiotics"
          checked={form.prior_antibiotics}
          onChange={handleChange}
          className="h-4 w-4"
        />
        Prior antibiotics in the last 90 days
      </label>

      <button
        type="submit"
        disabled={loading}
        className="sm:col-span-2 rounded-md bg-clinical-500 px-4 py-2 font-semibold text-white hover:bg-clinical-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Get Recommendation'}
      </button>
    </form>
  )
}
