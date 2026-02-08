'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Camera, CreditCard, Heart, Library, MapPin, Search, ShoppingBag, Store, Tag, Truck, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NewBooks from "./components/NewBooks";
import { Card, CardContent } from "@/components/ui/card";

const bannerSlides = [
  {
    id: 1,
    image: "/images/book1.jpg",
    headline: "Find Your Next Great Read",
    subheading: "Discover millions of second-hand books at amazing prices",
  },
  {
    id: 2,
    image: "/images/book2.jpg",
    headline: "Save Up To 85% on Books",
    subheading: "College textbooks, novels, and more at unbeatable prices",
  },
  {
    id: 3,
    image: "/images/book3.jpg",
    headline: "Support Local Sellers",
    subheading: "Buy from verified sellers in your community",
  },
];
const blogPosts = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
    title: "Where and how to sell old books online?",
    description:
      "Get started with selling your used books online and earn money from your old books.",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
  },
  {
    imageSrc:
      "https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
    title: "What to do with old books?",
    description:
      "Learn about different ways to make use of your old books and get value from them.",
    icon: <Library className="w-6 h-6 text-primary" />,
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
    title: "What is BookChain?",
    description:
      "Discover how BookChain helps you buy and sell used books online easily.",
    icon: <Store className="w-6 h-6 text-primary" />,
  },
];
const featuredBooks = [
  {
    id: 1,
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    price: 1299,
    originalPrice: 8999,
    condition: 'Good',
    location: 'Dhaka, Bangladesh',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    title: 'Organic Chemistry',
    author: 'Paula Yurkanis Bruice',
    price: 1850,
    originalPrice: 12500,
    condition: 'Like New',
    location: 'Chittagong, Bangladesh',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    price: 1500,
    originalPrice: 9999,
    condition: 'Good',
    location: 'Khulna, Bangladesh',
    image: 'https://images.pexels.com/photos/1301585/pexels-photo-1301585.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    price: 599,
    originalPrice: 1499,
    condition: 'Fair',
    location: 'Rajshahi, Bangladesh',
    image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 5,
    title: 'Physics for Scientists',
    author: 'Raymond A. Serway',
    price: 2200,
    originalPrice: 14999,
    condition: 'Very Good',
    location: 'Sylhet, Bangladesh',
    image: 'https://images.pexels.com/photos/2663815/pexels-photo-2663815.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 6,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 450,
    originalPrice: 1299,
    condition: 'Good',
    location: 'Barisal, Bangladesh',
    image: 'https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 7,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 850,
    originalPrice: 1999,
    condition: 'Very Good',
    location: 'Comilla, Bangladesh',
    image: 'https://images.pexels.com/photos/305821/pexels-photo-305821.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 8,
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    price: 1750,
    originalPrice: 10500,
    condition: 'Like New',
    location: 'Narayanganj, Bangladesh',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 9,
    title: 'Data Structures and Algorithms',
    author: 'Michael T. Goodrich',
    price: 1650,
    originalPrice: 9500,
    condition: 'Good',
    location: 'Rangpur, Bangladesh',
    image: 'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 10,
    title: 'Bangla Literature Collection',
    author: 'Humayun Ahmed',
    price: 1200,
    originalPrice: 2500,
    condition: 'Excellent',
    location: 'Gazipur, Bangladesh',
    image: 'https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 11,
    title: 'IELTS Preparation Guide',
    author: 'Cambridge University Press',
    price: 950,
    originalPrice: 2200,
    condition: 'Like New',
    location: 'Mymensingh, Bangladesh',
    image: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 12,
    title: 'Harry Potter Collection',
    author: 'J.K. Rowling',
    price: 3500,
    originalPrice: 8000,
    condition: 'Good',
    location: 'Dinajpur, Bangladesh',
    image: 'https://images.pexels.com/photos/2067561/pexels-photo-2067561.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];
const sellSteps = [
  {
    step: "Step 1",
    title: "Post an ad for selling used books",
    description:
      "Post an ad on BookKart describing your book details to sell your old books online.",
    icon: <Camera className="h-8 w-8 text-primary" />,
  },
  {
    step: "Step 2",
    title: "Set the selling price for your books",
    description: "Set the price for your books at which you want to sell them.",
    icon: <Tag className="h-8 w-8 text-primary" />,
  },
  {
    step: "Step 3",
    title: "Get paid into your Bkash/Bank account",
    description:
      "You will get money into your account once you receive an order for your book.",
    icon: <Wallet className="h-8 w-8 text-primary" />,
  },
];

const buySteps = [
  {
    step: "Step 1",
    title: "Select the used books you want",
    description: "Search from over thousands of used books listed on BookKart.",
    icon: <Search className="h-8 w-8 text-primary" />,
  },
  {
    step: "Step 2",
    title: "Place the order by making payment",
    description:
      "Then simply place the order by clicking on the 'Buy Now' button.",
    icon: <CreditCard className="h-8 w-8 text-primary" />,
  },
  {
    step: "Step 3",
    title: "Get the books delivered at your doorstep",
    description: "The books will be delivered to you at your doorstep!",
    icon: <Truck className="h-8 w-8 text-primary" />,
  },
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentImage((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };
  return (
    <main className="min-h-screen">
      <section className="relative h-150 overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === index ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.headline}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
          {/* Dynamic Title & Subtitle */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {bannerSlides[currentImage].headline}
            </h1>
            <p className="text-lg md:text-2xl text-gray-100 max-w-3xl mx-auto">
              {bannerSlides[currentImage].subheading}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Button size='lg' className="group bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <Link href="/books">
                  <div className="text-left">
                    <div className="text-sm opacity-90">Start Buying</div>
                    <div className="font-semibold">Buy used books</div>
                  </div>
                </Link>
              </div>
            </Button>

            <Button size='lg' className="group bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-black/20 p-2 rounded-lg group-hover:bg-black/30 transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <Link href="/book-sell">
                  <div className="text-left">
                    <div className="text-sm opacity-90">Start Selling</div>
                    <div className="font-semibold">Sell Used Books</div>
                  </div>
                </Link>
              </div>
            </Button>
          </div>
        </div>
      </section>
      {/* Additional sections like NewBooks, BlogPosts, HowItWorks can be added here */}
      <NewBooks />
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
            <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-emerald-50 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                    {book.condition}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{book.author}</p>

                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{book.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-emerald-600">৳{book.price}</span>
                        <span className="text-sm text-gray-400 line-through">৳{book.originalPrice}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Save {Math.round((1 - book.price / book.originalPrice) * 100)}%
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Button size='lg' className="flex mt-10 mb-10 mx-auto bg-yellow-500 hover:bg-yellow-600 px-8 py-6 rounded-xl">
        <Link href="/books">
          <div className="font-semibold text-black">
            Browse All Books
          </div>
        </Link>
      </Button>
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold mb-4">How to sell your old books online on BookChain?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Saving space and earning money is now easy with BookChain. Follow these simple steps to sell your used books online:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-gray-300 -z-10" />
            {
              sellSteps.map((step, index) => (
                <div key={index} className="relative flex flex-col h-full">
                  <div className="bg-white rounded-xl p-8 shadow-lg text-center grow flex flex-col">
                    <div className="absolute top-2 left-14 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium z-10">
                      {step.step}
                    </div>
                    <div className="w-16 h-16 mb-2 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm grow">{step.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold mb-4">How to Buy second hand books online on BookChain?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Saving space and earning money is now easy with BookChain. Follow these simple steps to buy second hand books online:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-gray-300 -z-10" />
            {
              buySteps.map((step, index) => (
                <div key={index} className="relative flex flex-col h-full">
                  <div className="bg-yellow-400 rounded-xl p-8 shadow-lg text-center grow flex flex-col">
                    <div className="absolute top-2 left-14 -translate-x-1/2 bg-white text-gray-900 px-4 py-1 rounded-full text-sm font-medium z-10">
                      {step.step}
                    </div>
                    <div className="w-16 h-16 mb-2 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm grow">{step.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      {/* Blog Posts Section can be added here */}
      <section className="py-16 bg-[rgb(223,234,254)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Read from our <span className="text-primary">Blog</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="h-full flex flex-col overflow-auto transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={post.imageSrc} alt={post.title} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {post.icon}
                      </div>
                      <span className="grow">{post.title}</span>
                    </h3>
                    <p className="text-gray-600 text-sm grow">{post.description}</p>
                    <Button variant="link" className="mt-4 p-0 flex items-center text-primary font-semibold">
                      Read More <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
            <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose BookChain?</h2>
            <div className="grid md:grid-cols-3 gap-28 mt-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <span className="text-3xl font-bold text-emerald-600">85%</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Save Up To 85%</h3>
                <p className="text-emerald-100">Get the same books at a fraction of the retail price</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <MapPin className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Local Sellers</h3>
                <p className="text-emerald-100">Find books from verified sellers in your area</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Huge Selection</h3>
                <p className="text-emerald-100">Thousands of books across all categories</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
