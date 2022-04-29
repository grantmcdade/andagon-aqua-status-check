import {Aqua} from "./aqua";
import * as githubCore from "@actions/core";

interface CheckStatusArgs {
    aqua: Aqua;
    statusId: number;
    itemType: string;
    itemId: string;
    statusNotSetMessage: string;
}

export async function checkStatus({
                                      aqua,
                                      statusId,
                                      itemType,
                                      itemId,
                                      statusNotSetMessage
                                  }: CheckStatusArgs) {
    switch (itemType) {
        case 'RQ':
            const requirement = await aqua.getRequirement(itemId);
            console.log('Checking if the item is ready to merge');
            if (!aqua.hasStatus(statusId, requirement)) {
                githubCore.setFailed(`Item is not ready to merge`);
            }
            break;
        case 'DF':
            const defect = await aqua.getDefect(itemId);
            console.log('Checking the item status');
            if (!aqua.hasStatus(statusId, defect)) {
                githubCore.setFailed(statusNotSetMessage);
            }
            break;
        default:
            githubCore.setFailed(`Unknown item type "${itemType}"`);
            break;
    }
}