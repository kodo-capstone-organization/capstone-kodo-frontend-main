export function formatUrl(url: string): string {
    return getBaseUrl().concat(url);
}

function getBaseUrl(): string {
        const env: string = process.env.NODE_ENV
        switch (env) {
            case 'development' || 'test': return 'http://localhost:8080'
            case 'production': return 'https://kodo-capstone-backend.herokuapp.com'
        }
        return ''
    }