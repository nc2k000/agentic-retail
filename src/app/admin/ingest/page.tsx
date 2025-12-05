'use client'

/**
 * Admin: Purchase History Ingestion
 *
 * Upload CSV files containing past purchase history to bootstrap personalization.
 */

import { useState } from 'react'
import Link from 'next/link'

interface IngestionResult {
  success: boolean
  orders_created: number
  preferences_created: number
  items_processed: number
  error?: string
}

export default function IngestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IngestionResult | null>(null)

  async function handleUpload() {
    if (!file) return

    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/ingest-purchases', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        console.log('✅ Purchase history ingested successfully!')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setResult({
        success: false,
        orders_created: 0,
        preferences_created: 0,
        items_processed: 0,
        error: 'Upload failed. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/chat"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Chat
          </Link>
          <h1 className="text-3xl font-bold mb-2">Import Purchase History</h1>
          <p className="text-slate-600">
            Upload a CSV file containing past purchases to bootstrap the personalization system.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select CSV file
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-blue-700 transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Upload & Process'
            )}
          </button>
        </div>

        {result && (
          <div
            className={`rounded-xl p-6 border ${
              result.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            {result.success ? (
              <>
                <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Success!
                </h2>
                <div className="space-y-2 text-green-800">
                  <p className="flex items-center">
                    <span className="font-medium w-48">Items processed:</span>
                    <span className="font-bold">{result.items_processed}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-48">Orders created:</span>
                    <span className="font-bold">{result.orders_created}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-48">Preferences generated:</span>
                    <span className="font-bold">{result.preferences_created}</span>
                  </p>
                </div>
                <p className="mt-4 text-sm text-green-700">
                  The personalization system has been updated with your purchase history.
                  Your maturity level and recommendations will now be more accurate.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
                <p className="text-red-700">{result.error}</p>
              </>
            )}
          </div>
        )}

        <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-lg mb-4">CSV Format</h3>
          <p className="text-sm text-slate-600 mb-4">
            Your CSV file should contain the following columns:
          </p>
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-slate-100">
              {`order_id,order_date,item_sku,item_name,category,brand,price,quantity
ORD001,2024-06-01,milk-2p,2% Milk,Dairy,Great Value,3.48,1
ORD001,2024-06-01,banana,Bananas,Produce,,1.99,1
ORD002,2024-06-08,milk-2p,2% Milk,Dairy,Great Value,3.48,1
ORD002,2024-06-08,eggs-org,Organic Eggs,Dairy,Happy Egg Co,5.99,1`}
            </pre>
          </div>
          <div className="mt-4 text-sm text-slate-600 space-y-2">
            <p>
              <strong>Required columns:</strong> order_id, order_date, item_sku, item_name, category, price, quantity
            </p>
            <p>
              <strong>Optional columns:</strong> brand
            </p>
            <p>
              <strong>Date format:</strong> YYYY-MM-DD (e.g., 2024-06-01)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
