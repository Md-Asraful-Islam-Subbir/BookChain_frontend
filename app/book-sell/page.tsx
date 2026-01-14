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
import { Book, Camera, ChevronRight, CreditCard, DollarSign, HelpCircle, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filters } from '@/lib/Constant';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const page = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [addProducts, { isLoading }] = useAddProductMutation();
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
            <CardHeader className='bg-linear-to-r from-blue-50 to-indigo-50 p-6'>
              <CardTitle className='text-2xl font-bold text-blue-700 flex items-center'>
                <Book className='mr-2 h-6 w-6' />
                Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 p-6'>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='title' className='md:w-1/4 font-medium text-gray-700'>
                  Ad Title
                </Label>
                <div className='md:w-3/4'>
                  <Input {...register("title", { required: "Ad title is required" })} placeholder='Title' type='title' />
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
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='category' className='md:w-1/4 font-medium text-gray-700'>
                  Book Condition
                </Label>
                <div className='md:w-3/4'>
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: 'Book condition is required' }}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className='flex space-x-4'>
                        {filters.condition.map((con) => (
                          <div key={con} className='flex items-center space-x-2'>
                            <RadioGroupItem value={con.toLowerCase()} id={con.toLowerCase()} />
                            <Label htmlFor={con.toLowerCase()} className='md:w-1/4 font-medium text-gray-700'>
                              {con}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.condition && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='category' className='md:w-1/4 font-medium text-gray-700'>
                  Class Type
                </Label>
                <div className='md:w-3/4'>
                  <Controller
                    name="classType"
                    control={control}
                    rules={{ required: 'Class type is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="please select Class type" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {filters.classType.map((classType) => (
                            <SelectItem key={classType} value={classType}>
                              {classType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.classType && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.classType.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='subject' className='md:w-1/4 font-medium text-gray-700'>
                  Book Title/Subject
                </Label>
                <div className='md:w-3/4'>
                  <Input {...register("subject", { required: "Book subject is required" })} placeholder='Enter your Book subject' type='subject' />
                  {
                    errors.subject && (
                      <p className='text-red-500 text-sm'>{errors.subject.message}</p>
                    )
                  }

                </div>
              </div>
              <div className="space-y-2">
                <Label className="block mb-2 font-medium text-gray-700">
                  Upload Photos
                </Label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-8 w-8 text-blue-500" />
                    <Label
                      htmlFor="images"
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                    >
                      Click here to upload up to 4 images (size: 15MB max. each)
                    </Label>

                    <Input
                      id="images"
                      type="file"
                      className="hidden"
                      accept="images/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`book image ${index + 1}`}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover w-full h-32 border border-gray-200"
                          />
                          <Button
                            onClick={() => removeImage(index)}
                            size="icon"
                            className="absolute -right-2 -top-2"
                            variant="destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* optional details */}
          <Card className="shadow-lg border-t-4 border-t-green-500">
            <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 p-6">
              <CardTitle className="text-2xl text-green-700 flex items-center">
                <HelpCircle className="mr-2 h-6 w-6" />
                Optional Details
              </CardTitle>
              <CardDescription>(Description, MRP, Author, etc...)</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Book Information</AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-4'>
                      <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                        <Label htmlFor='price' className='md:w-1/4 font-medium text-gray-700'>
                          MRP
                        </Label>
                        <Input {...register("price", { required: "Book price is required" })} placeholder='Enter Book MRP' type='price' className='md:w-3/4' />
                        {
                          errors.price && (
                            <p className='text-red-500 text-sm'>{errors.price.message}</p>
                          )
                        }

                      </div>
                      <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                        <Label htmlFor='author' className='md:w-1/4 font-medium text-gray-700'>
                          Book Author
                        </Label>
                        <Input {...register("author",)} placeholder='Enter Author Name' type='author' className='md:w-3/4' />
                      </div>
                      <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                        <Label htmlFor='edition' className='md:w-1/4 font-medium text-gray-700'>
                          Book Edition(year)
                        </Label>
                        <Input {...register("author",)} placeholder='Enter Book Edition' type='edition' className='md:w-3/4' />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <hr className="my-4 border-gray-200" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-2">
                  <AccordionTrigger>Ad Description</AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-4'>
                      <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                        <Label htmlFor='description' className='md:w-1/4 font-medium text-gray-700'>
                          Description
                        </Label>
                        <Textarea id='description' {...register("description",)} placeholder='Enter Book Description' className='w-full md:w-3/4' rows={4} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <hr className="my-4 border-gray-200" />
            </CardContent>
          </Card>
          <Card className='shadow-lg border-t-4 border-t-yellow-500'>
            <CardHeader className='bg-linear-to-r from-yellow-50 to-amber-50 p-6'>
              <CardTitle className='text-2xl font-bold text-yellow-700 flex items-center'>
                <DollarSign className='mr-2 h-6 w-6' />
                Price Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 p-6'>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4'>
                <Label htmlFor='finalPrice' className='md:w-1/4 font-medium text-gray-700'>
                  Your Price (৳)
                </Label>
                <div className='md:w-3/4'>
                  <Input id='finalPrice' {...register("finalPrice", { required: "Final Price is required" })} placeholder='Enter your book final price' type='finalPrice' />
                  {
                    errors.finalPrice && (
                      <p className='text-red-500 text-sm'>{errors.finalPrice.message}</p>
                    )
                  }

                </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4'>
                <Label className='md:w-1/4 mt-2 font-medium text-gray-700'>
                  Shipping Charges
                </Label>
                <div className='space-y-3 md:w-3/4'>
                  <div className='flex items-center gap-4'>
                    <Input id='shippingCharge' {...register("shippingCharge",)} placeholder='Enter shipping Charges' type='shippingCharge' className='w-full md:w-1/2' disabled={watch('shippingCharge') == 'free'} />
                    <span className='text-sm'>Or</span>
                    <div className='flex items-center space-x-4'>
                      <Controller
                        name="shippingCharge"
                        control={control}
                        rules={{ required: 'shipping Charge is required' }}
                        render={({ field }) => (
                          <Checkbox
                            id='freeShipping'
                            checked={field.value === 'free'}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? 'free' : '')
                            }}
                          />
                        )}
                      />
                      <Label htmlFor='freeShipping'>
                        Free Shipping
                      </Label>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground'>Buyer prefer free shipping or low shipping charges</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-t-4 border-t-blue-500">
  <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 p-6">
    <CardTitle className="text-2xl font-bold text-yellow-600 flex items-center">
      <CreditCard className="mr-2 h-6 w-6" />
      Payment Mode
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-6 p-6">
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
      <Label className="md:w-1/4 font-medium text-gray-700">
        Payment Mode
      </Label>

      <div className="md:w-3/4 space-y-2">
        <p className="text-sm text-muted-foreground">
          After your book is sold, how would you like to receive the payment?
        </p>

        {/* PAYMENT MODE RADIO */}
        <Controller
          name="paymentMode"
          control={control}
          rules={{ required: "Payment Mode is required" }}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="UPI" id="upi" />
                <Label htmlFor="upi">UPI Id / Number</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Bank Account" id="bank" />
                <Label htmlFor="bank">Bank Account</Label>
              </div>
            </RadioGroup>
          )}
        />

        {errors.paymentMode && (
          <p className="text-red-500 text-sm">
            {errors.paymentMode.message}
          </p>
        )}
      </div>
    </div>

    {/* ================= UPI ================= */}
    {paymentMode === "UPI" && (
      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <Label className="md:w-1/4 font-medium text-gray-700">
          UPI ID
        </Label>

        <div className="md:w-3/4">
          <Input
            {...register("paymentDetails.upiId", {
              required: "UPI Id is required",
              pattern: {
                value: /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/,
                message: "Invalid UPI ID format",
              },
            })}
            placeholder="Enter your UPI ID"
            type="text"
          />

          {errors.paymentDetails?.upiId && (
            <p className="text-red-500 text-sm">
              {errors.paymentDetails.upiId.message}
            </p>
          )}
        </div>
      </div>
    )}

    {/* ================= BANK ACCOUNT ================= */}
    {paymentMode === "Bank Account" && (
      <>
        {/* Account Number */}
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <Label className="md:w-1/4 font-medium text-gray-700">
            Account Number
          </Label>

          <div className="md:w-3/4">
            <Input
              {...register("paymentDetails.bankDetails.accountNumber", {
                required: "Account number is required",
                pattern: {
                  value: /^[0-9]{9,18}$/,
                  message: "Invalid account number",
                },
              })}
              placeholder="Enter account number"
              type="text"
            />

            {errors.paymentDetails?.bankDetails?.accountNumber && (
              <p className="text-red-500 text-sm">
                {errors.paymentDetails.bankDetails.accountNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* IFSC */}
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <Label className="md:w-1/4 font-medium text-gray-700">
            IFSC Code
          </Label>

          <div className="md:w-3/4">
            <Input
              {...register("paymentDetails.bankDetails.ifscCode", {
                required: "IFSC code is required",
                pattern: {
                  value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                  message: "Invalid IFSC code",
                },
              })}
              placeholder="Enter IFSC code"
              type="text"
            />

            {errors.paymentDetails?.bankDetails?.ifscCode && (
              <p className="text-red-500 text-sm">
                {errors.paymentDetails.bankDetails.ifscCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Bank Name */}
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <Label className="md:w-1/4 font-medium text-gray-700">
            Bank Name
          </Label>

          <div className="md:w-3/4">
            <Input
              {...register("paymentDetails.bankDetails.bankName", {
                required: "Bank name is required",
              })}
              placeholder="Enter bank name"
              type="text"
            />

            {errors.paymentDetails?.bankDetails?.bankName && (
              <p className="text-red-500 text-sm">
                {errors.paymentDetails.bankDetails.bankName.message}
              </p>
            )}
          </div>
        </div>
      </>
    )}
  </CardContent>
</Card>

          <Button type='submit' disabled={isLoading} className='w-60 text-md bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold py-6 shadow-lg rounded-lg transition duration-300 ease-in-out hover:scale-105'>
            {
              isLoading ? (
                <>
                  <Loader2 className='animated-spin mr-2' /> Saving...
                </>
              ) : (
                "Post your book."
              )
            }
          </Button>
          <p className='text-sm text-center mt-2 text-gray-600 '>By clicking "Post your book", you agree to our{" "}
            <Link href='/terms-of-use' className='text-blue-500 hover:underline'>Terms of use</Link>
            <Link href='/privacy-policy' className='text-blue-500 hover:underline'>Privacy policy</Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default page;
