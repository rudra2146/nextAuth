import  jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const getDataFromToken = async () => {
  const cookieStore = await cookies(); 
  console.log("Cookies store:", cookieStore);
  const token = cookieStore.get('next-auth.session-token')?.value;

  console.log("Retrieved token:", token);

  if (!token) {
    throw new Error('Token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { _id: string };
    return decoded._id;
  } catch (error) {
    throw new Error('Invalid token');
  }
};