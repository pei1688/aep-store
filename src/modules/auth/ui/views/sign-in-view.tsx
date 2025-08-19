"use client";

import Link from "next/link";
import * as Card from "@/components/ui/card";
import LoginForm from "../../components/login-form";

const SignInView = () => {
 
  return (
    <Card.Card className="w-full bg-transparent border-transparent shadow-none md:w-1/2">
      <Card.CardContent className="space-y-6">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-semibold">歡迎回來</h1>
          <h2 className="text-sm">管理您的帳號</h2>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          還沒有帳戶嗎?{" "}
          <Link
            href={"/sign-up"}
            className="duration-300 hover:underline"
          >
            註冊
          </Link>
        </div>
      </Card.CardContent>
    </Card.Card>
  );
};

export default SignInView;
