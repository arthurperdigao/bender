const { execSync } = require('child_process');
const fs = require('fs');

let outStr = '';
try {
    const output = execSync('npx eslint . -f json', { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 });
    const data = JSON.parse(output);
    data.filter(d => d.warningCount > 0 || d.errorCount > 0).forEach(d => {
        outStr += d.filePath + '\n';
        d.messages.forEach(m => outStr += `Line ${m.line}: ${m.message}\n`);
    });
} catch (e) {
    if (e.stdout) {
        const data = JSON.parse(e.stdout);
        data.filter(d => d.warningCount > 0 || d.errorCount > 0).forEach(d => {
            outStr += d.filePath + '\n';
            d.messages.forEach(m => outStr += `Line ${m.line}: ${m.message}\n`);
        });
    } else {
        outStr = String(e);
    }
}
fs.writeFileSync('lint_errors.txt', outStr);
