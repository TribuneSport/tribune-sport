export class DuplicateService {

  private titles = new Set<string>();

  exists(title: string): boolean {
    return this.titles.has(title.toLowerCase());
  }

  add(title: string): void {
    this.titles.add(title.toLowerCase());
  }

  clear(): void {
    this.titles.clear();
  }

}