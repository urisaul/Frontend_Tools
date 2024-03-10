
class DBM {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint) {
    const tok = this.getJwtFromCookie();
    if (!tok) return;
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      credentials: "include",
    });
    const data = await response.json();

    // Enhance each object with update and delete methods
    data.forEach((item) => {
      item.update = async (payload) => {
        const updatedItem = await this.update(endpoint, item.id, payload);
        Object.assign(item, updatedItem);
        return item;
      };

      item.delete = async () => {
        const deletedItem = await this.delete(endpoint, item.id);
        return deletedItem;
      };
    });

    return data;
  }

  async create(endpoint, payload) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  }

  async update(endpoint, id, payload) {
    const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  }

  async delete(endpoint, id) {
    const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${this.baseUrl}/signIn`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const token = response.headers.get("Set-Cookie");
    const data = await response.json();
    return data;
  }

  async signup(userInfo) {
    const response = await fetch(`${this.baseUrl}/signUp`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });
    const data = await response.json();
    return data;
  }

  isCookieValid(cookieName) {
    // Split the cookie string into individual cookies
    var cookies = document.cookie.split(";");

    // Loop through the cookies to find the one you're interested in
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();

      // Check if this is the cookie you're looking for
      if (cookie.indexOf(cookieName + "=") === 0) {
        // Extract the value of the cookie
        var cookieValue = cookie.substring(cookieName.length + 1);

        // Check if the cookie is not expired
        var cookieExpiration = new Date(cookieValue);
        if (cookieExpiration > new Date()) {
          return true;
        }
      }
    }
    return false;
  }

  getJwtFromCookie() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("jwt=")) {
        return cookie.substring(4); // Extract the JWT value
      }
    }
    return null; // Return null if the 'tok' cookie is not found
  }
}

module.exports = DBM;
