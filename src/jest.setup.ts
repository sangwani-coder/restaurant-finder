import fetchMock from 'jest-fetch-mock';
// Enables fetch to be mocked globally
// rewires 'fetch' global to call 'fetchMock' instead of the real implementation
// docs: https://www.npmjs.com/package/jest-fetch-mock#using-with-create-react-app
fetchMock.enableMocks();
