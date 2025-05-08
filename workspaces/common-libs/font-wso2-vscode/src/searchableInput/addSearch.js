/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
const fs = require('fs');

// Read the generated HTML file
const htmlFilePath = 'dist/wso2-vscode.html'; // Adjust the path to your generated HTML file
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

let modifiedHtml = htmlContent.replace(
    '<h1>wso2-vscode</h1>',
    `<h1>WSO2 VS Code Font</h1> <div> <input type="text" id="searchInput" placeholder="Seach Icon"> </div>`
);

modifiedHtml = modifiedHtml.replace(
    '</body>',
    `<script>
    // JavaScript to handle the label filtering
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchText = this.value.toLowerCase();
        const previews = document.querySelectorAll('.preview');

        previews.forEach(function (preview) {
            const label = preview.querySelector('.label');
            const labelText = label.textContent.toLowerCase();

            if (labelText.includes(searchText)) {
                preview.style.display = 'inline-block';
            } else {
                preview.style.display = 'none';
            }
        });
    });
</script>
</body>`
);

// Write the modified HTML file
fs.writeFileSync(htmlFilePath, modifiedHtml);
