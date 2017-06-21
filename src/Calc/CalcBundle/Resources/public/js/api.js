class Api {
  static async call(method, url, body, reject) {
    if (!Api.ALLOWED_METHODS.includes(method)) {
      const error = new Error('Not allowed method');
      return reject instanceof Function ? reject(error) : Request.error(error)
    }

    const options = { method };
    if (method !== 'GET' && body) {
      options.body = '';
      if (typeof body === 'object') {
        for (const key in body) {
          options.body += `${key}=${body[key]}&`
        }
      }
    }

    if (method === 'POST') {
      options.headers = new Headers();
      options.headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    }

    const call = fetch(new Request(url, options));
    if (reject instanceof Function) {
      call.catch(reject);
    }

    return call.then(resp => resp.json());
  }
  static async get(url, query = {}, reject = null) {
    return Api.call('GET', url, query, reject);
  }

  static async post(url, query = {}, reject = null) {
    return Api.call('POST', url, query, reject);
  }

  static async patch(url, query = {}, reject = null) {
    return Api.call('PATCH', url, query, reject);
  }

  static async delete(url, query = {}, reject = null) {
    return Api.call('DELETE', url, query, reject);
  }

}

Api.ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'DELETE'];