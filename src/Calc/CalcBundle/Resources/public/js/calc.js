(body => {
  const elements = {};
  let references = {};

  const init = async () => {
    elements.body = $(body);
    const res = await getReferences();
    console.log(res);
  };

  const getReferences = async () => {
    const req = new Request('/calc/references', {
      method : 'GET',
      headers: {},
      cache  : 'none'
    });
    return fetch(req)
      .then(res => res.json())
      .then(result => {
        references = {};
        const { data } = result;
        if (!data || !Object.keys(data).length) {
          return references;
        }

        references = {};
        for (const option of data) {
          references[option.id] = option;
        }
        return references;
      })
      .catch(err => {
        console.error(err);
        return {};
      });
  };

  const calc = () => {

  };

  window.submit = () => {
    console.log(elements);
  };

  init();
})(document.body);
