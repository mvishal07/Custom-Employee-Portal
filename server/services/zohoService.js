const axios = require("axios");

const db = require("../config/db");


const getToken = async (service) => {

    const [rows] = await db.execute(
        `
        SELECT *
        FROM zoho_tokens
        WHERE service = ?
        `,
        [service]
    );

    if (!rows.length) {

        throw new Error(
            `Zoho ${service} token not configured`
        );
    }

    const token = rows[0];

    const now = new Date();

    if (
        token.expires_at &&
        new Date(token.expires_at) > now
    ) {
        return token.access_token;
    }

    return refreshAccessToken(
        service,
        token.refresh_token
    );
};


const refreshAccessToken = async (
    service,
    refreshToken
) => {

    const params = new URLSearchParams();

    params.append(
        "refresh_token",
        refreshToken
    );

    params.append(
        "client_id",
        process.env.ZOHO_CLIENT_ID
    );

    params.append(
        "client_secret",
        process.env.ZOHO_CLIENT_SECRET
    );

    params.append(
        "grant_type",
        "refresh_token"
    );

    const response = await axios.post(
        `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
        null,
        {
            params: Object.fromEntries(
                params.entries()
            )
        }
    );

    const {
        access_token,
        expires_in,
        api_domain
    } = response.data;

    const expiresAt =
        new Date(
            Date.now() +
            (expires_in * 1000)
        );

    await db.execute(
        `
        UPDATE zoho_tokens

        SET
            access_token = ?,
            api_domain = ?,
            expires_at = ?

        WHERE service = ?
        `,
        [
            access_token,
            api_domain || null,
            expiresAt,
            service
        ]
    );

    return access_token;
};


const zohoRequest = async ({
    service,
    method,
    url,
    params,
    data,
    headers = {}
}) => {

    const accessToken =
        await getToken(service);

    const response = await axios({
        method,
        url,
        params,
        data,

        headers: {
            ...headers,
            Authorization:
                `Zoho-oauthtoken ${accessToken}`
        }
    });

    return response.data;
};


module.exports = {
    getToken,
    refreshAccessToken,
    zohoRequest
};