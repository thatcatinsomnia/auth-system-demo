"use server";

import { AxiosError } from 'axios';
import axios from 'axios';
import { RedirectType, redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const getUserFromDB = async (email: string, password: string) => {
  const url = process.env.AUTH_URL + '/sign-in';

  try {
    const res = await axios.post(url, {
      email,
      password
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export default async function signIn(formData: FormData) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  let user = null;

  try {
    user = await getUserFromDB(formData.get('email') as string, formData.get('password') as string);

    if (user) {
      cookies().set('access_token', user.accessToken, {
        httpOnly: isProduction,
        secure: isProduction
      });

      cookies().set('refresh_token', user.refreshToken, {
        httpOnly: isProduction,
        secure: isProduction
      });
      
    }
  } catch (error) {
    let errorMsg = 'Something error when sign in';

    if (error instanceof AxiosError && error.response?.status === 400) {
      errorMsg = 'Email and password fields are required !!!';
    } else if (error instanceof AxiosError && error.response?.status === 401) {
      errorMsg = 'Password not correct';
    } else if (error instanceof AxiosError && error.response?.status === 404) {
      errorMsg = 'Email not exist';
    }

    console.log(error)
    return {
      error: errorMsg
    };
  } 

  // must call ouside try catch block
  // documents: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#redirecting
  redirect(process.env.WEB_URL!);
}