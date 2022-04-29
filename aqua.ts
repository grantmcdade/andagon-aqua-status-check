import axios from 'axios';

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

  async getRequirement(itemId: string) {
    const url = `${this.baseUrl}/api/Requirement/${itemId}`

    const response = await axios.get<BaseObject>(url, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

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
   * Check that the item is ready to merge
   * @param statusId The Id of the status to look for
   * @param item The item that should be checked
   * @returns true if the item has the specified status
   */
  hasStatus(statusId: number, item: BaseObject) {
    const field = item.Details.filter(f => f.Id === 'Status')?.[0];
    return field?.Value?.Id === statusId;
  }
}