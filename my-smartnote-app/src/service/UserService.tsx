import httpRequest from "@/utils/httpRequest";

export interface User {
  userId: number;
  fullName: string;
  email: string;
  password: string;
  avatarUrl: string;
  provider: string;
  createdAt: string | null;
}

export interface UserResponseWrapper {
  totalPages: number;
  totalElements: number;
  users: User[];
}

export interface UserCreateRequest {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  provider: string;
  role: string;
}

export interface UserResponse {
  userId: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  provider: string;
  createdAt: string | null;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
}

export const getAllUser = async (page: number = 1, size: number = 5): Promise<UserResponseWrapper> => {
  try {
    const response = await httpRequest.get<ApiResponse<UserResponseWrapper>>(`/user?page=${page}&size=${size}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};


export const registerUser = async (user: UserCreateRequest): Promise<UserResponse> => {
  try {
    const response = await httpRequest.post<ApiResponse<UserResponse>>("/user/register", user);
    return response.data.result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Failed to register user");
  }
};