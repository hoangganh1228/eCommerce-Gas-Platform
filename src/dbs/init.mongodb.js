'use strict';

const mongoose = require('mongoose');

const connectString = `mongodb://localhost:27017/shopDEV`;
const { countConnect } = require("../../helper/check.connect")

class Database {
  constructor() {
    this.connect();
  }

  // Hàm kết nối
  connect(type = 'mongodb') {
    // Cài đặt debug nếu cần
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    // Kết nối tới MongoDB
    mongoose
      .connect(connectString, {
        maxPoolSize: 50
      })
      .then(() => console.log("Connect Success"),countConnect())
      .catch((err) => console.log("Connect error:", err));
  }

  // Singleton Pattern: chỉ tạo 1 instance duy nhất
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance; // Trả về instance
  }
}

// Tạo instance duy nhất và xuất ra ngoài
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
