"use client";
import Link from "next/link";
import * as Card from "@/components/ui/card";
import RegisterForm from "../../components/register-form";

const SignUpView = () => {
  return (
    <Card.Card className="w-full bg-transparent border-transparent shadow-none md:w-1/2">
      <Card.CardContent className="space-y-6">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-semibold">建立你的帳號</h1>
          <h2 className="text-sm">成為會員不定時享有優惠</h2>
        </div>
        <RegisterForm />
        <div className="text-center text-sm">
          已經有帳戶嗎?{" "}
          <Link
            href={"/sign-in"}
            className="duration-300 hover:underline"
          >
            登入
          </Link>
        </div>
      </Card.CardContent>
    </Card.Card>
  );
};

export default SignUpView;
