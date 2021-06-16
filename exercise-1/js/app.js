(async function () {
    const users = await fetchData('https://5dc588200bbd050014fb8ae1.mockapi.io/assessment');
    const listTemplate =  document.getElementById("list-template");

    if (!listTemplate) { return; }

    const source = listTemplate.innerHTML;
    const template = Handlebars.compile(source);

    document.getElementById('entry').innerHTML = template(users);
})()

async function fetchData(url) {
    const response = await fetch(url);

    if (response.ok) {
        return response.json()
    } else {
        throw new Error('Data was fetched with error. ' + url)
    }
}
