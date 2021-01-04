export default class Model {
  constructor(options = {}) {
    const data = options.data || [];
    delete options.data;
    this.$collection = [];
    this.$options = Object.assign({ primaryKey: 'id' }, options);

    if (data.length) {
      this.record(data);
    }
  }

  record(data) {
    const mappedData = data.map(item => {
      if (item[this.$options.primaryKey]) {
        return item;
      } else {
        item[this.$options.primaryKey] = Math.round(Math.random() * 100);
        return item;
      }
    });
    this.$collection.push(...mappedData);
  }
  // My version of all method
  // all() {
  //   if (this.$collection.length === 0) {
  //     return 'Sorry, there are no heroes in the collection.';
  //   } else {
  //     return this.$collection;
  //   }
  // }

  // VueSchool version of all method
  all() {
    return this.$collection.map(entry => {
      return Object.assign({}, entry);
    });
  }

  update(key, data) {
    const foundIndex = this.$collection.findIndex(item => {
      return item[this.$options.primaryKey] === key;
    });
    if (foundIndex === -1) {
      return false;
    }
    this.$collection.splice(
      foundIndex,
      1,
      Object.assign(this.$collection[foundIndex], data)
    );
  }

  find(key) {
    const foundItem = this.$collection.find(item => {
      return item[this.$options.primaryKey] === key;
    });
    return foundItem ? Object.assign({}, foundItem) : null;
  }

  remove(key, property) {
    const foundIndex = this.$collection.findIndex(item => {
      return item[this.$options.primaryKey] === key;
    });
    if (property) {
      let item = this.find(key);
      delete item[property];
      this.$collection.splice(foundIndex, 1, item);
    } else {
      this.$collection.splice(foundIndex, 1);
    }
  }
}
