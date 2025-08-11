import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const param = await params;
        const imagePath = param.path;
        
        if (!imagePath || imagePath.length === 0) {
            return NextResponse.json(
                { error: 'Image path is required' },
                { status: 400 }
            );
        }

        // Construct the full file path
        const fullPath = path.join(process.cwd(), 'public', 'storage', 'image', ...imagePath);
        
        // Security check: ensure the path is within the storage directory
        const storageDir = path.join(process.cwd(), 'public', 'storage', 'image');
        const resolvedPath = path.resolve(fullPath);
        const resolvedStorageDir = path.resolve(storageDir);
        
        if (!resolvedPath.startsWith(resolvedStorageDir)) {
            return NextResponse.json(
                { error: 'Invalid path' },
                { status: 403 }
            );
        }

        // Check if file exists
        try {
            await fs.access(resolvedPath);
        } catch {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        // Read the file
        const fileBuffer = await fs.readFile(resolvedPath);
        
        // Determine content type based on file extension
        const ext = path.extname(resolvedPath).toLowerCase();
        let contentType = 'application/octet-stream';
        
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
        }

        // Return the image with appropriate headers
        // @ts-ignore
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}