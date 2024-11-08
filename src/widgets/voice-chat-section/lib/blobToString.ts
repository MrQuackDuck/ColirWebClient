export async function blobToString(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error("Reader result is not a string."));
    };
    reader.onerror = () => {
      reject(new Error("An error occurred while reading the blob."));
    };
    reader.readAsDataURL(blob);
  });
}