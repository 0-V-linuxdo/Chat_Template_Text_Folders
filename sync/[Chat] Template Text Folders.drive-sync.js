/* -------------------------------------------------------------------------- *
 * [Chat] Template Text Folders · Google Drive sync module (external)
 * -------------------------------------------------------------------------- */

(function (global) {
    'use strict';

    const DRIVE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
    const DRIVE_FILES_ENDPOINT = 'https://www.googleapis.com/drive/v3/files';
    const DRIVE_UPLOAD_ENDPOINT = 'https://www.googleapis.com/upload/drive/v3/files';

    const DEFAULT_STORAGE_KEY = 'cttfDriveSettings';
    const DEFAULT_FILE_NAME = '[Chat] Template Text Folders.backup.json';

    const safeStringify = (value, fallback = '') => {
        try {
            return JSON.stringify(value);
        } catch {
            return fallback;
        }
    };

    function createDriveSyncModule(options = {}) {
        const storageKey = options.storageKey || DEFAULT_STORAGE_KEY;
        const defaultFileName = options.defaultFileName || DEFAULT_FILE_NAME;
        const translate = typeof options.translate === 'function' ? options.translate : (text) => text;

        let t = translate;
        let driveAccessToken = '';
        let driveAccessTokenExpireAt = 0;

        const baseSettings = {
            enabled: false,
            clientId: '',
            clientSecret: '',
            refreshToken: '',
            fileId: '',
            fileName: defaultFileName,
            lastSyncedAt: 0
        };

        const readSettings = () => {
            try {
                const raw = localStorage.getItem(storageKey);
                if (!raw) return { ...baseSettings };
                const parsed = JSON.parse(raw);
                return {
                    ...baseSettings,
                    ...(parsed && typeof parsed === 'object' ? parsed : {})
                };
            } catch (error) {
                console.warn('[CTTF] Drive settings parse failed:', error);
                return { ...baseSettings };
            }
        };

        let driveSyncSettings = readSettings();

        const persistSettings = () => {
            try {
                localStorage.setItem(storageKey, JSON.stringify(driveSyncSettings));
            } catch (error) {
                console.warn('[CTTF] Drive settings persist failed:', error);
            }
        };

        const setTranslator = (fn) => {
            if (typeof fn === 'function') {
                t = fn;
            }
        };

        const resetAuthCache = () => {
            driveAccessToken = '';
            driveAccessTokenExpireAt = 0;
        };

        const updateSettings = (partial = {}) => {
            const prev = { ...driveSyncSettings };
            driveSyncSettings = {
                ...driveSyncSettings,
                ...partial
            };
            const name = (driveSyncSettings.fileName || '').trim();
            driveSyncSettings.fileName = name || defaultFileName;
            const credsChanged =
                prev.clientId !== driveSyncSettings.clientId ||
                prev.clientSecret !== driveSyncSettings.clientSecret ||
                prev.refreshToken !== driveSyncSettings.refreshToken;
            const fileTargetChanged = prev.fileName !== driveSyncSettings.fileName;
            if (credsChanged) {
                resetAuthCache();
                driveSyncSettings.fileId = '';
            } else if (fileTargetChanged) {
                driveSyncSettings.fileId = '';
            }
            persistSettings();
            return { ...driveSyncSettings };
        };

        const getFileName = () => {
            const name = (driveSyncSettings.fileName || '').trim();
            if (name) {
                return name;
            }
            driveSyncSettings.fileName = defaultFileName;
            persistSettings();
            return driveSyncSettings.fileName;
        };

        const hasDriveCredentials = () => Boolean(
            driveSyncSettings.clientId &&
            driveSyncSettings.clientSecret &&
            driveSyncSettings.refreshToken
        );

        const ensureDriveSyncApiAvailable = () => {
            const available = typeof GM_xmlhttpRequest === 'function';
            if (!available) {
                try {
                    alert(t('当前环境不支持跨域请求，请在脚本管理器中启用 GM_xmlhttpRequest。'));
                } catch (_) {
                    /* noop */
                }
            }
            return available;
        };

        const refreshDriveAccessToken = () => new Promise((resolve, reject) => {
            const body = [
                ['client_id', driveSyncSettings.clientId],
                ['client_secret', driveSyncSettings.clientSecret],
                ['refresh_token', driveSyncSettings.refreshToken],
                ['grant_type', 'refresh_token']
            ]
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value || ''))}`)
                .join('&');
            GM_xmlhttpRequest({
                method: 'POST',
                url: DRIVE_TOKEN_ENDPOINT,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: body,
                onload: (response) => {
                    const text = response.responseText || '';
                    try {
                        const json = text ? JSON.parse(text) : {};
                        if (response.status >= 200 && response.status < 300) {
                            if (json.error) {
                                reject(new Error(`Drive token error: ${safeStringify(json, '[invalid json]')}`));
                            } else {
                                resolve(json);
                            }
                        } else {
                            reject(new Error(`Drive token HTTP ${response.status}: ${text || '[empty response]'}`));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: (err) => {
                    reject(new Error(`Drive token request failed: ${safeStringify(err, '{}')}`));
                }
            });
        });

        async function ensureDriveAccessToken() {
            const now = Date.now();
            if (driveAccessToken && now < driveAccessTokenExpireAt - 60000) {
                return driveAccessToken;
            }
            const tokenPayload = await refreshDriveAccessToken();
            driveAccessToken = tokenPayload.access_token;
            const expiresIn = Number(tokenPayload.expires_in) || 3600;
            driveAccessTokenExpireAt = now + expiresIn * 1000;
            return driveAccessToken;
        }

        function listDriveConfigFiles(token, targetName = getFileName()) {
            return new Promise((resolve, reject) => {
                const params = new URLSearchParams({
                    pageSize: '5',
                    fields: 'files(id,name,mimeType,modifiedTime,size)',
                    orderBy: 'modifiedTime desc'
                });
                const sanitizedName = (targetName || '').replace(/'/g, "\\'");
                params.set('q', `(trashed = false) and name = '${sanitizedName}'`);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${DRIVE_FILES_ENDPOINT}?${params.toString()}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText || '{}');
                                resolve(Array.isArray(data.files) ? data.files : []);
                            } catch (error) {
                                reject(error);
                            }
                        } else {
                            reject(new Error(`Drive list HTTP ${response.status}: ${response.responseText || ''}`));
                        }
                    },
                    onerror: (err) => {
                        reject(new Error(`Drive list network error: ${safeStringify(err, '{}')}`));
                    }
                });
            });
        }

        function downloadDriveFileContent(fileId, token) {
            return new Promise((resolve, reject) => {
                const encoded = encodeURIComponent(fileId);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${DRIVE_FILES_ENDPOINT}/${encoded}?alt=media`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.responseText || '');
                        } else {
                            let parsed;
                            try {
                                parsed = response.responseText ? JSON.parse(response.responseText) : null;
                            } catch {
                                parsed = null;
                            }
                            const err = new Error(
                                parsed?.error?.message
                                    ? `Drive download HTTP ${response.status}: ${parsed.error.message}`
                                    : `Drive download HTTP ${response.status}: ${response.responseText || ''}`
                            );
                            reject(err);
                        }
                    },
                    onerror: (err) => {
                        reject(new Error(`Drive download network error: ${safeStringify(err, '{}')}`));
                    }
                });
            });
        }

        function uploadDriveConfigFile({ token, fileId, fileName, content }) {
            return new Promise((resolve, reject) => {
                const boundary = `cttfBoundary${Date.now()}`;
                const metadata = {
                    name: fileName || getFileName(),
                    mimeType: 'application/json'
                };
                const multipartBody = [
                    `--${boundary}`,
                    'Content-Type: application/json; charset=UTF-8',
                    '',
                    JSON.stringify(metadata),
                    `--${boundary}`,
                    'Content-Type: application/json',
                    '',
                    content,
                    `--${boundary}--`,
                    ''
                ].join('\r\n');
                const hasFileId = Boolean(fileId);
                const targetUrl = hasFileId
                    ? `${DRIVE_UPLOAD_ENDPOINT}/${encodeURIComponent(fileId)}?uploadType=multipart`
                    : `${DRIVE_UPLOAD_ENDPOINT}?uploadType=multipart`;
                GM_xmlhttpRequest({
                    method: hasFileId ? 'PATCH' : 'POST',
                    url: targetUrl,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': `multipart/related; boundary=${boundary}`
                    },
                    data: multipartBody,
                    onload: (response) => {
                        const text = response.responseText || '';
                        try {
                            const json = text ? JSON.parse(text) : {};
                            if (response.status >= 200 && response.status < 300) {
                                resolve(json);
                            } else {
                                reject(new Error(`Drive upload HTTP ${response.status}: ${text || '[empty response]'}`));
                            }
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: (err) => {
                        reject(new Error(`Drive upload network error: ${safeStringify(err, '{}')}`));
                    }
                });
            });
        }

        const formatDriveError = (error) => {
            if (!error) return t('Drive 请求失败：') + 'Unknown error';
            if (typeof error === 'string') return error;
            if (error?.message) return error.message;
            try {
                return JSON.stringify(error);
            } catch {
                return String(error);
            }
        };

        async function syncUploadConfigToDrive(content) {
            const token = await ensureDriveAccessToken();
            const serializedContent = typeof content === 'string' ? content : safeStringify(content, '{}');
            const targetName = getFileName();
            const cachedId = (driveSyncSettings.fileId || '').trim();
            let uploadResult = null;
            try {
                uploadResult = await uploadDriveConfigFile({
                    token,
                    fileId: cachedId,
                    fileName: targetName,
                    content: serializedContent
                });
            } catch (error) {
                if (cachedId) {
                    uploadResult = await uploadDriveConfigFile({
                        token,
                        fileId: '',
                        fileName: targetName,
                        content: serializedContent
                    });
                } else {
                    throw error;
                }
            }
            const resolvedId = uploadResult?.id || cachedId || '';
            driveSyncSettings.fileId = resolvedId;
            driveSyncSettings.fileName = uploadResult?.name || targetName;
            driveSyncSettings.lastSyncedAt = Date.now();
            persistSettings();
            return {
                uploadResult,
                settings: { ...driveSyncSettings }
            };
        }

        async function syncDownloadConfigFromDrive() {
            const token = await ensureDriveAccessToken();
            const targetName = getFileName();
            let fileId = (driveSyncSettings.fileId || '').trim();
            let resolvedFileMeta = null;
            if (!fileId) {
                const files = await listDriveConfigFiles(token, targetName);
                if (!Array.isArray(files) || files.length === 0) {
                    const notFoundError = new Error(t('未找到云端配置文件。'));
                    notFoundError.code = 'NOT_FOUND';
                    throw notFoundError;
                }
                resolvedFileMeta = files[0];
                fileId = resolvedFileMeta?.id || '';
            }
            let content = '';
            try {
                content = await downloadDriveFileContent(fileId, token);
            } catch (error) {
                if (fileId && !resolvedFileMeta) {
                    const fallbackFiles = await listDriveConfigFiles(token, targetName);
                    if (Array.isArray(fallbackFiles) && fallbackFiles.length) {
                        resolvedFileMeta = fallbackFiles[0];
                        fileId = resolvedFileMeta?.id || fileId;
                        content = await downloadDriveFileContent(fileId, token);
                    } else {
                        throw error;
                    }
                } else {
                    throw error;
                }
            }
            driveSyncSettings.fileId = fileId;
            driveSyncSettings.fileName = resolvedFileMeta?.name || targetName;
            driveSyncSettings.lastSyncedAt = Date.now();
            persistSettings();
            return {
                id: fileId,
                name: driveSyncSettings.fileName,
                content,
                settings: { ...driveSyncSettings }
            };
        }

        return {
            setTranslator,
            getSettings: () => ({ ...driveSyncSettings }),
            updateSettings,
            persistSettings,
            resetAuthCache,
            getFileName,
            hasDriveCredentials,
            ensureDriveSyncApiAvailable,
            formatDriveError,
            syncUploadConfigToDrive,
            syncDownloadConfigFromDrive
        };
    }

    const exported = {
        createDriveSyncModule,
        DEFAULT_FILE_NAME,
        DEFAULT_STORAGE_KEY
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exported;
    }
    global.CTTFDriveSyncModule = exported;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

