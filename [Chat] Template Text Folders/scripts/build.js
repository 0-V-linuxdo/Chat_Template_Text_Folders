const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const modulesDir = path.join(rootDir, 'src', 'modules');
const outputPath = path.join(rootDir, '[Chat] Template Text Folders.user.js');

const moduleFilenames = [
    '00-userscript-header.js',
    '01-core-runtime.js',
    '02-toolbar-controls.js',
    '03-settings-panel.js',
    '04-script-config.js',
    '05-automation-rules.js',
    '06-domain-style.js',
    '07-initialization.js',
];

function assertModulesExist() {
    for (const filename of moduleFilenames) {
        const modulePath = path.join(modulesDir, filename);
        if (!fs.existsSync(modulePath)) {
            throw new Error(`Module file missing: ${modulePath}`);
        }
    }
}

function build() {
    assertModulesExist();
    const contents = moduleFilenames.map((filename) => {
        const filePath = path.join(modulesDir, filename);
        return fs.readFileSync(filePath, 'utf8');
    });

    fs.writeFileSync(outputPath, contents.join(''), 'utf8');
    console.log(`✅ Build complete: ${path.relative(rootDir, outputPath)}`);
}

if (require.main === module) {
    try {
        build();
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exitCode = 1;
    }
}

module.exports = { build };
