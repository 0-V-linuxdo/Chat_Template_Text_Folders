/* -------------------------------------------------------------------------- *
 * [Chat] Template Text Folders · Google Drive sync module (bundled)
 * -------------------------------------------------------------------------- */

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

        const resolveGMRequest = () => {
            try {
                if (typeof GM_xmlhttpRequest === 'function') {
                    return GM_xmlhttpRequest;
                }
                if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.GM_xmlhttpRequest === 'function') {
                    return unsafeWindow.GM_xmlhttpRequest;
                }
                if (typeof window !== 'undefined' && typeof window.GM_xmlhttpRequest === 'function') {
                    return window.GM_xmlhttpRequest;
                }
            } catch (_) {
                /* ignore resolution errors */
            }
            return null;
        };

        const resolveFetch = () => {
            try {
                if (typeof fetch === 'function') {
                    return fetch;
                }
                if (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function') {
                    return globalThis.fetch;
                }
                if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
                    return window.fetch.bind(window);
                }
                if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.fetch === 'function') {
                    return unsafeWindow.fetch.bind(unsafeWindow);
                }
            } catch (_) {
                /* ignore resolution errors */
            }
            return null;
        };

        const performDriveRequest = async (options = {}) => {
            const attemptGM = async () => {
                const gmRequest = resolveGMRequest();
                if (!gmRequest) return null;
                return new Promise((resolve, reject) => {
                    try {
                        gmRequest({
                            method: options.method || 'GET',
                            url: options.url,
                            headers: options.headers,
                            data: options.data,
                            onload: (response) => {
                                const payload = {
                                    status: response.status,
                                    responseText: response.responseText || ''
                                };
                                if (payload.status === 0) {
                                    reject(new Error('GM_xmlhttpRequest returned status 0 (likely blocked or offline).'));
                                    return;
                                }
                                resolve(payload);
                            },
                            onerror: (err) => {
                                const message = err?.error || err?.message || safeStringify(err, '{}');
                                reject(new Error(message));
                            }
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            };

            const attemptFetch = async () => {
                const fetchApi = resolveFetch();
                if (!fetchApi) return null;
                const response = await fetchApi(options.url, {
                    method: options.method || 'GET',
                    headers: options.headers,
                    body: options.data,
                    credentials: 'omit',
                    mode: 'cors',
                    cache: 'no-store'
                });
                return {
                    status: response.status,
                    responseText: await response.text()
                };
            };

            const pref = driveSyncSettings.requestMode === 'adguard' ? ['fetch', 'gm'] : ['gm', 'fetch'];
            let lastError = null;
            for (const method of pref) {
                try {
                    if (method === 'gm') {
                        const res = await attemptGM();
                        if (res) return res;
                    } else {
                        const res = await attemptFetch();
                        if (res) return res;
                    }
                } catch (error) {
                    lastError = error;
                }
            }
            throw lastError || new Error('No request API available for Drive sync.');
        };

        const buildHttpError = (label, response) => {
            const status = response?.status ?? 0;
            const text = response?.responseText || '';
            const error = new Error(`${label} HTTP ${status}: ${text || '[empty response]'}`);
            error.status = status;
            error.responseText = text;
            return error;
        };

        const baseSettings = {
            enabled: false,
            clientId: '',
            clientSecret: '',
            refreshToken: '',
            fileId: '',
            fileName: defaultFileName,
            lastSyncedAt: 0,
            requestMode: 'default', // 'default' | 'adguard'
            configCollapsed: false
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

        const normalizeRequestMode = (value) => (value === 'adguard' ? 'adguard' : 'default');
        const normalizeBool = (value, fallback = false) => (typeof value === 'boolean' ? value : fallback);

        const updateSettings = (partial = {}) => {
            const prev = { ...driveSyncSettings };
            driveSyncSettings = {
                ...driveSyncSettings,
                ...partial,
                requestMode: normalizeRequestMode(partial.requestMode ?? driveSyncSettings.requestMode),
                configCollapsed: normalizeBool(partial.configCollapsed ?? driveSyncSettings.configCollapsed, false)
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
            const available = Boolean(resolveGMRequest() || resolveFetch());
            if (!available) {
                try {
                    alert(t('m_8db845c5073b'));
                } catch (_) {
                    /* noop */
                }
            }
            return available;
        };

        const refreshDriveAccessToken = async () => {
            const body = [
                ['client_id', driveSyncSettings.clientId],
                ['client_secret', driveSyncSettings.clientSecret],
                ['refresh_token', driveSyncSettings.refreshToken],
                ['grant_type', 'refresh_token']
            ]
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value || ''))}`)
                .join('&');
            let response;
            try {
                response = await performDriveRequest({
                    method: 'POST',
                    url: DRIVE_TOKEN_ENDPOINT,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: body
                });
            } catch (error) {
                throw new Error(`Drive token request failed: ${error?.message || safeStringify(error, '{}')}`);
            }
            const text = response.responseText || '';
            const status = response.status;
            const json = text ? JSON.parse(text) : {};
            if (status >= 200 && status < 300) {
                if (json.error) {
                    throw new Error(`Drive token error: ${safeStringify(json, '[invalid json]')}`);
                }
                return json;
            }
            throw new Error(`Drive token HTTP ${status}: ${text || '[empty response]'}`);
        };

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

        async function listDriveConfigFiles(token, targetName = getFileName()) {
            const params = new URLSearchParams({
                pageSize: '5',
                fields: 'files(id,name,mimeType,modifiedTime,size)',
                orderBy: 'modifiedTime desc'
            });
            const sanitizedName = (targetName || '').replace(/'/g, "\\'");
            params.set('q', `(trashed = false) and name = '${sanitizedName}'`);
            let response;
            try {
                response = await performDriveRequest({
                    method: 'GET',
                    url: `${DRIVE_FILES_ENDPOINT}?${params.toString()}`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                });
            } catch (error) {
                throw new Error(`Drive list network error: ${error?.message || safeStringify(error, '{}')}`);
            }
            if (response.status >= 200 && response.status < 300) {
                const data = JSON.parse(response.responseText || '{}');
                return Array.isArray(data.files) ? data.files : [];
            }
            throw buildHttpError('Drive list', response);
        }

        async function downloadDriveFileContent(fileId, token) {
            const encoded = encodeURIComponent(fileId);
            let response;
            try {
                response = await performDriveRequest({
                    method: 'GET',
                    url: `${DRIVE_FILES_ENDPOINT}/${encoded}?alt=media`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                throw new Error(`Drive download network error: ${error?.message || safeStringify(error, '{}')}`);
            }
            if (response.status >= 200 && response.status < 300) {
                return response.responseText || '';
            }
            let parsed;
            try {
                parsed = response.responseText ? JSON.parse(response.responseText) : null;
            } catch {
                parsed = null;
            }
            const err = parsed?.error?.message
                ? `Drive download HTTP ${response.status}: ${parsed.error.message}`
                : `Drive download HTTP ${response.status}: ${response.responseText || ''}`;
            const error = new Error(err);
            error.status = response.status;
            error.responseText = response.responseText || '';
            throw error;
        }

        async function uploadDriveConfigFile({ token, fileId, fileName, content }) {
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
            let response;
            try {
                response = await performDriveRequest({
                    method: hasFileId ? 'PATCH' : 'POST',
                    url: targetUrl,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': `multipart/related; boundary=${boundary}`
                    },
                    data: multipartBody
                });
            } catch (error) {
                throw new Error(`Drive upload network error: ${error?.message || safeStringify(error, '{}')}`);
            }
            const text = response.responseText || '';
            const json = text ? JSON.parse(text) : {};
            if (response.status >= 200 && response.status < 300) {
                return json;
            }
            throw new Error(`Drive upload HTTP ${response.status}: ${text || '[empty response]'}`);
        }

        const formatDriveError = (error) => {
            if (!error) return t('m_26718a2ad193') + 'Unknown error';
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

        const isAuthError = (status) => status === 401 || status === 403;
        const isFileStaleError = (status) => status === 404 || isAuthError(status) || status === 400;

        async function syncDownloadConfigFromDrive() {
            let token = await ensureDriveAccessToken();
            const targetName = getFileName();

            const buildNotFoundError = () => {
                const err = new Error(t('m_345f882bd9c1'));
                err.code = 'NOT_FOUND';
                return err;
            };

            const fetchLatestFileMeta = async () => {
                const files = await listDriveConfigFiles(token, targetName);
                if (!Array.isArray(files) || files.length === 0) {
                    throw buildNotFoundError();
                }
                return files[0];
            };

            const attemptDownload = async ({ forceRelist = false, allowTokenRetry = true } = {}) => {
                let fileMeta = null;
                let fileId = (driveSyncSettings.fileId || '').trim();
                if (!fileId || forceRelist) {
                    try {
                        fileMeta = await fetchLatestFileMeta();
                        fileId = fileMeta?.id || '';
                    } catch (error) {
                        const status = error?.status || 0;
                        if (allowTokenRetry && isAuthError(status)) {
                            resetAuthCache();
                            token = await ensureDriveAccessToken();
                            return attemptDownload({ forceRelist, allowTokenRetry: false });
                        }
                        throw error;
                    }
                }
                try {
                    const content = await downloadDriveFileContent(fileId, token);
                    return { content, fileId, fileMeta };
                } catch (error) {
                    const status = error?.status || 0;
                    if (allowTokenRetry && isAuthError(status)) {
                        resetAuthCache();
                        token = await ensureDriveAccessToken();
                        return attemptDownload({ forceRelist, allowTokenRetry: false });
                    }
                    if (!forceRelist && isFileStaleError(status)) {
                        return attemptDownload({ forceRelist: true, allowTokenRetry: false });
                    }
                    throw error;
                }
            };

            const { content, fileId, fileMeta } = await attemptDownload();
            driveSyncSettings.fileId = fileId;
            driveSyncSettings.fileName = fileMeta?.name || driveSyncSettings.fileName || targetName;
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

export {
    createDriveSyncModule,
    DEFAULT_FILE_NAME,
};
