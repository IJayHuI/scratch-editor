import {ScratchStorage, Asset} from 'scratch-storage';
import { supabase } from './supabase';

import defaultProject from './default-project';
import {GUIStorage, TranslatorFunction} from '../gui-config';

import saveProjectToServer from '../lib/save-project-to-server';

export class LegacyStorage implements GUIStorage {
    private projectHost?: string;
    private projectToken?: string;
    private backpackHost?: string;
    private translator?: TranslatorFunction;

    readonly scratchStorage = new ScratchStorage();

    constructor () {
        this.cacheDefaultProject(this.scratchStorage);
        this.addOfficialScratchWebStores(this.scratchStorage);
    }

    setProjectHost (host: string): void {
        this.projectHost = host;
    }

    setProjectToken (token: string): void {
        this.projectToken = token;
    }

    setProjectMetadata (projectId: string | null | undefined): void {
        const {RequestMetadata, setMetadata, unsetMetadata} = this.scratchStorage.scratchFetch;

        // If project ID is '0' or zero, it's not a real project ID. In that case, remove the project ID metadata.
        // Same if it's null undefined.
        if (projectId && projectId !== '0') {
            setMetadata(RequestMetadata.ProjectId, projectId);
        } else {
            unsetMetadata(RequestMetadata.ProjectId);
        }
    }

    setTranslatorFunction (translator: TranslatorFunction): void {
        this.translator = translator;

        // TODO: Verify that this is correct
        this.cacheDefaultProject(this.scratchStorage);
    }

    setBackpackHost (host: string): void {
        const shouldAddSource = !this.backpackHost;
        if (shouldAddSource) {
            const AssetType = this.scratchStorage.AssetType;

            this.scratchStorage.addWebStore(
                [AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound],
                this.getBackpackAssetURL.bind(this)
            );
        }

        this.backpackHost = host;
    }

    saveProject (
        projectId: number,
        vmState: string,
        params: { originalId: string; isCopy: boolean; isRemix: boolean; title: string; }
    ) {
        return saveProjectToServer(projectId, vmState, params);
    }

    private cacheDefaultProject (storage: ScratchStorage) {
        const defaultProjectAssets = defaultProject(this.translator);
        defaultProjectAssets.forEach(asset => storage.builtinHelper._store(
            storage.AssetType[asset.assetType],
            storage.DataFormat[asset.dataFormat],
            asset.data,
            asset.id
        ));
    }

    private addOfficialScratchWebStores (storage: ScratchStorage) {  
        // 为项目使用自定义加载器  
        const originalLoad = storage.load.bind(storage);  
        storage.load = (assetType, assetId, dataFormat) => {
            if (assetType === storage.AssetType.Project) {
                return this.loadProjectFromSupabase(assetId.toString());
            }
            return originalLoad(assetType, assetId, dataFormat);
        };  
          
        // 添加占位符URL配置  
        storage.addWebStore(  
            [storage.AssetType.Project],  
            () => 'supabase://projects',  
            this.getProjectCreateConfig.bind(this),  
            this.getProjectUpdateConfig.bind(this)  
        );  
          
        // 保持其他存储不变  
        storage.addWebStore(  
            [storage.AssetType.ImageVector, storage.AssetType.ImageBitmap, storage.AssetType.Sound],  
            this.getAssetGetConfig.bind(this),  
            this.getAssetCreateConfig.bind(this),  
            this.getAssetCreateConfig.bind(this)  
        );  
          
        storage.addWebStore(  
            [storage.AssetType.Sound],  
            asset => `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`  
        );  
    }  

    private async loadProjectFromSupabase(assetId: string) {  
        try {
            // 获取当前会话
            const { data: sessionData } = await supabase.auth.getSession();
            // 查询文件元数据
            const { data: fileData, error: errorData } = await supabase
                .from("files")
                .select("*")
                .eq("id", assetId)
                .single();
            if (errorData || !fileData) {
                throw new Error(
                    `文件未找到: ${errorData?.message || "未知错误"}`,
                );
            }
            // 检测是否为本人项目
            const isOwner = sessionData?.session?.user?.id === fileData.user_id;
            // 创建签名URL
            const { data: urlData, error: urlError } = await supabase.storage
                .from("files")
                .createSignedUrl(fileData.file_path, 60 * 60);
            if (urlError || !urlData?.signedUrl) {
                throw new Error(
                    `无法创建签名URL: ${urlError?.message || "未知错误"}`,
                );
            }
            // 下载文件
            const response = await fetch(urlData?.signedUrl);
            if (!response.ok) {
                throw new Error(`下载失败: ${response.statusText}`);
            }
            // 直接返回ArrayBuffer，让VM处理解压
            const arrayBuffer = await response.arrayBuffer();
            // 创建Asset对象
            const asset = this.scratchStorage.createAsset(
                this.scratchStorage.AssetType.Project,
                this.scratchStorage.DataFormat.SB3,
                new Uint8Array(arrayBuffer),
                assetId,
                true,
            );

            (asset as any).isOwner = isOwner;
            (asset as any).projectName = fileData.file_name;
            return asset;
        } catch (error) {  
            console.error('从Supabase加载项目失败:', error);  
            throw error;  
        }  
    }  

    private getProjectGetConfig (projectAsset) {
        const path = `${this.projectHost}/${projectAsset.assetId}`;
        const qs = this.projectToken ? `?token=${this.projectToken}` : '';
        return path + qs;
    }

    private getProjectCreateConfig () {
        return {
            url: `${this.projectHost}/`,
            withCredentials: true
        };
    }

    private getProjectUpdateConfig (projectAsset: Asset) {
        return {
            url: `${this.projectHost}/${projectAsset.assetId}`,
            withCredentials: true
        };
    }

    private getAssetGetConfig (asset: Asset) {
        return `/static/assets/${asset.assetId}.${asset.dataFormat}`;
    }

    private getAssetCreateConfig (asset: Asset) {
        return {
            // There is no such thing as updating assets, but storage assumes it
            // should update if there is an assetId, and the asset store uses the
            // assetId as part of the create URI. So, force the method to POST.
            // Then when storage finds this config to use for the "update", still POSTs
            method: "post",
            url: `/static/assets/${asset.assetId}.${asset.dataFormat}`,
            withCredentials: true,
        };
    }

    private getBackpackAssetURL (asset) {
        return `${this.backpackHost}/${asset.assetId}.${asset.dataFormat}`;
    }
}
