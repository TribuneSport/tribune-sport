import { NewsSource } from "@/types/news";

export class SourceQueue {
  private queue: NewsSource[] = [];

  add(source: NewsSource) {
    this.queue.push(source);
  }

  addMany(sources: NewsSource[]) {
    this.queue.push(...sources);
  }

  next(): NewsSource | undefined {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
  }
}