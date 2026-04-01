class ApiResponse {
  constructor(status, data = null, message = null) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  static success(data, message = 'Request was successful', status = 200) {
    return new ApiResponse(status, data, message);
  }

  static error(status = 500, message = 'An error occurred') {
    return new ApiResponse(status, null, message);
  }

  toJSON() {
    return {
      status: this.status,
      data: this.data,
      message: this.message,
    };
  }
}

export default ApiResponse;
