const STYLE_RULE_SOURCE = {
    OFFICIAL: 'official',
    CUSTOM: 'custom',
};

const STYLE_MATCHER_TYPE = {
    DOMAIN: 'domain',
    URL_PREFIX: 'url-prefix',
    URL: 'url',
    REGEXP: 'regexp',
};

const SUPPORTED_MATCHER_TYPES = new Set(Object.values(STYLE_MATCHER_TYPE));
const RULE_METADATA_KEYS = new Set([
    'rule-id',
    'name',
    'source',
    'enabled',
    'toolbar-height',
    'toolbar-bottom-spacing',
    'favicon',
]);
const GLOBAL_METADATA_KEYS = new Set([
    'official-version',
    'official-source-url',
    'official-last-fetched-at',
]);

const USERSTYLE_HEADER_START = '==UserStyle==';
const USERSTYLE_HEADER_END = '==/UserStyle==';

const normalizeWhitespace = (value) => String(value == null ? '' : value).replace(/\s+/g, ' ').trim();

const normalizeRuleSource = (source, fallback = STYLE_RULE_SOURCE.CUSTOM) => {
    const normalized = normalizeWhitespace(source).toLowerCase();
    return normalized === STYLE_RULE_SOURCE.OFFICIAL || normalized === STYLE_RULE_SOURCE.CUSTOM
        ? normalized
        : fallback;
};

const clampStyleHeight = (value, fallback = undefined) => {
    if (value === '' || value == null) {
        return fallback;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.max(20, Math.min(200, Math.round(parsed)));
};

const clampBottomSpacing = (value, fallback = undefined) => {
    if (value === '' || value == null) {
        return fallback;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.max(-200, Math.min(200, Math.round(parsed)));
};

const createStableHash = (input) => {
    const text = String(input == null ? '' : input);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
};

const createStyleRuleId = (seed, prefix = 'cttf-style') => `${prefix}-${createStableHash(seed)}`;

const toMetadataBoolean = (value, fallback = true) => {
    if (typeof value === 'boolean') {
        return value;
    }
    const normalized = normalizeWhitespace(value).toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
        return false;
    }
    return fallback;
};

const normalizeMatcherType = (type) => {
    const normalized = normalizeWhitespace(type).toLowerCase();
    return SUPPORTED_MATCHER_TYPES.has(normalized) ? normalized : '';
};

const normalizeStyleMatcher = (matcher) => {
    if (!matcher || typeof matcher !== 'object') {
        return null;
    }
    const type = normalizeMatcherType(matcher.type);
    const value = typeof matcher.value === 'string' ? matcher.value.trim() : '';
    if (!type || !value) {
        return null;
    }
    if (type === STYLE_MATCHER_TYPE.REGEXP) {
        try {
            // Validate early so imports fail fast instead of breaking matching later.
            new RegExp(value);
        } catch (error) {
            throw new Error(`Invalid regexp matcher: ${value}`);
        }
    }
    return { type, value };
};

const getPrimaryHostFromMatchers = (matchers = []) => {
    for (const matcher of matchers) {
        if (!matcher || typeof matcher !== 'object') {
            continue;
        }
        if (matcher.type === STYLE_MATCHER_TYPE.DOMAIN) {
            return matcher.value.trim();
        }
        if (matcher.type === STYLE_MATCHER_TYPE.URL || matcher.type === STYLE_MATCHER_TYPE.URL_PREFIX) {
            try {
                return new URL(matcher.value).hostname || '';
            } catch (_) {
                continue;
            }
        }
    }
    return '';
};

const ensureStyleRule = (rule, options = {}) => {
    if (!rule || typeof rule !== 'object') {
        return null;
    }
    const fallbackSource = normalizeRuleSource(options.fallbackSource, STYLE_RULE_SOURCE.CUSTOM);
    const legacyDomain = typeof rule.domain === 'string' ? rule.domain.trim() : '';
    const rawMatchers = Array.isArray(rule.matchers)
        ? rule.matchers
        : (legacyDomain ? [{ type: STYLE_MATCHER_TYPE.DOMAIN, value: legacyDomain }] : []);
    const matchers = [];
    rawMatchers.forEach((matcher) => {
        const normalizedMatcher = normalizeStyleMatcher(matcher);
        if (normalizedMatcher) {
            matchers.push(normalizedMatcher);
        }
    });

    if (!matchers.length) {
        return null;
    }

    const layout = {};
    const height = clampStyleHeight(rule.layout?.height ?? rule.height);
    const bottomSpacing = clampBottomSpacing(rule.layout?.bottomSpacing ?? rule.bottomSpacing);
    if (typeof height === 'number') {
        layout.height = height;
    }
    if (typeof bottomSpacing === 'number') {
        layout.bottomSpacing = bottomSpacing;
    }

    const cssCode = typeof rule.cssCode === 'string'
        ? rule.cssCode.trim()
        : '';
    const name = typeof rule.name === 'string' ? rule.name.trim() : '';
    const source = normalizeRuleSource(rule.source, fallbackSource);
    const favicon = typeof rule.favicon === 'string' ? rule.favicon.trim() : '';
    const seed = [
        source,
        name,
        matchers.map((matcher) => `${matcher.type}:${matcher.value}`).join('|'),
        cssCode,
        layout.height ?? '',
        layout.bottomSpacing ?? '',
    ].join('\n');

    return {
        id: typeof rule.id === 'string' && rule.id.trim()
            ? rule.id.trim()
            : createStyleRuleId(seed, source === STYLE_RULE_SOURCE.OFFICIAL ? 'cttf-official-style' : 'cttf-custom-style'),
        name,
        source,
        enabled: toMetadataBoolean(rule.enabled, true),
        matchers,
        cssCode,
        layout,
        favicon,
    };
};

const migrateLegacyDomainStyleSettings = (legacyRules = []) => {
    if (!Array.isArray(legacyRules)) {
        return [];
    }
    return legacyRules
        .map((item, index) => ensureStyleRule({
            id: item?.id,
            name: item?.name,
            source: STYLE_RULE_SOURCE.CUSTOM,
            enabled: true,
            matchers: typeof item?.domain === 'string' && item.domain.trim()
                ? [{ type: STYLE_MATCHER_TYPE.DOMAIN, value: item.domain.trim() }]
                : [],
            cssCode: item?.cssCode || '',
            layout: {
                height: item?.height,
                bottomSpacing: item?.bottomSpacing,
            },
            favicon: item?.favicon || '',
        }, {
            fallbackSource: STYLE_RULE_SOURCE.CUSTOM,
            index,
        }))
        .filter(Boolean);
};

const ensureStyleBundle = (bundle, options = {}) => {
    const rawBundle = (bundle && typeof bundle === 'object') ? bundle : {};
    const fallbackSource = normalizeRuleSource(options.fallbackSource, STYLE_RULE_SOURCE.OFFICIAL);
    const rules = Array.isArray(rawBundle.rules) ? rawBundle.rules : (Array.isArray(options.rules) ? options.rules : []);
    const normalizedRules = [];
    rules.forEach((rule, index) => {
        const normalizedRule = ensureStyleRule(rule, {
            fallbackSource,
            index,
        });
        if (normalizedRule) {
            normalizedRules.push(normalizedRule);
        }
    });

    return {
        version: typeof rawBundle.version === 'string'
            ? rawBundle.version.trim()
            : (typeof options.version === 'string' ? options.version.trim() : ''),
        sourceUrl: typeof rawBundle.sourceUrl === 'string'
            ? rawBundle.sourceUrl.trim()
            : (typeof options.sourceUrl === 'string' ? options.sourceUrl.trim() : ''),
        lastFetchedAt: Number.isFinite(Number(rawBundle.lastFetchedAt))
            ? Number(rawBundle.lastFetchedAt)
            : (Number.isFinite(Number(options.lastFetchedAt)) ? Number(options.lastFetchedAt) : 0),
        rules: normalizedRules,
    };
};

const splitRulesBySource = (rules = []) => {
    const grouped = {
        official: [],
        custom: [],
    };
    if (!Array.isArray(rules)) {
        return grouped;
    }
    rules.forEach((rule) => {
        if (!rule || typeof rule !== 'object') {
            return;
        }
        if (rule.source === STYLE_RULE_SOURCE.OFFICIAL) {
            grouped.official.push(rule);
            return;
        }
        grouped.custom.push(rule);
    });
    return grouped;
};

const summarizeMatchers = (matchers = [], options = {}) => {
    if (!Array.isArray(matchers) || !matchers.length) {
        return options.emptyLabel || '';
    }
    const maxItems = Math.max(1, Number(options.maxItems) || 2);
    const labels = matchers.map((matcher) => {
        if (!matcher || typeof matcher !== 'object') {
            return '';
        }
        const prefix = matcher.type === STYLE_MATCHER_TYPE.DOMAIN
            ? 'domain'
            : matcher.type === STYLE_MATCHER_TYPE.URL_PREFIX
                ? 'prefix'
                : matcher.type === STYLE_MATCHER_TYPE.URL
                    ? 'url'
                    : 'regexp';
        return `${prefix}: ${matcher.value}`;
    }).filter(Boolean);
    if (labels.length <= maxItems) {
        return labels.join(' | ');
    }
    return `${labels.slice(0, maxItems).join(' | ')} | +${labels.length - maxItems}`;
};

const escapeUserStyleString = (value) => String(value == null ? '' : value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

const serializeMatcher = (matcher) => {
    if (!matcher || typeof matcher !== 'object') {
        return '';
    }
    return `${matcher.type}("${escapeUserStyleString(matcher.value)}")`;
};

const parseUserStyleHeaderMetadata = (commentContent) => {
    const metadata = {};
    if (!commentContent || !commentContent.includes(USERSTYLE_HEADER_START)) {
        return metadata;
    }
    const normalized = commentContent.replace(/\r\n/g, '\n');
    const startIndex = normalized.indexOf(USERSTYLE_HEADER_START);
    const endIndex = normalized.indexOf(USERSTYLE_HEADER_END);
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        return metadata;
    }
    const body = normalized.slice(startIndex + USERSTYLE_HEADER_START.length, endIndex);
    body.split('\n').forEach((line) => {
        const match = /^\s*@([A-Za-z0-9_-]+)\s+(.+?)\s*$/.exec(line);
        if (!match) {
            return;
        }
        metadata[match[1].toLowerCase()] = match[2];
    });
    return metadata;
};

const parseMetadataComment = (commentContent) => {
    const ruleMetadata = {};
    const globalMetadata = {};
    let firstPlainComment = '';

    const normalized = String(commentContent == null ? '' : commentContent)
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.replace(/^\s*\* ?/, '').trim())
        .filter(Boolean);

    normalized.forEach((line) => {
        const metadataMatch = /^@cttf-([a-z0-9-]+)\s*:?\s*(.*)$/i.exec(line);
        if (!metadataMatch) {
            if (!firstPlainComment) {
                firstPlainComment = line;
            }
            return;
        }
        const key = metadataMatch[1].toLowerCase();
        const rawValue = metadataMatch[2] || '';
        if (RULE_METADATA_KEYS.has(key)) {
            ruleMetadata[key] = rawValue;
            return;
        }
        if (GLOBAL_METADATA_KEYS.has(key)) {
            globalMetadata[key] = rawValue;
        }
    });

    return {
        ruleMetadata,
        globalMetadata,
        firstPlainComment,
    };
};

const readBlockComment = (source, startIndex) => {
    const closeIndex = source.indexOf('*/', startIndex + 2);
    if (closeIndex === -1) {
        throw new Error('Unterminated block comment in .user.css');
    }
    return {
        content: source.slice(startIndex + 2, closeIndex),
        endIndex: closeIndex + 2,
    };
};

const skipQuotedString = (source, startIndex, quoteChar) => {
    let index = startIndex + 1;
    while (index < source.length) {
        const char = source[index];
        if (char === '\\') {
            index += 2;
            continue;
        }
        if (char === quoteChar) {
            return index + 1;
        }
        index += 1;
    }
    throw new Error('Unterminated string in .user.css');
};

const splitTopLevelCommaSegments = (text) => {
    const segments = [];
    let start = 0;
    let parenDepth = 0;
    let index = 0;

    while (index < text.length) {
        const char = text[index];
        if (char === '"' || char === '\'') {
            index = skipQuotedString(text, index, char);
            continue;
        }
        if (char === '/' && text[index + 1] === '*') {
            const comment = readBlockComment(text, index);
            index = comment.endIndex;
            continue;
        }
        if (char === '(') {
            parenDepth += 1;
            index += 1;
            continue;
        }
        if (char === ')') {
            parenDepth = Math.max(0, parenDepth - 1);
            index += 1;
            continue;
        }
        if (char === ',' && parenDepth === 0) {
            segments.push(text.slice(start, index).trim());
            start = index + 1;
        }
        index += 1;
    }

    const trailing = text.slice(start).trim();
    if (trailing) {
        segments.push(trailing);
    }
    return segments.filter(Boolean);
};

const parseMozDocumentMatchers = (text) => {
    const segments = splitTopLevelCommaSegments(text);
    if (!segments.length) {
        throw new Error('Empty @-moz-document matcher list in .user.css');
    }

    return segments.map((segment) => {
        const match = /^([a-z-]+)\s*\(\s*"((?:\\.|[^"])*)"\s*\)\s*$/i.exec(segment);
        if (!match) {
            throw new Error(`Unsupported @-moz-document matcher: ${segment}`);
        }
        const type = normalizeMatcherType(match[1]);
        if (!type) {
            throw new Error(`Unsupported @-moz-document matcher type: ${match[1]}`);
        }
        const rawValue = match[2]
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        return normalizeStyleMatcher({
            type,
            value: rawValue,
        });
    });
};

const extractLeadingRuleMetadata = (cssCode) => {
    const source = String(cssCode == null ? '' : cssCode);
    let index = 0;
    const pendingComments = [];

    while (index < source.length) {
        const char = source[index];
        if (/\s/.test(char)) {
            index += 1;
            continue;
        }
        if (char === '/' && source[index + 1] === '*') {
            const comment = readBlockComment(source, index);
            pendingComments.push(comment.content);
            index = comment.endIndex;
            continue;
        }
        break;
    }

    const aggregated = {
        ruleMetadata: {},
        firstPlainComment: '',
    };
    pendingComments.forEach((commentContent) => {
        const parsed = parseMetadataComment(commentContent);
        Object.assign(aggregated.ruleMetadata, parsed.ruleMetadata);
        if (!aggregated.firstPlainComment && parsed.firstPlainComment) {
            aggregated.firstPlainComment = parsed.firstPlainComment;
        }
    });

    return {
        cssCode: source.slice(index).trim(),
        ruleMetadata: aggregated.ruleMetadata,
        firstPlainComment: aggregated.firstPlainComment,
    };
};

const readMozDocumentBlock = (source, startIndex, pendingComments, options = {}) => {
    const directive = '@-moz-document';
    let index = startIndex + directive.length;
    let parenDepth = 0;

    while (index < source.length) {
        const char = source[index];
        if (char === '"' || char === '\'') {
            index = skipQuotedString(source, index, char);
            continue;
        }
        if (char === '/' && source[index + 1] === '*') {
            const comment = readBlockComment(source, index);
            index = comment.endIndex;
            continue;
        }
        if (char === '(') {
            parenDepth += 1;
            index += 1;
            continue;
        }
        if (char === ')') {
            parenDepth = Math.max(0, parenDepth - 1);
            index += 1;
            continue;
        }
        if (char === '{' && parenDepth === 0) {
            break;
        }
        index += 1;
    }

    if (source[index] !== '{') {
        throw new Error('Invalid @-moz-document block: missing opening brace');
    }

    const matcherText = source.slice(startIndex + directive.length, index).trim();
    const matchers = parseMozDocumentMatchers(matcherText);

    let bodyIndex = index + 1;
    let braceDepth = 1;
    while (bodyIndex < source.length) {
        const char = source[bodyIndex];
        if (char === '"' || char === '\'') {
            bodyIndex = skipQuotedString(source, bodyIndex, char);
            continue;
        }
        if (char === '/' && source[bodyIndex + 1] === '*') {
            const comment = readBlockComment(source, bodyIndex);
            bodyIndex = comment.endIndex;
            continue;
        }
        if (char === '{') {
            braceDepth += 1;
            bodyIndex += 1;
            continue;
        }
        if (char === '}') {
            braceDepth -= 1;
            if (braceDepth === 0) {
                break;
            }
        }
        bodyIndex += 1;
    }

    if (braceDepth !== 0) {
        throw new Error('Invalid @-moz-document block: missing closing brace');
    }

    const rawCssCode = source.slice(index + 1, bodyIndex);
    const leadingMetadata = extractLeadingRuleMetadata(rawCssCode);
    const metadataAccumulator = {
        ruleMetadata: {},
        firstPlainComment: '',
    };

    pendingComments.forEach((commentContent) => {
        const parsed = parseMetadataComment(commentContent);
        Object.assign(metadataAccumulator.ruleMetadata, parsed.ruleMetadata);
        if (!metadataAccumulator.firstPlainComment && parsed.firstPlainComment) {
            metadataAccumulator.firstPlainComment = parsed.firstPlainComment;
        }
    });
    Object.assign(metadataAccumulator.ruleMetadata, leadingMetadata.ruleMetadata);
    if (!metadataAccumulator.firstPlainComment && leadingMetadata.firstPlainComment) {
        metadataAccumulator.firstPlainComment = leadingMetadata.firstPlainComment;
    }

    const sourceFallback = normalizeRuleSource(options.defaultSource, STYLE_RULE_SOURCE.CUSTOM);
    const ruleMetadata = metadataAccumulator.ruleMetadata;
    const fallbackName = metadataAccumulator.firstPlainComment || summarizeMatchers(matchers, { maxItems: 1 });
    const fallbackSeed = [
        sourceFallback,
        matcherText,
        leadingMetadata.cssCode.trim(),
        fallbackName,
    ].join('\n');
    const normalizedRule = ensureStyleRule({
        id: ruleMetadata['rule-id'],
        name: ruleMetadata.name || fallbackName,
        source: ruleMetadata.source || sourceFallback,
        enabled: ruleMetadata.enabled,
        matchers,
        cssCode: leadingMetadata.cssCode,
        layout: {
            height: ruleMetadata['toolbar-height'],
            bottomSpacing: ruleMetadata['toolbar-bottom-spacing'],
        },
        favicon: ruleMetadata.favicon || '',
    }, {
        fallbackSource: sourceFallback,
        seed: fallbackSeed,
    });

    if (!normalizedRule) {
        throw new Error('Failed to normalize parsed style rule');
    }

    return {
        rule: normalizedRule,
        endIndex: bodyIndex + 1,
    };
};

const parseUserStyleFile = (source, options = {}) => {
    const text = String(source == null ? '' : source);
    const rules = [];
    const pendingComments = [];
    const globalMetadata = {};
    let userStyleMetadata = {};
    let index = 0;

    while (index < text.length) {
        const char = text[index];
        if (/\s/.test(char)) {
            index += 1;
            continue;
        }
        if (char === '/' && text[index + 1] === '*') {
            const comment = readBlockComment(text, index);
            const parsedHeader = parseUserStyleHeaderMetadata(comment.content);
            const isUserStyleHeader = Object.keys(parsedHeader).length > 0;
            if (isUserStyleHeader) {
                userStyleMetadata = {
                    ...userStyleMetadata,
                    ...parsedHeader,
                };
            }
            const parsedComment = parseMetadataComment(comment.content);
            Object.assign(globalMetadata, parsedComment.globalMetadata);
            if (!isUserStyleHeader) {
                pendingComments.push(comment.content);
            }
            index = comment.endIndex;
            continue;
        }
        if (text.startsWith('@-moz-document', index)) {
            const block = readMozDocumentBlock(text, index, pendingComments, {
                defaultSource: options.defaultSource || STYLE_RULE_SOURCE.CUSTOM,
            });
            rules.push(block.rule);
            pendingComments.length = 0;
            index = block.endIndex;
            continue;
        }
        index += 1;
    }

    return {
        metadata: {
            userStyle: userStyleMetadata,
            officialVersion: typeof globalMetadata['official-version'] === 'string' && globalMetadata['official-version'].trim()
                ? globalMetadata['official-version'].trim()
                : (typeof userStyleMetadata.version === 'string' ? userStyleMetadata.version.trim() : ''),
            officialSourceUrl: typeof globalMetadata['official-source-url'] === 'string'
                ? globalMetadata['official-source-url'].trim()
                : '',
            officialLastFetchedAt: Number.isFinite(Number(globalMetadata['official-last-fetched-at']))
                ? Number(globalMetadata['official-last-fetched-at'])
                : 0,
        },
        rules,
    };
};

const serializeRuleMetadataComment = (key, value) => `/* @cttf-${key}: ${value} */`;

const serializeStyleRule = (rule) => {
    const normalizedRule = ensureStyleRule(rule, {
        fallbackSource: rule?.source || STYLE_RULE_SOURCE.CUSTOM,
    });
    if (!normalizedRule) {
        return '';
    }
    const lines = [];
    lines.push(serializeRuleMetadataComment('rule-id', normalizedRule.id));
    if (normalizedRule.name) {
        lines.push(serializeRuleMetadataComment('name', normalizedRule.name));
    }
    lines.push(serializeRuleMetadataComment('source', normalizedRule.source));
    lines.push(serializeRuleMetadataComment('enabled', normalizedRule.enabled ? 'true' : 'false'));
    if (typeof normalizedRule.layout?.height === 'number') {
        lines.push(serializeRuleMetadataComment('toolbar-height', normalizedRule.layout.height));
    }
    if (typeof normalizedRule.layout?.bottomSpacing === 'number') {
        lines.push(serializeRuleMetadataComment('toolbar-bottom-spacing', normalizedRule.layout.bottomSpacing));
    }
    if (normalizedRule.favicon) {
        lines.push(serializeRuleMetadataComment('favicon', normalizedRule.favicon));
    }
    lines.push(`@-moz-document ${normalizedRule.matchers.map(serializeMatcher).join(', ')} {`);
    if (normalizedRule.cssCode) {
        lines.push(normalizedRule.cssCode);
    }
    lines.push('}');
    return lines.join('\n');
};

const formatTimestampForExport = (value) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
};

const serializeStylePackageToUserCss = (options = {}) => {
    const officialStyleBundle = ensureStyleBundle(options.officialStyleBundle, {
        fallbackSource: STYLE_RULE_SOURCE.OFFICIAL,
    });
    const customStyleRules = Array.isArray(options.customStyleRules)
        ? options.customStyleRules
            .map((rule) => ensureStyleRule(rule, { fallbackSource: STYLE_RULE_SOURCE.CUSTOM }))
            .filter(Boolean)
        : [];

    const allRules = [...officialStyleBundle.rules, ...customStyleRules];
    const version = officialStyleBundle.version || `[${formatTimestampForExport(Date.now())}] exported`;
    const headerLines = [
        '/* ==UserStyle==',
        '@name           [Chat] Template Text Folders Styles',
        '@namespace      https://github.com/0-V-linuxdo/Chat_Template_Text_Folders',
        '@description    Exported official and custom styles for [Chat] Template Text Folders.',
        `@version        ${version}`,
        '@license        MIT',
        '==/UserStyle== */',
        '',
        `/* @cttf-official-version: ${officialStyleBundle.version || ''} */`,
        `/* @cttf-official-source-url: ${officialStyleBundle.sourceUrl || ''} */`,
        `/* @cttf-official-last-fetched-at: ${officialStyleBundle.lastFetchedAt || 0} */`,
        '',
    ];

    const body = allRules.map((rule) => serializeStyleRule(rule)).filter(Boolean).join('\n\n');
    return `${headerLines.join('\n')}${body}\n`;
};

const buildOfficialStyleBundleFromUserCss = (source, options = {}) => {
    const parsed = parseUserStyleFile(source, {
        defaultSource: STYLE_RULE_SOURCE.OFFICIAL,
    });
    return ensureStyleBundle({
        version: parsed.metadata.officialVersion || options.version || '',
        sourceUrl: options.sourceUrl || parsed.metadata.officialSourceUrl || '',
        lastFetchedAt: Number.isFinite(Number(options.lastFetchedAt))
            ? Number(options.lastFetchedAt)
            : (parsed.metadata.officialLastFetchedAt || 0),
        rules: parsed.rules.map((rule) => ({
            ...rule,
            source: STYLE_RULE_SOURCE.OFFICIAL,
            enabled: typeof rule.enabled === 'boolean' ? rule.enabled : true,
        })),
    }, {
        fallbackSource: STYLE_RULE_SOURCE.OFFICIAL,
    });
};

export {
    STYLE_MATCHER_TYPE,
    STYLE_RULE_SOURCE,
    clampBottomSpacing,
    clampStyleHeight,
    buildOfficialStyleBundleFromUserCss,
    ensureStyleBundle,
    ensureStyleRule,
    getPrimaryHostFromMatchers,
    migrateLegacyDomainStyleSettings,
    normalizeStyleMatcher,
    parseUserStyleFile,
    serializeStylePackageToUserCss,
    splitRulesBySource,
    summarizeMatchers,
};
