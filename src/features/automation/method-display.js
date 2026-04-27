import {
    AUTO_SUBMIT_METHODS,
    normalizeAutoSubmitMethod,
    t,
} from '../../core/runtime-services.js';

const keyboardMethodPattern = /(enter|shift|caps|ctrl|control|cmd|meta|option|alt|space|tab|esc|escape|delete|backspace|home|end|page ?up|page ?down|arrow|up|down|left|right)/i;

const createKeyCapElement = (label) => {
    const keyEl = document.createElement('span');
    keyEl.textContent = label;
    keyEl.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        padding: 3px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(180deg, rgba(17,17,17,0.95), rgba(45,45,45,0.95));
        box-shadow: inset 0 -1px 0 rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.45);
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        line-height: 1.2;
        white-space: nowrap;
    `;
    return keyEl;
};

const resolveMethodDisplayValue = (rawMethod, rawAdvanced) => {
    const originalValue = typeof rawMethod === 'string' ? rawMethod.trim() : '';
    if (!originalValue) {
        return '';
    }
    const shouldNormalize = [
        AUTO_SUBMIT_METHODS.ENTER,
        AUTO_SUBMIT_METHODS.MODIFIER_ENTER,
        AUTO_SUBMIT_METHODS.CLICK_SUBMIT,
        'Enter',
        'Cmd+Enter',
        '模拟点击提交按钮',
    ].includes(originalValue);
    if (!shouldNormalize) {
        return originalValue;
    }
    const normalizedMethod = normalizeAutoSubmitMethod(originalValue);
    if (normalizedMethod === AUTO_SUBMIT_METHODS.ENTER) {
        return t('i18n.automation.method.enter');
    }
    if (normalizedMethod === AUTO_SUBMIT_METHODS.MODIFIER_ENTER) {
        return rawAdvanced && rawAdvanced.variant === 'ctrl'
            ? 'Ctrl+Enter'
            : t('i18n.automation.method.modifier_enter');
    }
    if (normalizedMethod === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
        return AUTO_SUBMIT_METHODS.CLICK_SUBMIT;
    }
    return originalValue;
};

const createMethodDisplay = (rawMethod, rawAdvanced = null) => {
    const methodValue = resolveMethodDisplayValue(rawMethod, rawAdvanced);
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.gap = '6px';
    container.style.flexWrap = 'wrap';
    container.style.maxWidth = '100%';
    container.style.fontSize = '12px';
    container.style.fontWeight = '600';

    if (!methodValue) {
        const placeholder = document.createElement('span');
        placeholder.textContent = '-';
        placeholder.style.color = 'var(--muted-text-color, #6b7280)';
        placeholder.style.fontWeight = '500';
        container.appendChild(placeholder);
        return container;
    }

    if (methodValue === AUTO_SUBMIT_METHODS.CLICK_SUBMIT) {
        const clickBadge = document.createElement('span');
        clickBadge.textContent = t('m_82872ab8af7b');
        clickBadge.style.cssText = `
            padding: 4px 12px;
            border-radius: 20px;
            background: linear-gradient(180deg, rgba(253,224,71,0.85), rgba(251,191,36,0.9));
            border: 1px solid rgba(217,119,6,0.4);
            box-shadow: inset 0 -1px 0 rgba(217,119,6,0.35), 0 1px 2px rgba(217,119,6,0.25);
            color: rgba(120,53,15,0.95);
            font-weight: 700;
            font-size: 12px;
            letter-spacing: 0.02em;
            white-space: nowrap;
        `;
        container.appendChild(clickBadge);
        return container;
    }

    const shouldUseKeyStyle = keyboardMethodPattern.test(methodValue)
        || methodValue.includes('+')
        || methodValue.includes('/');

    if (!shouldUseKeyStyle) {
        const pill = document.createElement('span');
        pill.textContent = methodValue;
        pill.style.cssText = `
            padding: 4px 10px;
            background-color: rgba(59,130,246,0.12);
            color: var(--primary-color, #3B82F6);
            border-radius: 999px;
            white-space: nowrap;
        `;
        container.appendChild(pill);
        return container;
    }

    const combos = methodValue.split('/').map((segment) => segment.trim()).filter(Boolean);
    combos.forEach((combo, comboIdx) => {
        if (comboIdx > 0) {
            const divider = document.createElement('span');
            divider.textContent = '/';
            divider.style.color = 'var(--muted-text-color, #6b7280)';
            divider.style.fontSize = '11px';
            divider.style.fontWeight = '600';
            container.appendChild(divider);
        }

        const comboWrapper = document.createElement('div');
        comboWrapper.style.display = 'flex';
        comboWrapper.style.alignItems = 'center';
        comboWrapper.style.justifyContent = 'center';
        comboWrapper.style.gap = '4px';

        const keys = combo.split('+').map((part) => part.trim()).filter(Boolean);
        if (!keys.length) {
            keys.push(combo);
        }

        keys.forEach((keyLabel, keyIdx) => {
            if (keyIdx > 0) {
                const plusSign = document.createElement('span');
                plusSign.textContent = '+';
                plusSign.style.color = 'var(--muted-text-color, #6b7280)';
                plusSign.style.fontSize = '11px';
                plusSign.style.fontWeight = '600';
                comboWrapper.appendChild(plusSign);
            }
            comboWrapper.appendChild(createKeyCapElement(keyLabel));
        });

        container.appendChild(comboWrapper);
    });

    return container;
};

export {
    createMethodDisplay,
};
