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


interface RefreshTokenResponse {
  code: number;
  message: string;
  result: {
    token: string;
    authenticated: boolean;
  };
}

interface VerifyCaptchaResponse {
  message: string;
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
  console.log("OAuth code received:", code);

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


export const verifyCaptcha = async (token: string): Promise<VerifyCaptchaResponse> => {
  try {
    // Gửi yêu cầu đến backend để xác minh token CAPTCHA qua query parameter
    const response = await httpRequest.post<VerifyCaptchaResponse>(
      "/auth/verify-captcha", // API endpoint
      null, // Không cần body, vì token sẽ được gửi qua query parameter
      {
        params: {
          token, // Truyền token qua query parameter
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response)
    // Trả về toàn bộ response.data
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error verifying captcha:", error.message);
      throw new Error(error.message || "Captcha verification failed");
    } else if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const axiosError = error as { response: { data: VerifyCaptchaResponse } };
      throw new Error(axiosError.response.data.message || "Captcha verification failed");
    } else {
      throw new Error("Unexpected error occurred during captcha verification");
    }
  }
};

export const refreshToken = async (currentToken: string): Promise<string> => {
  try {
    // Gửi yêu cầu refresh token đến backend
    const response = await httpRequest.post<RefreshTokenResponse>(
      "/auth/refresh", // API endpoint
      { token: currentToken }, // Gửi token cũ trong body
      {
        headers: {
          Authorization: `Bearer ${currentToken}`, // Gửi token cũ trong header
        },
      }
    );

    // Kiểm tra mã lỗi từ phản hồi
    if (response.data?.code !== 1000) {
      console.error("Refresh token error:", response.data?.message);
      throw new Error(response.data?.message || "Token refresh failed");
    }

    const newToken = response.data.result?.token; // Lấy token mới từ phản hồi

    if (!newToken) {
      throw new Error("No token returned from refresh API");
    }

    // Cập nhật token mới vào localStorage
    localStorage.setItem("token", newToken);

    // Trả về token mới
    return newToken;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error refreshing token:", error.message);
      throw new Error(error.message || "Network error");
    } else if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const axiosError = error as { response: { data: string } };
      throw new Error(axiosError.response.data || "Token refresh failed");
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};