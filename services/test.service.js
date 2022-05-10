const testError = async (action) => {
  if (action === 'err') {
    const error = new Error();

    error.statusCode = 401;
    error.message = 'dsflmdskfm';
    throw error;
  }
  return 'No error will be thrown';
};

module.exports = { testError };
