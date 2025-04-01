import httpRequest from "@/utils/httpRequest";

// Cập nhật interface InviteResponse để khớp với InviteLinkResponse từ backend
export interface InviteResponse {
  code?: number;
  message?: string;
  result: {
    inviteLink: string;
    status: string; // InviteStatus từ backend
    expiryDate: string; // Định dạng "yyyy-MM-dd HH:mm:ss"
    noteId: number | null; // Thêm noteId
    taskId: number | null; // Thêm taskId
    permissions: string;
  };
}

// Gửi lời mời qua email (không cần noteId/taskId)
export const sendInvitation = async (
  email: string,
  role: string
): Promise<string> => {
  try {
    const response = await httpRequest.post<InviteResponse>(
      `/invite/send?email=${encodeURIComponent(
        email
      )}&role=${encodeURIComponent(role)}`
    );

    return `Lời mời đã được gửi đến ${email}`;

  } catch (error) {
    console.error("Error sending invitation:", error);
    throw new Error("Failed to send invitation");
  }
};

// Chấp nhận lời mời
export const acceptInvitation = async (token: string): Promise<string> => {
  try {
    const response = await httpRequest.post<InviteResponse>("/invite/accept", {
      token,
    });

    if (response.data.code === 1000) {
      return "Lời mời đã được chấp nhận thành công";
    }

    throw new Error(response.data.message || "Chấp nhận lời mời thất bại");
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw new Error("Failed to accept invitation");
  }
};

// Tạo link mời với tùy chọn noteId hoặc taskId
export const generateInviteLink = async (
  role: string,
  noteId?: number, // Thêm tham số tùy chọn
  taskId?: number
): Promise<string> => {
  try {
    // Xây dựng query string dựa trên tham số truyền vào
    let url = `/invite/generate-invite-link?role=${encodeURIComponent(role)}`;
    if (noteId) url += `&noteId=${noteId}`;
    if (taskId) url += `&taskId=${taskId}`;

    const response = await httpRequest.post<InviteResponse>(url);

    console.log("API Response:", response.data);

    if (response.status === 200 && response.data?.result.inviteLink) {
      return response.data.result.inviteLink; // Trả về inviteLink
    }

    throw new Error(response.data?.message || "Tạo link mời thất bại");
  } catch (error) {
    console.error("Error generating invite link:", error);
    throw new Error("Failed to generate invite link");
  }
};

// Kiểm tra trạng thái link mời
export const checkInvite = async (token: string): Promise<InviteResponse> => {
  try {
    const response = await httpRequest.get<InviteResponse>(
      `/invite/check-invite?token=${encodeURIComponent(token)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking invite:", error);
    throw new Error("Failed to check invite");
  }
};

// Yêu cầu quyền truy cập
export const requestAccess = async (
  token: string,
  email?: string
): Promise<string> => {
  try {
    console.log("Sending token:", token);

    // Lấy email từ localStorage nếu email truyền vào bị null hoặc undefined
    const userEmail = email ?? localStorage.getItem("email");

    // Tạo URL động, chỉ thêm email nếu nó có giá trị
    let url = `/invite/request-access?token=${encodeURIComponent(token)}`;
    if (userEmail) {
      url += `&email=${encodeURIComponent(userEmail)}`;
    }

    const response = await httpRequest.post<{ code: number; message: string }>(
      url
    );

    if (response.data.code === 1000) {
      return "Yêu cầu truy cập đã được gửi thành công";
    }

    throw new Error(response.data.message || "Gửi yêu cầu truy cập thất bại");
  } catch (error) {
    console.error("Error requesting access:", error);
    throw new Error("Failed to request access");
  }
};

export const approveAccess = async (
  token: string,
  approve: boolean
): Promise<string> => {
  try {
    const response = await httpRequest.post<{ code: number; message: string }>(
      `/invite/approve?token=${encodeURIComponent(token)}&approve=${approve}`
    );
    if (response.data.code === 1000) {
      return approve
        ? "Quyền truy cập đã được phê duyệt"
        : "Yêu cầu truy cập đã bị từ chối";
    }
    throw new Error(
      response.data.message || "Phê duyệt quyền truy cập thất bại"
    );
  } catch (error) {
    console.error("Error approving access:", error);
    throw new Error("Failed to approve access");
  }
};
