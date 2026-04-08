const fs = require('fs');

function replaceDb(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.name === 'node_modules') continue;
        const fullPath = dir + '/' + file.name;
        if (file.isDirectory()) {
            replaceDb(fullPath);
        } else if (file.name.endsWith('.js') && file.name !== 'db.js' && file.name !== 'fix_db.js' && file.name !== 'test_api.js') {
            let src = fs.readFileSync(fullPath, 'utf8');
            let original = src;
            
            if (src.includes('const pool = new Pool(')) {
                let depth = fullPath.substring('d:/Hire_Helper_Infosys/backend'.length).split('/').length - 2;
                let reqPath = depth === 0 ? './db' : '../'.repeat(depth) + 'db';
                
                src = src.replace(/const \{ Pool \} = require\('pg'\);\n?/g, '');
                src = src.replace(/const pool = new Pool\(\{[\s\S]*?\}\);/g, 'const pool = require(\'' + reqPath + '\');');
                
                if(original !== src) {
                   fs.writeFileSync(fullPath, src);
                   console.log('Fixed', fullPath);
                }
            }
        }
    }
}

replaceDb('d:/Hire_Helper_Infosys/backend');
