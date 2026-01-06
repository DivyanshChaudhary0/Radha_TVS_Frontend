import { authApi } from "@/api/authApi";
import { bikeApi } from "@/api/bikeApi";
import { customerApi } from "@/api/customerApi";
import { saleApi } from "@/api/saleApi";
import { Bike, Customer, Sale, User } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: any;
  setUser: React.Dispatch<any>;
  bikes: Bike[];
  setBikes: React.Dispatch<React.SetStateAction<Bike[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBikes();
      fetchCustomers();
      fetchSales();
    }
  }, [user]);

  const checkAuth = async () => {
    const savedToken = await AsyncStorage.getItem("token");
    try {
      const res: any = await authApi.verifyToken();
      setUser(res.user);
      if (savedToken) {
        setToken(savedToken);
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const fetchBikes = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await bikeApi.getAll();
      setBikes(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch bikes. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await customerApi.getAllCustomers();
      setCustomers(res);
    } catch (error) {
      Alert.alert("Error", "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      setIsLoading(true);
      const res = await saleApi.getAll();
      setSales(res.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { token, user } = await authApi.login(
        email.trim(),
        password.trim()
      );
      console.log("user", user);
      console.log("token", token);
      setUser(user);
      await AsyncStorage.setItem("token", token);
      setToken(token);
      router.replace("/Dashboard");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message ||
          error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    router.replace("/(auth)/Login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        login,
        logout,
        user,
        setUser,
        bikes,
        setBikes,
        customers,
        setCustomers,
        sales, 
        setSales
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
