import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Save a project JSON to the project server.
 * This should eventually live in scratch-www.
 * @param {number} projectId the ID of the project, null if a new project.
 * @param {object} vmState the JSON project representation.
 * @param {object} params the request params.
 * @property {?number} params.originalId the original project ID if a copy/remix.
 * @property {?boolean} params.isCopy a flag indicating if this save is creating a copy.
 * @property {?boolean} params.isRemix a flag indicating if this save is creating a remix.
 * @property {?string} params.title the title of the project.
 * @returns {Promise} A promise that resolves when the network request resolves.
 */
export default async function (projectId, vmState, params) {
    const queryParams = {};
    if (Object.prototype.hasOwnProperty.call(params, "originalId"))
        queryParams.original_id = params.originalId;
    if (Object.prototype.hasOwnProperty.call(params, "isCopy"))
        queryParams.is_copy = params.isCopy;
    if (Object.prototype.hasOwnProperty.call(params, "isRemix"))
        queryParams.is_remix = params.isRemix;
    if (Object.prototype.hasOwnProperty.call(params, "title"))
        queryParams.title = params.title;

    const fileName = queryParams.title;
    if (queryParams.is_copy || queryParams.is_remix) {
        // 复制或改编作品，创建新作品记录
        const {
            data: {
                session: { user },
            },
        } = await supabase.auth.getSession();
        const uuid = uuidv4();
        const filePath = `${user.id}/${uuid}.sb3`;
        const thumbnailPath = `${user.id}/${uuid}.png`;
        // 上传sb3
        const { error: uploadSb3Error } = await supabase.storage
            .from("files")
            .upload(filePath, vmState, {
                contentType: "application/x.scratch.sb3",
            });
        if (uploadSb3Error) throw uploadSb3Error;
        // 上传缩略图（提前写入缩略图信息，后续再上传真实缩略图）
        const { data: insertData, error: insertError } = await supabase
            .from("files")
            .insert({
                user_id: user.id, // ⚠️ 必须是 auth 用户 id
                file_name: fileName,
                file_path: filePath,
                thumbnail_path: thumbnailPath,
            })
            .select()
            .single();
        if (insertError) throw insertError;
        return Promise.resolve(insertData);
    } else {
        const { data: fileData, error: errorData } = await supabase
            .from("files")
            .select("*")
            .eq("id", projectId)
            .single();
        if (errorData) throw errorData;
        const thumbnailPath = `${fileData.file_path.substring(0, fileData.file_path.lastIndexOf("."))}.png`;
        // 替换sb3
        const { error: updateError } = await supabase.storage
            .from("files")
            .upload(fileData.file_path, vmState, { upsert: true });
        if (updateError) throw updateError;
        // 替换文件名，不管原先有没有缩略图，都更新缩略图路径
        const { data, error } = await supabase
            .from("files")
            .update({ file_name: fileName, thumbnail_path: thumbnailPath })
            .eq("id", fileData.id)
            .select()
            .single();
        if (error) throw error;
        return Promise.resolve(data);
    }
}
