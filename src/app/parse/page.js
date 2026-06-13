'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkPaymentStatus, parsePolicy } from '@/lib/api';

function ParsePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('checking');
  const [parseRequest, setParseRequest] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [pageUrl, setPageUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (!ref) { router.push('/'); return; }
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
    checkStatus(ref);
  }, []);

  const checkStatus = async (ref) => {
    try {
      const res = await checkPaymentStatus(ref);
      const data = res.data;
      if (data.status === 'PAID') {
        setParseRequest(data);
        setStatus('ready');
      } else if (data.status === 'PARSED') {
        setStatus('already_parsed');
      } else if (data.status === 'PENDING') {
        if (attempts < 10) {
          setAttempts(prev => prev + 1);
          setTimeout(() => checkStatus(ref), 3000);
        } else {
          setStatus('payment_pending');
        }
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // clipboard not available — ignore silently
    }
  };

  const handleUpload = async (file) => {
    if (!file || !parseRequest) return;
    setParsing(true);
    setError('');
    const formData = new FormData();
    formData.append('policy', file);
    formData.append('parseRequestId', parseRequest.parseRequestId);
    formData.append('shieldType', parseRequest.shieldType);
    try {
      const res = await parsePolicy(formData);
      localStorage.setItem('ikmr_result', JSON.stringify(res.data));
      router.push('/crisis-screen');
    } catch (err) {
      setError(err.response?.data?.message || 'Parsing failed. Please try a clearer image or PDF.');
      setParsing(false);
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Confirming Payment</h2>
          <p className="text-sm text-gray-500">Please wait...</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-[#1a1a2e] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#1a1a2e] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#1a1a2e] rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'payment_pending') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Not Confirmed Yet</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your payment may still be processing. Please check your email for a confirmation link.
            If you have not paid yet, please go back and complete payment.
          </p>
          {pageUrl && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-gray-500 mb-2">Save this link — you can come back to it anytime:</p>
              <p className="text-xs text-[#1a1a2e] break-all font-mono mb-2">{pageUrl}</p>
              <button onClick={handleCopyLink}
                className="text-xs font-semibold text-[#1a1a2e] underline">
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}
          <button onClick={() => router.push('/')}
            className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-semibold text-sm">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'already_parsed') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Already Parsed</h2>
          <p className="text-sm text-gray-500 mb-6">
            This policy has already been parsed. If you saved your results, check your device.
            To parse another policy, please make a new payment.
          </p>
          <button onClick={() => router.push('/')}
            className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-semibold text-sm">
            Parse Another Policy
          </button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
          <p className="text-sm text-gray-500 mb-6">
            Please contact hello@awas.asia with your payment reference.
          </p>
          <button onClick={() => router.push('/')}
            className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-semibold text-sm">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-[#1a1a2e] p-6 text-center">
        <div className="text-3xl font-bold text-white tracking-wide">IKMR</div>
        <div className="text-sm text-gray-300 mt-1">
          {parseRequest?.shieldType === 'MOTOR' ? '🚗 Motor Rights Audit' : '🏥 Medical Rights Audit'}
        </div>
      </div>

      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="text-sm font-bold text-green-700">✅ Payment Confirmed</div>
          <div className="text-xs text-green-600 mt-1">You are ready to upload your policy for analysis.</div>
        </div>

        {pageUrl && !parsing && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-amber-800 mb-1">📌 Not ready to upload now?</p>
            <p className="text-xs text-amber-700 mb-2">
              Save this link — you can come back anytime to upload your policy:
            </p>
            <p className="text-xs text-[#1a1a2e] break-all font-mono mb-2">{pageUrl}</p>
            <button onClick={handleCopyLink}
              className="text-xs font-semibold text-[#1a1a2e] underline">
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900 mb-2">Upload Your Policy Schedule</h2>
        <p className="text-sm text-gray-500 mb-6">
          Upload a PDF or take a clear photo of your policy schedule.
          Our AI will decode your rights in about 30 seconds.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {parsing ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Analyzing Your Policy</h3>
            <p className="text-sm text-gray-500 mb-4">Extracting your rights and identifying key clauses...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#1a1a2e] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#1a1a2e] rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-[#1a1a2e] rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-xs text-gray-400 mt-6">Please wait. Do not close this page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block w-full border-2 border-dashed border-[#1a1a2e] rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50">
              <div className="text-4xl mb-3">📄</div>
              <div className="text-sm font-bold text-[#1a1a2e] mb-1">Tap to Upload Policy</div>
              <div className="text-xs text-gray-400">PDF, JPG or PNG — Max 10MB</div>
              <input type="file" accept=".pdf,image/*" className="hidden"
                onChange={(e) => { if (e.target.files[0]) { handleUpload(e.target.files[0]); } }} />
            </label>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700 font-medium mb-1">📋 Tips for best results:</p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Use the policy SCHEDULE page — not the full booklet</li>
                <li>• Ensure text is clear and not blurry</li>
                <li>• PDF gives best accuracy</li>
                <li>• Photos taken in good lighting work well</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        © 2026 AWAS Premium Resources. All rights reserved.
      </div>
    </div>
  );
}

export default function ParsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    }>
      <ParsePageContent />
    </Suspense>
  );
}