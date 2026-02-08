'use client';
import { UserData } from '@/lib/types/type';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUpdateUserMutation } from '@/store/api';
import toast from 'react-hot-toast';
import { setUser } from '@/store/slice/userSlice';

const page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const [updateUser,{isLoading}]=useUpdateUserMutation();
const dispatch = useDispatch();

  const {register, handleSubmit, reset} = useForm<UserData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    }
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    })
  }, [user, isEditing, reset])

  const handleProfileEdit = async (data: UserData) => {
    
    const {name, phoneNumber} = data;
    try {
      const result = await updateUser({userId: user?._id, userData: {name, phoneNumber}})
      if(result && result.data) {
        dispatch(setUser(result?.data))
        setIsEditing(false);
        toast.success('Profile updated successfully')
      } else {
        throw new Error("Could not update profile")
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to update profile')
    }
  };

  return (
    <div className='space-y-6'>
      <div className='bg-linear-to-r from-pink-500 to-rose-500 text-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-4xl font-bold mb-2'>
          My Profile
        </h1>
        <p className='text-pink-100'>
          Manage your personal information and preferences
        </p>
      </div>
            <Card className='border-t-4 border-t-pink-500 shadow-lg'>
        <CardHeader className='bg-linear-to-r from-pink-50 to-rose-50 p-6'>
          <CardTitle className='text-2xl text-pink-700'>
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your profile details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 p-6'>
          <form onSubmit={handleSubmit(handleProfileEdit)}>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                  <Input
                    id='username'
                    placeholder='john'
                    disabled={!isEditing}
                    className='pl-10'
                    {...register('name')}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                  <Input
                    id='email'
                    placeholder='john@gmail.com'
                    disabled
                    className='pl-10'
                    {...register('email')}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phoneNumber'>Phone Number</Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                  <Input
                    id='phoneNumber'
                    placeholder='+8801XXXXXXXXX'
                    disabled={!isEditing}
                    className='pl-10'
                    {...register('phoneNumber')}
                  />
                </div>
              </div>
            </div>
            <CardFooter className='bg-pink-50 mt-4 flex justify-between'>
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant='outline'
                  className='ml-4'
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                >
                  Discard Changes
                </Button>
                
                <Button
                  type='submit'
                  variant='outline'
                  className='bg-linear-to-r from-pink-500 to-rose-500 text-white'
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
               <Button
                  type='button'
                  variant='outline'
                  className='mt-4 bg-linear-to-r from-pink-500 to-rose-500 text-white'
                  onClick={()=>setIsEditing(true)}
                >
                  edit Profile
                </Button>
              </>
            )}
          </CardFooter>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}

export default page