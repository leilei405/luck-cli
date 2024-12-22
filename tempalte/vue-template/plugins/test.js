import { makeList } from './inquirer.js';
import plugin from './index.js';

(async function() {
  const res = await plugin({
    makeList,
  });
  console.log(res);
})();
