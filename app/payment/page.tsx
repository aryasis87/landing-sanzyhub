'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// ============================================================
// CONFIG - Ganti sesuai environment B.com
// ============================================================
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
const MIDTRANS_SNAP_URL = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js'

// A.com base URL - untuk redirect balik setelah bayar
const A_COM_URL = process.env.NEXT_PUBLIC_A_COM_URL || 'https://A.com'

// ============================================================
// TYPES
// ============================================================
type PageStatus =
  | 'loading'       // Sedang load script Midtrans
  | 'opening'       // Script siap, sedang buka popup
  | 'waiting'       // Popup terbuka, menunggu user
  | 'success'       // Bayar berhasil
  | 'pending'       // Bayar pending (transfer bank, dll)
  | 'error'         // Error
  | 'closed'        // User tutup popup tanpa bayar
  | 'invalid'       // Token tidak ada / URL invalid

// ============================================================
// MAIN COMPONENT
// ============================================================
function PaymentContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<PageStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const order = searchParams.get('orderId')

    // Validasi URL params
    if (!token || !order) {
      setStatus('invalid')
      setErrorMessage('Token atau Order ID tidak ditemukan.')
      return
    }

    setOrderId(order)

    // Load Midtrans Snap script
    const existingScript = document.getElementById('midtrans-snap')
    if (existingScript) {
      // Script sudah ada, langsung buka
      openSnap(token, order)
      return
    }

    const script = document.createElement('script')
    script.id = 'midtrans-snap'
    script.src = MIDTRANS_SNAP_URL
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY)

    script.onload = () => {
      setStatus('opening')
      openSnap(token, order)
    }

    script.onerror = () => {
      setStatus('error')
      setErrorMessage('Gagal memuat halaman pembayaran. Periksa koneksi internet Anda.')
    }

    document.body.appendChild(script)
  }, [searchParams])

  const openSnap = (token: string, order: string) => {
    if (typeof window === 'undefined' || !(window as any).snap) {
      setStatus('error')
      setErrorMessage('Midtrans Snap tidak berhasil dimuat.')
      return
    }

    setStatus('waiting')

    ;(window as any).snap.pay(token, {
      onSuccess: (result: any) => {
        console.log('✅ Payment success:', result)
        setStatus('success')
        // ✅ Redirect ke A.com deposit page dengan status params
        setTimeout(() => {
          window.location.href = `${A_COM_URL}/deposit?status=success&orderId=${order}`
        }, 1500)
      },

      onPending: (result: any) => {
        console.log('⏳ Payment pending:', result)
        setStatus('pending')
        // ✅ Pending = tetap perlu verifikasi di A.com
        setTimeout(() => {
          window.location.href = `${A_COM_URL}/deposit?status=pending&orderId=${order}`
        }, 1500)
      },

      onError: (result: any) => {
        console.error('❌ Payment error:', result)
        setStatus('error')
        setErrorMessage('Pembayaran gagal. Silakan coba lagi.')
        // ✅ Redirect balik ke A.com dengan status error
        setTimeout(() => {
          window.location.href = `${A_COM_URL}/deposit?status=error&orderId=${order}`
        }, 2500)
      },

      onClose: () => {
        console.log('🚪 Snap popup closed by user')
        setStatus('closed')
        // ✅ User tutup popup - kembali ke A.com
        setTimeout(() => {
          window.location.href = `${A_COM_URL}/deposit?status=closed&orderId=${order}`
        }, 1500)
      },
    })
  }

  const handleBackToDeposit = () => {
    window.location.href = `${A_COM_URL}/deposit`
  }

  const handleRetry = () => {
    window.location.href = `${A_COM_URL}/deposit`
  }

  // ============================================================
  // RENDER STATES
  // ============================================================
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo / Branding */}
        <div style={styles.logo}>
          <div style={styles.logoCircle}>💳</div>
          <span style={styles.logoText}>Stouch Pay</span>
        </div>

        {/* Loading */}
        {(status === 'loading' || status === 'opening') && (
          <StatusView
            icon={<Spinner />}
            title="Mempersiapkan Pembayaran"
            subtitle="Mohon tunggu, kami sedang membuka halaman pembayaran..."
            color="#60a5fa"
          />
        )}

        {/* Waiting - popup terbuka */}
        {status === 'waiting' && (
          <StatusView
            icon="⏳"
            title="Selesaikan Pembayaran"
            subtitle="Popup pembayaran sudah terbuka. Silakan selesaikan transaksi Anda di sana."
            color="#facc15"
            extra={
              <p style={styles.hint}>
                Jika popup tidak muncul, pastikan browser Anda mengizinkan popup dari halaman ini.
              </p>
            }
          />
        )}

        {/* Success */}
        {status === 'success' && (
          <StatusView
            icon="✅"
            title="Pembayaran Berhasil!"
            subtitle="Transaksi Anda berhasil. Saldo akan segera dikreditkan."
            color="#4ade80"
            extra={
              <p style={styles.hint}>Mengalihkan ke halaman konfirmasi...</p>
            }
          />
        )}

        {/* Pending */}
        {status === 'pending' && (
          <StatusView
            icon="⏰"
            title="Menunggu Konfirmasi"
            subtitle="Pembayaran Anda sedang diproses. Kami akan mengonfirmasi dalam beberapa saat."
            color="#fb923c"
            extra={
              <p style={styles.hint}>Mengalihkan ke halaman status...</p>
            }
          />
        )}

        {/* Closed - user tutup popup */}
        {status === 'closed' && (
          <StatusView
            icon="🚪"
            title="Pembayaran Dibatalkan"
            subtitle="Anda menutup halaman pembayaran sebelum menyelesaikan transaksi."
            color="#94a3b8"
            extra={
              <button onClick={handleBackToDeposit} style={styles.button}>
                Kembali ke Deposit
              </button>
            }
          />
        )}

        {/* Error */}
        {status === 'error' && (
          <StatusView
            icon="❌"
            title="Terjadi Kesalahan"
            subtitle={errorMessage || 'Pembayaran gagal. Silakan coba lagi.'}
            color="#f87171"
            extra={
              <button onClick={handleRetry} style={styles.button}>
                Coba Lagi
              </button>
            }
          />
        )}

        {/* Invalid URL */}
        {status === 'invalid' && (
          <StatusView
            icon="⚠️"
            title="Halaman Tidak Valid"
            subtitle={errorMessage || 'Parameter pembayaran tidak lengkap.'}
            color="#fbbf24"
            extra={
              <button onClick={handleBackToDeposit} style={styles.button}>
                Kembali ke Deposit
              </button>
            }
          />
        )}

        {/* Order ID info */}
        {orderId && status !== 'invalid' && (
          <p style={styles.orderId}>Order ID: {orderId}</p>
        )}
      </div>
    </div>
  )
}

// ============================================================
// STATUS VIEW COMPONENT
// ============================================================
function StatusView({
  icon,
  title,
  subtitle,
  color,
  extra,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  color: string
  extra?: React.ReactNode
}) {
  return (
    <div style={styles.statusContainer}>
      <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>
        {icon}
      </div>
      <h2 style={{ ...styles.statusTitle, color }}>{title}</h2>
      <p style={styles.statusSubtitle}>{subtitle}</p>
      {extra}
    </div>
  )
}

// ============================================================
// SPINNER COMPONENT
// ============================================================
function Spinner() {
  return (
    <div style={{
      width: 56,
      height: 56,
      border: '4px solid #1e293b',
      borderTop: '4px solid #60a5fa',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      margin: '0 auto',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ============================================================
// STYLES
// ============================================================
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f1419 0%, #1e293b 100%)',
    padding: '20px',
  },
  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '40px',
  },
  logoCircle: {
    fontSize: 28,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#f1f5f9',
    letterSpacing: '-0.5px',
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: '8px 0 4px',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    margin: '0 0 16px',
    lineHeight: 1.6,
  },
  hint: {
    fontSize: 12,
    color: '#64748b',
    margin: '8px 0 0',
    lineHeight: 1.5,
    padding: '10px 16px',
    background: '#0f172a',
    borderRadius: '10px',
    width: '100%',
  },
  button: {
    marginTop: '16px',
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    transition: 'opacity 0.2s',
  },
  orderId: {
    marginTop: '32px',
    fontSize: '11px',
    color: '#475569',
    borderTop: '1px solid #334155',
    paddingTop: '16px',
  },
}

// ============================================================
// PAGE EXPORT (wrapped in Suspense untuk useSearchParams)
// ============================================================
export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f1419',
        color: '#94a3b8',
        fontSize: 14,
      }}>
        Memuat...
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}