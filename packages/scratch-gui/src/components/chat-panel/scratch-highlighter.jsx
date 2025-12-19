import React, { useEffect, useRef } from "react";
import ScratchBlocks from "scratch-blocks";

import styles from "./scratch-highlighter.css";

const ScratchHighlighter = ({ value, title = "scratch" }) => {
    const containerRef = useRef(null);
    const workspaceRef = useRef(null);

    /**
     * ① 只在组件首次挂载时 inject workspace
     */
    useEffect(() => {
        if (!containerRef.current) return;
        if (workspaceRef.current) return;

        workspaceRef.current = ScratchBlocks.inject(containerRef.current, {
            media: "/static/media/", // 本地 media
            readOnly: true,
            toolbox: false,
            scrollbars: true,
            sounds: false,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.8,
                maxScale: 1,
                minScale: 0.5,
            },
            grid: {
                spacing: 40,
                length: 3,
                colour: "#ccc",
                snap: false,
            },
        });
    }, []);

    /**
     * ② 当 value 变化时，仅更新积木内容
     */
    useEffect(() => {
        if (!workspaceRef.current || !value) return;

        try {
            const xmlDom = ScratchBlocks.Xml.textToDom(value);
            ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(
                xmlDom,
                workspaceRef.current,
            );
            workspaceRef.current.scrollCenter();
        } catch (err) {
            console.error("Scratch XML 渲染失败:", err);
            containerRef.current.innerHTML = `<pre style="color:red">${err.message}</pre>`;
        }
    }, [value]);

    /**
     * ③ 卸载时释放 workspace
     */
    useEffect(() => {
        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
                workspaceRef.current = null;
            }
        };
    }, []);

    const header = (
        <div className={styles.highlighterHeader}>
            <p className={styles.lang}>{title}</p>
        </div>
    );

    const body = <div ref={containerRef} className={styles.highlighterBody} />;

    return (
        <div className={styles.scratchHighlighter}>
            {header}
            {body}
        </div>
    );
};

export default ScratchHighlighter;
