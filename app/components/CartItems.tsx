'use client';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/lib/types/type";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartItemsProp {
    items: CartItem[];
    onRemoveItem: (productId: string) => void;
    onToggleWishlist: (productId: string) => void;
    wishlist: { products: string[] }[];
}

const CartItems: React.FC<CartItemsProp> = ({ items, onRemoveItem, onToggleWishlist, wishlist }) => {
    return (
        <ScrollArea className='h-full pr-4'>
            {items.map((item) => (
                <div key={item._id} className='flex gap-4 py-6 border-b last:border-0'>
                    {/* Book Image */}
                    <Link href={`/books/${item.product._id}`} className="shrink-0">
                        <Image
                            src={item?.product?.images?.[0]}
                            alt={item?.product?.title}
                            width={120}
                            height={160}
                            className='object-cover rounded-lg'
                        />
                    </Link>

                    {/* Book Details */}
                    <div className='flex-1 flex flex-col justify-between'>
                        <div>
                            <Link href={`/books/${item.product._id}`}>
                                <h3 className='font-semibold text-base mb-2 hover:text-blue-600'>
                                    {item.product.title}
                                </h3>
                            </Link>
                            <div className='text-sm text-gray-600 mb-2'>
                                Quantity: {item.quantity}
                            </div>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='text-gray-400 line-through text-sm'>
                                    ৳{item.product.price}
                                </span>
                                <span className='font-bold text-lg'>
                                    ৳{item.product.finalPrice}
                                </span>
                            </div>
                            <div className='text-sm text-green-600 font-medium'>
                                {item.product.shippingCharge === 'free' 
                                    ? "Free Shipping" 
                                    : `Shipping ৳${item.product.shippingCharge}`}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-2 mt-4'>
                            <Button 
                                variant='outline' 
                                size='sm' 
                                onClick={() => onRemoveItem(item.product._id)}
                                className="flex items-center gap-1"
                            >
                                <Trash2 className='w-4 h-4' />
                                Remove
                            </Button>
                            <Button 
                                variant='outline' 
                                size='sm' 
                                onClick={() => onToggleWishlist(item.product._id)}
                                className="flex items-center gap-1"
                            >
                                <Heart 
                                    className={`h-4 w-4 ${
                                        wishlist.some((w) => w.products.includes(item.product._id)) 
                                            ? "fill-red-500 text-red-500" 
                                            : ""
                                    }`} 
                                />
                                Add to Wishlist
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
    )
}

export default CartItems;