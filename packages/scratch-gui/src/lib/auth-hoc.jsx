import React from "react";
import { supabase } from "./supabase";
import { connect } from "react-redux";
import { setSession } from "../reducers/session";

const AuthHOC = function (WrappedComponent) {
    class AuthComponent extends React.Component {
        componentDidMount() {
            this.checkAuthParams();
            this.injectSessionToRedux();
        }

        returnToManagePanel() {
            const isDev = process.env.NODE_ENV === "development";
            const baseUrl = isDev
                ? "http://localhost:5173"
                : "https://blockcode.com.cn";
            window.location.href = baseUrl;
        }

        async checkAuthParams() {
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

            const { error } = await supabase.auth.setSession({
                access_token: token,
                refresh_token: refreshToken,
            });
            if (error) {
                console.error("Supabase session error:", error);
                this.returnToManagePanel();
            }
        }

        async injectSessionToRedux() {
            const { data } = await supabase.auth.getSession();
            const profile = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.session.user.id)
                .maybeSingle();
            if (profile.error) {
                console.error(profile.error);
                this.returnToManagePanel();
            }
            const sessionState = {
                session: {
                    user: {
                        username:
                            profile.data.nick_name ||
                            data.session.user.email.split("@")[0], // 用邮箱前缀做 username
                        thumbnailUrl: null, // Supabase avatar 或 null
                        classroomId: null, // 可以置 null
                    },
                },
                permissions: {
                    educator: profile.data.role === "student" ? false : true, // 默认 false，可根据实际业务修改
                    student: profile.data.role === "student" ? true : false, // 默认 true
                },
            };
            this.props.setSession(sessionState);
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    const mapDispatchToProps = (dispatch) => ({
        setSession: (sessionState) => dispatch(setSession(sessionState)),
    });

    return connect(null, mapDispatchToProps)(AuthComponent);
};

export default AuthHOC;
