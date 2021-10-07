export function formatUrl(url: string, isWebRTC: boolean): string {
    if (isWebRTC) {
        return getWebRTCUrl().concat(url);
    } else {
        return getBaseUrl().concat(url);
    }
}

function getWebRTCUrl(): string {
    return "https://capstone-kodo-webrtc.herokuapp.com";
}

function getBaseUrl(): string {
    const env: string = process.env.NODE_ENV
    switch (env) {
        case 'development' || 'test': return 'http://localhost:8080'
        case 'production': return 'https://kodo-capstone-backend.herokuapp.com'
    }
    return ''
}