'use client'

import { useAddToWishlistMutation, useGetCartQuery, useRemoveFromCartMutation, useRemoveFromWishlistMutation } from '@/store/api';
import { addToWishlistAction, removeFromWishListAction } from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const {orderId, step} = useSelector((state: RootState) => state.checkout);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const {data: cartData, isLoading: isCartLoading} = useGetCartQuery(user?._id);
  const [removeCartMutation] = useRemoveFromCartMutation();
  const [addWishListMutation] = useAddToWishlistMutation();
  const [removeWishListMutation] = useRemoveFromWishlistMutation();
  const [addToWishlistMuttation] = useAddToWishlistMutation();
const wishlist = useSelector((state: RootState) => state.wishlist.items)

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
  return (
    <div>page</div>
  )
}

export default page;