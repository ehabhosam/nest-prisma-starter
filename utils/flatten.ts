function traverseAndFlatten(currentNode, target, flattenedKey = undefined) {
  for (var key in currentNode) {
    if (currentNode.hasOwnProperty(key)) {
      var newKey;
      if (flattenedKey === undefined) {
        newKey = key;
      } else {
        newKey = flattenedKey + '.' + key;
      }

      var value = currentNode[key];
      if (typeof value === 'object') {
        traverseAndFlatten(value, target, newKey);
      } else {
        target[newKey] = value;
      }
    }
  }
}

export function flatten(obj) {
  var flattenedObject = {};
  traverseAndFlatten(obj, flattenedObject);
  return flattenedObject;
}
