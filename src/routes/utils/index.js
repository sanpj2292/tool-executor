const getDecodedValue = (dataChunk) => {
    var dec = new TextDecoder("utf-8");
    return dec.decode(dataChunk);
};

module.exports = {
    getDecodedValue
};