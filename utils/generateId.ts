const shortid = require('shortid');

export default function generateId(): string {
  let id = shortid.generate();

  // ensure id is only alphanumeric
  while (id.match(/[^a-zA-Z0-9]/)) {
    id = shortid.generate();
  }

  return id.toUpperCase();
}
