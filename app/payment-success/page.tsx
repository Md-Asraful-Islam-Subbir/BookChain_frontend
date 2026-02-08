'use client';

import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>
        <p className="mt-2 text-gray-600">
          Session ID: {sessionId}
        </p>
      </div>
    </div>
  );
}
