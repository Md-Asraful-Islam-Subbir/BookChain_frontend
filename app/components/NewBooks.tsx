
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { books } from '@/lib/Constant';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'

const NewBooks = () => {
  const [currentBookSlide, setcurrentBookSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setcurrentBookSlide((pre) => (pre + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }
    , []);
  const preSlide = () => {
    setcurrentBookSlide((pre) => (pre - 1 + 3) % 3);
  }
  const nextSlide = () => {
    setcurrentBookSlide((pre) => (pre + 1) % 3);
  }

  const calculateDiscount = (price: number, finalPrice: number) => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  }
  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold mb-12 text-center'>New Books Arrivals</h2>
        <div className='relative'>
          {
            books.length > 0 ? (
              <>
                <div className='overflow-hidden'>
                  <div className='flex transition-transform duration-500 ease-in-out' style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}>
                    {
                      [0, 1, 2].map((slideIndex) => (
                        <div key={slideIndex} className='w-full flex-none'>
                          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                            {
                              books.slice(slideIndex * 3, slideIndex * 3 + 3).map((book) => (
                                <Card key={book._id} className="relative">
                                  <CardContent className="p-4">
                                    <Link href={`/books/${book._id}`}>
                                      <div className='relative'>
                                        <Image src={book.images[0]} alt={book.title} width={200} height={300} className="w-full h-50 object-cover mb-4 rounded" />
                                        {
                                          calculateDiscount(book.price, book.finalPrice) > 0 && (
                                            <span className="absolute top-2 left-0 rounded-r-lg bg-red-500 px-2 py-1 text-xs font-medium text-white">
                                              {calculateDiscount(book.price, book.finalPrice)}% Off
                                            </span>
                                          )
                                        }
                                        <h3 className='mb-2 line-clamp-2 text-sm font-medium'>
                                          {book.title}
                                        </h3>
                                        <div className='flex items-center justify-between'>
                                          <div className='flex items-baseline gap-2'>
                                            <span className='text-lg font-bold'>৳{book.finalPrice}</span>
                                            {
                                              book.price && (
                                                <span className='text-sm text-muted-foreground line-through'>৳{book.price}</span>
                                              )
                                            }
                                          </div>
                                          <div className='flex justify-between items-center text-xs text-zinc-400'>
                                            <span>{book.condition}</span>
                                          </div>
                                        </div>
                                        <div className='pt-4'>
                                          <Button className='flex float-end mb-2 bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-600'>
                                            Buy Now
                                          </Button>
                                        </div>
                                      </div>
                                    </Link>
                                  </CardContent>
                                </Card>
                              ))
                            }
                          </div>
                        </div>

                      ))
                    }
                  </div>
                </div>
                <button onClick={preSlide} className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md'>
                  <ChevronLeft className='h-6 w-6' />
                </button>
                <button onClick={nextSlide} className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md'>
                  <ChevronRight className='h-6 w-6' />
                </button>
                <div className='mt-8 flex justify-center space-x-2'>
                  {
                    [0, 1, 2].map((index) => (
                      <button key={index} onClick={() => setcurrentBookSlide(index)} className={`h-3 w-3 rounded-full ${currentBookSlide === index ? 'bg-blue-600' : 'bg-gray-300'}`}>

                      </button>
                    ))}
                </div>
              </>
            ) :
              <>
                <p>No books available</p>
              </>
          }
        </div>
      </div>
    </section>
  )
}

export default NewBooks