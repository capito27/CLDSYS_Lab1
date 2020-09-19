function generateToken(id, expires) {
    return Buffer.from(
        id.toString()
            .concat(':')
            .concat(expires.toISOString())
    ).toString('base64');
}

function unpackToken(token) {
    let res = Buffer.from(token, 'base64').toString('UTF-8');
    res = res.split(/:(.+)/);
    const expires = new Date(res[1]);

    return {
        id: res[0],
        expires: expires,
        isValid: expires > Date.now()
    };
}

module.exports = {
    generateToken,
    unpackToken
};