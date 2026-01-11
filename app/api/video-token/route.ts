import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
    const API_KEY = process.env.VIDEO_SDK_API_KEY;
    const SECRET_KEY = process.env.VIDEO_SDK_SECRET;

    if (!API_KEY || !SECRET_KEY) {
        return NextResponse.json({ error: 'Missing VideoSDK configuration' }, { status: 500 });
    }

    const options: jwt.SignOptions = {
        expiresIn: '10m',
        algorithm: 'HS256',
    };

    const payload = {
        apikey: API_KEY,
        permissions: ['allow_join', 'allow_mod'], // check: 'ask_join' for student?
        version: 2,
    };

    try {
        const token = jwt.sign(payload, SECRET_KEY, options);
        return NextResponse.json({ token });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
}
