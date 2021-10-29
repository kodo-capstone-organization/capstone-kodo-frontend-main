export function transformToBlob<T>(object: T): Blob {
    const stringifiedObject = JSON.stringify(object);
    return new Blob([stringifiedObject], {
        type: 'application/json'
    });
}