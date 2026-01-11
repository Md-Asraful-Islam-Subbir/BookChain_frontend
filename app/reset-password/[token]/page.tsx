'use client'
import { useResetPasswordMutation } from '@/store/api';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleLoginDialog } from '@/store/slice/userSlice';

interface ResetPasswordFormData {
    token: string,
    newPassword: string,
    confirmPassword: string
}

const page: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const [resetPassword] = useResetPasswordMutation();
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
const handleLoginClick=()=>{
    dispatch(toggleLoginDialog());
}
    const onSubmit = async (data: ResetPasswordFormData) => {
        setResetPasswordLoading(true);
        if (data.newPassword !== data.confirmPassword) {
            toast.error('Passwords do not match');
            setResetPasswordLoading(false);
            return
        }
        try {
            await resetPassword({ token: token, newPassword: data.newPassword }).unwrap();
            setResetPasswordSuccess(true);
            toast.success('password reset successfully');
        } catch (error) {
            toast.error('Failed to reset password')
        }
        finally {
            setResetPasswordLoading(false);
        }

    }

    return (
        <div className='p-20 flex items-center justify-center bg-linear-to-r from-blue-100 to-purple-100 min-h-screen'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full'
                transition={{ duration: 0.5 }}
            >
                <h2 className='text-2xl font-semibold text-gray-700 mb-6 text-center'>Reset Your Password</h2>
                {
                    !resetPasswordSuccess ? (
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                            <div className='relative'>
                                <Input {...register("newPassword", { required: "New Password is required" })} placeholder='New Password' type={showPassword ? "text" : "password"} className='pl-10' />
                                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' size={20} />
                                {
                                    showPassword ? (
                                        <EyeOff className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer' size={20} onClick={() => setShowPassword(false)} />
                                    ) : (
                                        <Eye className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer' size={20} onClick={() => setShowPassword(true)} />
                                    )
                                }
                            </div>
                            {
                                errors.newPassword && (
                                    <p className='text-red-500 text-sm'>{errors.newPassword.message}</p>
                                )
                            }
                            <Input {...register("confirmPassword", { required: "Confirm New Password is required" })} placeholder='Confirm New Password' type="password" />
                            {
                                errors.confirmPassword && (
                                    <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>
                                )
                            }
                            <Button type='submit' className='w-full font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105'>
                                            {
                                                resetPasswordLoading ? (
                                                    <Loader2 className='animate-spin mr-2' size={20} />
                                                ) : (
                                                    "Reset Password"
                                                )
                                            }
                                        </Button>

                        </form>
                    ) : (
                        <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                            Password Reset successfully
                        </h2>
                        <p className='text-gray-500'>
                            Your password has been reset successfully.You'll be now login with new password...
                        </p>
                        <Button
                            onClick={handleLoginClick}
                            className="bg-blue-500 mt-4 hover:bg-blue-600 font-bold text-white py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Go To Login
                        </Button>
                    </motion.div>
                    )
                }

            </motion.div>

        </div>
    )
}

export default page;