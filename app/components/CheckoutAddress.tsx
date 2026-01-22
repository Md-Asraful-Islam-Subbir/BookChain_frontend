import { Address } from '@/lib/types/type';
import { useAddOrUpdateAddressMutation, useGetAddressQuery } from '@/store/api';
import React, { useState } from 'react';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import BookLoader from '@/lib/BookLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface AddressResponse {
    success: boolean;
    message: string;
    data: {
        addresses: Address[];
    }
}
const addressFormSchema = zod.object({
    phoneNumber: zod.string().min(10, "Phone number must be 10 digits"),
    addressLine1: zod.string().min(5, "Address line 1 at least 5 characters"),
    addressLine2: zod.string().optional(),
    city: zod.string().min(2, "City at least 2 characters"),
    state: zod.string().min(2, "State at least 2 characters"),
    pincode: zod.string().min(6, "Pincode must be 6 digits")
});
type AddressFormValues = zod.infer<typeof addressFormSchema>;

interface CheckoutAddressProps {
    onAddressSelect: (address: Address) => void;
    selectedAddressId?: string;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({ onAddressSelect, selectedAddressId }) => {

    const { data: addressData, isLoading } = useGetAddressQuery() as {
        data: AddressResponse | undefined;
        isLoading: boolean;
    };

    const [addOrUpdateAddress] = useAddOrUpdateAddressMutation();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const addresses = addressData?.data?.addresses || [];

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            phoneNumber: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
        }
    });
    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        form.reset(address);
        setShowAddressForm(true);
    }
    const onSubmit = async (data: AddressFormValues) => {
        try {
            let result;
            if (editingAddress) {
                const updateAddress = {
                    ...editingAddress,
                    ...data,
                    addressId: editingAddress._id,
                };
                result = await addOrUpdateAddress(updateAddress).unwrap();
            }
            else {
                result = await addOrUpdateAddress(data).unwrap();
            }
        } catch (error) {
            console.log(error);
        }
    }
    if (isLoading) {
        <BookLoader />;
    }
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {addresses.map((address: Address) => (
                    <Card
                        key={address._id}
                        className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${selectedAddressId === address._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                            }`}
                    >
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Checkbox
                                    checked={selectedAddressId === address._id}
                                    onCheckedChange={() => onAddressSelect(address)}
                                    className="w-5 h-5"
                                />

                                <div className="flex items-center justify-between">
                                    <Button
                                        size='icon'
                                        variant='ghost'
                                        onClick={() => handleEditAddress(address)}
                                    >
                                        <Pencil className='h-5 w-5 text-gray-600 hover:blue-500' />
                                    </Button>
                                </div>
                            </div>
                            <div className='text-sm text-gray-600'>
                                <p>{address?.addressLine1}</p>
                                {address?.addressLine2 && (
                                    <p>{address?.addressLine2}</p>
                                )}
                                <p></p>
                                <p>
                                    {address.city}, {address.state}{" "}
                                </p>
                                <p>{address.pincode}</p>
                                <p></p>
                                <p className='mt-2 font-medium'>Phone: {address.phoneNumber}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Phone Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="addressLine1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address Line 1</FormLabel>
                                        <FormControl>
                                            <Input placeholder="address,street,house no" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="addressLine2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address Line 2(optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="appartment,suite,unit.." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>city</FormLabel>
                                        <FormControl>
                                            <Input placeholder="city" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
<FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>state</FormLabel>
                                        <FormControl>
                                            <Input placeholder="state" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            </div>
                            <FormField
                                control={form.control}
                                name="pincode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>pincode</FormLabel>
                                        <FormControl>
                                            <Input placeholder="pincode" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='w-full'>
                                {editingAddress? 'Update Address':'Add Address'}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CheckoutAddress