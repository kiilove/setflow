import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";

export const getUser = httpsCallable(functions, "getUser");

export const fetchUserData = async (userId) => {
  try {
    const result = await getUser({ userId });
    return result.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
