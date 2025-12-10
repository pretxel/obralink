
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // In a real app, check user auth here here!
                // const user = await auth();
                // if (!user) throw new Error('Unauthorized');

                return {
                    // Allow all content types by not specifying allowedContentTypes
                    tokenPayload: JSON.stringify({
                        // optional payload
                    }),
                };
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
