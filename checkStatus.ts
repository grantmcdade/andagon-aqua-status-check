import {Aqua} from "./aqua";
import * as githubCore from "@actions/core";

/**
 * An interface describing to arguments for 
 * the checkStatus function
 */
interface CheckStatusArgs {
    aqua: Aqua;
    statusId: number;
    itemType: string;
    itemId: string;
    statusNotSetMessage: string;
}

/**
 * A function to check the status of an item
 * @param aqua The logged in instance of the Aqua API handler
 * @param statusId The status code's Id
 * @param itemType The item type RQ, DF etc.
 * @param itemId The six digit item Id
 * @param statusNotSetMessage The message to show when the item does not have the status code
 */
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
            if (!aqua.hasStatus(statusId, requirement)) {
                githubCore.setFailed(statusNotSetMessage);
            }
            break;
        case 'DF':
            const defect = await aqua.getDefect(itemId);
            if (!aqua.hasStatus(statusId, defect)) {
                githubCore.setFailed(statusNotSetMessage);
            }
            break;
        default:
            githubCore.setFailed(`Unknown item type "${itemType}"`);
            break;
    }
}