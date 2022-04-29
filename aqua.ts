import axios from 'axios';

/**
 * An interface definition for Aqua's base object to allow
 * for reading the status in a type safe way.
 */
interface BaseObject {
  Details: [{
    Value: Record<string, string | number>,
    Id: string
  }]
}


/**
 * The class through which all access to Aqua is controlled
 */
export class Aqua {
  baseUrl: string | undefined;
  token: string | undefined;

  /**
   * A function that handles the login
   * @param aquaUrl The URL to the Aqua server (excluding /api/...)
   * @param username The Aqua user to log in as
   * @param password The password for the Aqua user
   */
  async login(
    aquaUrl: string,
    username: string,
    password: string,
  ) {
    let success = false;
    const data = `username=${username}&password=${password}&grant_type=password`;

    this.baseUrl = aquaUrl;
    const response = await axios.post(`${aquaUrl}/api/token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
      },
    });

    if (response.status === 200) {
      this.token = response.data.access_token;
      return !!this.token;
    }

    this.token = undefined;
    return false;
  }

  /**
   * Call the GET /api/Requirement/:itemId endpoint
   * @param itemId The Id of the item to retrieve
   */
  async getRequirement(itemId: string) {
    const url = `${this.baseUrl}/api/Requirement/${itemId}`

    const response = await axios.get<BaseObject>(url, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  /**
   * Call the GET /api/Defect/:itemId endpoint
   * @param itemId The Id of the item to retrieve
   */
  async getDefect(itemId: string) {
    const url = `${this.baseUrl}/api/Defect/${itemId}`

    const response = await axios.get<BaseObject>(url, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  /**
   // * Check if the item has the specified status code
   * @param statusId The Id of the status to look for
   * @param item The item that should be checked
   * @returns true if the item has the specified status
   */
  hasStatus(statusId: number, item: BaseObject) {
    const field = item.Details.filter(f => f.Id === 'Status')?.[0];
    return field?.Value?.Id === statusId;
  }
}