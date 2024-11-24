async function apiJson({ req, res, data, model, meta = {}, json = false }) {
    const output = { data: data };
    if (json) {
        return output;
    }
    return res.status(200).json(output);
}
module.exports = apiJson;   