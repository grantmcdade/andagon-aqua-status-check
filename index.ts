import * as githubCore from '@actions/core';
import {Aqua} from './aqua';
import {checkStatus} from "./checkStatus";

try {
    const branchName = githubCore.getInput('branch_name');
    const branchNameExpr = githubCore.getInput('branch_name_expr');
    const username = githubCore.getInput('username');
    const password = githubCore.getInput('password');
    const url = githubCore.getInput('aqua_url');
    const statusId = parseInt(githubCore.getInput('status_id_to_check'), 10); // '20294';
    const statusNotSetMessage = githubCore.getInput('status_not_set_message');
    console.log(`Checking ${branchName}`);

    const regex = new RegExp(branchNameExpr);
    if (regex.test(branchName)) {
        const match = regex.exec(branchName);
        const itemCode = match?.[1] ?? '';
        const itemType = itemCode.slice(0, 2);
        const itemId = itemCode.slice(2);

        githubCore.setOutput("item_code", itemCode);
        githubCore.setOutput("item_type", itemType);
        githubCore.setOutput("item_id", itemId);

        console.log('Item type is:', itemType);
        console.log('Item id is:', itemId);

        const aqua = new Aqua();
        aqua
            .login(url, username, password)
            .then((success) => {
                if (success) {
                    console.log('Checking the item status');
                    return checkStatus({aqua, statusId, itemType, itemId, statusNotSetMessage});
                } else {
                    console.log('Failed to log in');
                }
            })
            .catch(handleError);
    } else {
        githubCore.setFailed('Could not find the issue number');
    }
} catch (error: any) {
    githubCore.setFailed(error.message);
}

function handleError(error: Record<string, string>) {
    githubCore.setFailed(error.message ?? 'An error occurred');
}

