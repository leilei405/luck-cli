export default async function(api) {
  const mode = await api.makeList({
    choices: [{
      name: 'API', value: 'api',
    }, {
      name: '默认', value: 'default',
    }],
    message: '请选择代码模式',
  });
  return {
    mode
  }
}
