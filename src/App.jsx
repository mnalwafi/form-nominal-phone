import { useState } from 'react'
import './App.css'

export default function App() {
  const [data, setData] = useState({ nominal: '', phone: '' })
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading] = useState(false)

  // ponytail: browser Geolocation API; add reverse geocoding API when address text needed
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    if (!navigator.geolocation) {
      setSubmitted({ ...data, location: 'Geolocation not supported by browser' })
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSubmitted({
          ...data,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: `${Math.round(pos.coords.accuracy)}m`,
          },
        })
        setLoading(false)
      },
      (err) => {
        setSubmitted({ ...data, location: `Permission denied / error: ${err.message}` })
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
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
          <p>Submitted:</p>
          <p>Nominal: <strong>Rp {Number(submitted.nominal).toLocaleString('id-ID')}</strong></p>
          <p>Phone: <strong>{submitted.phone}</strong></p>
          <p>
            Location:{' '}
            <strong>
              {typeof submitted.location === 'object'
                ? `${submitted.location.lat}, ${submitted.location.lng} (±${submitted.location.accuracy})`
                : submitted.location}
            </strong>
          </p>
        </div>
      )}
    </main>
  )
}
