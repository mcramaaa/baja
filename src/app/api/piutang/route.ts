// app/api/piutang/route.ts
import readPiutang from "@/lib/readPiutang";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Logika untuk mengambil data piutang
    const data = await readPiutang();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data piutang" },
      { status: 500 }
    );
  }
}

// import { google } from "googleapis";
// import keys from "../../../key.json";

// export default function getPiutang({ req, res }: any) {
//   try {
//     const client = new google.auth.JWT(
//       keys.client_email,
//       undefined,
//       keys.private_key,
//       ["https://www.googleapis.com/auth/spreadsheets"]
//     );

//     client.authorize(async function (err, tokens) {
//       if (err) {
//         console.log("Error authenticating:", err);
//         return res.status(400).send(JSON.stringify({ error: true }));
//       }

//       const gsapi = google.sheets({ version: "v4", auth: client });
//       const opt = {
//         spreadsheetId: "1pxAHMxfqHWePa682WKzCOfEf9HRB0NKO6gTc8UlZVOE",
//         range: "A1:E",
//       };

//       const data = await gsapi.spreadsheets.values.get(opt);
//       console.log(data);
//       return res
//         .status(200)
//         .send(JSON.stringify({ error: false, data: data.data.values }));
//     });
//   } catch (err: any) {
//     return res
//       .status(400)
//       .send(JSON.stringify({ error: true, message: err.message }));
//   }
// }

// import { google } from "googleapis";

// export const getPiutang = async () => {
//   const PRIVATE_KEY =
//     "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDdM8hUg4mMGSEq\neeF/yGnXvzhzQkkDul5j0wHv4qYwsy58p0ZRXwhrh1XW7CLbFonG87g0TVjOzWtM\n8Amhmw7penCnikNAocVy3GDWEE217Lvie3LWw1SuggFUshQug2Bnx0LSJEIciDCn\nWb/H+k4Ord0U9N06VbznnijPJde38LbzMpLCK4EzAFXKNptiikEjlSgYcLvhWR+v\n8M00MC8ng9Grb9lblDXGNts/pmaHZy1E3tQ9edcSehQFK5//WT0OZsTMR0xdxJqv\nAx8gvucgvcFiOkN6l9TKWD/SPGIQl4HzWLZZHUXEd2e+ivBXPUaoaGy0RMQFDSGA\nIms9OqHtAgMBAAECggEAB4BMH2o8Kxsmt9sdEEQCgNg2yMPQmDbaS2jPqevwm6Sr\n43rEWe85fh9Ursk1r7fJMXe41qnhJIGB+BXeFxPxcsNImDSKWMyo6974zVw4Amlr\nf//p3PS6mwCvcl49Qcw0jqMKy00C9+w6DXwako8UqrnvI241UAHceinvyNcymZsY\n41Nd0Wmr7t10UmTEUuR+2D3CT8ctQWL6k1QfgSL3Rd4yT6MabCMQM4DBXMmSGOXx\nZjj4XOYO3sh5Pd86FA8F6Wm935App1Jki9wgALi8QMJrFmb1n+liV+ze1YdR6bj8\nrjccutsgyoImdDTH1XLvwLqKLet/mYJaZvVCwShjIQKBgQDyn2XWGOKezsO2VBva\nayYTQigZdDWMzC0hLIB7UX7PPF7KSNHFF1JvmxImDCfgUOlMrjqIHFjXB6xYYLxN\nWVYP+VonbnVQ54PcIGVlQZuzobH21RrrvsmFAD8lcvOGYtBCnEbhuP1/gjRwg/mr\n+LtFKHwXGqgCdC2mPGn08gOJoQKBgQDpZgmi/V/h6r5c4T/s6/hOKgC+aFCHUgq8\nynzxWvHpIP1m72sSbLqH7faeWaiZ4CIOTL5INXgSbHbbk8slABkzMdQ+h7J9w0CF\nAoQN9XAOEdrmsBirD0AZeusy4YIdPutmQEHStZXCjpnSwkg7Z+mk2UlU//xwM9pb\nLVXzQWXszQKBgG1Orvy0HXVaxgXhAuN2nqLSjWpaVr3mRvbJK+FjJ/SJyFLuV8Op\n7DPn81c85sJC8bjgTfKAgu3twRHYEz3t3742ow1c0HHwvBFybvwdgN5/HMSN4iEP\nxY6sO8bNcTW8UwOPkMelJmBJ8wI2E0gNOaHAyZdHJSZl3SMl2L7IQhvBAoGBAODm\nuRx8yNraJ4s6Zi33h/JR2RuhSw/KR5x6BgFQYFEDwApjZCqB6RA4hm85+BQmfMqI\nusa79zLRn4qglJzXxnClcF68xYsYDWDd9r+4pLx6ChRG1c5nyJ2E64TA9m8WBSEn\nhAX1ghTS8ni7S30q+WInGtm0Pd0kqiE3w12+w+d1AoGAKOBb1k+3KgrcVO8OzUx/\nPX+Udx8CCKRWkO1Nva/arYtcIn7PDcz3aWge2cyi9LUbG6aLHZC0ZYnyk+gJFbEE\n2xDBP8MsmInPfwAf3IN9vWSM1sfCftpSZdezIT0Z48IMY9HAOXXCI+51dr4w4xBN\nfalIIy7gR031m8beazLkid8=\n-----END PRIVATE KEY-----\n";
//   const auth = new google.auth.GoogleAuth({
//     credentials: {
//       client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
//       private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
//     },
//     scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
//   });

//   const sheets = google.sheets({ version: "v4", auth });
//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: "1pxAHMxfqHWePa682WKzCOfEf9HRB0NKO6gTc8UlZVOE",
//     range: "A1:E",
//   });
//   console.log(res.data);
// };
