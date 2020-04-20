module.exports = class Response {
  status(status) {
    this.status = status;
    return this;
  }

  data(data) {
    return data;
  }
};
