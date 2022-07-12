export default (req, res, next) => {
    const authHeaders = req.headers.authorization;

    console.log(authHeaders);
}