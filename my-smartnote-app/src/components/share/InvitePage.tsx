import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, Loader2 } from "lucide-react";
import {
  checkInvite,
  InviteResponse,
  requestAccess,
} from "@/service/InviteService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function InvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [inviteStatus, setInviteStatus] = useState<
    InviteResponse["result"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false); // Kiểm tra đã gửi request chưa
  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển trang
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      const url = new URL(window.location.href);
      console.log(url);
      const redirectPath = url.searchParams.get("redirect");
      const tokenInvite = redirectPath?.split("token=")[1];
      console.log("Token from URL:", tokenInvite);
      localStorage.setItem("tokenInvite", tokenInvite ?? "");
      console.log(tokenInvite);
      if (redirectPath) {
        localStorage.setItem("redirectAfterLogin", redirectPath);
      }
      navigate(`/login?redirect=/join?token=${token}`);
      return;
    }

    // Xử lý logic khi đã đăng nhập và có token
    if (token) {
      checkInvite(token)
        .then((response) => {
          console.log("API Response:", response);
          setInviteStatus(response.result);
        })
        .catch(() => {
          setError("Invalid or expired invite link");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No token provided");
      setLoading(false);
    }
  }, [token, navigate]);

  const handleRequestAccess = async () => {
    if (!token) return;
    setIsRequesting(true);

    const tokenInvite = localStorage.getItem("tokenInvite");

    try {
      console.log("Requesting access with token:", token);
      if (tokenInvite) {
        await requestAccess(tokenInvite);
      } else {
        toast.error("Invite token is missing or invalid.");
      }

      toast.success("Send request access successful!");
      setHasRequested(true);
      localStorage.removeItem("tokenInvite"); 
      localStorage.removeItem("redirectAfterLogin"); 

      setTimeout(() => {
        navigate("/"); 
      }, 3000); 
    } catch {
      toast.error("Failed to request access!");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-gray-500" size={50} />
            <p className="text-lg font-semibold mt-4">
              Checking invite link...
            </p>
          </div>
        ) : error ? (
          <div>
            <XCircle className="text-red-500 mx-auto" size={50} />
            <p className="text-lg font-semibold text-red-600 mt-4">{error}</p>
          </div>
        ) : (
          <CardContent>
            {/* Hiển thị icon tương ứng với trạng thái */}
            {hasRequested ? (
              <CheckCircle className="text-green-500 mx-auto" size={50} />
            ) : (
              <HelpCircle className="text-gray-500 mx-auto" size={50} />
            )}

            <h2 className="text-2xl font-bold mt-4">You're Invited!</h2>

            <div className="mt-3 p-3 bg-gray-100 rounded-lg text-gray-600">
              <p className="text-sm font-medium">
                <span className="font-semibold">Status:</span>{" "}
                {inviteStatus?.status || "Unknown"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Expires on:</span>{" "}
                {inviteStatus?.expiryDate
                  ? new Date(inviteStatus.expiryDate).toLocaleString()
                  : "Unknown"}
              </p>
              <p
                className={`mt-2 text-sm font-semibold ${
                  hasRequested ? "text-green-600" : "text-orange-500"
                }`}
              >
                {hasRequested
                  ? "Đã gửi yêu cầu truy cập"
                  : "Chưa gửi yêu cầu truy cập"}
              </p>
            </div>

            <Button
              className="mt-5 w-full flex items-center justify-center"
              onClick={handleRequestAccess}
              disabled={isRequesting || hasRequested}
            >
              {isRequesting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Sending Request...
                </>
              ) : (
                "Request Access"
              )}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
