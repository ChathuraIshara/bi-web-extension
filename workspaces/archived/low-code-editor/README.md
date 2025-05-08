# @wso2-enterprise/low-code-editor

## Getting Started 

### Developer Guide

> Avoid working directly on `wso2-enterprise/ballerina-low-code-editor`, fork this repositoty to your account first.

```
git clone https://github.com/<your-username>/ballerina-low-code-editor.git
cd ballerina-low-code-editor/low-code-editor
npm install
```

#### For local development

You need to run `npm link` inside `low-code-editor/` directory to test `low-code-editor` library with `choreo-console` in local environment.

```
npm link
npm run watch
```

```
cd <project-directory>
npm link @wso2-enterprise/ballerina-low-code-editor
```

> You can use `npm unlink` command inside the same directory to force switch back to remote referance of the package. You might want to run `npm install` on parent repository also.

Currently you can't test `low-code-editor` locally without support of `choreo-console`.

#### Publishing guide for `low-code-editor`

- [Generate a personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)  in github if you dont have one already.
- Create new file named `.npmrc` inside `low-code-editor` directory.
- Add the follwing lines to the file.

```bash
@wso2-enterprise:registry = https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken = [PERSONAL_ACCESS_TOKEN]
always-auth = true
```
- Run below command to state package version you want to publish. It'll update the package.json.
```bash
npm version <major|minor|patch>
```
- Run the following command inside `low-code-editor` directory.
```bash
npm publish --tag latest
```
- This will publish the package to `@wso2-enterprise` github package registry. You can check the published package from the [packages page](https://github.com/wso2-enterprise/ballerina-plugin-vscode/packages).
