'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrisisScreenPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('ikmr_result');
    if (!stored) { router.push('/'); return; }
    try { setResult(JSON.parse(stored)); }
    catch { setError('Failed to load results. Please parse your policy again.'); }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Results Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button onClick={() => router.push('/')} className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-semibold text-sm">Start Again</button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const { shieldType, extractedData, rightsBrief, insurerInfo, maturityStatus, daysToMaturity } = result;
  const isMotor = shieldType === 'MOTOR';

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-[#1a1a2e] text-white px-4 py-4">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div>
            <div className="text-lg font-bold">IKMR</div>
            <div className="text-xs text-gray-400">{isMotor ? '🚗 Motor Rights Audit' : '🏥 Medical Rights Audit'}</div>
          </div>
          <button onClick={() => { localStorage.removeItem('ikmr_result'); router.push('/'); }}
            className="text-xs text-gray-300 border border-gray-600 px-3 py-1 rounded-lg">
            New Audit
          </button>
        </div>
      </div>

      <div className="px-4 py-4 max-w-md mx-auto space-y-4">

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 text-center">
          <p className="text-xs font-bold text-yellow-800">📸 SCREENSHOT THIS PAGE NOW</p>
          <p className="text-xs text-yellow-700 mt-1">Save to your phone. This is your emergency rights reference. Results are not stored on our servers.</p>
        </div>

        <div className="bg-[#1a1a2e] text-white rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">AWAS — {isMotor ? 'ROADSIDE PROTECTION SHIELD' : 'OFFICIAL POLICY RIGHTS HOLDER'}</div>
          <div className="text-base font-bold">{extractedData?.insurer_name || 'Your Insurer'} | VERIFIED CONTRACT</div>
          <div className="text-xs text-gray-300 mt-1">Policy: {extractedData?.policy_number || 'N/A'}</div>
          {isMotor && <div className="text-xs text-gray-300">Vehicle: {extractedData?.vehicle_number || 'N/A'}</div>}
          {!isMotor && <div className="text-xs text-gray-300">Holder: {extractedData?.policy_holder || 'N/A'}</div>}
          <div className="text-xs text-gray-300">Valid until: {extractedData?.policy_end_date || 'N/A'}</div>
        </div>

        {isMotor && (
          <>
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a2e] border-b border-gray-100 pb-2">💰 YOUR VEHICLE VALUE</h3>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">Valuation Type</span>
                <span className={`text-xs font-bold ${extractedData?.valuation_type?.includes('AGREED') ? 'text-green-600' : 'text-orange-600'}`}>{extractedData?.valuation_type || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">Sum Insured</span>
                <span className="text-xs font-bold text-[#1a1a2e]">{extractedData?.sum_insured || 'N/A'}</span>
              </div>
              {rightsBrief?.valuation_rights && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2"><p className="text-xs text-blue-800">{rightsBrief.valuation_rights}</p></div>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a2e] border-b border-gray-100 pb-2">🏆 NCD PROTECTION</h3>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">NCD Status</span>
                <span className="text-xs font-bold text-green-600">{extractedData?.ncd_percentage || 'N/A'} ACTIVE</span>
              </div>
              {rightsBrief?.ncd_rights && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2"><p className="text-xs text-blue-800">{rightsBrief.ncd_rights}</p></div>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a2e] border-b border-gray-100 pb-2">🚛 TOWING RIGHTS</h3>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">Towing Benefit</span>
                <span className="text-xs font-bold text-green-600">{extractedData?.towing_benefit || 'N/A'}</span>
              </div>
              {rightsBrief?.towing_rights && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2"><p className="text-xs text-blue-800">{rightsBrief.towing_rights}</p></div>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a2e] border-b border-gray-100 pb-2">🔧 WINDSCREEN RIGHTS</h3>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">Coverage</span>
                <span className={`text-xs font-bold ${extractedData?.windscreen_covered ? 'text-green-600' : 'text-red-500'}`}>
                  {extractedData?.windscreen_covered ? `COVERED — ${extractedData?.windscreen_limit || 'Check policy'}` : 'NOT COVERED'}
                </span>
              </div>
              {rightsBrief?.windscreen_rights && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2"><p className="text-xs text-blue-800">{rightsBrief.windscreen_rights}</p></div>}
            </div>
          </>
        )}

        {!isMotor && (
          <>
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a2e] border-b border-gray-100 pb-2">🛏️ WARD ENTITLEMENT</h3>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">Room & Board</span>
                <span className="text-xs font-bold text-green-600">{extractedData?.room_and_board_limit || 'N/A'} / DAY</span>
              </div>
              {rightsBrief?.ward_entitlement && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2"><p className="text-xs text-blue-800">{rightsBrief.ward_entitlement}</p></div>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a2e] border-b border-gray-100 pb-2">💰 ANNUAL LIMIT</h3>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">Annual Limit</span>
                <span className="text-xs font-bold text-[#1a1a2e]">{extractedData?.annual_limit || 'N/A'}</span>
              </div>
              {rightsBrief?.annual_limit_rights && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2"><p className="text-xs text-blue-800">{rightsBrief.annual_limit_rights}</p></div>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a2e] border-b border-gray-100 pb-2">🛑 CO-PAYMENT STATUS</h3>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">Co-Payment</span>
                <span className={`text-xs font-bold ${!extractedData?.co_payment ? 'text-green-600' : 'text-orange-600'}`}>
                  {extractedData?.co_payment ? `YES — ${extractedData?.co_payment_percentage || 'Check policy'}` : 'NO CO-PAYMENT (CASHLESS)'}
                </span>
              </div>
              {rightsBrief?.copayment_rights && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2"><p className="text-xs text-blue-800">{rightsBrief.copayment_rights}</p></div>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a2e] border-b border-gray-100 pb-2">⏳ POLICY MATURITY</h3>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500">Status</span>
                <span className={`text-xs font-bold ${maturityStatus === 'MATURED' ? 'text-green-600' : 'text-orange-600'}`}>
                  {maturityStatus === 'MATURED' ? 'FULLY MATURED ✅' : daysToMaturity ? `IN WAITING — ${daysToMaturity} DAYS LEFT` : 'N/A'}
                </span>
              </div>
              {rightsBrief?.maturity_rights && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2"><p className="text-xs text-blue-800">{rightsBrief.maturity_rights}</p></div>}
            </div>
          </>
        )}

        {rightsBrief?.hidden_clause_warnings && rightsBrief.hidden_clause_warnings !== 'NONE DETECTED' && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <h3 className="text-sm font-bold text-red-700 mb-2">⚠️ IMPORTANT WARNINGS</h3>
            <p className="text-xs text-red-700">{rightsBrief.hidden_clause_warnings}</p>
          </div>
        )}

        {rightsBrief?.hidden_clause_warnings === 'NONE DETECTED' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs text-green-700 font-medium">✅ No hidden clause warnings detected in your policy.</p>
          </div>
        )}

        {rightsBrief?.emergency_action && (
          <div className="bg-white border-2 border-[#1a1a2e] rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#1a1a2e] mb-2">🚨 EMERGENCY ACTION PLAN</h3>
            <p className="text-xs text-gray-700 whitespace-pre-line">{rightsBrief.emergency_action}</p>
          </div>
        )}

        {insurerInfo?.hotline && (
          <a href={"tel:" + insurerInfo.hotline}
            className="block w-full bg-[#1a1a2e] text-white text-center py-3 rounded-xl text-sm font-bold">
            📞 Call {insurerInfo.name} — {insurerInfo.hotline}
          </a>
        )}

        {insurerInfo?.panelUrl && (
          <a href={insurerInfo.panelUrl} target="_blank" rel="noopener noreferrer"
            className="block w-full border border-[#1a1a2e] text-[#1a1a2e] text-center py-3 rounded-xl text-sm font-bold">
            {isMotor ? '🔧 Find Panel Workshop' : '🏥 Find Panel Hospital'}
          </a>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 text-center">
            ⚖️ This audit is decoded directly from your binding Policy Schedule Contract.
            Show this screen to hospital admission staff or at roadside to assert your legal entitlements.
          </p>
        </div>

        <div className="bg-[#1a1a2e] rounded-xl p-4 text-center">
          <div className="text-white text-sm font-bold mb-1">⚡ ACCIDENT HAPPENED?</div>
          <div className="text-gray-300 text-xs mb-3">Launch AWAS Post-Accident Claims Automation</div>
          <a href="https://awas.asia" className="block bg-white text-[#1a1a2e] py-3 rounded-lg text-sm font-bold">
            Launch AWAS Core →
          </a>
        </div>

        <button onClick={() => { localStorage.removeItem('ikmr_result'); router.push('/'); }}
          className="w-full border border-gray-300 text-gray-500 py-3 rounded-xl text-sm">
          Parse Another Policy
        </button>

        <div className="text-center py-4 text-xs text-gray-400">
          © 2026 AWAS Premium Resources. All rights reserved.
        </div>

      </div>
    </div>
  );
}