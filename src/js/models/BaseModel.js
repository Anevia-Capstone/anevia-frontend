// Base Model class for MVP pattern
export default class BaseModel {
  constructor() {
    this.data = {};
    this.observers = [];
  }

  // Add observer for data changes
  addObserver(observer) {
    this.observers.push(observer);
  }

  // Remove observer
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // Notify all observers of data changes
  notifyObservers(data) {
    this.observers.forEach(observer => {
      if (typeof observer.update === 'function') {
        observer.update(data);
      }
    });
  }

  // Set data and notify observers
  setData(key, value) {
    this.data[key] = value;
    this.notifyObservers({ key, value, data: this.data });
  }

  // Get data
  getData(key) {
    return key ? this.data[key] : this.data;
  }

  // Clear all data
  clearData() {
    this.data = {};
    this.notifyObservers({ data: this.data });
  }

  // Update multiple data properties
  updateData(newData) {
    Object.assign(this.data, newData);
    this.notifyObservers({ data: this.data });
  }
}
