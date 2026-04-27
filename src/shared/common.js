/* -------------------------------------------------------------------------- *
 * Shared · Common helpers for serializable cloning and browser downloads
 * -------------------------------------------------------------------------- */

const cloneSerializable = (value, options = {}) => {
    const {
        fallback = value,
        logLabel = '[Chat] Template Text Folders clone failed:',
    } = options;

    if (value == null) {
        return value;
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch (error) {
        console.warn(logLabel, error);
        return fallback;
    }
};

const downloadTextFile = (fileName, text, mimeType = 'text/plain;charset=utf-8') => {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};

export {
    cloneSerializable,
    downloadTextFile,
};
