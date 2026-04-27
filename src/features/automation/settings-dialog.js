import {
    buttonConfig,
    createDialogCloseIconButton,
    createFaviconElement,
    createUnifiedDialog,
    generateDomainFavicon,
    persistButtonConfig,
    registerLocaleRefresh,
    setTrustedHTML,
    styles,
    t,
} from '../../core/runtime-services.js';
import { closeExistingOverlay } from '../toolbar/index.js';
import { createMethodDisplay } from './method-display.js';
import { showAutomationRuleEditorDialog } from './rule-editor-dialog.js';

let currentAutomationOverlay = null;
let currentConfirmOverlay = null;

function showAutomationSettingsDialog() {
    if (currentAutomationOverlay) {
        closeExistingOverlay(currentAutomationOverlay);
    }

    const { overlay, dialog } = createUnifiedDialog({
        title: 'm_fa60c9c7db86',
        width: '750px',
        showTitle: false,
        onClose: () => {
            if (currentAutomationOverlay === overlay) {
                currentAutomationOverlay = null;
            }
        },
        closeOnOverlayClick: true,
        closeOnEscape: true,
        beforeClose: () => {
            persistButtonConfig();
            return true;
        },
    });
    currentAutomationOverlay = overlay;
    overlay.__cttfLocaleRefreshCleanup = registerLocaleRefresh(() => {
        if (currentAutomationOverlay !== overlay) {
            return;
        }
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
            currentConfirmOverlay = null;
        }
        showAutomationSettingsDialog();
    });

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.gap = '12px';
    header.style.flexWrap = 'wrap';
    header.style.marginBottom = '10px';

    const titleEl = document.createElement('h2');
    titleEl.textContent = t('m_fa60c9c7db86');
    titleEl.style.margin = '0';
    titleEl.style.fontSize = '18px';
    titleEl.style.fontWeight = '600';
    titleEl.style.color = 'var(--text-color, #333333)';
    titleEl.style.flex = '1 1 auto';
    titleEl.style.minWidth = '0';

    const closeAutomationBtn = createDialogCloseIconButton((event) => {
        void overlay.__cttfRequestClose('button', event);
    });
    closeAutomationBtn.id = 'closeAutomationBtn';

    const headerActions = document.createElement('div');
    headerActions.style.display = 'flex';
    headerActions.style.alignItems = 'center';
    headerActions.style.gap = '10px';
    headerActions.style.marginLeft = 'auto';
    headerActions.style.flex = '0 0 auto';
    headerActions.appendChild(closeAutomationBtn);

    header.appendChild(titleEl);
    header.appendChild(headerActions);
    dialog.appendChild(header);

    const listContainer = document.createElement('div');
    listContainer.style.cssText = `
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--dialog-bg, #ffffff);
        max-height: 320px;
    `;

    const listHeader = document.createElement('div');
    listHeader.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        flex-shrink: 0;
    `;

    const headerColumns = [
        { label: t('m_1f24c1e5aafa'), flex: '0 0 32px', justify: 'center' },
        { label: t('m_f412fe65e355'), flex: '1 1 0%', justify: 'flex-start', paddingLeft: '8px' },
        { label: t('m_b90e30398d2f'), flex: '0 0 120px', justify: 'center' },
        { label: t('m_c9c77517fe85'), flex: '0 0 40px', justify: 'center' },
        { label: t('m_3755f56f2f83'), flex: '0 0 40px', justify: 'center' },
    ];

    headerColumns.forEach(({ label, flex, justify, paddingLeft }) => {
        const column = document.createElement('div');
        column.textContent = label;
        column.style.display = 'flex';
        column.style.alignItems = 'center';
        column.style.justifyContent = justify;
        column.style.flex = flex;
        column.style.fontSize = '12px';
        column.style.fontWeight = '600';
        if (paddingLeft) {
            column.style.paddingLeft = paddingLeft;
        }
        listHeader.appendChild(column);
    });

    const listBody = document.createElement('div');
    listBody.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        overflow-y: auto;
        max-height: 260px;
    `;
    listBody.classList.add('hide-scrollbar');

    listContainer.appendChild(listHeader);
    listContainer.appendChild(listBody);
    dialog.appendChild(listContainer);

    const showAutomationRuleDeleteConfirmDialog = (rule, onConfirm) => {
        if (!rule) {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            return;
        }

        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }

        let confirmOverlayRef = null;
        const { overlay: confirmOverlay, dialog: confirmDialog } = createUnifiedDialog({
            title: null,
            showTitle: false,
            width: '420px',
            maxWidth: '90vw',
            padding: '24px',
            zIndex: '13000',
            closeOnOverlayClick: false,
            overlayClassName: 'confirm-overlay',
            dialogClassName: 'confirm-dialog',
            onClose: () => {
                if (currentConfirmOverlay === confirmOverlayRef) {
                    currentConfirmOverlay = null;
                }
            },
        });
        confirmOverlayRef = confirmOverlay;

        const ruleName = rule.name || rule.domain || t('m_34ead5ec21ba');
        const ruleDomain = rule.domain || t('m_26b0c4d3cf64');
        const faviconUrl = rule.favicon || generateDomainFavicon(rule.domain);
        const deleteAutomationTitle = t('m_37c14d8c2265', { ruleName });
        const irreversibleNoticeAutomation = t('m_017b3765c0b7');

        setTrustedHTML(confirmDialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteAutomationTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleNoticeAutomation}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 12px; border-radius:6px; background-color: var(--button-bg, #f3f4f6);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                    <div style="
                        width:32px;
                        height:32px;
                        border-radius:8px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        overflow:hidden;
                        flex-shrink:0;
                    ">
                        <img src="${faviconUrl}" alt="${ruleName}" style="width:24px; height:24px; object-fit:contain;" referrerpolicy="no-referrer">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:14px; font-weight:600; color: var(--text-color, #333333);">${ruleName}</span>
                        <span style="font-size:12px; color: var(--muted-text-color, #6b7280);">${ruleDomain}</span>
                    </div>
                </div>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333); display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('m_bb0ecaa69368')}<span class="cttf-automation-method-container"></span>
                </p>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelAutomationRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t('m_4d0b4688c787')}</button>
                <button id="confirmAutomationRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t('m_3755f56f2f83')}</button>
            </div>
        `);

        const methodPlaceholder = confirmDialog.querySelector('.cttf-automation-method-container');
        if (methodPlaceholder) {
            const methodDisplay = createMethodDisplay(rule.method, rule.methodAdvanced);
            methodDisplay.style.justifyContent = 'flex-start';
            methodPlaceholder.replaceWith(methodDisplay);
        }

        currentConfirmOverlay = confirmOverlay;

        confirmDialog.querySelector('#cancelAutomationRuleDelete')?.addEventListener('click', () => {
            closeExistingOverlay(confirmOverlay);
        });

        confirmDialog.querySelector('#confirmAutomationRuleDelete')?.addEventListener('click', () => {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            closeExistingOverlay(confirmOverlay);
        });
    };

    function renderDomainRules() {
        setTrustedHTML(listBody, '');
        const rules = buttonConfig.domainAutoSubmitSettings;
        let metadataPatched = false;

        if (!rules.length) {
            const emptyState = document.createElement('div');
            emptyState.textContent = t('m_7e0dafd33317');
            emptyState.style.cssText = `
                padding: 18px;
                border-radius: 6px;
                border: 1px dashed var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
                color: var(--muted-text-color, #6b7280);
                font-size: 13px;
                text-align: center;
            `;
            listBody.appendChild(emptyState);
            return;
        }

        rules.forEach((rule, idx) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 6px;
                background-color: var(--button-bg, #f3f4f6);
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            `;
            item.addEventListener('mouseenter', () => {
                item.style.borderColor = 'var(--primary-color, #3B82F6)';
                item.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.borderColor = 'var(--border-color, #e5e7eb)';
                item.style.boxShadow = 'none';
            });

            const faviconUrl = rule.favicon || generateDomainFavicon(rule.domain);
            if (!rule.favicon && rule.domain) {
                rule.favicon = faviconUrl;
                metadataPatched = true;
            }
            const faviconBadge = createFaviconElement(
                faviconUrl,
                rule.name || rule.domain,
                '🌐',
                { withBackground: false, size: 26 },
            );
            faviconBadge.title = rule.domain || '';

            const iconColumn = document.createElement('div');
            iconColumn.style.display = 'flex';
            iconColumn.style.alignItems = 'center';
            iconColumn.style.justifyContent = 'center';
            iconColumn.style.flex = '0 0 30px';
            iconColumn.appendChild(faviconBadge);

            const infoColumn = document.createElement('div');
            infoColumn.style.display = 'flex';
            infoColumn.style.flexDirection = 'column';
            infoColumn.style.gap = '4px';
            infoColumn.style.minWidth = '0';
            infoColumn.style.flex = '1 1 0%';

            const nameEl = document.createElement('span');
            nameEl.textContent = rule.name || rule.domain || t('m_34ead5ec21ba');
            nameEl.style.fontWeight = '600';
            nameEl.style.fontSize = '14px';
            nameEl.style.color = 'var(--text-color, #1f2937)';

            const domainEl = document.createElement('span');
            domainEl.textContent = rule.domain || '';
            domainEl.style.fontSize = '12px';
            domainEl.style.color = 'var(--muted-text-color, #6b7280)';
            domainEl.style.whiteSpace = 'nowrap';
            domainEl.style.overflow = 'hidden';
            domainEl.style.textOverflow = 'ellipsis';
            domainEl.style.maxWidth = '260px';
            domainEl.title = rule.domain || '';

            infoColumn.appendChild(nameEl);
            infoColumn.appendChild(domainEl);

            const methodDisplay = createMethodDisplay(rule.method || '-', rule.methodAdvanced);

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--primary-color, #3B82F6);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            editBtn.addEventListener('mouseenter', () => {
                editBtn.style.backgroundColor = 'rgba(59,130,246,0.12)';
            });
            editBtn.addEventListener('mouseleave', () => {
                editBtn.style.backgroundColor = 'transparent';
            });
            editBtn.addEventListener('click', () => {
                const ruleToEdit = buttonConfig.domainAutoSubmitSettings[idx];
                showAutomationRuleEditorDialog(ruleToEdit, (newData) => {
                    buttonConfig.domainAutoSubmitSettings[idx] = newData;
                    persistButtonConfig();
                    renderDomainRules();
                });
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--danger-color, #ef4444);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.backgroundColor = 'rgba(239,68,68,0.12)';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.backgroundColor = 'transparent';
            });
            deleteBtn.addEventListener('click', () => {
                const ruleToDelete = buttonConfig.domainAutoSubmitSettings[idx];
                showAutomationRuleDeleteConfirmDialog(ruleToDelete, () => {
                    buttonConfig.domainAutoSubmitSettings.splice(idx, 1);
                    persistButtonConfig();
                    renderDomainRules();
                });
            });

            const methodColumn = document.createElement('div');
            methodColumn.style.display = 'flex';
            methodColumn.style.alignItems = 'center';
            methodColumn.style.justifyContent = 'center';
            methodColumn.style.flex = '0 0 120px';
            methodColumn.appendChild(methodDisplay);

            const editColumn = document.createElement('div');
            editColumn.style.display = 'flex';
            editColumn.style.alignItems = 'center';
            editColumn.style.justifyContent = 'center';
            editColumn.style.flex = '0 0 40px';
            editColumn.appendChild(editBtn);

            const deleteColumn = document.createElement('div');
            deleteColumn.style.display = 'flex';
            deleteColumn.style.alignItems = 'center';
            deleteColumn.style.justifyContent = 'center';
            deleteColumn.style.flex = '0 0 40px';
            deleteColumn.appendChild(deleteBtn);

            item.appendChild(iconColumn);
            item.appendChild(infoColumn);
            item.appendChild(methodColumn);
            item.appendChild(editColumn);
            item.appendChild(deleteColumn);
            listBody.appendChild(item);
        });

        if (metadataPatched) {
            persistButtonConfig();
        }
    }
    renderDomainRules();

    const addDiv = document.createElement('div');
    addDiv.style.marginTop = '12px';
    addDiv.style.textAlign = 'left';

    const addBtn = document.createElement('button');
    addBtn.textContent = t('m_d1dd773736d1');
    addBtn.style.cssText = `
        background-color: var(--add-color, #fd7e14);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
    `;
    addBtn.addEventListener('click', () => {
        showAutomationRuleEditorDialog({}, (newData) => {
            buttonConfig.domainAutoSubmitSettings.push(newData);
            persistButtonConfig();
            renderDomainRules();
        });
    });
    addDiv.appendChild(addBtn);
    dialog.appendChild(addDiv);
}

export {
    showAutomationSettingsDialog,
};
