'use client'

import { BookDetails } from '@/lib/types/type';
import { useAddProductMutation } from '@/store/api';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import NoData from '../components/NoData';
import { toggleLoginDialog } from '@/store/slice/userSlice';
import Link from 'next/link';
import { Book, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filters } from '@/lib/Constant';

const page = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [addProducts] = useAddProductMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<BookDetails>({
    defaultValues: {
      images: [],
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      const currentFiles = watch('images') || [];

      setUploadedImages((prevImage) =>
        [...prevImage, ...newFiles.map((file) => URL.createObjectURL(file))].slice(0, 4)
      );

      setValue('images', [...currentFiles, ...newFiles].slice(0, 4) as string[]);
    }
  };
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));

    const currentFiles = watch('images') || [];
    const uploadFiles = currentFiles.filter((_, i) => i !== index);
    setValue('images', uploadFiles);
  }
  const onSubmit = async (data: BookDetails) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images') {
          formData.append(key, value as string);
        }
      });

      if (data.paymentMode === 'UPI') {
        formData.set('paymentDetails', JSON.stringify({ upiId: data.paymentDetails.upiId }))
      } else if (data.paymentMode === 'Bank Account') {
        formData.set('paymentDetails', JSON.stringify({ bankDetails: data.paymentDetails.bankDetails }))
      }

      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append('images', image))
      }

      const result = await addProducts(formData).unwrap();
      if (result.success) {
        router.push(`books/${result.data._id}`)
        toast.success('Books added successfully');
        reset();
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to list the book,Please try again later...')
    }
  }
  const paymentMode = watch('paymentMode');

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog())
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
  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-blue-600 mb-4'>
            Sell Your Used Book
          </h1>
          <p className='text-xl text-gray-400 mb-4'>Submit a free classified ad to sell your used books for cash in Bangladesh</p>
          <Link href='#' className='text-blue-500 hover:underline inline-flex items-center'>
            Learn how it works
            <ChevronRight className='ml-1 h-4 w-4' />
          </Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          <Card className='shadow-lg border-t-4 border-t-blue-500'>
            <CardHeader className='bg-linear-to-r from-blue-50 to-indigo-50'>
              <CardTitle className='text-2xl font-bold text-blue-700 flex items-center'>
                <Book className='mr-2 h-6 w-6' />
                Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 p-6'>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='title' className='md:w-1/4 font-medium text-gray-700'>
                  A4 Title
                </Label>
                <div className='md:w-3/4'>
                  <Input {...register("title", { required: "Book title is required" })} placeholder='Title' type='title' />
                  {
                    errors.title && (
                      <p className='text-red-500 text-sm'>{errors.title.message}</p>
                    )
                  }

                </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='category' className='md:w-1/4 font-medium text-gray-700'>
                  Book Type
                </Label>
              <div className='md:w-3/4'>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Book type is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="please select book type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {filters.category.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.category.message}
                  </p>
                )}
              </div>
              </div>
            </CardContent>
          </Card>
        </form>

      </div>
    </div>
  );
};

export default page;
