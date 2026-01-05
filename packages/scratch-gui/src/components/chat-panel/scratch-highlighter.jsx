import React, { useEffect, useRef } from "react";
import ScratchBlocks from "scratch-blocks";
import adapter from "../../../../scratch-vm/src/engine/adapter";
import { Button } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import styles from "./scratch-highlighter.css";

const ScratchHighlighter = ({ value, title = "scratch", vm }) => {
    const containerRef = useRef(null);
    const workspaceRef = useRef(null);

    // 只在组件首次挂载时 inject workspace
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

    // 当 value 变化时，仅更新积木内容
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

    // 卸载时释放 workspace
    useEffect(() => {
        return () => {
            if (workspaceRef.current) {
                workspaceRef.current.dispose();
                workspaceRef.current = null;
            }
        };
    }, []);

    const handleExecute = () => {
        if (!vm || !vm.editingTarget) {
            console.warn("VM 或 editingTarget 不存在");
            return;
        }

        const workspace = workspaceRef.current;
        if (!workspace) return;

        // 1. workspace → XML DOM
        const xmlDom = ScratchBlocks.Xml.workspaceToDom(workspace);

        // 2. ✅ 正确提取 block / shadow
        const blockDomList = Array.from(xmlDom.childNodes).filter(
            (node) => node.localName === "block" || node.localName === "shadow",
        );

        if (blockDomList.length === 0) {
            console.warn("没有可执行的积木");
            return;
        }
        // 3. Scratch 官方 adapter
        const blocks = adapter({
            xml: {
                outerHTML: blockDomList.map((node) => node.outerHTML).join(""),
            },
        });

        // 4. 官方复制流程
        vm.shareBlocksToTarget(blocks, vm.editingTarget.id);
        setTimeout(() => {
            vm.refreshWorkspace();
            vm.emitWorkspaceUpdate();
        }, 100);
    };

    const header = (
        <div className={styles.highlighterHeader}>
            <p className={styles.lang}>{title}</p>
            <Button variant="text" color="default" onClick={handleExecute} icon={<CaretRightOutlined />}>
                执行
            </Button>
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
