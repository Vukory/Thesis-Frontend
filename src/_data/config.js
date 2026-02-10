/**
 * @typedef {'production'|'development'} Environment
 * 
 * @typedef {object} Config
 * @property {string} baseUrl
 * @property {string} apiBaseUrl
 * @property {Environment} env Which environment/stage we're running on.
 */

const NODE_ENV = /** @type {Environment} */ (process.env.NODE_ENV);

/**
 * @returns {Config}
 */
function getConfig() {
  switch (NODE_ENV) {
    case 'production':
      return {
        baseUrl: 'https://survey.vukory.art',
        apiBaseUrl: 'https://api.vukory.art',
        env: NODE_ENV,
      }
    case 'development':
      return {
        baseUrl: 'http://localhost:8080',
        apiBaseUrl: 'http://localhost:8081',
        env: NODE_ENV,
      }
    default:
      throw Error('NODE_ENV must be one of: "production", "development"');
  }
}

export default getConfig();
