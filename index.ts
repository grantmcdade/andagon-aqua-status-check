import * as githubCore from '@actions/core';
import { Aqua } from './aqua';

try {
  const branchName = githubCore.getInput('branch_name');
  const branchNameExpr = githubCore.getInput('branch_name_expr');
  const username = githubCore.getInput('username');
  const password = githubCore.getInput('password');
  const url = githubCore.getInput('aqua_url');
  const readyToMergeStatusId = parseInt(githubCore.getInput('ready_to_merge_status_id'), 10); // '20294';
  console.log(`Checking ${branchName}`);

  const regex = new RegExp(branchNameExpr);
  if (regex.test(branchName)) {
    const match = regex.exec(branchName);
    const itemCode = match?.[1] ?? '';
    const itemType = itemCode.slice(0, 2);
    const itemId = itemCode.slice(2);

    githubCore.setOutput("itemCode", itemCode);
    githubCore.setOutput("itemType", itemType);
    githubCore.setOutput("itemId", itemId);
    
    console.log('Item type is:', itemType);
    console.log('Item id is:', itemId);

    const aqua = new Aqua();
    aqua
        .login(url, username, password)
        .then((success) => {
          if (success) {
            console.log('Checking the item status');
            return checkStatus(aqua, readyToMergeStatusId, itemType, itemId);
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

async function checkStatus(aqua: Aqua, readyToMergeStatusId: number, itemType: string, itemId: string) {
  switch (itemType) {
    case 'RQ':
      const requirement = await aqua.getRequirement(itemId);
      console.log('Checking if the item is ready to merge');
      if (!aqua.hasStatus(readyToMergeStatusId, requirement)) {
        githubCore.setFailed(`Item is not ready to merge`);
      }
      break;
    case 'DF':
      const defect = await aqua.getDefect(itemId);
      console.log('Checking if the item is ready to merge');
      if (!aqua.hasStatus(readyToMergeStatusId, defect)) {
        githubCore.setFailed(`Item is not ready to merge`);
      }
      break;
    default:
      githubCore.setFailed(`Unknown item type "${itemType}"`);
      break;
  }
}
