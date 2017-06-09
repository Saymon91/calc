class Api {
  static async call(method, url, query, reject) {
    if (!Api.ALLOWED_METHODS.includes(method)) {
      const error = new Error('Not allowed method');
      return reject instanceof Function ? reject(error) : Request.error(error)
    }

    const call = fetch(new Request(url, { method, body: query }));
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
