'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';


const page = () => {
    const params = useParams();
    const id = params.id;
    const [selectedImage, setSelectedImage] = useState(0);
    const router = useRouter();
    const [isAddToCart, setIsAddToCart] = useState(false);

    const book = {
        _id: "1",
        images: [],
        title: "The Alchemist",
        category: "Reading Books (Novels)",
        condition: "Excellent",
        classType: "B.Com",
        subject: "Fiction",
        price: 300,
        author: "Paulo Coelho",
        edition: "25th Anniversary Edition",
        description: "A philosophical book about a shepherd's journey to realize his dreams.",
        finalPrice: 250,
        shippingCharge: 50,
        paymentMode: "UPI",
        paymentDetails: {
            upiId: "example@upi"
        },
        createdAt: new Date("2024-01-01"),
        seller: { name: "John Doe", contact: "1234567890" }
    }

    const handleAddToCart = {

    }
    const handleAddToWishlist = {

    }
    const bookImage = book?.images || [];
    const calculateDiscount = (price: number, finalPrice: number) => {
        if (price > finalPrice && price > 0) {
            return Math.round(((price - finalPrice) / price) * 100);
        }
        return 0;
    }
    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    }
    return (
        <div className='min-h-screen bg-gray-100'>
            <div className='container mx-auto px-4 py-8'>
                <nav className='mb-8 flex items-center gap-2 text-sm text-muted-foreground'>
                    <Link href="/" className='text-primary hover:underline'>
                        {" "}
                        Home {" "}
                    </Link>
                    <span>/</span>
                    <Link href="/books" className='text-primary hover:underline'>
                        Books
                    </Link>
                    <span>/</span>
                    <span className='text-gray-600'>{book.category}</span>
                    <span>/</span>
                    <span className='text-gray-600'>{book.title}</span>
                </nav>
                <div className='grid gap-8 md:grid-cols-2'>
                    <div className='space-y-4'>
                        <div className='relative h-120 overflow-hidden rounded-lg border bg-white shadow-md'>
                            <Image src={bookImage[selectedImage]} alt={book.title} fill className='object-contain' />
                            {
                                calculateDiscount(book.price, book.finalPrice) > 0 && (
                                    <span className="absolute left-0 top-2 rounded-r-lg px-2 py-1 text-xs font-medium bg-orange-600/90 text-white hover:bg-orange-700">
                                        {calculateDiscount(book.price, book.finalPrice)}% Off
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page