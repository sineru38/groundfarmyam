// pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { parseSuccessParams } from "../services/tossPayments";
import { formatPrice } from "../utils/constants";

export function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const info = parseSuccessParams(params);

  useEffect(() => {
    // 실제 운영 시: Vercel Edge Function을 통해 결제 승인 API 호출
    // POST https://api.tosspayments.com/v1/payments/confirm
    console.log("결제 성공 파라미터:", info);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-display font-bold text-forest-900 text-2xl mb-2">결제 완료!</h2>
        <p className="text-stone-500 text-sm mb-6">그라운드팜 예약이 확정되었습니다</p>
        {info.amount > 0 && (
          <div className="bg-forest-50 rounded-2xl p-4 mb-6 text-sm">
            <div className="text-stone-500 mb-1">결제 금액</div>
            <div className="font-bold text-forest-700 text-xl">{formatPrice(info.amount)}</div>
            {info.orderId && <div className="text-xs text-stone-400 mt-2">주문번호: {info.orderId}</div>}
          </div>
        )}
        <button onClick={() => navigate("/")} className="w-full py-3 bg-gradient-to-r from-forest-600 to-forest-700 text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all">
          🏡 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

// pages/PaymentFail.jsx
export function PaymentFail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code    = params.get("code");
  const message = params.get("message");

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="font-display font-bold text-red-700 text-2xl mb-2">결제 실패</h2>
        <p className="text-stone-500 text-sm mb-4">{message || "결제 처리 중 오류가 발생했습니다."}</p>
        {code && <p className="text-xs text-stone-400 mb-6">오류 코드: {code}</p>}
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="flex-1 py-3 bg-forest-600 text-white rounded-2xl font-bold text-sm hover:bg-forest-700 transition-colors">
            다시 시도
          </button>
          <button onClick={() => navigate("/")} className="flex-1 py-3 bg-stone-100 text-stone-700 rounded-2xl font-bold text-sm hover:bg-stone-200 transition-colors">
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
