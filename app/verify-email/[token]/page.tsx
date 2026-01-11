'use client'
import { useVerifyEmailMutation } from "@/store/api";
import { authStatus, setEmailVerified } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from 'framer-motion';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const page: React.FC = () => {
    const { token } = useParams<{ token: string }>()
    //console.log(token)
    const router = useRouter();
    const dispatch = useDispatch();
    const [verifyEmail] = useVerifyEmailMutation();
    const isVerifyEmail = useSelector((state: RootState) => state.user.isEmailVerified)
    const [varificationStatus, setVarificationStatus] = useState<"loading" | "success" | "alreadyVerified" | "failed">("loading")

    useEffect(() => {
        const verify = async () => {
            if (isVerifyEmail) {
                setVarificationStatus("alreadyVerified")
                return;
            }
            try {
                const result = await verifyEmail(token).unwrap();
                if (result.success) {
                    dispatch(setEmailVerified(true))
                    setVarificationStatus('success')
                    dispatch(authStatus())
                    toast.success('Email verified successfully')
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000)
                }
                else {
                    throw new Error(result.message || 'Verification failed')
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (token && varificationStatus === "loading") {
            verify();
        }
    }, [token, verifyEmail, dispatch, isVerifyEmail])
    return (
        <div className='p-20 flex items-center justify-center bg-linear-to-r from-blue-100 to-purple-100 min-h-screen'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full'
                transition={{ duration: 0.5 }}
            >
                {varificationStatus === "loading" && (
                    <div className='flex flex-col items-center'>
                        <Loader2 className='h-16 w-16 text-blue-500 animate-spin mb-4' />
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                            Verifying Your Email
                        </h2>
                        <p className='text-gray-500'>
                            Please wait while we confirm your email address...
                        </p>
                    </div>
                )}

                {varificationStatus === "success" && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                            Email Verified
                        </h2>
                        <p className='text-gray-500'>
                            Your Email has been verified successfully.You'll be redirecting homepage shortly...
                        </p>
                    </motion.div>
                )}
                {varificationStatus === "alreadyVerified" && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                            Email is already Verified
                        </h2>
                        <p className='text-gray-500'>
                            Your Email is already verified.You'll be enjoy our services...
                        </p>
                        <Button
                            onClick={() => router.push('/')}
                            className="bg-blue-500 mt-4 hover:bg-blue-600 font-bold text-white py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Go To Homepage
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default page;