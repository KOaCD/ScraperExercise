const reddit = require('./reddit');

(async () => {
    await reddit.initialize('node');
    let results = await reddit.getResults();
    debugger;
})();