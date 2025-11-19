"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名").max(50, "用户名不能超过50个字符"),
  password: z.string().min(1, "请输入密码").max(100, "密码不能超过100个字符"),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    // TODO: 这里需要调用后端登录接口
    console.log("登录数据:", data);

    // 模拟登录验证
    toast.success("登录成功!", {
      description: `欢迎回来, ${data.username}`,
      position: "top-center",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-4xl font-bold tracking-tight">
            登录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FieldGroup>
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
                      className="h-14 rounded-xl bg-muted/50 text-base"
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
                      className="h-14 rounded-xl bg-muted/50 text-base"
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
              className="h-14 w-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              登录
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
