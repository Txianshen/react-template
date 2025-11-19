"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
// import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { loginApi } from "@/api/login";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    console.log(data);
    // 目前默认直接跳转
    navigate("/app");
    // 等后续登录接口有了再对接
    // const response = await loginApi(data);
    // if (response && response.token) {
    //   // 保存 token 到 localStorage
    //   localStorage.setItem("token", response.token);
    //   localStorage.setItem("username", data.username);
    //   toast.success("登录成功!", {
    //     description: `欢迎回来, ${data.username}`,
    //   });
    //   // 跳转到主页
    //   navigate("/app");
    // } else {
    //   toast.error("登录失败", {
    //     description: response.message,
    //   });
    // }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[480px] border-border/50 bg-card/50 backdrop-blur-sm gap-4">
        <CardHeader className="space-y-1 px-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            登录
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FieldGroup className="border-[#3f3f46] border rounded-lg p-3 bg-[#1e1e21]">
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="username"
                      className="text-base font-medium"
                    >
                      用户名
                    </FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="Type here..."
                      aria-invalid={fieldState.invalid}
                      autoComplete="username"
                      className="h-10 rounded-lg bg-muted/50 text-base border-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="password"
                      className="text-base font-medium"
                    >
                      密码
                    </FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Type here..."
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
                      className="h-10 rounded-lg bg-muted/50 text-base border-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              form="login-form"
              className="h-10 w-full rounded-full cursor-pointer bg-gradient-to-r from-cyan-500 to-emerald-500 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              登录
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
