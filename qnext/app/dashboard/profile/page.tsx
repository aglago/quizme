// app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserType } from '@/app/types';
import { useSession } from 'next-auth/react';

// Define form schema with Zod
const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  bio: z.string().optional(), // Added bio field
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession(); // Get update function

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      bio: '', // Added bio to default values
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/profile'); // Adjust endpoint if needed

        if (!response.ok) {
          const errorData = await response.json() as ApiResponse<null>;
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const profileData = await response.json() as ApiResponse<{ user: UserType }>;
        if (profileData.data?.user) {
          setUser(profileData.data.user);
          setValue('firstName', profileData.data.user.firstName || '');
          setValue('lastName', profileData.data.user.lastName || '');
          setValue('email', profileData.data.user.email || '');
          setValue('bio', profileData.data.user.bio || ''); // Set bio value
        } else {
          throw new Error(profileData.error || "Profile data is missing");
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'An error occurred while fetching profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      setIsLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiResponse<null>;
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedProfileData = await response.json() as ApiResponse<{ user: UserType }>;
      if (updatedProfileData.data?.user) {
        setUser(updatedProfileData.data.user);
        setSuccessMessage('Profile updated successfully!');
        // Update session with new user data
        await update({
          ...session,
          user: {
            ...session?.user,
            name: `${updatedProfileData.data.user.firstName} ${updatedProfileData.data.user.lastName}`,
          },
        });
      } else {
        throw new Error(updatedProfileData.error || "Failed to update profile");
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <p>Loading profile information...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
            <input
              id="firstName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('firstName')}
            />
            {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
            <input
              id="lastName"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('lastName')}
            />
            {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              id="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
          </div>
           <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
            <textarea
              id="bio"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('bio')}
            />
            {errors.bio && <p className="text-red-500 text-xs italic">{errors.bio.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;