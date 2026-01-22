'use client'

import CartItems from '@/app/components/CartItems';
import CheckoutAddress from '@/app/components/CheckoutAddress';
import NoData from '@/app/components/NoData';
import PriceDetails from '@/app/components/PriceDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Address } from '@/lib/types/type';
import { useAddToWishlistMutation, useCreateOrUpdateOrderMutation, useGetCartQuery, useGetOrderByIdQuery, useRemoveFromCartMutation, useRemoveFromWishlistMutation } from '@/store/api';
import { setCart } from '@/store/slice/cartSlice';
import { setCheckoutStep, setOrderId } from '@/store/slice/checkoutSlice';
import { toggleLoginDialog } from '@/store/slice/userSlice';
import { addToWishlistAction, removeFromWishListAction } from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import { ChevronRight, MapPin, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { orderId, step } = useSelector((state: RootState) => state.checkout);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(user?._id);
  const [removeCartMutation] = useRemoveFromCartMutation();
  const [removeWishListMutation] = useRemoveFromWishlistMutation();
  const [addToWishlistMuttation] = useAddToWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const cart = useSelector((state: RootState) => state.cart)
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(orderId || '');
  const [createRazorpayPayment] = useCreateOrUpdateOrderMutation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (orderData && orderData.shippingAddress) {
      setSelectedAddress(orderData.shippingAddress)
    }
  }, [orderData])

  useEffect(() => {
    if (step === 'addresses' && !selectedAddress) {
      setShowAddressDialog(true);
    }
  }, [step, selectedAddress])
  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data))
    }
  }, [cartData, dispatch])

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeCartMutation(productId).unwrap();
      if (result.success) {
        dispatch(setCart(result.data))
        toast.success(result.message || 'Item removed successfully')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to remove item from cart');
    }
  }
  const handleAddToWishlist = async (productId: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId)
      )
      if (isWishlist) {
        const result = await removeWishListMutation(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishListAction(productId))
          toast.success(result.message || 'Remove from wishlist')
        } else {
          throw new Error(result.message || 'Failed to remove from wishlist')
        }
      } else {
        const result = await addToWishlistMuttation(productId).unwrap();
        if (result.success) {
          dispatch(addToWishlistAction(result.data))
          toast.success(result.message || 'Added to wishlist')
        } else {
          throw new Error(result.message || 'Failed to add to wishlist')
        }
      }
    } catch (error: any) {
      // handle error
      const errormessage = error?.data?.message;
      toast.error(errormessage)
    }
  }
  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  }
  const totalAmount = cart.items.reduce((acc, item) => acc + (item.product.finalPrice * item.quantity), 0);
  const totalOriginalAmount = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalDiscount = totalOriginalAmount - totalAmount;
  const shippingCharge = cart.items.map(item => item.product.shippingCharge.toLowerCase() === 'free' ? 0 : parseFloat(item.product.shippingCharge) || 0)
  const maxShippingCharge = Math.max(...shippingCharge, 0);
  const finalAmount = totalAmount + maxShippingCharge;
  const handleProceedToCheckout = async () => {
    if (step === 'cart') {
      try {
        const result = await createOrUpdateOrder({ data: { items: cart.items, totalAmount: totalAmount } }).unwrap();
        if (result.success) {
          toast.success('Order created successfully');
          dispatch(setOrderId(result.data._id));
          dispatch(setCheckoutStep('addresses'));
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast.error('Failed to create order');
        console.error(error);
      }
    } else if (step === 'addresses') {
      if (selectedAddress) {
        dispatch(setCheckoutStep('payment'));
      }
      else {
        setShowAddressDialog(true);
      }
    }
    else if (step === 'payment') {
      handlePayment();
    }
  }
  const handleSelectAddress = async (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);
    if (orderId) {
      try {
        await createOrUpdateOrder({ updates: { orderId, shippingAddress: address } }).unwrap();
        toast.success("Address updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update address");
      }
    }
  }
  const handlePayment = async () => {

  }
  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }
  if (cart.items.length === 0) {
    return (
      <NoData
        message="Your cart is empty."
        description="Looks like you haven't added any items yet. 
            Explore our collection and find something you love!"
        buttonText="Browse Books"
        imageUrl="/images/cart.webp"
        onClick={() => router.push('/books')}
      />
    );
  }
  return (
    <>
      <div className='min-h-screen bg-white'>
        <div className='mb-8 bg-gray-100 py-4 px-6'>
          <div className='container mx-auto flex items-center'>
            <ShoppingCart className='h-6 w-6 mr-2 text-gray-600' />
            <span className='text-lg font-semibold text-gray-800'>
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"} {" "}
              in your cart
            </span>
          </div>
        </div>

        <div className='container mx-auto px-4 max-w-6xl'>
          <div className='mb-8'>
            <div className='flex justify-center items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className={`rounded-full p-3 ${step === "cart" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  <ShoppingCart className='h-6 w-6' />
                </div>
                <span className='font-medium hidden md:inline'>
                  Cart
                </span>
              </div>
              <ChevronRight className='h-5 w-5 text-gray-400' />
              <div className='flex items-center gap-2'>
                <div className={`rounded-full p-3 ${step === "addresses" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  <MapPin className='h-6 w-6' />
                </div>
                <span className='font-medium hidden md:inline'>
                  Address
                </span>
              </div>
              <ChevronRight className='h-5 w-5 text-gray-400' />
              <div className='flex items-center gap-2'>
                <div className={`rounded-full p-3 ${step === "payment" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  <ShoppingCart className='h-6 w-6' />
                </div>
                <span className='font-medium hidden md:inline'>
                  Payment
                </span>
              </div>
            </div>
          </div>

          <div className='grid gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2 '>
              <Card className='shadow-lg '>
                <CardHeader>
                  <CardTitle className='text-2xl'>Order Summary</CardTitle>
                  <CardDescription>Review your items</CardDescription>
                </CardHeader>
                <CardContent>
                  <CartItems
                    items={cart.items}
                    onRemoveItem={handleRemoveItem}
                    onToggleWishlist={handleAddToWishlist}
                    wishlist={wishlist}
                  />
                </CardContent>
              </Card>
            </div>

              <div>
                <PriceDetails
                  totalOriginalAmount={totalOriginalAmount}
                  totalAmount={finalAmount}
                  shippingCharge={maxShippingCharge}
                  totalDiscount={totalDiscount}
                  itemCount={cart.items.length}
                  isProcessing={isProcessing}
                  step={step}
                  onProceed={handleProceedToCheckout}
                  onBack={() => dispatch(setCheckoutStep(step === 'addresses' ? 'cart' : 'addresses'))}
                />
                {selectedAddress && (
        <Card className='mt-6 mb-6 shadow-lg'>
          <CardHeader>
            <CardTitle className='text-xl'>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-1'>
              <p>{selectedAddress?.state}</p>
              {selectedAddress?.addressLine2 && (
                <p>{selectedAddress?.addressLine2}</p>
              )}
              <p></p>
              <p>
                {selectedAddress.city}, {selectedAddress.state}{" "}
              </p>
              <p>{selectedAddress.pincode}</p>
              <p></p>
              <p>Phone: {selectedAddress.phoneNumber}</p>
            </div>
          </CardContent>
          <Button 
            className='mt-4' 
            variant='outline'
            onClick={() => setShowAddressDialog(true)}
          >
            <MapPin className='h-4 w-4 mr-2'/> Change Address
          </Button>
        </Card>
      )}
              </div>
            </div>
          <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
          <DialogContent className='sm:max-w-150'>
            <DialogHeader>
              <DialogTitle>
                Select or Add Delivery Address
              </DialogTitle>
            </DialogHeader>
            
            <CheckoutAddress
              onAddressSelect={handleSelectAddress}
              selectedAddressId={selectedAddress?._id}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </>
  )
}

export default page;