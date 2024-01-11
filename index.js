const core = require('@actions/core');
const { exec } = require('child_process');
const xpath = require('xpath');
const DOMParser = require('@xmldom/xmldom').DOMParser;
const fs = require('fs');

try {
    const filename = core.getInput('filename');
    const expression = core.getInput('expression');
    const namespaces = core.getInput('namespaces');

    const content = fs.readFileSync(filename, 'utf8');
    const document = new DOMParser().parseFromString(content);
    const select = namespaces
        ? xpath.useNamespaces(JSON.parse(namespaces)) 
        : xpath.select;
    const nodes = select(expression, document);

    const result = nodes.map(node => node.toString()).join("\n");
  
  exec(`echo "result=${result}" >> $GITHUB_OUTPUT`);
} catch (error) {
    core.setFailed(error.message);
}
