import { supabase } from "./supabase";

const uploadRecord = async (id = null, content = null) => {
    if (id === null) {
        // 创建新记录
        const { data, error } = await supabase
            .from("chat_history")
            .insert([{ title: "新对话", content: content || [] }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    let submitData = {};
    if (content !== null) submitData.content = content;
    const { data, error } = await supabase.from("chat_history").update(submitData).eq("id", id);
    if (error) throw error;
    return data;
};

const getChatRecords = async () => {
    const { data, error } = await supabase
        .from("chat_history")
        .select("id,created_at,title");
    if (error) throw error;
    return data.map((item) => {
        return {
            key: item.id,
            label: item.title,
            timestamp: new Date(item.created_at),
        };
    });
};

const getChatRecord = async (id) => {
    const { data, error } = await supabase
        .from("chat_history")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return {
        id: data.id,
        sessionTitle: data.title,
        messages: data.content,
        timestamp: new Date(data.created_at),
    };
};

const deleteRecord = async (id) => {
    const { error } = await supabase.from("chat_history").delete().eq("id", id);
    if (error) throw error;
}

export { uploadRecord, getChatRecords, getChatRecord, deleteRecord };
