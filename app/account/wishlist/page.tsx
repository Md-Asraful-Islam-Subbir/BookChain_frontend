'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import {
  useAddToCartMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation
} from '@/store/api'
import { RootState } from '@/store/store'
import toast from 'react-hot-toast'
import { removeFromWishListAction } from '@/store/slice/wishlistSlice'
import { addToCart } from '@/store/slice/cartSlice'
import { BookDetails } from '@/lib/types/type'
import BookLoader from '@/lib/BookLoader'
import NoData from '@/app/components/NoData'
import {
  Check,
  Heart,
  Loader2,
  ShoppingCart,
  Trash2
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const page = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<BookDetails[]>([])

  const [addToCartMutation] = useAddToCartMutation()
  const [removeWishlistMutation] = useRemoveFromWishlistMutation()

  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const cart = useSelector((state: RootState) => state.cart.items)

  const { data: wishlistData, isLoading } = useGetWishlistQuery({})

  useEffect(() => {
    if (wishlistData?.success) {
      setWishlistItems(wishlistData.data.products)
    }
  }, [wishlistData])

  const handleAddToCart = async (productId: string) => {
    setLoadingItemId(productId)
    try {
      const result = await addToCartMutation({
        productId,
        quantity: 1
      }).unwrap()

      if (result?.success && result.data) {
        dispatch(addToCart(result.data))
        toast.success(result.message || 'Added to cart successfully')
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add to cart')
    } finally {
      setLoadingItemId(null)
    }
  }

  const toggleWishlist = async (productId: string) => {
  try {
    const result = await removeWishlistMutation(productId).unwrap()

    if (result?.success) {
      dispatch(removeFromWishListAction(productId))
      setWishlistItems(prev =>
        prev.filter(item => item._id !== productId)
      )
      toast.success(result.message || 'Removed from wishlist')
    }
  } catch (error: any) {
    toast.error(error?.data?.message || 'Failed to remove')
  }
}

  const isItemInCart = (productId: string) => {
    return cart.some(cartItem => cartItem.product._id === productId)
  }

  if (isLoading) {
    return <BookLoader />
  }

  if (!wishlistItems.length) {
    return (
      <NoData
        message="Your wishlist is empty."
        description="Looks like you haven't added any items to your wishlist yet.
        Browse our collection and save your favorites!"
        buttonText="Browse Books"
        imageUrl="/images/wishlist.webp"
        onClick={() => router.push('/books')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Heart className="h-6 w-6 text-red-600" />
        <h3 className="text-2xl font-bold">My Wishlist</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
        {wishlistItems.map(item => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle className="font-medium pt-4">
                {item.title}
              </CardTitle>
              <CardDescription>
                ৳{item.finalPrice.toFixed(2)}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <img
                className="aspect-square w-full object-cover"
                src={item.images?.[0]}
                alt={item.title}
              />
            </CardContent>

            <CardFooter className="flex justify-center items-center gap-4 p-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleWishlist(item._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {isItemInCart(item._id) ? (
                <Button disabled>
                  <Check className="h-4 w-4 mr-2" />
                  Item in Cart
                </Button>
              ) : (
                <Button onClick={() => handleAddToCart(item._id)}>
                  {loadingItemId === item._id ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default page
