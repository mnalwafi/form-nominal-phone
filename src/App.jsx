import { useState } from 'react'
import './App.css'

export default function App() {
  const [data, setData] = useState({ nominal: '', phone: '' })
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading] = useState(false)

  // ponytail: browser Geolocation & Intl API; add IP geolocation fallback service when user denies GPS
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    const demographic = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.userAgentData?.platform || navigator.platform,
    }

    const finalize = (coords = null) => {
      setSubmitted({
        ...data,
        demographic: {
          ...demographic,
          coordinates: coords,
        },
      })
      setLoading(false)
    }

    if (!navigator.geolocation) {
      finalize('unsupported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        finalize({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: `${Math.round(pos.coords.accuracy)}m`,
        })
      },
      (err) => {
        finalize(`denied: ${err.message}`)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <main className="container">
      <h1>Payment Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nominal (Rp)
          <input
            type="number"
            min="1"
            required
            value={data.nominal}
            onChange={(e) => setData({ ...data, nominal: e.target.value })}
            placeholder="100000"
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            required
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="081234567890"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {submitted && (
        <div className="result" role="status">
          <p>Submitted Data:</p>
          <p>Nominal: <strong>Rp {Number(submitted.nominal).toLocaleString('id-ID')}</strong></p>
          <p>Phone: <strong>{submitted.phone}</strong></p>
          <p>Timezone: <strong>{submitted.demographic.timezone}</strong></p>
          <p>Language: <strong>{submitted.demographic.language}</strong></p>
          <p>
            Location:{' '}
            <strong>
              {typeof submitted.demographic.coordinates === 'object' && submitted.demographic.coordinates !== null
                ? `${submitted.demographic.coordinates.lat}, ${submitted.demographic.coordinates.lng} (±${submitted.demographic.coordinates.accuracy})`
                : submitted.demographic.coordinates}
            </strong>
          </p>
        </div>
      )}
    </main>
  )
}
