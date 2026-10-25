import { useState } from 'react'
import './App.css'

export default function App() {
  const [data, setData] = useState({ nominal: '', phone: '' })
  const [submitted, setSubmitted] = useState(null)

  // ponytail: state lokal & alert/render; tambah fetch() POST API saat backend siap
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(data)
  }

  return (
    <main className="container">
      <h1>Form Pembayaran</h1>
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
          Nomor Telepon
          <input
            type="tel"
            required
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="081234567890"
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <div className="result" role="status">
          <p>Terkirim:</p>
          <p>Nominal: <strong>Rp {Number(submitted.nominal).toLocaleString('id-ID')}</strong></p>
          <p>Telepon: <strong>{submitted.phone}</strong></p>
        </div>
      )}
    </main>
  )
}
