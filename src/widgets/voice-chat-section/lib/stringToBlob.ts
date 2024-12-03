export async function stringToBlob(dataURL: string): Promise<Blob> {
  const response = await fetch(dataURL);
  const arrayBuffer = await response.arrayBuffer();
  return new Blob([arrayBuffer], { type: "audio/wav" });
}
