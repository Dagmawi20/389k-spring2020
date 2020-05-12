function formatJSON(n) {
   return n.map(shoe => shoe.toJSON());
}

module.exports = formatJSON;