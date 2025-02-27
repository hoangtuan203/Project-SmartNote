import httpRequest from "@/utils/httpRequest";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  code: number;
  message: string;
  result: {
    token: string;
    userId: string;
    userName: string;
    email: string;
  };
}

interface OAuthResponse {
  token: string;
  userId: string;
  userName: string;
  role: string;
}

export const loginBasic = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse["result"]> => {
  try {
    const response = await httpRequest.post<LoginResponse>(
      "/auth/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Kiểm tra mã lỗi từ phản hồi
    if (response.data?.code !== 1000) {
      console.error("Login error:", response.data?.message);
      throw new Error(response.data?.message || "Login failed");
    }

    return response.data.result; // Trả về dữ liệu nếu thành công
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error logging in:", error.message);
      throw new Error(error.message || "Network error");
    } else if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const axiosError = error as { response: { data: string } };
      throw new Error(axiosError.response.data || "Network error");
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};
//login google, facebook
export const handleOAuthCallback = async (
  provider: string,
  code: string
): Promise<OAuthResponse> => {

  console.log("code ", code)
  try {
    const response = await httpRequest.post<OAuthResponse>(
      `/auth/oauth2/callback/${provider}`,
      { code }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error logging in:", error.message);
      throw new Error(error.message || "Network error");
    } else if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const axiosError = error as { response: { data: string } };
      throw new Error(axiosError.response.data || "Network error");
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};
