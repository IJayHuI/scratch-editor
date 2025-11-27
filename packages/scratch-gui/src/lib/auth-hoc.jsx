import React from "react";
import { supabase } from "./supabase";

const AuthHOC = function (WrappedComponent) {
    class AuthComponent extends React.Component {
        componentDidMount() {
            this.checkAuthParams();
        }

        returnToManagePanel() {
            const isDev = process.env.NODE_ENV === "development";
            const baseUrl = isDev
                ? "http://localhost:5173"
                : "https://blockcode.com.cn";
            window.location.href = baseUrl;
        }

        async setSupabaseSession(token, refreshToken) {
            const { error } = await supabase.auth.setSession({
                access_token: token,
                refresh_token: refreshToken,
            });
            if (error) {
                console.error("Supabase session error:", error);
                this.returnToManagePanel();
            }
        }

        checkAuthParams() {
            const hash = window.location.hash.substring(1); // 移除 #
            const hashParts = hash.split("?"); // 分割路径和查询参数

            const projectId = hashParts[0]; // 项目ID在问号前面
            const params = new URLSearchParams(hashParts[1] || ""); // 只解析查询参数部分

            const token = params.get("token");
            const refreshToken = params.get("refresh-token");

            // 检查是否三个参数都存在
            if (!projectId || !token || !refreshToken) {
                this.returnToManagePanel();
            }

            this.setSupabaseSession(token, refreshToken);
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return AuthComponent;
};

export default AuthHOC;
