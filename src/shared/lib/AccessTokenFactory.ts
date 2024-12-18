export class AccessTokenFactory {
  private getToken: () => Promise<string>;
  private tokenCacheInSeconds: number;
  private cachedToken: string | null = null;
  private lastTimeCached: Date | null = null;

  constructor(getToken: () => Promise<string>, tokenCacheInSeconds: number) {
    this.getToken = getToken;
    this.tokenCacheInSeconds = tokenCacheInSeconds;
  }

  public getAccessToken = async (): Promise<string> => {
    if (!this.cachedToken || !this.lastTimeCached) {
      this.cachedToken = await this.getToken();
      this.lastTimeCached = new Date();
    } else {
      const now = new Date();
      const diff = now.getTime() - this.lastTimeCached.getTime();
      if (diff > this.tokenCacheInSeconds * 1000) {
        this.cachedToken = await this.getToken();
        this.lastTimeCached = new Date();
      }
    }

    return this.cachedToken;
  };
}
