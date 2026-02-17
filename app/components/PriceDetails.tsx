'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CreditCard, Shield } from "lucide-react";

interface PriceDetailsProps {
  orderId: string | null;
  totalOriginalAmount: number;
  totalAmount: number;
  totalDiscount: number;
  itemCount: number;
  shippingCharge: number;
  isProcessing: boolean;
  step: 'cart' | 'addresses' | 'payment';
  onProceed: () => void;
  onBack: () => void;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  orderId,
  totalAmount,
  totalDiscount,
  totalOriginalAmount,
  shippingCharge,
  step,
  onBack,
  onProceed,
  isProcessing: parentProcessing,
  itemCount
}) => {
  const [loading, setLoading] = useState(false);

 const handlePayment = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `https://bookchain-backend.onrender.com/api/payment/stripe/create-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          totalAmount,
        }),
      }
    );

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url; // redirect to Stripe
    } else {
      throw new Error("Stripe session failed");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed. Try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <Card className='shadow-lg p-6'>
      <CardHeader>
        <CardTitle className='text-xl'>Price Details</CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex justify-between'>
          <span>Price ({itemCount} items)</span>
          <span>৳{totalOriginalAmount}</span>
        </div>
        <div className='flex justify-between text-green-600'>
          <span>Discount</span>
          <span>৳{totalDiscount}</span>
        </div>
        <div className='flex justify-between text-green-600'>
          <span>Delivery Charge</span>
          <span className={`${shippingCharge === 0 ? 'text-green-600' : 'text-black'}`}>
            {shippingCharge === 0 ? 'Free' : `৳${shippingCharge}`}
          </span>
        </div>
        <div className='border-t pt-4 font-medium flex justify-between'>
          <span>Total Amount</span>
          <span>৳{totalAmount}</span>
        </div>
      </CardContent>

      <CardFooter className='flex flex-col gap-4'>
        {step === 'payment' ? (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size='lg'
            onClick={handlePayment}
            disabled={loading || parentProcessing}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className='h-4 w-5 mr-2' />
                Continue To Pay
              </>
            )}
          </Button>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size='lg'
            onClick={onProceed}
            disabled={loading || parentProcessing}
          >
            <ChevronRight className='h-4 w-4 mr-2' />
            {step === 'cart' ? 'Proceed to Checkout' : 'Proceed to Payment'}
          </Button>
        )}

        {step !== 'cart' && (
          <Button
            variant='outline'
            className='w-full'
            onClick={onBack}
          >
            <ChevronLeft className='h-4 w-4 mr-2' /> Go Back
          </Button>
        )}

        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Shield className='h-4 w-4' />
          <span>Safe and Secure Payments</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PriceDetails;
